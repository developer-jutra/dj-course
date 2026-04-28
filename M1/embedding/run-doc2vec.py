import numpy as np
import json
import logging
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from tokenizers import Tokenizer
import os
import glob
import time
from datetime import datetime
from pathlib import Path
from corpora import CORPORA_FILES

# Ustawienie logowania dla gensim
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

# --- KONFIGURACJA ---

# Rejestr wyników treningów
TRAINING_REGISTRY_FILE = "doc2vec_training_registry.json"

# files = CORPORA_FILES["ALL"]
files = CORPORA_FILES["WOLNELEKTURY"]
# files = CORPORA_FILES["PAN_TADEUSZ"]

TOKENIZER_FILE = "../tokenizer/tokenizers/bielik-v3-tokenizer.json"
OUTPUT_MODEL_FILE = "doc2vec_model_combined.model"
OUTPUT_SENTENCE_MAP = "doc2vec_model_sentence_map_combined.json"

# Parametry treningu Doc2Vec
VECTOR_LENGTH = 20
WINDOW_SIZE = 6   
MIN_COUNT = 4         
WORKERS = 4           
EPOCHS = 20           
SG_MODE = 0   

# --- FUNKCJE POMOCNICZE ---

def load_training_registry():
    """
    Wczytuje rejestr wyników treningów z pliku JSON.
    
    Returns:
        list: Lista słowników z historią treningów
    """
    if os.path.exists(TRAINING_REGISTRY_FILE):
        with open(TRAINING_REGISTRY_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_training_registry(registry):
    """
    Zapisuje rejestr wyników treningów do pliku JSON.
    
    Args:
        registry (list): Lista słowników z historią treningów
    """
    with open(TRAINING_REGISTRY_FILE, 'w', encoding='utf-8') as f:
        json.dump(registry, f, ensure_ascii=False, indent=2)

def calculate_embedding_quality(model, test_queries, sentence_lookup, tokenizer):
    """
    Oblicza jakość embeddingu testując na przykładowych zapytaniach.
    
    Metryka: średnie podobieństwo top-1 wyniku (wyższe = lepsze)
    
    Args:
        model: Wytrenowany model Doc2Vec
        test_queries (list): Lista testowych zdań
        sentence_lookup (list): Lista wszystkich zdań z korpusu
        tokenizer: Tokenizer do przetwarzania zdań
        
    Returns:
        dict: Słownik z metrykami jakości
    """
    similarities = []
    
    for query in test_queries:
        tokens = tokenizer.encode(query).tokens
        inferred_vector = model.infer_vector(tokens, epochs=model.epochs)
        similar_docs = model.dv.most_similar([inferred_vector], topn=1)
        
        if similar_docs:
            similarities.append(similar_docs[0][1])  # similarity score
    
    avg_similarity = np.mean(similarities) if similarities else 0.0
    
    return {
        "avg_top1_similarity": float(avg_similarity),
        "test_queries_count": len(test_queries),
        "quality_rating": "excellent" if avg_similarity > 0.8 else 
                         "good" if avg_similarity > 0.6 else
                         "fair" if avg_similarity > 0.4 else "poor"
    }

def log_training_result(
    corpus_name,
    tokenizer_name,
    params,
    training_time,
    quality_metrics,
    corpus_stats
):
    """
    Loguje wyniki treningu do rejestru.
    
    Args:
        corpus_name (str): Nazwa korpusu
        tokenizer_name (str): Nazwa tokenizera
        params (dict): Parametry treningu
        training_time (float): Czas treningu w sekundach
        quality_metrics (dict): Metryki jakości embeddingu
        corpus_stats (dict): Statystyki korpusu
    """
    # Wczytaj istniejący rejestr
    registry = load_training_registry()
    
    # Utwórz nowy wpis
    entry = {
        "run_id": len(registry) + 1,
        "timestamp": datetime.now().isoformat(),
        "corpus": {
            "name": corpus_name,
            "sentences_count": corpus_stats.get("sentences_count", 0),
            "avg_tokens_per_sentence": corpus_stats.get("avg_tokens", 0)
        },
        "tokenizer": tokenizer_name,
        "parameters": params,
        "training_time_seconds": round(training_time, 2),
        "quality_metrics": quality_metrics,
        "output_files": {
            "model": OUTPUT_MODEL_FILE,
            "sentence_map": OUTPUT_SENTENCE_MAP
        }
    }
    
    # Dodaj do rejestru
    registry.append(entry)
    
    # Zapisz
    save_training_registry(registry)
    
    print(f"\n{'='*80}")
    print(f"✓ Wyniki treningu zapisane do rejestru")
    print(f"  Run ID: {entry['run_id']}")
    print(f"  Jakość embeddingu: {quality_metrics['quality_rating'].upper()}")
    print(f"  Plik rejestru: {TRAINING_REGISTRY_FILE}")
    print(f"{'='*80}\n")   

# --- ETAP 1: Wczytanie, Tokenizacja i Przygotowanie Danych ---
try:
    tokenizer = Tokenizer.from_file(TOKENIZER_FILE)
except FileNotFoundError:
    print(f"BŁĄD: Nie znaleziono pliku '{TOKENIZER_FILE}'. Upewnij się, że plik istnieje.")
    raise

# Wczytywanie i agregacja tekstu
raw_sentences = []
print("Wczytywanie tekstu z plików...")
print(f"Liczba plików do wczytania: {len(files)}") 

for file in files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            lines = [line.strip() for line in f if line.strip()] 
            raw_sentences.extend(lines)
    except FileNotFoundError:
        print(f"OSTRZEŻENIE: Nie znaleziono pliku '{file}'. Pomijam.")
        continue
    except Exception as e:
        print(f"BŁĄD podczas przetwarzania pliku '{file}': {e}")
        continue

if not raw_sentences:
    print("BŁĄD: Korpus danych jest pusty.")
    raise ValueError("Korpus danych jest pusty.")
print(f"Tokenizacja {len(raw_sentences)} zdań...")

# Konwersja na listę tokenów
tokenized_sentences = [
    tokenizer.encode(sentence).tokens for sentence in raw_sentences
]

# Statystyki korpusu
total_tokens = sum(len(sent) for sent in tokenized_sentences)
avg_tokens = total_tokens / len(tokenized_sentences) if tokenized_sentences else 0

corpus_stats = {
    "sentences_count": len(tokenized_sentences),
    "total_tokens": total_tokens,
    "avg_tokens": round(avg_tokens, 2)
}

print(f"Statystyki korpusu:")
print(f"  Zdań: {corpus_stats['sentences_count']:,}")
print(f"  Tokenów: {corpus_stats['total_tokens']:,}")
print(f"  Średnio tokenów/zdanie: {corpus_stats['avg_tokens']:.1f}")

# Przygotowanie danych dla Doc2Vec
tagged_data = [
    TaggedDocument(words=tokenized_sentences[i], tags=[str(i)])
    for i in range(len(tokenized_sentences))
]
print(f"Przygotowano {len(tagged_data)} sekwencji TaggedDocument do treningu.")

# --- ETAP 2: Trening Doc2Vec ---
print(f"\n{'='*80}")
print(f"ETAP 2: Trening modelu Doc2Vec")
print(f"{'='*80}")
print(f"Parametry treningu:")
print(f"  • Wymiar wektora (vector_size): {VECTOR_LENGTH}")
print(f"  • Rozmiar okna (window): {WINDOW_SIZE}")
print(f"  • Min. częstość (min_count): {MIN_COUNT}")
print(f"  • Liczba epok (epochs): {EPOCHS}")
print(f"  • Tryb: {'PV-DM (Distributed Memory)' if SG_MODE == 0 else 'PV-DBOW'}")
print(f"  • Wątki (workers): {WORKERS}")
print(f"\nUruchamiam trening...")
print(f"{'='*80}\n")

start_time = time.time()
model_d2v = Doc2Vec(
    tagged_data,
    vector_size=VECTOR_LENGTH,
    window=WINDOW_SIZE,
    min_count=MIN_COUNT,
    workers=WORKERS,
    epochs=EPOCHS,
    dm=1 # Distributed Memory (PV-DM)
)
end_time = time.time()
training_time = end_time - start_time

print(f"\n{'='*80}")
print(f"✓ Trening zakończony pomyślnie!")
print(f"  Czas treningu: {training_time:.2f}s ({training_time/60:.1f} min)")
print(f"{'='*80}")

# --- ETAP 3: Zapisywanie Wytrenowanego Modelu i Mapy ---
try:
    model_d2v.save(OUTPUT_MODEL_FILE)
    print(f"\nPełny model Doc2Vec zapisany jako: '{OUTPUT_MODEL_FILE}'.")
    
    with open(OUTPUT_SENTENCE_MAP, "w", encoding="utf-8") as f:
        json.dump(raw_sentences, f, ensure_ascii=False, indent=4)
    print(f"Mapa zdań do ID zapisana jako: '{OUTPUT_SENTENCE_MAP}'.")

except Exception as e:
    # W kontekście 'połączonego skryptu' błąd zapisu nie przerywa wnioskowania
    print(f"OSTRZEŻENIE: BŁĄD podczas zapisu modelu/mapy: {e}. Kontynuuję wnioskowanie in-memory.")


# =========================================================================
# === ETAP 4: OCENA JAKOŚCI EMBEDDINGU ===
# =========================================================================

print(f"\n{'='*80}")
print(f"ETAP 4: Ocena jakości embeddingu")
print(f"{'='*80}\n")

# Testowe zapytania do oceny jakości
test_queries = [
    "Jestem głodny i bardzo chętnie zjadłbym coś.",
    "Król siedział na tronie.",
    "Szlachta polska była dumna ze swoich tradycji.",
    "Wojsko maszerowało przez las.",
    "Miłość jest najważniejsza w życiu."
]

print(f"Testowanie na {len(test_queries)} przykładowych zapytaniach...")
quality_metrics = calculate_embedding_quality(
    model_d2v, 
    test_queries, 
    raw_sentences, 
    tokenizer
)

print(f"\nMetryki jakości:")
print(f"  • Średnie podobieństwo top-1: {quality_metrics['avg_top1_similarity']:.4f}")
print(f"  • Ocena jakości: {quality_metrics['quality_rating'].upper()}")
print(f"  • Liczba testów: {quality_metrics['test_queries_count']}")

# =========================================================================
# === ETAP 5: LOGOWANIE WYNIKÓW DO REJESTRU ===
# =========================================================================

print(f"\n{'='*80}")
print(f"ETAP 5: Zapisywanie wyników do rejestru")
print(f"{'='*80}\n")

# Przygotuj parametry do zapisu
training_params = {
    "VECTOR_LENGTH": VECTOR_LENGTH,
    "WINDOW_SIZE": WINDOW_SIZE,
    "MIN_COUNT": MIN_COUNT,
    "WORKERS": WORKERS,
    "EPOCHS": EPOCHS,
    "SG_MODE": SG_MODE,
    "dm": 1  # PV-DM
}

# Określ nazwę korpusu
corpus_name = "WOLNELEKTURY"  # Zmień dynamicznie jeśli potrzeba
if files == CORPORA_FILES.get("ALL"):
    corpus_name = "ALL"
elif files == CORPORA_FILES.get("PAN_TADEUSZ"):
    corpus_name = "PAN_TADEUSZ"

# Określ nazwę tokenizera
tokenizer_name = Path(TOKENIZER_FILE).stem

# Zapisz wyniki do rejestru
log_training_result(
    corpus_name=corpus_name,
    tokenizer_name=tokenizer_name,
    params=training_params,
    training_time=training_time,
    quality_metrics=quality_metrics,
    corpus_stats=corpus_stats
)

# =========================================================================
# === ETAP 6: DEMONSTRACJA WNIOSKOWANIA (INFERENCE) ===
# =========================================================================

print(f"\n{'='*80}")
print(f"ETAP 6: Demonstracja wnioskowania")
print(f"{'='*80}\n")

#  🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥testowanie🔥🔥🔥🔥🔥🔥🔥🔥
demonstration_sentence = "Jestem głodny i bardzo chętnie zjadłbym coś."
print(f"Zdanie do wnioskowania: \"{demonstration_sentence}\"")


# Używamy obiektów już załadowanych/wytrenowanych: model_d2v, tokenizer, raw_sentences
loaded_model = model_d2v # Używamy modelu prosto z treningu
sentence_lookup = raw_sentences # Używamy listy zdań prosto z wczytywania korpusu


# Tokenizacja nowego zdania
new_tokens = tokenizer.encode(demonstration_sentence).tokens

# 2. Generowanie wektora dla nowego zdania
inferred_vector = loaded_model.infer_vector(new_tokens, epochs=loaded_model.epochs) 
print(f"\nWygenerowany wektor (embedding) dla zdania. Kształt: {inferred_vector.shape}")

# 3. Znajdowanie najbardziej podobnych wektorów z przestrzeni dokumentów/zdań
# topn - liczba najbardziej podobnych zdań do zwrócenia
most_similar_docs = loaded_model.dv.most_similar([inferred_vector], topn=5)

print(f"\n{'─'*80}")
print(f"🎯 Top 5 najbardziej podobnych zdań z korpusu:")
print(f"{'─'*80}")
for rank, (doc_id_str, similarity) in enumerate(most_similar_docs, 1):
    # 1. Konwertujemy ID (string) z powrotem na indeks (int)
    doc_index = int(doc_id_str)
    
    # 2. Używamy indeksu do odnalezienia oryginalnego tekstu
    try:
        original_sentence = sentence_lookup[doc_index]
        
        # Emoji dla poziomów podobieństwa
        if similarity > 0.8:
            emoji = "🔥"
        elif similarity > 0.6:
            emoji = "✨"
        elif similarity > 0.4:
            emoji = "✓"
        else:
            emoji = "○"
            
        print(f"  {rank}. {emoji} Podobieństwo: {similarity:.4f}")
        print(f"     ID: {doc_id_str}")
        print(f"     Zdanie: {original_sentence}")
        print()
    except IndexError:
         print(f"  {rank}. ✗ BŁĄD: Nie znaleziono zdania dla ID: {doc_id_str}")
         print()

print(f"{'='*80}")
print(f"✓ ZADANIE 4.2 UKOŃCZONE")
print(f"{'='*80}")
print(f"\nPliki wyjściowe:")
print(f"  • Model: {OUTPUT_MODEL_FILE}")
print(f"  • Mapa zdań: {OUTPUT_SENTENCE_MAP}")
print(f"  • Rejestr treningów: {TRAINING_REGISTRY_FILE}")
print(f"\nNastępny krok:")
print(f"  Eksperymentuj z parametrami aby poprawić jakość embeddingu!")
print(f"  Sprawdź rejestr treningów: cat {TRAINING_REGISTRY_FILE}")
print(f"{'='*80}")
