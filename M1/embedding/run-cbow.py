import numpy as np
import json
import logging
from gensim.models import Word2Vec
from tokenizers import Tokenizer
import os
import glob
# import z corpora (zakładam, że jest to plik pomocniczy)
from corpora import CORPORA_FILES # type: ignore 

# Ustawienie logowania dla gensim
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

# --- KONFIGURACJA ŚCIEŻEK I PARAMETRÓW ---
# files = CORPORA_FILES["WOLNELEKTURY"]
# files = CORPORA_FILES["PAN_TADEUSZ"]
files = CORPORA_FILES["ALL"]

TOKENIZER_FILE = "../tokenizer/tokenizers/custom_bpe_tokenizer.json"
# TOKENIZER_FILE = "../tokenizer/tokenizers/bielik-v1-tokenizer.json"
# TOKENIZER_FILE = "../tokenizer/tokenizers/bielik-v3-tokenizer.json"

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

try:
    print(f"Ładowanie tokenizera z pliku: {TOKENIZER_FILE}")
    tokenizer = Tokenizer.from_file(TOKENIZER_FILE)
except FileNotFoundError:
    print(f"BŁĄD: Nie znaleziono pliku '{TOKENIZER_FILE}'. Upewnij się, że plik istnieje.")
    raise

# loading r& aggregating aw sentences from files
def aggregate_raw_sentences(files):
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

# --- DODANA FUNKCJA: OBLICZANIE WEKTORA DLA CAŁEGO SŁOWA ---

def get_word_vector_and_similar(word: str, tokenizer: Tokenizer, model: Word2Vec, topn: int = 20):
    # Tokenizacja słowa na tokeny podwyrazowe
    # Używamy .encode(), aby otoczyć słowo spacjami, co imituje kontekst w zdaniu
    # Ważne: tokenizator BPE/SentencePiece musi widzieć spację, by dodać prefiks '_'
    encoding = tokenizer.encode(" " + word + " ") 
    word_tokens = [t.strip() for t in encoding.tokens if t.strip()] # Usuń puste tokeny
    
    # Usuwamy tokeny początku/końca sekwencji, jeśli zostały dodane przez tokenizator
    if word_tokens and word_tokens[0] in ['[CLS]', '<s>', '<s>', 'Ġ']:
        word_tokens = word_tokens[1:]
    if word_tokens and word_tokens[-1] in ['[SEP]', '</s>', '</s>']:
        word_tokens = word_tokens[:-1]

    valid_vectors = []
    missing_tokens = []
    
    # 1. Zbieranie wektorów dla każdego tokenu
    for token in word_tokens:
        if token in model.wv:
            # Użycie tokenu ze spacją (np. '_ryż') lub bez (np. 'szlach')
            valid_vectors.append(model.wv[token])
        else:
            # W tym miejscu token może być zbyt rzadki i pominięty przez MIN_COUNT
            missing_tokens.append(token)

    if not valid_vectors:
        # Kod do obsługi, gdy żaden token nie ma wektora
        if missing_tokens:
            print(f"BŁĄD: Żaden z tokenów składowych ('{word_tokens}') nie znajduje się w słowniku (MIN_COUNT={MIN_COUNT}).")
        else:
            print(f"BŁĄD: Słowo '{word}' nie zostało przetworzone na wektory (sprawdź tokenizację).")
        return None, None

    # 2. Uśrednianie wektorów
    # Wektor dla całego słowa to średnia wektorów jego tokenów składowych
    word_vector = np.mean(valid_vectors, axis=0)

    # 3. Znalezienie najbardziej podobnych tokenów
    similar_words = model.wv.most_similar(
        positive=[word_vector],
        topn=topn
    )
    
    return word_vector, similar_words

# --- WERYFIKACJA UŻYCIA NOWEJ FUNKCJI ---

print("\n--- Weryfikacja: Szukanie podobieństw dla całych SŁÓW (uśrednianie wektorów tokenów) ---")

# Przykłady, które wcześniej mogły nie działać
words_to_test = ['wojsko', 'szlachta', 'choroba', 'król'] 

for word in words_to_test:
    word_vector, similar_tokens = get_word_vector_and_similar(word, tokenizer, model, topn=10)
    
    if word_vector is not None:
        print(f"\n10 tokenów najbardziej podobnych do SŁOWA '{word}' (uśrednione wektory tokenów {tokenizer.encode(word).tokens}):")
        # Wyświetlanie wektora (pierwsze 5 elementów)
        print(f"  > Wektor słowa (początek): {word_vector[:5]}...")
        for token, similarity in similar_tokens:
            print(f"  - {token}: {similarity:.4f}")

# --- WERYFIKACJA DLA WZORCA MATEMATYCZNEGO (Analogia wektorowa) ---

tokens_analogy = ['dziecko', 'kobieta']

# Używamy uśredniania wektorów dla tokenów
if tokens_analogy[0] in model.wv and tokens_analogy[1] in model.wv:
    similar_to_combined = model.wv.most_similar(
        positive=tokens_analogy,
        topn=10
    )

    print(f"\n10 tokenów najbardziej podobnych do kombinacji tokenów: {tokens_analogy}")
    for token, similarity in similar_to_combined:
        print(f"  - {token}: {similarity:.4f}")
else:
    print(f"\nOstrzeżenie: Co najmniej jeden z tokenów '{tokens_analogy}' nie znajduje się w słowniku. Pomięto analogię.")