"""
SBERT - Etap 1: Kodowanie bazy danych (korpusu) do embeddingów.

Ten skrypt:
1. Wczytuje korpus zdań z plików tekstowych
2. Generuje embeddingi używając modelu Sentence-BERT
3. Zapisuje embeddingi i mapę zdań do plików

Użycie:
    python sbert-encode-database.py
    
Pliki wyjściowe:
    - sbert_sentence_embeddings.npy - macierz embeddingów (numpy array)
    - sbert_sentence_map.json - mapowanie ID → oryginalne zdanie
    - sbert_database_stats.json - statystyki bazy danych
"""

import numpy as np
import json
import time
import argparse
from pathlib import Path
from sentence_transformers import SentenceTransformer
from corpora import CORPORA_FILES

# --- KONFIGURACJA ---

# Model Sentence-BERT (wybierz najlepszy dla języka polskiego)
MODEL_NAME = 'intfloat/multilingual-e5-small'
# Alternatywy dla polskiego:
# MODEL_NAME = 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2'
# MODEL_NAME = 'sdadas/mmlw-retrieval-roberta-base'  # Polski model!

# Pliki wyjściowe
OUTPUT_EMBEDDINGS_FILE = "sbert_sentence_embeddings.npy"
OUTPUT_SENTENCE_MAP = "sbert_sentence_map.json"
OUTPUT_STATS_FILE = "sbert_database_stats.json"

# --- FUNKCJE POMOCNICZE ---

def load_raw_sentences(file_list):
    """
    Wczytuje surowe zdania z listy plików.
    
    Args:
        file_list (list): Lista ścieżek do plików tekstowych
        
    Returns:
        list: Lista zdań (każde zdanie to string)
    """
    raw_sentences = []
    print(f"\nWczytywanie tekstu z {len(file_list)} plików...")
    
    files_loaded = 0
    files_failed = 0
    
    for file in file_list:
        try:
            with open(file, 'r', encoding='utf-8') as f:
                lines = [line.strip() for line in f if line.strip()]
                raw_sentences.extend(lines)
                files_loaded += 1
        except FileNotFoundError:
            print(f"  ⚠ Nie znaleziono pliku: {file}")
            files_failed += 1
        except Exception as e:
            print(f"  ✗ Błąd przy pliku {file}: {e}")
            files_failed += 1
    
    print(f"✓ Wczytano {files_loaded} plików, {files_failed} błędów")
    print(f"✓ Łącznie {len(raw_sentences):,} zdań")
    
    if not raw_sentences:
        raise ValueError("Korpus danych jest pusty!")
    
    return raw_sentences

def generate_embeddings(sentences, model_name, batch_size=32):
    """
    Generuje embeddingi dla listy zdań używając modelu SBERT.
    
    Args:
        sentences (list): Lista zdań do zakodowania
        model_name (str): Nazwa modelu z HuggingFace
        batch_size (int): Rozmiar batcha dla przetwarzania
        
    Returns:
        np.ndarray: Macierz embeddingów (n_sentences × embedding_dim)
    """
    print(f"\n{'='*80}")
    print(f"KODOWANIE BAZY DANYCH")
    print(f"{'='*80}")
    print(f"Model: {model_name}")
    print(f"Liczba zdań: {len(sentences):,}")
    print(f"Batch size: {batch_size}")
    print(f"{'='*80}\n")
    
    # Wczytanie modelu
    print(f"Ładowanie modelu...")
    start_load = time.time()
    model = SentenceTransformer(model_name)
    end_load = time.time()
    print(f"✓ Model załadowany w {end_load - start_load:.2f}s")
    
    # Generowanie embeddingów
    print(f"\nGenerowanie embeddingów...")
    start_encode = time.time()
    embeddings = model.encode(
        sentences,
        batch_size=batch_size,
        show_progress_bar=True,
        convert_to_numpy=True,
        normalize_embeddings=True  # Normalizacja dla lepszego podobieństwa cosinusowego
    )
    end_encode = time.time()
    
    encoding_time = end_encode - start_encode
    print(f"\n✓ Kodowanie zakończone w {encoding_time:.2f}s ({encoding_time/60:.1f} min)")
    print(f"  Średnio: {encoding_time/len(sentences)*1000:.2f}ms/zdanie")
    
    return embeddings, encoding_time

def save_database(embeddings, sentences, stats):
    """
    Zapisuje bazę danych embeddingów i metadane.
    
    Args:
        embeddings (np.ndarray): Macierz embeddingów
        sentences (list): Lista oryginalnych zdań
        stats (dict): Statystyki bazy danych
    """
    print(f"\n{'='*80}")
    print(f"ZAPISYWANIE BAZY DANYCH")
    print(f"{'='*80}")
    
    # 1. Zapisz embeddingi (numpy binary format)
    np.save(OUTPUT_EMBEDDINGS_FILE, embeddings)
    file_size_mb = Path(OUTPUT_EMBEDDINGS_FILE).stat().st_size / (1024 * 1024)
    print(f"✓ Embeddingi: {OUTPUT_EMBEDDINGS_FILE} ({file_size_mb:.2f} MB)")
    
    # 2. Zapisz mapę zdań (JSON)
    # Format: {id: sentence} dla szybkiego odnalezienia oryginalnego tekstu
    sentence_map = {str(i): sentence for i, sentence in enumerate(sentences)}
    with open(OUTPUT_SENTENCE_MAP, 'w', encoding='utf-8') as f:
        json.dump(sentence_map, f, ensure_ascii=False, indent=2)
    print(f"✓ Mapa zdań: {OUTPUT_SENTENCE_MAP}")
    
    # 3. Zapisz statystyki
    with open(OUTPUT_STATS_FILE, 'w', encoding='utf-8') as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)
    print(f"✓ Statystyki: {OUTPUT_STATS_FILE}")
    
    print(f"{'='*80}\n")

def main():
    """Główna funkcja skryptu."""
    parser = argparse.ArgumentParser(description='Kodowanie korpusu do bazy embeddingów SBERT')
    parser.add_argument('--corpus', type=str, default='ALL',
                      choices=['ALL', 'WOLNELEKTURY', 'PAN_TADEUSZ', 'NKJP'],
                      help='Wybór korpusu do zakodowania')
    parser.add_argument('--model', type=str, default=MODEL_NAME,
                      help='Nazwa modelu Sentence-BERT z HuggingFace')
    parser.add_argument('--batch-size', type=int, default=32,
                      help='Rozmiar batcha dla kodowania')
    parser.add_argument('--force', action='store_true',
                      help='Wymuś ponowne kodowanie (nawet jeśli plik istnieje)')
    
    args = parser.parse_args()
    
    # Sprawdź czy baza już istnieje
    if Path(OUTPUT_EMBEDDINGS_FILE).exists() and not args.force:
        print(f"\n{'='*80}")
        print(f"⚠ UWAGA: Baza danych już istnieje!")
        print(f"{'='*80}")
        print(f"Plik: {OUTPUT_EMBEDDINGS_FILE}")
        print(f"Użyj --force aby wymusić ponowne kodowanie")
        print(f"{'='*80}\n")
        return
    
    print(f"\n{'='*80}")
    print(f"SBERT - KODOWANIE BAZY DANYCH")
    print(f"{'='*80}")
    print(f"Korpus: {args.corpus}")
    print(f"Model: {args.model}")
    print(f"Batch size: {args.batch_size}")
    print(f"{'='*80}\n")
    
    # Wczytaj korpus
    try:
        files = CORPORA_FILES[args.corpus]
        sentences = load_raw_sentences(files)
    except KeyError:
        print(f"✗ BŁĄD: Nieznany korpus '{args.corpus}'")
        print(f"Dostępne: {list(CORPORA_FILES.keys())}")
        return
    except ValueError as e:
        print(f"✗ BŁĄD: {e}")
        return
    
    # Statystyki korpusu
    avg_len = np.mean([len(s.split()) for s in sentences])
    max_len = max([len(s.split()) for s in sentences])
    min_len = min([len(s.split()) for s in sentences])
    
    print(f"\nStatystyki korpusu:")
    print(f"  • Liczba zdań: {len(sentences):,}")
    print(f"  • Średnia długość: {avg_len:.1f} słów")
    print(f"  • Min/Max długość: {min_len}/{max_len} słów")
    
    # Generuj embeddingi
    try:
        embeddings, encoding_time = generate_embeddings(
            sentences, 
            args.model, 
            args.batch_size
        )
    except Exception as e:
        print(f"\n✗ BŁĄD podczas kodowania: {e}")
        return
    
    # Przygotuj statystyki
    stats = {
        "model": args.model,
        "corpus": args.corpus,
        "corpus_files_count": len(files),
        "sentences_count": len(sentences),
        "embedding_dimension": int(embeddings.shape[1]),
        "avg_sentence_length": float(avg_len),
        "min_sentence_length": int(min_len),
        "max_sentence_length": int(max_len),
        "encoding_time_seconds": float(encoding_time),
        "encoding_date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "embeddings_file": OUTPUT_EMBEDDINGS_FILE,
        "sentence_map_file": OUTPUT_SENTENCE_MAP
    }
    
    print(f"\nKształt macierzy embeddingów: {embeddings.shape}")
    print(f"  • Liczba zdań: {embeddings.shape[0]:,}")
    print(f"  • Wymiar wektora: {embeddings.shape[1]}")
    
    # Zapisz bazę danych
    save_database(embeddings, sentences, stats)
    
    print(f"{'='*80}")
    print(f"✓ KODOWANIE ZAKOŃCZONE POMYŚLNIE")
    print(f"{'='*80}")
    print(f"\nNastępny krok:")
    print(f"  python sbert-query-database.py")
    print(f"{'='*80}\n")

if __name__ == "__main__":
    main()
