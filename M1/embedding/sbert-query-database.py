"""
SBERT - Etap 2: Odpytywanie bazy danych embeddingów.

Ten skrypt:
1. Wczytuje wcześniej zakodowaną bazę embeddingów
2. Pozwala odpytywać bazę o podobne zdania
3. Testuje zarówno zdania wymyślone, jak i z korpusu

Użycie:
    python sbert-query-database.py
    python sbert-query-database.py --query "Twoje zdanie"
    python sbert-query-database.py --test-corpus
    python sbert-query-database.py --interactive
    
Wymaga wcześniejszego uruchomienia:
    python sbert-encode-database.py
"""

import numpy as np
import json
import argparse
import time
from pathlib import Path
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# --- KONFIGURACJA ---

# Pliki bazy danych (generowane przez sbert-encode-database.py)
INPUT_EMBEDDINGS_FILE = "sbert_sentence_embeddings.npy"
INPUT_SENTENCE_MAP = "sbert_sentence_map.json"
INPUT_STATS_FILE = "sbert_database_stats.json"

# --- FUNKCJE POMOCNICZE ---

def load_database():
    """
    Wczytuje bazę danych embeddingów i metadane.
    
    Returns:
        tuple: (embeddings, sentences, stats)
    """
    print(f"\n{'='*80}")
    print(f"WCZYTYWANIE BAZY DANYCH")
    print(f"{'='*80}")
    
    # Sprawdź czy pliki istnieją
    required_files = [
        INPUT_EMBEDDINGS_FILE,
        INPUT_SENTENCE_MAP,
        INPUT_STATS_FILE
    ]
    
    for file in required_files:
        if not Path(file).exists():
            raise FileNotFoundError(
                f"Brak pliku: {file}\n"
                f"Najpierw uruchom: python sbert-encode-database.py"
            )
    
    # Wczytaj embeddingi
    print(f"Wczytywanie embeddingów...")
    start = time.time()
    embeddings = np.load(INPUT_EMBEDDINGS_FILE)
    end = time.time()
    print(f"✓ Embeddingi: {embeddings.shape} ({end-start:.2f}s)")
    
    # Wczytaj mapę zdań
    print(f"Wczytywanie mapy zdań...")
    with open(INPUT_SENTENCE_MAP, 'r', encoding='utf-8') as f:
        sentence_map = json.load(f)
    sentences = [sentence_map[str(i)] for i in range(len(sentence_map))]
    print(f"✓ Zdania: {len(sentences):,}")
    
    # Wczytaj statystyki
    with open(INPUT_STATS_FILE, 'r', encoding='utf-8') as f:
        stats = json.load(f)
    print(f"✓ Statystyki: model={stats['model']}, corpus={stats['corpus']}")
    
    print(f"{'='*80}\n")
    
    return embeddings, sentences, stats

def query_database(query_text, embeddings, sentences, model, top_k=5):
    """
    Odpytuje bazę danych o zdania podobne do zapytania.
    
    Args:
        query_text (str): Zdanie zapytania
        embeddings (np.ndarray): Macierz embeddingów bazy danych
        sentences (list): Lista oryginalnych zdań
        model: Model SBERT do kodowania zapytania
        top_k (int): Liczba najbardziej podobnych wyników
        
    Returns:
        list: Lista krotek (index, similarity, sentence)
    """
    # Zakoduj zapytanie
    query_embedding = model.encode(
        [query_text],
        convert_to_numpy=True,
        normalize_embeddings=True
    )
    
    # Oblicz podobieństwo cosinusowe
    similarities = cosine_similarity(query_embedding, embeddings)[0]
    
    # Znajdź top-k najbardziej podobnych
    top_indices = np.argsort(similarities)[::-1][:top_k]
    
    results = [
        (int(idx), float(similarities[idx]), sentences[idx])
        for idx in top_indices
    ]
    
    return results

def print_results(query_text, results, show_index=True):
    """
    Wyświetla wyniki zapytania w czytelnym formacie.
    
    Args:
        query_text (str): Zapytanie
        results (list): Lista wyników z query_database()
        show_index (bool): Czy pokazywać ID zdania z korpusu
    """
    print(f"\n{'─'*80}")
    print(f"🔍 Zapytanie: \"{query_text}\"")
    print(f"{'─'*80}")
    print(f"Top {len(results)} najbardziej podobnych zdań:\n")
    
    for rank, (idx, similarity, sentence) in enumerate(results, 1):
        # Emoji dla poziomów podobieństwa
        if similarity > 0.9:
            emoji = "🔥"
        elif similarity > 0.8:
            emoji = "✨"
        elif similarity > 0.7:
            emoji = "✓"
        else:
            emoji = "○"
        
        print(f"  {rank}. {emoji} Podobieństwo: {similarity:.4f}")
        if show_index:
            print(f"     ID: {idx}")
        print(f"     Zdanie: {sentence}")
        print()

def test_invented_queries(embeddings, sentences, model):
    """
    Testuje bazę danych na wymyślonych zapytaniach.
    
    Args:
        embeddings: Macierz embeddingów
        sentences: Lista zdań
        model: Model SBERT
    """
    print(f"\n{'='*80}")
    print(f"TEST 1: ZDANIA WYMYŚLONE (spoza korpusu)")
    print(f"{'='*80}")
    
    # Zapytania testowe - różne tematy
    test_queries = [
        "Jestem bardzo głodny i chciałbym coś zjeść.",
        "Wojsko wkracza do miasta aby stłumić bunty.",
        "Leczenie choroby wymaga interwencji lekarza.",
        "Król wydał rozkaz swoim rycerzom.",
        "Miłość jest najpiękniejszym uczuciem na świecie.",
        "Szlachta polska broniła swoich przywilejów.",
        "Pogoda dziś jest naprawdę wspaniała.",
        "Technologia zmienia nasz świat każdego dnia."
    ]
    
    for query in test_queries:
        results = query_database(query, embeddings, sentences, model, top_k=5)
        print_results(query, results, show_index=True)

def test_corpus_queries(embeddings, sentences, model, sample_size=5):
    """
    Testuje bazę danych na zdaniach bezpośrednio z korpusu.
    
    Args:
        embeddings: Macierz embeddingów
        sentences: Lista zdań
        model: Model SBERT
        sample_size: Liczba losowych zdań z korpusu do przetestowania
    """
    print(f"\n{'='*80}")
    print(f"TEST 2: ZDANIA Z KORPUSU (powinny mieć similarity ≈ 1.0)")
    print(f"{'='*80}")
    
    # Wybierz losowe zdania z korpusu
    np.random.seed(42)  # Dla powtarzalności
    sample_indices = np.random.choice(len(sentences), sample_size, replace=False)
    
    for idx in sample_indices:
        query = sentences[idx]
        results = query_database(query, embeddings, sentences, model, top_k=5)
        
        print(f"\n{'─'*80}")
        print(f"🔍 Zapytanie (z korpusu, ID={idx}):")
        print(f"   \"{query}\"")
        print(f"{'─'*80}")
        print(f"Top 5 wyników:\n")
        
        for rank, (result_idx, similarity, sentence) in enumerate(results, 1):
            # Oznacz czy to dokładnie to samo zdanie
            is_exact = (result_idx == idx)
            emoji = "🎯" if is_exact else "○"
            marker = " ← TO SAMO ZDANIE" if is_exact else ""
            
            print(f"  {rank}. {emoji} Podobieństwo: {similarity:.4f}{marker}")
            print(f"     ID: {result_idx}")
            print(f"     Zdanie: {sentence}")
            print()

def interactive_mode(embeddings, sentences, model):
    """
    Tryb interaktywny - użytkownik wpisuje zapytania.
    
    Args:
        embeddings: Macierz embeddingów
        sentences: Lista zdań
        model: Model SBERT
    """
    print(f"\n{'='*80}")
    print(f"TRYB INTERAKTYWNY")
    print(f"{'='*80}")
    print(f"Wpisz zapytanie lub:")
    print(f"  • 'q' lub 'quit' - wyjście")
    print(f"  • 'random' - losowe zdanie z korpusu")
    print(f"  • 'help' - pomoc")
    print(f"{'='*80}\n")
    
    while True:
        query = input("\n🔍 Zapytanie: ").strip()
        
        if not query:
            continue
        
        if query.lower() in ['q', 'quit', 'exit']:
            print("Do widzenia!")
            break
        
        if query.lower() == 'help':
            print("\nKomendy:")
            print("  • Wpisz dowolne zdanie aby wyszukać podobne")
            print("  • 'random' - wylosuj zdanie z korpusu")
            print("  • 'q' - wyjście")
            continue
        
        if query.lower() == 'random':
            idx = np.random.randint(0, len(sentences))
            query = sentences[idx]
            print(f"  Wylosowano zdanie (ID={idx})")
        
        try:
            results = query_database(query, embeddings, sentences, model, top_k=5)
            print_results(query, results, show_index=True)
        except Exception as e:
            print(f"✗ Błąd: {e}")

def main():
    """Główna funkcja skryptu."""
    parser = argparse.ArgumentParser(description='Odpytywanie bazy embeddingów SBERT')
    parser.add_argument('--query', type=str,
                      help='Pojedyncze zapytanie do przetestowania')
    parser.add_argument('--test-invented', action='store_true',
                      help='Test na wymyślonych zdaniach')
    parser.add_argument('--test-corpus', action='store_true',
                      help='Test na zdaniach z korpusu')
    parser.add_argument('--interactive', '-i', action='store_true',
                      help='Tryb interaktywny')
    parser.add_argument('--top-k', type=int, default=5,
                      help='Liczba wyników do pokazania')
    parser.add_argument('--all-tests', action='store_true',
                      help='Uruchom wszystkie testy')
    
    args = parser.parse_args()
    
    # Wczytaj bazę danych
    try:
        embeddings, sentences, stats = load_database()
    except FileNotFoundError as e:
        print(f"\n✗ BŁĄD: {e}\n")
        return
    except Exception as e:
        print(f"\n✗ BŁĄD podczas wczytywania bazy: {e}\n")
        return
    
    # Wczytaj model (ten sam co użyty do kodowania)
    model_name = stats['model']
    print(f"Ładowanie modelu: {model_name}...")
    try:
        model = SentenceTransformer(model_name)
        print(f"✓ Model załadowany\n")
    except Exception as e:
        print(f"✗ BŁĄD podczas ładowania modelu: {e}\n")
        return
    
    # Wykonaj odpowiednie testy/zapytania
    if args.all_tests:
        # Wszystkie testy po kolei
        test_invented_queries(embeddings, sentences, model)
        test_corpus_queries(embeddings, sentences, model)
        
    elif args.query:
        # Pojedyncze zapytanie
        results = query_database(args.query, embeddings, sentences, model, args.top_k)
        print_results(args.query, results, show_index=True)
        
    elif args.test_invented:
        # Test wymyślonych zdań
        test_invented_queries(embeddings, sentences, model)
        
    elif args.test_corpus:
        # Test zdań z korpusu
        test_corpus_queries(embeddings, sentences, model)
        
    elif args.interactive:
        # Tryb interaktywny
        interactive_mode(embeddings, sentences, model)
        
    else:
        # Domyślnie: wszystkie testy
        print("Uruchamiam wszystkie testy (użyj --help aby zobaczyć opcje)\n")
        test_invented_queries(embeddings, sentences, model)
        test_corpus_queries(embeddings, sentences, model)
    
    print(f"\n{'='*80}")
    print(f"✓ ZAKOŃCZONO")
    print(f"{'='*80}\n")

if __name__ == "__main__":
    main()
