# pip install sentence-transformers numpy scikit-learn

import numpy as np
import glob
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import logging
import os
import time
from corpora import CORPORA_FILES

# Ustawienie logowania
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

# --- KONFIGURACJA ŚCIEŻEK I PARAMETRÓW ---
# MODEL_NAME = 'intfloat/multilingual-e5-small'
# MODEL_NAME = "sdadas/mmlw-e5-small"
# MODEL_NAME = "sdadas/mmlw-retrieval-e5-small"
MODEL_NAME = "sdadas/st-polish-paraphrase-from-distilroberta"
OUTPUT_EMBEDDINGS_FILE = "sbert_sentence_embeddings.npy"

files = CORPORA_FILES["ALL"]

# --- ETAP 1: Wczytanie Korpusu ---

def load_raw_sentences(file_list):
    """Wczytuje surowe zdania z listy plików."""
    raw_sentences = []
    print(f"Wczytywanie tekstu z {len(file_list)} plików...")
    for file in file_list:
        try:
            with open(file, 'r', encoding='utf-8') as f:
                # Wczytaj linie, usuń białe znaki i pomiń puste
                lines = [line.strip() for line in f if line.strip()]
                raw_sentences.extend(lines)
        except FileNotFoundError:
            # Ostrzeżenie, jeśli plik nie zostanie znaleziony
            print(f"OSTRZEŻENIE: Nie znaleziono pliku '{file}'. Pomijam.")
        except Exception as e:
            print(f"BŁĄD podczas przetwarzania pliku '{file}': {e}")

    if not raw_sentences:
        raise ValueError("Korpus danych jest pusty lub nie został wczytany.")

    return raw_sentences

try:
    raw_sentences = load_raw_sentences(files)
    print(f"Wczytano {len(raw_sentences)} zdań do przetworzenia.")
except ValueError as e:
    print(f"BŁĄD: {e}")
    exit()

# --- ETAP 2: Generowanie/Wczytywanie Embeddingów KORPUSU ---

# Sprawdzenie, czy wektory korpusu istnieją już na dysku
if os.path.exists(OUTPUT_EMBEDDINGS_FILE):
    # --- Wariant 1: Wczytywanie z pliku (.npy) ---
    print(f"\n--- Wariant 1: Wczytywanie wektorów z pliku '{OUTPUT_EMBEDDINGS_FILE}' ---")
    try:
        start_time = time.time()
        sentence_embeddings = np.load(OUTPUT_EMBEDDINGS_FILE)
        end_time = time.time()
        print(f"Wektory załadowane pomyślnie w {end_time - start_time:.2f} sekundy. Pominięto kodowanie.")

    except Exception as e:
        # W przypadku błędu wczytywania (np. uszkodzony plik), przejdź do generowania
        print(f"BŁĄD podczas ładowania pliku .npy: {e}. Przetwarzam korpus od nowa.")
        needs_generation = True
    else:
        needs_generation = False
else:
    needs_generation = True

if needs_generation:
    # --- Wariant 2: Ładowanie Modelu i Generowanie ---
    print(f"\n--- Wariant 2: Ładowanie Modelu i Generowanie Wektorów ---")
    print(f"Ładowanie Sentence-Transformer: {MODEL_NAME}...")
    try:
        # Wczytanie modelu z Hugging Face
        model_sbert = SentenceTransformer(MODEL_NAME)
    except Exception as e:
        print(f"FATALNY BŁĄD podczas ładowania modelu {MODEL_NAME}: {e}")
        exit()

    print(f"Generowanie wektorów dla {len(raw_sentences)} zdań...")
    start_time = time.time()
    # Metoda .encode() automatycznie tokenizuje i generuje wektory
    sentence_embeddings = model_sbert.encode(
        raw_sentences,
        show_progress_bar=True,
        convert_to_numpy=True
    )
    end_time = time.time()
    print(f"Generowanie zakończone w {end_time - start_time:.2f} sekundy.")

    # Zapisanie nowo utworzonych wektorów do pliku
    np.save(OUTPUT_EMBEDDINGS_FILE, sentence_embeddings)
    print(f"Wektory zdań zapisane jako: '{OUTPUT_EMBEDDINGS_FILE}'.")


print(f"\nKształt macierzy embeddingów zdań: {sentence_embeddings.shape}")
print(f"Wymiar wektora zdania: {sentence_embeddings.shape[1]}")


# --- ETAP 3: Przykładowe Wykorzystanie (Porównywanie Zdań) ---

# =========================================================
# === DODANY FRAGMENT KODU ROZWIĄZUJĄCY BŁĄD NameError ===
# =========================================================
# Sprawdzenie, czy model został już zainicjowany (tj. czy zmienna istnieje w globalnym zakresie)
if 'model_sbert' not in locals() and 'model_sbert' not in globals():
    print(f"\nŁadowanie Sentence-Transformer do kodowania zapytania: {MODEL_NAME}...")
    try:
        model_sbert = SentenceTransformer(MODEL_NAME)
        print("Model SBERT załadowany pomyślnie.")
    except Exception as e:
        print(f"BŁĄD podczas ładowania modelu dla zapytania: {e}")
        exit()
# =========================================================
# 🔥🔥🔥🔥🔥🔥testowanie zdań🔥🔥🔥🔥🔥🔥🔥🔥
# query_sentence = "Jestem głodny."
# query_sentence = "Wojsko wejdzie do miast i skończą się bunty"
# query_sentence = "Leczenie tego schorzenia jest bardzo ważne i wymaga interwencji lekarza."
query_sentence = "Litwo! Ojczyzno moja! ty jesteś jak zdrowie."
print(f"\n--- Wyszukiwanie podobieństwa do: '{query_sentence}' ---")

# Generowanie wektora dla zapytania
query_embedding = model_sbert.encode(
    [query_sentence],
    convert_to_numpy=True
)

# Obliczenie podobieństwa kosinusowego między zapytaniem a wszystkimi zdaniami
# Podobieństwo kosinusowe jest standardową miarą podobieństwa wektorów
similarities = cosine_similarity(query_embedding, sentence_embeddings)[0]

# Wyszukanie 5 najbardziej podobnych
top_5_indices = np.argsort(similarities)[::-1][:5]

print("\n5 zdań z korpusu najbardziej podobnych do zapytania:")
for i in top_5_indices:
    print(f"  - Sim: {similarities[i]:.4f} | Zdanie: {raw_sentences[i]}")
