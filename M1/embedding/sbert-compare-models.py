"""
Porównanie modeli Sentence-BERT dla języka polskiego.

Ten skrypt testuje różne modele na tym samym korpusie i zapytaniach,
aby znaleźć najlepszy model dla polskich tekstów.

Testowane modele:
1. intfloat/multilingual-e5-small - wielojęzyczny (domyślny)
2. sdadas/mmlw-retrieval-roberta-base - POLSKI ⭐
3. sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2 - wielojęzyczny
4. sentence-transformers/LaBSE - wielojęzyczny Google

Użycie:
    python sbert-compare-models.py
    python sbert-compare-models.py --corpus PAN_TADEUSZ  # szybszy test
"""

import numpy as np
import time
import argparse
from pathlib import Path
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from corpora import CORPORA_FILES

# --- MODELE DO PRZETESTOWANIA ---

MODELS_TO_TEST = {
    "multilingual-e5-small": {
        "name": "intfloat/multilingual-e5-small",
        "description": "Wielojęzyczny E5 (domyślny)",
        "size": "118M parametrów",
        "languages": "100+ języków"
    },
    "polish-roberta": {
        "name": "sdadas/mmlw-retrieval-roberta-base",
        "description": "Polski RoBERTa (NAJLEPSZY dla PL) ⭐",
        "size": "~500MB",
        "languages": "Polski + wielojęzyczny"
    },
    "paraphrase-multilingual": {
        "name": "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
        "description": "Paraphrase Multilingual",
        "size": "471M parametrów",
        "languages": "50+ języków"
    },
    "labse": {
        "name": "sentence-transformers/LaBSE",
        "description": "LaBSE (Language-agnostic BERT)",
        "size": "471M parametrów",
        "languages": "109 języków"
    }
}

# Zapytania testowe - polskie zdania z różnych dziedzin
TEST_QUERIES = [
    "Król wydał rozkaz swoim rycerzom.",
    "Szlachta polska była dumna ze swoich tradycji.",
    "Wojsko maszerowało przez las w kierunku miasta.",
    "Miłość jest najważniejsza w życiu człowieka.",
    "Lekarz zalecił natychmiastowe leczenie choroby.",
    "Jestem bardzo głodny i chciałbym coś zjeść.",
]

# --- FUNKCJE POMOCNICZE ---

def load_corpus(corpus_name="PAN_TADEUSZ", max_sentences=1000):
    """
    Wczytuje korpus tekstowy (ograniczona wersja dla szybkości testów).
    
    Args:
        corpus_name: Nazwa korpusu z CORPORA_FILES
        max_sentences: Maksymalna liczba zdań (dla szybkości)
    
    Returns:
        list: Lista zdań
    """
    print(f"\nWczytywanie korpusu: {corpus_name}")
    print(f"Limit zdań: {max_sentences}")
    
    files = CORPORA_FILES[corpus_name]
    sentences = []
    
    for file in files:
        try:
            with open(file, 'r', encoding='utf-8') as f:
                lines = [line.strip() for line in f if line.strip()]
                sentences.extend(lines)
                
                if len(sentences) >= max_sentences:
                    break
        except FileNotFoundError:
            continue
    
    sentences = sentences[:max_sentences]
    print(f"✓ Wczytano {len(sentences):,} zdań")
    
    return sentences

def test_model(model_key, model_info, corpus_sentences, test_queries):
    """
    Testuje pojedynczy model i zwraca metryki.
    
    Args:
        model_key: Klucz modelu (dla identyfikacji)
        model_info: Dict z informacjami o modelu
        corpus_sentences: Lista zdań korpusu
        test_queries: Lista zapytań testowych
    
    Returns:
        dict: Metryki wydajności i jakości
    """
    print(f"\n{'='*80}")
    print(f"TEST MODELU: {model_info['description']}")
    print(f"{'='*80}")
    print(f"Model: {model_info['name']}")
    print(f"Rozmiar: {model_info['size']}")
    print(f"Języki: {model_info['languages']}")
    print(f"{'─'*80}")
    
    results = {
        "model_key": model_key,
        "model_name": model_info['name'],
        "description": model_info['description']
    }
    
    # 1. ŁADOWANIE MODELU
    print(f"\n1. Ładowanie modelu...")
    try:
        start_load = time.time()
        model = SentenceTransformer(model_info['name'])
        load_time = time.time() - start_load
        print(f"   ✓ Załadowano w {load_time:.2f}s")
        results['load_time'] = load_time
    except Exception as e:
        print(f"   ✗ BŁĄD: {e}")
        results['error'] = str(e)
        return results
    
    # 2. KODOWANIE KORPUSU
    print(f"\n2. Kodowanie korpusu ({len(corpus_sentences):,} zdań)...")
    try:
        start_encode = time.time()
        corpus_embeddings = model.encode(
            corpus_sentences,
            batch_size=32,
            show_progress_bar=False,
            convert_to_numpy=True,
            normalize_embeddings=True
        )
        encode_time = time.time() - start_encode
        print(f"   ✓ Zakodowano w {encode_time:.2f}s")
        print(f"   Średnio: {encode_time/len(corpus_sentences)*1000:.2f}ms/zdanie")
        results['encode_time'] = encode_time
        results['encode_speed'] = len(corpus_sentences) / encode_time
    except Exception as e:
        print(f"   ✗ BŁĄD: {e}")
        results['error'] = str(e)
        return results
    
    # 3. TESTOWANIE ZAPYTAŃ
    print(f"\n3. Testowanie zapytań ({len(test_queries)} zapytań)...")
    query_similarities = []
    
    for i, query in enumerate(test_queries, 1):
        # Zakoduj zapytanie
        query_embedding = model.encode(
            [query],
            convert_to_numpy=True,
            normalize_embeddings=True
        )
        
        # Oblicz podobieństwo
        similarities = cosine_similarity(query_embedding, corpus_embeddings)[0]
        
        # Znajdź top-3
        top_3_indices = np.argsort(similarities)[::-1][:3]
        avg_top3_sim = np.mean([similarities[idx] for idx in top_3_indices])
        max_sim = similarities[top_3_indices[0]]
        
        query_similarities.append(avg_top3_sim)
        
        print(f"   Zapytanie {i}: max_sim={max_sim:.4f}, avg_top3={avg_top3_sim:.4f}")
        print(f"   → \"{query[:60]}...\"")
        print(f"     Top wynik: \"{corpus_sentences[top_3_indices[0]][:60]}...\"")
    
    # Metryki jakości
    avg_similarity = np.mean(query_similarities)
    min_similarity = np.min(query_similarities)
    max_similarity = np.max(query_similarities)
    
    results['avg_similarity'] = float(avg_similarity)
    results['min_similarity'] = float(min_similarity)
    results['max_similarity'] = float(max_similarity)
    results['std_similarity'] = float(np.std(query_similarities))
    
    print(f"\n   PODSUMOWANIE JAKOŚCI:")
    print(f"   • Średnie podobieństwo: {avg_similarity:.4f}")
    print(f"   • Min/Max: {min_similarity:.4f} / {max_similarity:.4f}")
    print(f"   • Odchylenie std: {results['std_similarity']:.4f}")
    
    return results

def print_comparison_table(all_results):
    """Wyświetla tabelę porównawczą wszystkich modeli."""
    print(f"\n{'='*80}")
    print(f"PORÓWNANIE MODELI - PODSUMOWANIE")
    print(f"{'='*80}\n")
    
    # Sortuj według średniego podobieństwa (jakość)
    valid_results = [r for r in all_results if 'error' not in r]
    sorted_by_quality = sorted(valid_results, key=lambda x: x['avg_similarity'], reverse=True)
    
    print(f"{'Rank':<6} {'Model':<35} {'Jakość':<12} {'Czas [s]':<12} {'Szybkość':<15}")
    print(f"{'─'*100}")
    
    for rank, result in enumerate(sorted_by_quality, 1):
        emoji = "🥇" if rank == 1 else "🥈" if rank == 2 else "🥉" if rank == 3 else "  "
        
        model_name = result['model_key']
        quality = result['avg_similarity']
        encode_time = result.get('encode_time', 0)
        speed = result.get('encode_speed', 0)
        
        print(f"{emoji} {rank:<4} {model_name:<35} {quality:<12.4f} {encode_time:<12.2f} {speed:<15.1f} zd/s")
    
    # Szczegółowe porównanie
    print(f"\n{'='*80}")
    print(f"SZCZEGÓŁOWA ANALIZA")
    print(f"{'='*80}\n")
    
    for rank, result in enumerate(sorted_by_quality, 1):
        emoji = "🥇" if rank == 1 else "🥈" if rank == 2 else "🥉" if rank == 3 else "○"
        
        print(f"{emoji} {rank}. {result['description']}")
        print(f"   Model: {result['model_name']}")
        print(f"   Jakość (avg similarity): {result['avg_similarity']:.4f}")
        print(f"   Czas kodowania: {result.get('encode_time', 0):.2f}s")
        print(f"   Szybkość: {result.get('encode_speed', 0):.1f} zdań/s")
        print(f"   Czas ładowania: {result.get('load_time', 0):.2f}s")
        print()
    
    # REKOMENDACJA
    print(f"{'='*80}")
    print(f"🎯 REKOMENDACJA")
    print(f"{'='*80}\n")
    
    best = sorted_by_quality[0]
    fastest = min(valid_results, key=lambda x: x.get('encode_time', float('inf')))
    
    print(f"✨ NAJLEPSZA JAKOŚĆ: {best['description']}")
    print(f"   Model: {best['model_name']}")
    print(f"   Jakość: {best['avg_similarity']:.4f}")
    print(f"   Użyj: python sbert-encode-database.py --model {best['model_name']}")
    
    print(f"\n⚡ NAJSZYBSZY: {fastest['description']}")
    print(f"   Model: {fastest['model_name']}")
    print(f"   Czas: {fastest['encode_time']:.2f}s")
    print(f"   Szybkość: {fastest['encode_speed']:.1f} zdań/s")
    
    # Trade-off
    if best['model_key'] != fastest['model_key']:
        quality_diff = (best['avg_similarity'] - fastest['avg_similarity']) / fastest['avg_similarity'] * 100
        time_diff = (fastest['encode_time'] - best['encode_time']) / best['encode_time'] * 100
        
        print(f"\n⚖️  TRADE-OFF:")
        print(f"   • Najlepszy model jest o {quality_diff:.1f}% lepszy jakościowo")
        print(f"   • Ale o {abs(time_diff):.1f}% wolniejszy w kodowaniu")
    
    print(f"\n{'='*80}\n")

def main():
    """Główna funkcja."""
    parser = argparse.ArgumentParser(description='Porównanie modeli SBERT dla polskiego')
    parser.add_argument('--corpus', type=str, default='PAN_TADEUSZ',
                      choices=['PAN_TADEUSZ', 'WOLNELEKTURY', 'ALL'],
                      help='Korpus do testowania')
    parser.add_argument('--max-sentences', type=int, default=1000,
                      help='Maksymalna liczba zdań z korpusu (dla szybkości)')
    parser.add_argument('--models', type=str, nargs='+',
                      choices=list(MODELS_TO_TEST.keys()),
                      help='Wybierz konkretne modele do testowania')
    
    args = parser.parse_args()
    
    print(f"\n{'='*80}")
    print(f"PORÓWNANIE MODELI SENTENCE-BERT DLA JĘZYKA POLSKIEGO")
    print(f"{'='*80}")
    print(f"Korpus: {args.corpus}")
    print(f"Limit zdań: {args.max_sentences}")
    print(f"Zapytań testowych: {len(TEST_QUERIES)}")
    print(f"{'='*80}")
    
    # Wczytaj korpus
    try:
        corpus = load_corpus(args.corpus, args.max_sentences)
    except Exception as e:
        print(f"\n✗ BŁĄD przy wczytywaniu korpusu: {e}")
        return
    
    # Wybierz modele do testowania
    if args.models:
        models_to_test = {k: v for k, v in MODELS_TO_TEST.items() if k in args.models}
    else:
        models_to_test = MODELS_TO_TEST
    
    print(f"\nLiczba modeli do przetestowania: {len(models_to_test)}")
    for key, info in models_to_test.items():
        print(f"  • {info['description']}")
    
    # Testuj każdy model
    all_results = []
    
    for model_key, model_info in models_to_test.items():
        try:
            result = test_model(model_key, model_info, corpus, TEST_QUERIES)
            all_results.append(result)
        except Exception as e:
            print(f"\n✗ BŁĄD podczas testowania {model_key}: {e}")
            all_results.append({
                "model_key": model_key,
                "model_name": model_info['name'],
                "description": model_info['description'],
                "error": str(e)
            })
    
    # Wyświetl porównanie
    if all_results:
        print_comparison_table(all_results)
    
    print(f"{'='*80}")
    print(f"✓ TESTY ZAKOŃCZONE")
    print(f"{'='*80}\n")

if __name__ == "__main__":
    main()
