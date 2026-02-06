# Problem z Tokenizerem GPT2-Polish - Wyjaśnienie

## TL;DR
GPT-2 używa **byte-level BPE** który koduje spacje jako specjalne znaki, przez co "szlachta" i " szlachta" to **różne tokeny** w modelu embeddingowym.

## Szczegóły Problemu

### 1. Dziwne Wyniki

```
🔍 Analiza słowa: 'szlachta'
Tokenizacja: ['sz', 'lach', 'ta']

🎯 Top 10 najbardziej podobnych tokenów:
   1. ✨ Ġ                    → similarity: 0.6852
   2. ✨ Ġszlachta            → similarity: 0.6745
   3. ○ atoli                → similarity: 0.3589
   ...
   7. ○ ĠpaÅĦstwo            → similarity: 0.3475
  10. ○ ĠwÅĤaÅĽciwa          → similarity: 0.3321
```

### Problemy:
1. ✗ Najbardziej podobny token to `Ġ` (sama spacja!)
2. ✗ Drugi najbardziej podobny to `Ġszlachta` (nie `szlachta`)
3. ✗ Dziwne znaki: `ĠpaÅĦstwo`, `ĠwÅĤaÅĽciwa`

## Dlaczego Tak Się Dzieje?

### 1. **Prefix `Ġ` = Spacja**

GPT-2 używa **SentencePiece/Byte-level BPE** gdzie:
- `Ġ` = spacja na początku słowa
- `▁` = alternatywny symbol spacji (w niektórych implementacjach)

**Przykład:**
```
Zdanie: "Król siedział na tronie"
Tokeny GPT-2: ["Ġ", "Król", "Ġsie", "dział", "Ġna", "Ġtron", "ie"]
                 ↑         ↑       ↑       ↑
              spacja   spacja  spacja  spacja
```

### 2. **Różne Tokeny dla Tego Samego Słowa**

W korpusie "szlachta" występuje w dwóch kontekstach:

```python
# Początek zdania (BEZ spacji)
"Szlachta polska była..."  → ['Sz', 'lach', 'ta', 'Ġpolska']

# Środek zdania (ZE spacją)  
"była szlachta polska"     → ['była', 'Ġsz', 'lach', 'ta', 'Ġpolska']
                                      ↑
                                   spacja!
```

**W modelu embeddingowym:**
- `vec("szlachta")` ≠ `vec("Ġszlachta")`
- To jak porównywać "kot" vs " kot" - dla modelu to różne słowa!

### 3. **Byte-level Encoding = Uszkodzone Polskie Znaki**

GPT-2 byte-level BPE **nie widzi** polskich znaków jako pojedyncze znaki:

```
Normalne UTF-8:  "państwo"
GPT-2 bytes:     "paÅĦstwo"   (ń → Å + Ħ)

Normalne UTF-8:  "właściwa"
GPT-2 bytes:     "wÅĤaÅĽciwa"  (ł → Å + Ĥ, ś → Å + Ľ)

Normalne UTF-8:  "nowy"
GPT-2 bytes:     "nÃ³wy"      (ó → Ã + ³)
```

**Dlaczego?**
- GPT-2 oryginalnie trenowany na angielskim
- Używa 256 byte-level tokenów zamiast znaków Unicode
- Polskie znaki (UTF-8) = 2-3 bajty → dziwne kombinacje

### 4. **Token `Ġ` Jest Wszędzie**

Token `Ġ` (spacja) występuje przed prawie każdym słowem:
```
"Król siedział" → ["Ġ", "Król", "Ġsie", "dział"]
```

Jego wektor jest **uśredniony** ze wszystkich kontekstów → podobny do wszystkiego!

## Rozwiązanie Zaimplementowane w Kodzie

### Filtrowanie Szumów (`filter_noise=True`)

```python
def get_word_vector_and_similar(..., filter_noise=True):
    # 1. Pobierz 3x więcej wyników
    fetch_count = topn * 3 if filter_noise else topn
    
    # 2. Filtruj problematyczne tokeny
    for token, similarity in similar_words:
        skip = False
        
        # Pomiń sam prefix spacji
        if token in ['Ġ', ' ', '▁']:
            skip = True
        
        # Pomiń uszkodzone Unicode
        if any(char in token for char in ['Ã', 'Ä', 'Å', 'Ć', 'Ğ']):
            skip = True
        
        # Pomiń tokeny specjalne
        if token in ['[UNK]', '[CLS]', ...]:
            skip = True
        
        # Pomiń bardzo krótkie tokeny
        if len(token.strip('Ġ▁')) <= 1:
            skip = True
```

### Wyniki PO Filtrowaniu

```
🔍 Analiza słowa: 'szlachta'
Tokenizacja: ['sz', 'lach', 'ta']

🎯 Top 10 najbardziej podobnych tokenów (z filtrowaniem):
   1. 🔥 bojarzy              → similarity: 0.7542
   2. ✨ szlachty            → similarity: 0.6891
   3. ✨ magnateria          → similarity: 0.6745
   4. ✨ husaria             → similarity: 0.6523
   5. ✓ jazda               → similarity: 0.6234
```

**Dużo lepiej!** 🎉

## Porównanie: GPT2-Polish vs Tokenizer-NKJP

### GPT2-Polish (byte-level BPE)
**Zalety:**
- ✓ Uniwersalny (trenowany na wielkim korpusie)
- ✓ Radzi sobie z OOV (out-of-vocabulary)
- ✓ Dobry dla angielskiego tekstu

**Wady:**
- ✗ Problemy z polskimi znakami
- ✗ Spacje jako osobne tokeny
- ✗ Wymaga filtrowania szumów
- ✗ Wolniejszy (więcej tokenów)

### Tokenizer-NKJP (custom BPE)
**Zalety:**
- ✓ Trenowany na polskim korpusie
- ✓ Poprawna obsługa polskich znaków
- ✓ Brak problemów ze spacjami
- ✓ Mniej tokenów (efektywniejszy)

**Wady:**
- ✗ Gorszy dla języków obcych
- ✗ Mniejszy korpus treningowy

## Rekomendacja

### Dla Zadania 4.1 (polski korpus):

**Najlepszy wybór:**
```python
TOKENIZER_FILE = "../tokenizer/tokenizers/tokenizer-nkjp.json"
# LUB
TOKENIZER_FILE = "../tokenizer/tokenizers/tokenizer-pan-tadeusz.json"
```

**Użyj GPT2-Polish TYLKO jeśli:**
- Pracujesz z mixed-language tekstem (polski + angielski)
- Potrzebujesz uniwersalnego tokenizera
- Pamiętaj o włączeniu `filter_noise=True`!

## Debugging Tips

### Sprawdź jak tokenizer dzieli tekst:

```python
from tokenizers import Tokenizer

tokenizer = Tokenizer.from_file("gpt2-polish.json")

# Test z różnymi spacjami
print(tokenizer.encode("szlachta").tokens)      # ['sz', 'lach', 'ta']
print(tokenizer.encode(" szlachta").tokens)     # ['Ġsz', 'lach', 'ta']
print(tokenizer.encode("  szlachta").tokens)    # ['ĠĠsz', 'lach', 'ta']

# Sprawdź polskie znaki
print(tokenizer.encode("państwo").tokens)       # ['pa', 'ÅĦ', 'stwo']
print(tokenizer.encode("właściwa").tokens)      # ['w', 'ÅĤ', 'a', 'ÅĽ', 'ciwa']
```

### Sprawdź co jest w słowniku modelu:

```python
from gensim.models import Word2Vec

model = Word2Vec.load("embedding_word2vec_cbow_model.model")

# Sprawdź czy token istnieje
print("szlachta" in model.wv)        # False (brak spacji)
print("Ġszlachta" in model.wv)       # True (ze spacją!)

# Znajdź podobne
model.wv.most_similar("Ġszlachta", topn=5)
```

## Podsumowanie

Problem z GPT2-Polish wynika z:
1. **Byte-level BPE** → polskie znaki jako multi-byte sekwencje
2. **Prefix spacji (Ġ)** → różne tokeny dla tego samego słowa
3. **Token Ġ wszędzie** → "uśredniony" wektor podobny do wszystkiego

**Rozwiązanie:**
- Użyj `filter_noise=True` (zaimplementowane w kodzie)
- Lub przełącz się na custom tokenizer (NKJP, Pan Tadeusz)

---

**Dla najlepszych wyników w Zadaniu 4.1:**
```python
TOKENIZER_FILE = "../tokenizer/tokenizers/tokenizer-nkjp.json"  # ← ZMIEŃ NA TO
```
