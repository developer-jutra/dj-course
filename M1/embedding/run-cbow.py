"""
ZADANIE 4.1 - CBOW (Continuous Bag-of-Words) Embedding

Ten skrypt implementuje model embeddingowy CBOW, który uczy się przewidywać 
słowo docelowe (środkowe) na podstawie jego słów kontekstowych (otaczających).

GŁÓWNE KROKI:
1. Załadowanie tokenizera BPE
2. Wczytanie i tokenizacja korpusu tekstowego
3. Trening modelu Word2Vec w trybie CBOW
4. Eksport wektorów embeddingowych
5. Testowanie podobieństwa semantycznego słów

CBOW vs Skip-gram:
- CBOW: kontekst → słowo środkowe (szybszy, lepszy dla częstych słów)
- Skip-gram: słowo środkowe → kontekst (lepszy dla rzadkich słów)
"""

import numpy as np
import json
import logging
from gensim.models import Word2Vec
from tokenizers import Tokenizer
import os
import glob
from corpora import CORPORA_FILES # type: ignore 

# Ustawienie szczegółowego logowania dla monitorowania procesu treningu
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

# --- KONFIGURACJA ŚCIEŻEK I PARAMETRÓW ---

# KROK 1: Wybór korpusu treningowego
# Dostępne opcje: "WOLNELEKTURY", "PAN_TADEUSZ", "NKJP", "ALL"
# Większy korpus = lepsze embeddingi, ale dłuższy trening
# files = CORPORA_FILES["WOLNELEKTURY"]  # ~35 plików, literatura polska
# files = CORPORA_FILES["PAN_TADEUSZ"]   # ~12 plików, tylko Pan Tadeusz
files = CORPORA_FILES["ALL"]             # ~3936 plików, wszystkie korpusy

# KROK 2: Wybór tokenizera
# Tokenizer dzieli tekst na podwyrazowe tokeny (np. "wojsko" → ["woj", "sko"])
# Wybór tokenizera ma OGROMNY wpływ na jakość embeddingu!
# Z Zadania 3 wiemy że:
# - tokenizer-nkjp: dobry dla ogólnego polskiego (14,100 tokenów dla Chopina)
# - tokenizer-pan-tadeusz: najlepszy dla literatury (9,985 tokenów)
# - bielik-v3: lepszy od v1/v2 (13,177 tokenów)
# - gpt2-polish: bardzo dobry uniwersalny (14,018 tokenów)
TOKENIZER_FILE = "../tokenizer/tokenizers/tokenizer-nkjp.json"
# TOKENIZER_FILE = "../tokenizer/tokenizers/gpt2-polish.json"
# TOKENIZER_FILE = "../tokenizer/tokenizers/tokenizer-pan-tadeusz.json"
# TOKENIZER_FILE = "../tokenizer/tokenizers/bielik-v1-tokenizer.json"
# TOKENIZER_FILE = "../tokenizer/tokenizers/bielik-v3-tokenizer.json"

# KROK 3: Pliki wyjściowe
OUTPUT_TENSOR_FILE = "embedding_tensor_cbow.npy"            # Macierz wektorów (numpy array)
OUTPUT_MAP_FILE = "embedding_token_to_index_map.json"        # Mapowanie token→indeks
OUTPUT_MODEL_FILE = "embedding_word2vec_cbow_model.model"    # Pełny model gensim

# KROK 4: Parametry treningu Word2Vec (CBOW)
# Te parametry KRYTYCZNIE wpływają na jakość i czas treningu!

VECTOR_LENGTH = 100   # Wymiar wektora embeddingowego (50-300 typowo)
                      # Większy = więcej informacji, ale wolniejszy trening
                      # Zalecane: 100-200 dla dobrych wyników

WINDOW_SIZE = 8      # Rozmiar okna kontekstowego (ile słów po każdej stronie)
                      # CBOW używa WINDOW_SIZE słów z lewej i prawej do przewidywania środkowego
                      # Np. dla WINDOW_SIZE=2: [w1, w2, TARGET, w4, w5]
                      # Większy = więcej kontekstu, ale wolniejszy
                      # Zalecane: 5-10

MIN_COUNT = 2         # Minimalna częstość występowania tokenu
                      # Tokeny występujące rzadziej niż MIN_COUNT są ignorowane
                      # Większy = mniej tokenów, szybszy trening, ale gorsza pokrycie
                      # Zalecane: 2-5

WORKERS = 4           # Liczba wątków do równoległego treningu
                      # Ustaw na liczbę rdzeni CPU (sprawdź: os.cpu_count())

EPOCHS = 25       # Liczba przejść przez cały korpus
                      # Więcej = lepsze wyniki, ale dłuższy trening
                      # Zalecane: 10-50
                      # UWAGA: Zbyt wiele epok może prowadzić do overfittingu!

SAMPLE_RATE = 1e-3    # Współczynnik downsamplingu dla częstych słów
                      # Redukuje wpływ bardzo częstych słów (np. "i", "w", "na")
                      # Typowo: 1e-3 do 1e-5
                      # 0 = wyłączone

SG_MODE = 0           # Tryb algorytmu: 0 = CBOW, 1 = Skip-gram
                      # CBOW: szybszy, lepszy dla częstych słów
                      # Skip-gram: wolniejszy, lepszy dla rzadkich słów

# KROK 5: Załadowanie tokenizera
# Tokenizer BPE (Byte Pair Encoding) został wytrenowany w Zadaniu 3
# Ładujemy go z pliku JSON
try:
    print(f"\n{'='*80}")
    print(f"KROK 1: Ładowanie tokenizera")
    print(f"{'='*80}")
    print(f"Plik tokenizera: {TOKENIZER_FILE}")
    tokenizer = Tokenizer.from_file(TOKENIZER_FILE)
    print(f"✓ Tokenizer załadowany pomyślnie")
    print(f"  Rozmiar słownika: {tokenizer.get_vocab_size()} tokenów")
    
    # Wykryj typ tokenizera (GPT-2 style vs standardowy)
    # GPT-2 używa 'Ġ' jako prefix dla spacji
    IS_GPT2_STYLE = 'Ġ' in tokenizer.get_vocab()
    if IS_GPT2_STYLE:
        print(f"  ⚠ Wykryto tokenizer GPT-2 style (używa prefiksu 'Ġ' dla spacji)")
        print(f"  → Zostanie zastosowana specjalna obsługa tokenów")
    
except FileNotFoundError:
    print(f"✗ BŁĄD: Nie znaleziono pliku '{TOKENIZER_FILE}'.")
    print(f"  Upewnij się, że plik istnieje i ścieżka jest poprawna.")
    print(f"  Uruchom najpierw Zadanie 3 aby stworzyć tokenizery!")
    raise

# KROK 6: Funkcja agregacji zdań z plików korpusu
def aggregate_raw_sentences(files):
    """
    Wczytuje i agreguje wszystkie zdania z plików korpusu.
    
    Proces:
    1. Iteruje przez każdy plik w liście
    2. Wczytuje plik linia po linii (każda linia = jedno zdanie)
    3. Usuwa puste linie i białe znaki
    4. Dodaje wszystkie zdania do jednej listy
    
    Args:
        files (list): Lista ścieżek do plików tekstowych
        
    Returns:
        list[str]: Lista wszystkich zdań ze wszystkich plików
        
    Uwagi:
        - Pliki muszą być w kodowaniu UTF-8
        - Każda linia w pliku traktowana jest jako osobne zdanie
        - Puste linie są pomijane
        - Jeśli plik nie istnieje, wyświetla ostrzeżenie i kontynuuje
    """
    raw_sentences = []
    print(f"\n{'='*80}")
    print(f"KROK 2: Wczytywanie korpusu tekstowego")
    print(f"{'='*80}")
    print(f"Liczba plików do wczytania: {len(files)}")
    
    files_loaded = 0
    files_skipped = 0
    
    for file in files:
        try:
            with open(file, 'r', encoding='utf-8') as f:
                # Wczytaj wszystkie niepuste linie
                lines = [line.strip() for line in f if line.strip()]
                raw_sentences.extend(lines)
                files_loaded += 1
                
                # Wyświetl progress co 500 plików
                if files_loaded % 500 == 0:
                    print(f"  Wczytano {files_loaded}/{len(files)} plików...")
                    
        except FileNotFoundError:
            print(f"⚠ OSTRZEŻENIE: Nie znaleziono pliku '{file}'. Pomijam.")
            files_skipped += 1
            continue
        except Exception as e:
            print(f"⚠ OSTRZEŻENIE: Błąd przy wczytywaniu '{file}': {e}")
            files_skipped += 1
            continue

    print(f"\n✓ Wczytano {files_loaded} plików")
    if files_skipped > 0:
        print(f"⚠ Pominięto {files_skipped} plików (błędy)")
    print(f"✓ Zebrano {len(raw_sentences):,} zdań")
    
    if not raw_sentences:
        print("✗ BŁĄD: Pliki wejściowe są puste lub nie zostały wczytane.")
        exit()
        
    return raw_sentences

raw_sentences = aggregate_raw_sentences(files)

# KROK 7: Tokenizacja korpusu
# Tokenizacja batch'owa - przetwarzamy wszystkie zdania naraz (wydajniej niż jedno po jednym)
print(f"\n{'='*80}")
print(f"KROK 3: Tokenizacja zdań")
print(f"{'='*80}")
print(f"Tokenizacja {len(raw_sentences):,} zdań...")
print(f"To może chwilę potrwać...")

# encode_batch() przetwarza wszystkie zdania równolegle - dużo szybsze!
encodings = tokenizer.encode_batch(raw_sentences)

# Konwersja obiektów Encoding na listę list stringów (tokenów)
# Każde zdanie staje się listą tokenów
# Przykład: "Litwo! Ojczyzno moja!" → ["Litwo", "!", "Ojczy", "zno", "moja", "!"]
tokenized_sentences = [
    encoding.tokens for encoding in encodings
]

print(f"✓ Przygotowano {len(tokenized_sentences):,} sekwencji tokenów")

# Statystyki tokenizacji
total_tokens = sum(len(sent) for sent in tokenized_sentences)
avg_tokens = total_tokens / len(tokenized_sentences) if tokenized_sentences else 0
print(f"✓ Łączna liczba tokenów: {total_tokens:,}")
print(f"✓ Średnia długość zdania: {avg_tokens:.1f} tokenów")

# Przykład tokenizacji (pierwsze 3 zdania)
print(f"\nPrzykład tokenizacji (pierwsze 3 zdania):")
for i, sent in enumerate(tokenized_sentences[:3], 1):
    print(f"  Zdanie {i} ({len(sent)} tokenów): {sent[:15]}{'...' if len(sent) > 15 else ''}")

# --- ETAP 2: Trening Word2Vec (CBOW) ---

print(f"\n{'='*80}")
print(f"KROK 4: Trening modelu Word2Vec (CBOW)")
print(f"{'='*80}")
print(f"Parametry treningu:")
print(f"  • Wymiar wektora (vector_size): {VECTOR_LENGTH}")
print(f"  • Rozmiar okna (window): {WINDOW_SIZE}")
print(f"  • Min. częstość (min_count): {MIN_COUNT}")
print(f"  • Liczba epok (epochs): {EPOCHS}")
print(f"  • Tryb: {'CBOW' if SG_MODE == 0 else 'Skip-gram'}")
print(f"  • Wątki (workers): {WORKERS}")
print(f"\nUruchamiam trening...")
print(f"{'='*80}\n")

"""
Jak działa CBOW (Continuous Bag-of-Words):

1. Dla każdego słowa w zdaniu:
   - Bierze WINDOW_SIZE słów z lewej strony
   - Bierze WINDOW_SIZE słów z prawej strony
   - Próbuje przewidzieć słowo środkowe na podstawie kontekstu

2. Przykład dla WINDOW_SIZE=2:
   Zdanie: "król siedział na tronie w zamku"
   Cel: przewidzieć "tronie"
   Input: ["król", "siedział", "na"] + ["w", "zamku"] → Output: "tronie"

3. Sieć neuronowa:
   Input Layer → Hidden Layer (embedding) → Output Layer
   
4. Wagi hidden layer to właśnie nasze embeddingi!
   Każdy token dostaje wektor o długości VECTOR_LENGTH

5. Trening przez EPOCHS epok:
   - Każda epoka = jedno przejście przez cały korpus
   - Wagi są stopniowo dostosowywane aby lepiej przewidywać słowa
   - Efekt: podobne semantycznie słowa mają podobne wektory
"""

model = Word2Vec(
    sentences=tokenized_sentences,  # Dane treningowe (lista list tokenów)
    vector_size=VECTOR_LENGTH,      # Wymiar wektora embeddingowego
    window=WINDOW_SIZE,             # Rozmiar okna kontekstowego
    min_count=MIN_COUNT,            # Minimalna częstość tokenu
    workers=WORKERS,                # Liczba wątków
    sg=SG_MODE,                     # 0: CBOW, 1: Skip-gram
    epochs=EPOCHS,                  # Liczba epok treningu
    sample=SAMPLE_RATE,             # Downsampling częstych słów
)

print(f"\n{'='*80}")
print(f"✓ Trening zakończony pomyślnie!")
print(f"{'='*80}")
print(f"Statystyki modelu:")
print(f"  • Liczba unikalnych tokenów w słowniku: {len(model.wv):,}")
print(f"  • Wymiar wektora: {model.wv.vector_size}")
print(f"  • Łączna liczba parametrów: {len(model.wv) * model.wv.vector_size:,}")

# --- ETAP 3: Eksport i Zapis Wyników ---

print(f"\n{'='*80}")
print(f"KROK 5: Eksport wytrenowanego modelu")
print(f"{'='*80}")

"""
Eksportujemy model w 3 formatach:

1. Tensor NumPy (.npy):
   - Macierz wektorów wszystkich tokenów
   - Format: [num_tokens, vector_size]
   - Użycie: szybkie ładowanie do NumPy/PyTorch/TensorFlow

2. Mapa token→indeks (.json):
   - Słownik mapujący tokeny na ich indeksy w tensorze
   - Format: {"token": index, ...}
   - Użycie: translacja tokenu na indeks w tensorze

3. Pełny model Gensim (.model):
   - Zawiera wszystko: wektory, słownik, metadane
   - Format: właściwy dla gensim
   - Użycie: kontynuacja treningu, operacje na wektorach
"""

# 1. EKSPORT TENSORA NUMPY
# Pobieramy macierz wszystkich wektorów z modelu
embedding_matrix_np = model.wv.vectors  # Shape: (vocab_size, vector_size)
embedding_matrix_tensor = np.array(embedding_matrix_np, dtype=np.float32)

print(f"\nTensor embeddingowy:")
print(f"  • Kształt: {embedding_matrix_tensor.shape} (Tokeny × Wymiar)")
print(f"  • Typ danych: {embedding_matrix_tensor.dtype}")
print(f"  • Rozmiar w pamięci: {embedding_matrix_tensor.nbytes / 1024 / 1024:.2f} MB")

np.save(OUTPUT_TENSOR_FILE, embedding_matrix_tensor)
print(f"  ✓ Zapisano jako: '{OUTPUT_TENSOR_FILE}'")

# 2. EKSPORT MAPOWANIA TOKEN→INDEKS
# Każdy token ma swój unikalny indeks w tensorze
# Przykład: {"Litwo": 0, "Ojczy": 1, "zno": 2, ...}
token_to_index = {token: model.wv.get_index(token) for token in model.wv.index_to_key}

print(f"\nMapa tokenów:")
print(f"  • Liczba tokenów: {len(token_to_index):,}")
print(f"  • Przykładowe tokeny: {list(token_to_index.keys())[:5]}")

with open(OUTPUT_MAP_FILE, "w", encoding="utf-8") as f:
    json.dump(token_to_index, f, ensure_ascii=False, indent=2)
print(f"  ✓ Zapisano jako: '{OUTPUT_MAP_FILE}'")

# 3. EKSPORT PEŁNEGO MODELU GENSIM
# Zawiera wszystko - można wczytać i kontynuować trening lub używać API gensim
model.save(OUTPUT_MODEL_FILE)
print(f"\nPełny model:")
print(f"  ✓ Zapisano jako: '{OUTPUT_MODEL_FILE}'")

print(f"\n{'='*80}")
print(f"✓ Wszystkie pliki zapisane pomyślnie!")
print(f"{'='*80}")

# --- ETAP 4: FUNKCJE POMOCNICZE DO TESTOWANIA EMBEDDINGU ---

def get_word_vector_and_similar(word: str, tokenizer: Tokenizer, model: Word2Vec, topn: int = 20, filter_noise: bool = True):
    """
    Oblicza wektor embeddingowy dla całego słowa i znajduje najbardziej podobne tokeny.
    
    Proces:
    1. Tokenizuje słowo na podwyrazowe tokeny (np. "wojsko" → ["woj", "sko"])
    2. Pobiera wektory dla każdego tokenu z modelu
    3. Uśrednia wektory tokenów → wektor słowa
    4. Znajduje najbardziej podobne tokeny używając podobieństwa kosinusowego
    5. [Opcjonalnie] Filtruje szumy (same spacje, uszkodzone znaki)
    
    Args:
        word (str): Słowo do analizy (np. "wojsko", "szlachta")
        tokenizer (Tokenizer): Tokenizer BPE do podziału słowa na tokeny
        model (Word2Vec): Wytrenowany model Word2Vec z embeddingami
        topn (int): Ile najbardziej podobnych tokenów zwrócić (domyślnie 20)
        filter_noise (bool): Czy filtrować "szumy" z wyników (domyślnie True)
                            Usuwa: same spacje (Ġ), uszkodzone Unicode, tokeny specjalne
        
    Returns:
        tuple: (word_vector, similar_tokens) gdzie:
            - word_vector: np.array - uśredniony wektor słowa (shape: [vector_size])
            - similar_tokens: list[(str, float)] - lista (token, similarity_score)
            
        lub (None, None) jeśli nie można obliczyć wektora
        
    Podobieństwo kosinusowe:
        similarity = (A · B) / (||A|| × ||B||)
        Zakres: [-1, 1] gdzie:
            1.0 = identyczne kierunki (bardzo podobne)
            0.0 = prostopadłe (niezwiązane)
           -1.0 = przeciwne kierunki (przeciwstawne)
           
    Przykład:
        >>> vector, similar = get_word_vector_and_similar("król", tokenizer, model, topn=5)
        >>> # vector: array([0.123, -0.456, 0.789, ...])
        >>> # similar: [("książę", 0.721), ("władca", 0.689), ...]
        
    Uwagi:
        - Słowo musi zawierać przynajmniej jeden token znany modelowi
        - Rzadkie słowa (< MIN_COUNT) mogą nie mieć wektorów
        - Dla lepszych wyników używaj słów z korpusu treningowego
    """
    # KROK 1: Tokenizacja słowa
    # Dodajemy spacje aby tokenizer widział słowo w kontekście (ważne dla tokenów ze spacją)
    encoding = tokenizer.encode(" " + word + " ") 
    word_tokens = [t.strip() for t in encoding.tokens if t.strip()]  # Usuń puste tokeny
    
    # KROK 2: Czyszczenie tokenów specjalnych
    # Usuwamy tokeny początku/końca sekwencji jeśli zostały dodane
    if word_tokens and word_tokens[0] in ['[CLS]', '<s>', 'Ġ']:
        word_tokens = word_tokens[1:]
    if word_tokens and word_tokens[-1] in ['[SEP]', '</s>']:
        word_tokens = word_tokens[:-1]

    valid_vectors = []
    missing_tokens = []
    
    # KROK 3: Zbieranie wektorów dla każdego tokenu
    for token in word_tokens:
        if token in model.wv:
            # Token znaleziony w modelu - pobierz jego wektor
            valid_vectors.append(model.wv[token])
        else:
            # Token zbyt rzadki (< MIN_COUNT) lub nieznany
            missing_tokens.append(token)

    # KROK 4: Sprawdzenie czy mamy jakiekolwiek wektory
    if not valid_vectors:
        if missing_tokens:
            print(f"✗ Słowo '{word}' → tokeny {word_tokens}")
            print(f"  Żaden token nie znajduje się w słowniku (MIN_COUNT={MIN_COUNT})")
        else:
            print(f"✗ Słowo '{word}' nie zostało przetokenizowane poprawnie")
        return None, None

    # KROK 5: Uśrednianie wektorów
    # Wektor całego słowa = średnia wektorów jego tokenów składowych
    # Przykład: "wojsko" = ["woj", "sko"] → średnia(vec("woj"), vec("sko"))
    word_vector = np.mean(valid_vectors, axis=0)

    # KROK 6: Znalezienie najbardziej podobnych tokenów
    # Używamy podobieństwa kosinusowego między word_vector a wszystkimi wektorami w modelu
    # Pobieramy więcej wyników jeśli będziemy filtrować
    fetch_count = topn * 3 if filter_noise else topn
    
    similar_words = model.wv.most_similar(
        positive=[word_vector],  # Szukamy tokenów podobnych do tego wektora
        topn=fetch_count         # Zwróć więcej aby móc filtrować
    )
    
    # KROK 7: Filtrowanie szumów (dla tokenizerów GPT-2 style)
    if filter_noise:
        filtered_results = []
        
        for token, similarity in similar_words:
            # Pomiń problematyczne tokeny
            skip = False
            
            # 1. Pomiń sam prefix spacji (token "Ġ" lub " ")
            if token in ['Ġ', ' ', '▁']:
                skip = True
            
            # 2. Pomiń tokeny zawierające uszkodzone znaki Unicode
            # GPT-2 byte-level BPE: ł→ÅĤ, ń→ÅĦ, ó→Ã³, etc.
            if any(char in token for char in ['Ã', 'Ä', 'Å', 'Ć', 'Ğ']):
                skip = True
            
            # 3. Pomiń tokeny specjalne
            if token in ['[UNK]', '[CLS]', '[SEP]', '[PAD]', '[MASK]', '<s>', '</s>', '<unk>']:
                skip = True
            
            # 4. Pomiń bardzo krótkie tokeny (często artefakty)
            if len(token.strip('Ġ▁')) <= 1:
                skip = True
            
            if not skip:
                filtered_results.append((token, similarity))
            
            # Przerwij gdy mamy wystarczająco wyników
            if len(filtered_results) >= topn:
                break
        
        similar_words = filtered_results
    
    return word_vector, similar_words

# --- ETAP 5: WERYFIKACJA I TESTOWANIE EMBEDDINGU ---

print(f"\n{'='*80}")
print(f"KROK 6: Weryfikacja jakości embeddingu")
print(f"{'='*80}")
print(f"Test: Szukanie semantycznie podobnych słów")
print(f"Metoda: Uśrednianie wektorów tokenów składowych")
print(f"{'='*80}\n")

"""
Jak testujemy jakość embeddingu?

1. Podobieństwo semantyczne:
   - Słowa o podobnym znaczeniu powinny mieć podobne wektory
   - Np. "król" ≈ "książę", "wojsko" ≈ "armia"

2. Analogie wektorowe:
   - król - mężczyzna + kobieta ≈ królowa
   - dziecko + kobieta ≈ dziewczyna/córka

3. Co oznacza dobry wynik?
   - Similarity > 0.7: Bardzo dobre podobieństwo
   - Similarity 0.5-0.7: Dobre podobieństwo
   - Similarity < 0.5: Słabe podobieństwo
   
4. Cele optymalizacji (z Zadania 4.1):
   - król-książę: jak najbliżej 1.0
   - kobieta-dziewczyna: jak najbliżej 1.0
   - Zwiększ EPOCHS, VECTOR_LENGTH, lub WINDOW_SIZE jeśli wyniki słabe

UWAGA DLA TOKENIZERA GPT2-POLISH:
   - GPT-2 używa byte-level BPE z prefiksem 'Ġ' dla spacji
   - "szlachta" tokenizuje się jako ['sz', 'lach', 'ta'] (BEZ spacji)
   - Ale w korpusie może być "Ġszlachta" (ZE spacją) - to INNY token!
   - Filtrowanie szumów usuwa: Ġ (samą spację), uszkodzone Unicode (ÅĤ, Ã³)
"""

# Testowe słowa - powinny mieć sensowne odpowiedniki semantyczne
words_to_test = ['wojsko', 'szlachta', 'choroba', 'król'] 

for word in words_to_test:
    word_vector, similar_tokens = get_word_vector_and_similar(word, tokenizer, model, topn=10)
    
    if word_vector is not None:
        # Pokaż jak słowo zostało stokenizowane
        tokens_used = tokenizer.encode(word).tokens
        
        print(f"{'─'*80}")
        print(f"🔍 Analiza słowa: '{word}'")
        print(f"{'─'*80}")
        print(f"Tokenizacja: {tokens_used}")
        print(f"Wektor (pierwsze 10 wymiarów): {word_vector[:10]}")
        print(f"\n🎯 Top 10 najbardziej podobnych tokenów:")
        
        for i, (token, similarity) in enumerate(similar_tokens, 1):
            # Dodaj emoji dla różnych poziomów podobieństwa
            if similarity > 0.7:
                emoji = "🔥"  # Bardzo podobne
            elif similarity > 0.6:
                emoji = "✨"  # Podobne
            elif similarity > 0.5:
                emoji = "✓"   # Dość podobne
            else:
                emoji = "○"   # Słabo podobne
                
            print(f"  {i:2d}. {emoji} {token:20s} → similarity: {similarity:.4f}")
        print()

# --- TEST ANALOGII WEKTOROWYCH ---

print(f"\n{'='*80}")
print(f"KROK 7: Test analogii wektorowych")
print(f"{'='*80}")
print(f"Wzór: token1 + token2 → znajdź najbardziej podobny wynik")
print(f"Interpretacja: Jaki token łączy cechy obu tokenów?")
print(f"{'='*80}\n")

"""
Analogie wektorowe - matematyka embeddingów:

Jeśli mamy dobrze wytrenowany embedding:
- vec("król") - vec("mężczyzna") + vec("kobieta") ≈ vec("królowa")
- vec("dziecko") + vec("kobieta") ≈ vec("dziewczyna")

W praktyce:
1. Dodajemy wektory dwóch słów
2. Szukamy tokenów najbliższych tej sumie
3. Jeśli wynik ma sens semantycznie = dobry embedding!
"""

# Para tokenów do analogii
tokens_analogy = ['dziecko', 'kobieta']

# Sprawdzamy czy oba tokeny istnieją w modelu
if tokens_analogy[0] in model.wv and tokens_analogy[1] in model.wv:
    print(f"🔍 Analogia: '{tokens_analogy[0]}' + '{tokens_analogy[1]}'")
    print(f"Pytanie: Jaki token łączy cechy obu słów?\n")
    
    similar_to_combined = model.wv.most_similar(
        positive=tokens_analogy,  # Suma wektorów tych tokenów
        topn=10                   # Top 10 wyników
    )

    print(f"🎯 Top 10 wyników:")
    for i, (token, similarity) in enumerate(similar_to_combined, 1):
        if similarity > 0.7:
            emoji = "🔥"
        elif similarity > 0.6:
            emoji = "✨"
        else:
            emoji = "○"
        print(f"  {i:2d}. {emoji} {token:20s} → similarity: {similarity:.4f}")
    
    # Sprawdź czy oczekiwane słowa są w wynikach
    expected_words = ['dziewczyna', 'córka', 'dziewczynka', 'matka']
    found = [word for word in expected_words if word in [t[0] for t in similar_to_combined]]
    
    if found:
        print(f"\n✓ Znalezione oczekiwane słowa: {found}")
    else:
        print(f"\n⚠ Brak oczekiwanych słów ({expected_words}) w top 10")
        print(f"  Wskazówka: Zwiększ EPOCHS lub VECTOR_LENGTH dla lepszych wyników")
else:
    print(f"⚠ OSTRZEŻENIE: Co najmniej jeden z tokenów {tokens_analogy} nie znajduje się w słowniku.")
    print(f"   Możliwe przyczyny:")
    print(f"   - Token występuje rzadziej niż MIN_COUNT={MIN_COUNT}")
    print(f"   - Token nie występuje w korpusie treningowym")
    print(f"   Pomijam test analogii.")

print(f"\n{'='*80}")
print(f"✓ ZADANIE 4.1 UKOŃCZONE")
print(f"{'='*80}")
print(f"\nPliki wyjściowe:")
print(f"  • {OUTPUT_TENSOR_FILE}")
print(f"  • {OUTPUT_MAP_FILE}")
print(f"  • {OUTPUT_MODEL_FILE}")
print(f"\nNastępny krok:")
print(f"  Eksperymentuj z parametrami (VECTOR_LENGTH, EPOCHS, WINDOW_SIZE)")
print(f"  aby poprawić jakość embeddingu!")
print(f"{'='*80}")