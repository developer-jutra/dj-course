# SBERT - Sentence Embeddings (Zadanie 4.3)

## 📋 Przegląd

Implementacja zadania 4.3 - wykorzystanie pretrenowanego modelu Sentence-BERT do generowania embeddingów zdań i wyszukiwania semantycznego.

**Rozdzielenie na dwa etapy:**
1. **Kodowanie bazy danych** (`sbert-encode-database.py`) - jednorazowe
2. **Odpytywanie bazy** (`sbert-query-database.py`) - wielokrotne

## 🚀 Szybki start

### Krok 1: Zakoduj bazę danych (raz)

```bash
# Domyślnie - korpus ALL
python sbert-encode-database.py

# Lub wybierz konkretny korpus
python sbert-encode-database.py --corpus WOLNELEKTURY
python sbert-encode-database.py --corpus PAN_TADEUSZ
```

**Czas wykonania:**
- WOLNELEKTURY: ~2-5 minut
- ALL: ~5-15 minut (zależnie od CPU/GPU)

**Pliki wyjściowe:**
- `sbert_sentence_embeddings.npy` - macierz embeddingów
- `sbert_sentence_map.json` - mapowanie ID → zdanie
- `sbert_database_stats.json` - statystyki

### Krok 2: Odpytuj bazę (wielokrotnie)

```bash
# Wszystkie testy (wymyślone + z korpusu)
python sbert-query-database.py

# Tylko test wymyślonych zdań
python sbert-query-database.py --test-invented

# Tylko test zdań z korpusu
python sbert-query-database.py --test-corpus

# Pojedyncze zapytanie
python sbert-query-database.py --query "Król wydał rozkaz swoim rycerzom"

# Tryb interaktywny
python sbert-query-database.py --interactive
```

## 🔧 Opcje zaawansowane

### Kodowanie bazy danych

```bash
# Użyj innego modelu (polski!)
python sbert-encode-database.py --model sdadas/mmlw-retrieval-roberta-base

# Większy batch size (jeśli masz GPU)
python sbert-encode-database.py --batch-size 64

# Wymuś ponowne kodowanie
python sbert-encode-database.py --force

# Pomoc
python sbert-encode-database.py --help
```

### Odpytywanie bazy

```bash
# Więcej wyników
python sbert-query-database.py --query "Twoje zdanie" --top-k 10

# Wszystkie testy naraz
python sbert-query-database.py --all-tests

# Tryb interaktywny (najwygodniejszy!)
python sbert-query-database.py -i
```

## 📊 Przykładowe wyniki

### Test 1: Zdania wymyślone (spoza korpusu)

```
🔍 Zapytanie: "Jestem bardzo głodny i chciałbym coś zjeść."
Top 5 najbardziej podobnych zdań:

  1. ✨ Podobieństwo: 0.8234
     ID: 45621
     Zdanie: – ja też nie jem

  2. ✓ Podobieństwo: 0.7892
     ID: 12456
     Zdanie: — Nie bój się waćpanna, nie zjem cię!

  3. ✓ Podobieństwo: 0.7654
     ID: 78234
     Zdanie: Po chwili otworzył je. Rzędzian siedział ciągle pod oknem.
```

### Test 2: Zdania z korpusu (powinny mieć similarity ≈ 1.0)

```
🔍 Zapytanie (z korpusu, ID=1234):
   "Król siedział na tronie i wydawał rozkazy."
Top 5 wyników:

  1. 🎯 Podobieństwo: 1.0000 ← TO SAMO ZDANIE
     ID: 1234
     Zdanie: Król siedział na tronie i wydawał rozkazy.

  2. ○ Podobieństwo: 0.8567
     ID: 5678
     Zdanie: Monarcha zasiadł na swym miejscu.
```

## 🔍 Modele dla języka polskiego

### Domyślny (wielojęzyczny)
```python
MODEL_NAME = 'intfloat/multilingual-e5-small'
# Rozmiar: 118M parametrów
# Języki: 100+ (w tym polski)
# Jakość dla polskiego: dobra
```

### Zalecane alternatywy

1. **sdadas/mmlw-retrieval-roberta-base** ⭐ NAJLEPSZY dla polskiego
   ```bash
   python sbert-encode-database.py --model sdadas/mmlw-retrieval-roberta-base
   ```
   - Trenowany specjalnie na polskim
   - Najlepsza jakość dla polskich tekstów
   - Rozmiar: ~500MB

2. **sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2**
   ```bash
   python sbert-encode-database.py --model sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2
   ```
   - Wielojęzyczny, mniejszy rozmiar
   - Dobry kompromis jakość/szybkość

## 📁 Struktura plików

```
M1/embedding/
├── sbert-encode-database.py      # Etap 1: Kodowanie
├── sbert-query-database.py       # Etap 2: Odpytywanie
├── run-sbert.py                  # Oryginalny skrypt (wszystko razem)
├── sbert_sentence_embeddings.npy # Baza embeddingów (generowana)
├── sbert_sentence_map.json       # Mapa ID → zdanie (generowana)
└── sbert_database_stats.json     # Statystyki (generowana)
```

## 🎯 Wykonanie zadania 4.3

### Wymagania zadania:
- [x] ✅ Znaleźć alternatywę dla modelu lepiej dostosowanego do polskiego
  - Rekomendacja: `sdadas/mmlw-retrieval-roberta-base`
- [x] ✅ Rozdzielić skrypt (kodowanie osobno, odpytywanie osobno)
  - `sbert-encode-database.py` + `sbert-query-database.py`
- [x] ✅ Odpytać o zdania wymyślone
  - `--test-invented` - 8 różnych testowych zapytań
- [x] ✅ Odpytać o zdania z korpusu treningowego
  - `--test-corpus` - losowe zdania z korpusu, similarity ≈ 1.0

### Testowanie różnych modeli:

```bash
# 1. Model domyślny (wielojęzyczny)
python sbert-encode-database.py
python sbert-query-database.py --all-tests > wyniki_multilingual.txt

# 2. Model polski (NAJLEPSZY!)
python sbert-encode-database.py --model sdadas/mmlw-retrieval-roberta-base --force
python sbert-query-database.py --all-tests > wyniki_polski.txt

# 3. Porównaj wyniki
diff wyniki_multilingual.txt wyniki_polski.txt
```

## 💡 Wskazówki

### Przyspieszenie kodowania
- Użyj GPU jeśli dostępne (automatycznie wykrywane przez sentence-transformers)
- Zwiększ `--batch-size` (domyślnie 32)
- Dla testów użyj mniejszego korpusu: `--corpus PAN_TADEUSZ`

### Tryb interaktywny - najlepszy do eksperymentów!
```bash
python sbert-query-database.py --interactive
```
Pozwala wpisywać zapytania w czasie rzeczywistym:
```
🔍 Zapytanie: wojsko i wojna
🔍 Zapytanie: miłość i szczęście
🔍 Zapytanie: random  # losowe zdanie z korpusu
🔍 Zapytanie: q       # wyjście
```

### Debugowanie
- Sprawdź czy baza istnieje: `ls sbert_*.{npy,json}`
- Zobacz statystyki: `cat sbert_database_stats.json`
- Wymuś ponowne kodowanie: `--force`

## 📈 Metryki jakości

### Similarity score
- **0.9 - 1.0** 🔥 - Bardzo podobne (prawie identyczne)
- **0.8 - 0.9** ✨ - Podobne semantycznie
- **0.7 - 0.8** ✓ - Powiązane tematycznie
- **< 0.7** ○ - Słabo powiązane

### Dla zdań z korpusu
- **Oczekiwane**: similarity ≈ 1.0 dla tego samego zdania
- **Jeśli < 0.95**: Problem z normalizacją lub modelem

## 🐛 Troubleshooting

### Błąd: "Brak pliku sbert_sentence_embeddings.npy"
```bash
# Najpierw zakoduj bazę!
python sbert-encode-database.py
```

### Błąd: "Model not found"
```bash
# Model zostanie automatycznie pobrany z HuggingFace
# Wymaga połączenia z internetem przy pierwszym użyciu
```

### Wolne kodowanie
```bash
# Użyj mniejszego korpusu do testów
python sbert-encode-database.py --corpus PAN_TADEUSZ

# Lub większego batch size (jeśli masz RAM/GPU)
python sbert-encode-database.py --batch-size 64
```

## 🔗 Linki

- [Sentence-Transformers Documentation](https://www.sbert.net/)
- [Polski model (sdadas)](https://huggingface.co/sdadas/mmlw-retrieval-roberta-base)
- [Multilingual E5](https://huggingface.co/intfloat/multilingual-e5-small)

---

**Status zadania 4.3**: ✅ UKOŃCZONE
