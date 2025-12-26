import numpy as np
import json
import logging
from gensim.models import Word2Vec
from tokenizers import Tokenizer
import os
import glob
from pathlib import Path
from corpora import CORPORA_FILES # type: ignore

# Ustawienie logowania dla gensim
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

# --- KONFIGURACJA ŚCIEŻEK I PARAMETRÓW ---
OUTPUT_TENSOR_FILE = "embedding_tensor_cbow.npy"
OUTPUT_MAP_FILE = "embedding_token_to_index_map.json"
OUTPUT_MODEL_FILE = "embedding_word2vec_cbow_model.model"

# Parametry treningu Word2Vec (CBOW)
VECTOR_LENGTH = 20
WINDOW_SIZE = 6
MIN_COUNT = 2
WORKERS = 4
EPOCHS = 20
SAMPLE_RATE = 1e-2
SG_MODE = 0 # 0 dla CBOW, 1 dla Skip-gram

# loading r& aggregating aw sentences from files
def aggregate_raw_sentences(files: list[Path]):
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

    if not raw_sentences:
        print("BŁĄD: Pliki wejściowe są puste lub nie zostały wczytane.")
        exit()
    return raw_sentences

def run_training(key: str, TOKENIZER_FILE: Path):
    files = CORPORA_FILES[key]

    print("Rozpoczynanie treningu embeddingów słów przy użyciu Word2Vec (CBOW)...")

    try:
        print(f"Ładowanie tokenizera z pliku: {TOKENIZER_FILE}")
        tokenizer = Tokenizer.from_file(TOKENIZER_FILE)
    except FileNotFoundError:
        print(f"BŁĄD: Nie znaleziono pliku '{TOKENIZER_FILE}'. Upewnij się, że plik istnieje.")
        raise

    raw_sentences = aggregate_raw_sentences(files)

    # Tokenizacja całej partii zdań przy użyciu tokenizera BPE
    print(f"Tokenizacja {len(raw_sentences)} zdań...")
    encodings = tokenizer.encode_batch(raw_sentences)

    # Konwersja obiektów Encoding na listę list stringów (tokenów)
    tokenized_sentences = [
        encoding.tokens for encoding in encodings
    ]
    print(f"Przygotowano {len(tokenized_sentences)} sekwencji do treningu.")

    # --- ETAP 2: Trening Word2Vec (CBOW) ---

    print("\n--- Rozpoczynanie Treningu Word2Vec (CBOW) ---")
    model = Word2Vec(
        sentences=tokenized_sentences,
        vector_size=VECTOR_LENGTH,
        window=WINDOW_SIZE,
        min_count=MIN_COUNT,
        workers=WORKERS,
        sg=SG_MODE,  # 0: CBOW
        epochs=EPOCHS,
        sample=SAMPLE_RATE,
    )
    print("Trening zakończony pomyślnie.")

    # --- ETAP 3: Eksport i Zapis Wyników ---

    # Eksport tensora embeddingowego
    embedding_matrix_np = model.wv.vectors
    embedding_matrix_tensor = np.array(embedding_matrix_np, dtype=np.float32)

    print(f"\nKształt finalnego tensora: {embedding_matrix_tensor.shape} (Tokeny x Wymiar)")

    # 1. Zapisanie tensora NumPy (.npy)
    np.save(OUTPUT_TENSOR_FILE, embedding_matrix_tensor)
    print(f"Tensor embeddingowy zapisany jako: '{OUTPUT_TENSOR_FILE}'.")

    # 2. Zapisanie mapowania tokenów na indeksy
    token_to_index = {token: model.wv.get_index(token) for token in model.wv.index_to_key}
    with open(OUTPUT_MAP_FILE, "w", encoding="utf-8") as f:
        json.dump(token_to_index, f, ensure_ascii=False, indent=4)
    print(f"Mapa tokenów do indeksów zapisana jako: '{OUTPUT_MAP_FILE}'.")

    # 3. Zapisanie całego modelu gensim (opcjonalne, ale zalecane)
    model.save(OUTPUT_MODEL_FILE)
    print(f"Pełny model Word2Vec zapisany jako: '{OUTPUT_MODEL_FILE}'.")

if __name__ == "__main__":
    # files = CORPORA_FILES["WOLNELEKTURY"]
    # files = CORPORA_FILES["PAN_TADEUSZ"]
    files = CORPORA_FILES["ALL"]

    TOKENIZER_FILE = "../tokenizer/tokenizers/latarnik_tokenizer.json"
    # TOKENIZER_FILE = "../tokenizer/tokenizers/bielik-v1-tokenizer.json"
    # TOKENIZER_FILE = "../tokenizer/tokenizers/bielik-v3-tokenizer.json"

    run_training(files, TOKENIZER_FILE)
