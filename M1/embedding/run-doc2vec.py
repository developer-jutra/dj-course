import numpy as np
import json
import logging
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from tokenizers import Tokenizer
import os
import glob
import time
from corpora import CORPORA_FILES

# Ustawienie logowania dla gensim
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

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

# Przygotowanie danych dla Doc2Vec
tagged_data = [
    TaggedDocument(words=tokenized_sentences[i], tags=[str(i)])
    for i in range(len(tokenized_sentences))
]
print(f"Przygotowano {len(tagged_data)} sekwencji TaggedDocument do treningu.")

# --- ETAP 2: Trening Doc2Vec ---
print("\n--- Rozpoczynanie Treningu Doc2Vec ---")
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
print(f"Trening zakończony pomyślnie. Czas trwania: {end_time - start_time:.2f}s")

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
# === ETAP 4: BEZPOŚREDNIE WNIOSKOWANIE (INFERENCE) PRZY UŻYCIU OBIEKTÓW IN-MEMORY ===
# =========================================================================

print("\n" + "="*50)
print("=== ROZPOCZYNAM ETAP WNIOSKOWANIA (INFERENCE) ===")
print("="*50)

#  🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥testowanie🔥🔥🔥🔥🔥🔥🔥🔥
new_sentence = "Jestem głodny." 
print(f"Zdanie do wnioskowania: \"{new_sentence}\"")


# Używamy obiektów już załadowanych/wytrenowanych: model_d2v, tokenizer, raw_sentences
loaded_model = model_d2v # Używamy modelu prosto z treningu
sentence_lookup = raw_sentences # Używamy listy zdań prosto z wczytywania korpusu


# Tokenizacja nowego zdania
new_tokens = tokenizer.encode(new_sentence).tokens

# 2. Generowanie wektora dla nowego zdania
inferred_vector = loaded_model.infer_vector(new_tokens, epochs=loaded_model.epochs) 
print(f"\nWygenerowany wektor (embedding) dla zdania. Kształt: {inferred_vector.shape}")

# 3. Znajdowanie najbardziej podobnych wektorów z przestrzeni dokumentów/zdań
# topn=5, topn=20 - za co odpowiadaten parametr?
most_similar_docs = loaded_model.dv.most_similar([inferred_vector], topn=5)

print("\n5 najbardziej podobnych zdań z korpusu (Doc2Vec Inference):")
for doc_id_str, similarity in most_similar_docs:
    # 1. Konwertujemy ID (string) z powrotem na indeks (int)
    doc_index = int(doc_id_str)
    
    # 2. Używamy indeksu do odnalezienia oryginalnego tekstu
    # Zabezpieczenie na wypadek błędu indeksowania (choć nie powinno wystąpić)
    try:
        original_sentence = sentence_lookup[doc_index]
        print(f"  - Sim: {similarity:.4f} | Zdanie (ID: {doc_id_str}): {original_sentence}")
    except IndexError:
         print(f"  - Sim: {similarity:.4f} | BŁĄD: Nie znaleziono zdania dla ID: {doc_id_str}")

print("\n=== ETAP WNIOSKOWANIA ZAKOŃCZONY ===")
