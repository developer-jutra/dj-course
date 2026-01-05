"""
Skrypt do testowania różnych kombinacji parametrów Doc2Vec.

Testuje 24 kombinacje parametrów:
- VECTOR_LENGTH: stały = 20
- WINDOW_SIZE: 3, 5, 8, 10, 12, 15
- EPOCHS: 10, 20, 40, 80

Wszystkie wyniki zapisywane są automatycznie w rejestrze.
"""

import numpy as np
import json
import logging
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from tokenizers import Tokenizer
import os
import time
from datetime import datetime
from pathlib import Path
from corpora import CORPORA_FILES

# Ustawienie logowania dla gensim
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

# --- KONFIGURACJA ---

TRAINING_REGISTRY_FILE = "doc2vec_training_registry.json"

# Tokenizer
TOKENIZER_FILE = "../tokenizer/tokenizers/bielik-v3-tokenizer.json"

# Korpusy do testowania (48 kombinacji = 24 dla każdego korpusu)
CORPORA_TO_TEST = [
    ("WOLNELEKTURY", CORPORA_FILES["WOLNELEKTURY"]),
    ("ALL", CORPORA_FILES["ALL"])
]

# Parametry stałe
MIN_COUNT = 4
WORKERS = 4
SG_MODE = 0  # PV-DM

# Parametry do testowania (24 kombinacje × 2 korpusy = 48 testów)
VECTOR_LENGTHS = [20, 50, 100]        # 3 wartości
WINDOW_SIZES = [5, 10]                # 2 wartości
EPOCHS_LIST = [10, 20, 40, 80]        # 4 wartości
# 3 × 2 × 4 = 24 kombinacje na korpus

OUTPUT_MODEL_FILE = "doc2vec_model_test.model"
OUTPUT_SENTENCE_MAP = "doc2vec_model_sentence_map_test.json"

# --- FUNKCJE POMOCNICZE ---

def load_training_registry():
    """Wczytuje rejestr wyników treningów z pliku JSON."""
    if os.path.exists(TRAINING_REGISTRY_FILE):
        with open(TRAINING_REGISTRY_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_training_registry(registry):
    """Zapisuje rejestr wyników treningów do pliku JSON."""
    with open(TRAINING_REGISTRY_FILE, 'w', encoding='utf-8') as f:
        json.dump(registry, f, ensure_ascii=False, indent=2)

def calculate_embedding_quality(model, test_queries, sentence_lookup, tokenizer):
    """
    Oblicza jakość embeddingu testując na przykładowych zapytaniach.
    
    Metryka: średnie podobieństwo top-1 wyniku (wyższe = lepsze)
    """
    similarities = []
    
    for query in test_queries:
        tokens = tokenizer.encode(query).tokens
        inferred_vector = model.infer_vector(tokens, epochs=model.epochs)
        similar_docs = model.dv.most_similar([inferred_vector], topn=1)
        
        if similar_docs:
            similarities.append(similar_docs[0][1])
    
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
    """Loguje wyniki treningu do rejestru."""
    registry = load_training_registry()
    
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
    
    registry.append(entry)
    save_training_registry(registry)
    
    return entry['run_id']

# --- PRZYGOTOWANIE DANYCH (raz dla wszystkich testów) ---

print(f"\n{'='*80}")
print(f"SCENARIUSZ TESTOWY DOC2VEC - KOMPLEKSOWA ANALIZA")
print(f"{'='*80}")
print(f"Korpusy do testowania: {len(CORPORA_TO_TEST)}")
for corpus_name, _ in CORPORA_TO_TEST:
    print(f"  • {corpus_name}")
print(f"\nParametry stałe:")
print(f"  MIN_COUNT: {MIN_COUNT}")
print(f"  WORKERS: {WORKERS}")
print(f"  SG_MODE: {SG_MODE} (PV-DM)")
print(f"\nParametry zmienne:")
print(f"  VECTOR_LENGTH: {VECTOR_LENGTHS} ({len(VECTOR_LENGTHS)} wartości)")
print(f"  WINDOW_SIZE: {WINDOW_SIZES} ({len(WINDOW_SIZES)} wartości)")
print(f"  EPOCHS: {EPOCHS_LIST} ({len(EPOCHS_LIST)} wartości)")
tests_per_corpus = len(VECTOR_LENGTHS) * len(WINDOW_SIZES) * len(EPOCHS_LIST)
total_tests = tests_per_corpus * len(CORPORA_TO_TEST)
print(f"\nLiczba testów:")
print(f"  • Na korpus: {tests_per_corpus}")
print(f"  • Razem: {total_tests}")
print(f"{'='*80}\n")

# Wczytanie tokenizera
try:
    tokenizer = Tokenizer.from_file(TOKENIZER_FILE)
    print(f"✓ Wczytano tokenizer: {Path(TOKENIZER_FILE).name}\n")
except FileNotFoundError:
    print(f"✗ BŁĄD: Nie znaleziono pliku '{TOKENIZER_FILE}'")
    raise

# Testowe zapytania do oceny jakości
test_queries = [
    "Jestem głodny i bardzo chętnie zjadłbym coś.",
    "Król siedział na tronie.",
    "Szlachta polska była dumna ze swoich tradycji.",
    "Wojsko maszerowało przez las.",
    "Miłość jest najważniejsza w życiu."
]

tokenizer_name = Path(TOKENIZER_FILE).stem

# --- PĘTLA TESTOWA ---

print(f"{'='*80}")
print(f"ROZPOCZYNANIE TESTÓW")
print(f"{'='*80}\n")

test_counter = 0
results_summary = []
corpus_results = {}  # Wyniki pogrupowane według korpusu

start_total = time.time()

# Pętla po korpusach
for corpus_name, files in CORPORA_TO_TEST:
    print(f"\n{'#'*80}")
    print(f"KORPUS: {corpus_name}")
    print(f"{'#'*80}\n")
    
    # Wczytywanie korpusu
    raw_sentences = []
    print(f"Wczytywanie korpusu ({len(files)} plików)...")
    for file in files:
        try:
            with open(file, 'r', encoding='utf-8') as f:
                lines = [line.strip() for line in f if line.strip()]
                raw_sentences.extend(lines)
        except FileNotFoundError:
            print(f"  OSTRZEŻENIE: Nie znaleziono pliku '{file}'. Pomijam.")
            continue
    
    if not raw_sentences:
        print(f"✗ BŁĄD: Korpus {corpus_name} jest pusty. Pomijam.")
        continue
    
    print(f"✓ Wczytano {len(raw_sentences):,} zdań")
    
    # Tokenizacja
    print(f"Tokenizacja zdań...")
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
    
    print(f"✓ Statystyki korpusu:")
    print(f"    Zdań: {corpus_stats['sentences_count']:,}")
    print(f"    Tokenów: {corpus_stats['total_tokens']:,}")
    print(f"    Średnio tokenów/zdanie: {corpus_stats['avg_tokens']:.1f}")
    
    # Przygotowanie danych dla Doc2Vec
    tagged_data = [
        TaggedDocument(words=tokenized_sentences[i], tags=[str(i)])
        for i in range(len(tokenized_sentences))
    ]
    print(f"✓ Przygotowano {len(tagged_data):,} sekwencji TaggedDocument\n")
    
    corpus_results[corpus_name] = []
    
    # Pętla po parametrach
    for vector_length in VECTOR_LENGTHS:
        for window_size in WINDOW_SIZES:
            for epochs in EPOCHS_LIST:
                test_counter += 1
                
                print(f"\n{'─'*80}")
                print(f"TEST {test_counter}/{total_tests} | Korpus: {corpus_name}")
                print(f"{'─'*80}")
                print(f"Parametry:")
                print(f"  VECTOR_LENGTH: {vector_length}")
                print(f"  WINDOW_SIZE: {window_size}")
                print(f"  EPOCHS: {epochs}")
                print(f"  MIN_COUNT: {MIN_COUNT}")
                
                # Trening modelu
                start_time = time.time()
                
                model_d2v = Doc2Vec(
                    tagged_data,
                    vector_size=vector_length,
                    window=window_size,
                    min_count=MIN_COUNT,
                    workers=WORKERS,
                    epochs=epochs,
                    dm=1  # PV-DM
                )
                
                end_time = time.time()
                training_time = end_time - start_time
                
                print(f"  ✓ Trening zakończony: {training_time:.2f}s")
                
                # Ocena jakości
                quality_metrics = calculate_embedding_quality(
                    model_d2v, 
                    test_queries, 
                    raw_sentences, 
                    tokenizer
                )
                
                print(f"  ✓ Jakość: {quality_metrics['quality_rating'].upper()} "
                      f"(podobieństwo: {quality_metrics['avg_top1_similarity']:.4f})")
                
                # Zapisz do rejestru
                training_params = {
                    "VECTOR_LENGTH": vector_length,
                    "WINDOW_SIZE": window_size,
                    "MIN_COUNT": MIN_COUNT,
                    "WORKERS": WORKERS,
                    "EPOCHS": epochs,
                    "SG_MODE": SG_MODE,
                    "dm": 1
                }
                
                run_id = log_training_result(
                    corpus_name=corpus_name,
                    tokenizer_name=tokenizer_name,
                    params=training_params,
                    training_time=training_time,
                    quality_metrics=quality_metrics,
                    corpus_stats=corpus_stats
                )
                
                print(f"  ✓ Zapisano do rejestru (Run ID: {run_id})")
                
                # Zapisz do podsumowania
                result_entry = {
                    "test_num": test_counter,
                    "run_id": run_id,
                    "corpus": corpus_name,
                    "corpus_size": corpus_stats['sentences_count'],
                    "vector_length": vector_length,
                    "window_size": window_size,
                    "epochs": epochs,
                    "training_time": round(training_time, 2),
                    "quality": quality_metrics['avg_top1_similarity'],
                    "rating": quality_metrics['quality_rating']
                }
                results_summary.append(result_entry)
                corpus_results[corpus_name].append(result_entry)

end_total = time.time()
total_time = end_total - start_total

# --- PODSUMOWANIE KOŃCOWE ---

print(f"\n{'='*80}")
print(f"TESTY ZAKOŃCZONE!")
print(f"{'='*80}")
print(f"Przeprowadzono: {total_tests} testów")
print(f"Całkowity czas: {total_time:.2f}s ({total_time/60:.1f} min)")
print(f"Średni czas/test: {total_time/total_tests:.2f}s")

# --- RANKING GLOBALNY ---
print(f"\n{'='*80}")
print(f"RANKING GLOBALNY (Top 10 najlepszych)")
print(f"{'='*80}")

sorted_results = sorted(results_summary, key=lambda x: x['quality'], reverse=True)

print(f"{'Rank':<6} {'Test#':<7} {'Korpus':<15} {'Vec':<5} {'Win':<5} {'Ep':<5} {'Quality':<10} {'Rating':<10} {'Time':<8}")
print(f"{'─'*100}")

for rank, result in enumerate(sorted_results[:10], 1):
    emoji = "🥇" if rank == 1 else "🥈" if rank == 2 else "🥉" if rank == 3 else "  "
    print(f"{emoji} {rank:<4} {result['test_num']:<7} {result['corpus']:<15} "
          f"{result['vector_length']:<5} {result['window_size']:<5} {result['epochs']:<5} "
          f"{result['quality']:<10.4f} {result['rating']:<10} {result['training_time']:.1f}s")

# --- PORÓWNANIE KORPUSÓW ---
print(f"\n{'='*80}")
print(f"PORÓWNANIE KORPUSÓW")
print(f"{'='*80}\n")

for corpus_name, corpus_res in corpus_results.items():
    if not corpus_res:
        continue
    
    avg_quality = np.mean([r['quality'] for r in corpus_res])
    avg_time = np.mean([r['training_time'] for r in corpus_res])
    best_result = max(corpus_res, key=lambda x: x['quality'])
    
    print(f"Korpus: {corpus_name}")
    print(f"  • Rozmiar: {corpus_res[0]['corpus_size']:,} zdań")
    print(f"  • Liczba testów: {len(corpus_res)}")
    print(f"  • Średnia jakość: {avg_quality:.4f}")
    print(f"  • Średni czas treningu: {avg_time:.1f}s")
    print(f"  • Najlepsza jakość: {best_result['quality']:.4f}")
    print(f"    (V={best_result['vector_length']}, W={best_result['window_size']}, E={best_result['epochs']})")
    print()

# --- ANALIZA WPŁYWU PARAMETRÓW ---
print(f"{'='*80}")
print(f"ANALIZA WPŁYWU PARAMETRÓW")
print(f"{'='*80}\n")

# 1. Wpływ VECTOR_LENGTH
print(f"📊 VECTOR_LENGTH - wpływ na jakość i czas:")
print(f"{'─'*80}")
for vl in sorted(set(r['vector_length'] for r in results_summary)):
    vl_results = [r for r in results_summary if r['vector_length'] == vl]
    avg_q = np.mean([r['quality'] for r in vl_results])
    avg_t = np.mean([r['training_time'] for r in vl_results])
    print(f"  V={vl:3d}: jakość={avg_q:.4f}, czas={avg_t:6.1f}s ({len(vl_results)} testów)")

# 2. Wpływ WINDOW_SIZE
print(f"\n📊 WINDOW_SIZE - wpływ na jakość i czas:")
print(f"{'─'*80}")
for ws in sorted(set(r['window_size'] for r in results_summary)):
    ws_results = [r for r in results_summary if r['window_size'] == ws]
    avg_q = np.mean([r['quality'] for r in ws_results])
    avg_t = np.mean([r['training_time'] for r in ws_results])
    print(f"  W={ws:3d}: jakość={avg_q:.4f}, czas={avg_t:6.1f}s ({len(ws_results)} testów)")

# 3. Wpływ EPOCHS
print(f"\n📊 EPOCHS - wpływ na jakość i czas:")
print(f"{'─'*80}")
for ep in sorted(set(r['epochs'] for r in results_summary)):
    ep_results = [r for r in results_summary if r['epochs'] == ep]
    avg_q = np.mean([r['quality'] for r in ep_results])
    avg_t = np.mean([r['training_time'] for r in ep_results])
    print(f"  E={ep:3d}: jakość={avg_q:.4f}, czas={avg_t:6.1f}s ({len(ep_results)} testów)")

# 4. Wpływ rozmiaru korpusu
print(f"\n📊 ROZMIAR KORPUSU - wpływ na jakość i czas:")
print(f"{'─'*80}")
for corpus_name, corpus_res in corpus_results.items():
    if not corpus_res:
        continue
    avg_q = np.mean([r['quality'] for r in corpus_res])
    avg_t = np.mean([r['training_time'] for r in corpus_res])
    size = corpus_res[0]['corpus_size']
    print(f"  {corpus_name}: {size:,} zdań → jakość={avg_q:.4f}, czas={avg_t:6.1f}s")

# --- WNIOSKI ---
print(f"\n{'='*80}")
print(f"🎯 KLUCZOWE WNIOSKI")
print(f"{'='*80}\n")

best = sorted_results[0]
print(f"1. NAJLEPSZE PARAMETRY:")
print(f"   • Korpus: {best['corpus']}")
print(f"   • VECTOR_LENGTH: {best['vector_length']}")
print(f"   • WINDOW_SIZE: {best['window_size']}")
print(f"   • EPOCHS: {best['epochs']}")
print(f"   • Jakość: {best['quality']:.4f} ({best['rating'].upper()})")
print(f"   • Czas: {best['training_time']:.1f}s")

# Najlepszy dla każdego parametru
best_vl = max(VECTOR_LENGTHS, key=lambda v: np.mean([r['quality'] for r in results_summary if r['vector_length'] == v]))
best_ws = max(WINDOW_SIZES, key=lambda w: np.mean([r['quality'] for r in results_summary if r['window_size'] == w]))
best_ep = max(EPOCHS_LIST, key=lambda e: np.mean([r['quality'] for r in results_summary if r['epochs'] == e]))

print(f"\n2. WPŁYW PARAMETRÓW NA JAKOŚĆ:")
print(f"   • VECTOR_LENGTH: {best_vl} daje najlepszą średnią jakość")
print(f"   • WINDOW_SIZE: {best_ws} daje najlepszą średnią jakość")
print(f"   • EPOCHS: {best_ep} daje najlepszą średnią jakość")

# Porównanie korpusów
corpus_comparison = {}
for corpus_name, corpus_res in corpus_results.items():
    if corpus_res:
        corpus_comparison[corpus_name] = np.mean([r['quality'] for r in corpus_res])

best_corpus = max(corpus_comparison, key=corpus_comparison.get)
worst_corpus = min(corpus_comparison, key=corpus_comparison.get)
improvement = (corpus_comparison[best_corpus] - corpus_comparison[worst_corpus]) / corpus_comparison[worst_corpus] * 100

print(f"\n3. WPŁYW KORPUSU:")
print(f"   • Lepszy korpus: {best_corpus} (jakość: {corpus_comparison[best_corpus]:.4f})")
print(f"   • Gorszy korpus: {worst_corpus} (jakość: {corpus_comparison[worst_corpus]:.4f})")
print(f"   • Poprawa: {improvement:.1f}%")

# Trade-off jakość vs czas
fastest = min(results_summary, key=lambda x: x['training_time'])
print(f"\n4. TRADE-OFF JAKOŚĆ vs CZAS:")
print(f"   • Najszybszy: {fastest['training_time']:.1f}s (jakość: {fastest['quality']:.4f})")
print(f"   • Najlepszy: {best['training_time']:.1f}s (jakość: {best['quality']:.4f})")
print(f"   • Różnica czasu: {best['training_time'] - fastest['training_time']:.1f}s")
print(f"   • Zysk jakości: {(best['quality'] - fastest['quality'])/fastest['quality']*100:.1f}%")

print(f"\n{'='*80}")
print(f"PLIKI WYJŚCIOWE")
print(f"{'='*80}")
print(f"  • Rejestr treningów: {TRAINING_REGISTRY_FILE}")
print(f"  • Model (ostatni test): {OUTPUT_MODEL_FILE}")
print(f"  • Mapa zdań (ostatni test): {OUTPUT_SENTENCE_MAP}")

print(f"\n{'='*80}")
print(f"NASTĘPNE KROKI")
print(f"{'='*80}")
print(f"  1. Przejrzyj szczegóły: python view-training-registry.py")
print(f"  2. Zobacz ranking: python view-training-registry.py --best")
print(f"  3. Analiza parametrów: python view-training-registry.py --compare")
print(f"  4. Użyj najlepszych parametrów w run-doc2vec.py")
print(f"{'='*80}\n")
