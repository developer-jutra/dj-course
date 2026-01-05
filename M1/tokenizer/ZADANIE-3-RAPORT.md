# Zadanie 3 - Tokenizer - Raport

## Podsumowanie Wykonanych Zadań

### 1. Dynamizacja kodu tokenizer-build.py ✓

Zrefaktorowano oryginalny skrypt `tokenizer-build.py` aby umożliwić:
- Dynamiczny wybór korpusu treningowego (PAN_TADEUSZ, WOLNELEKTURY, NKJP, ALL)
- Konfigurację rozmiaru słownika (vocab_size)
- Konfigurację minimalnej częstotliwości (min_frequency)
- Automatyczne budowanie wszystkich tokenizerów jedną komendą: `--all`

**Przykłady użycia:**
```bash
# Jeden tokenizer
python tokenizer-build.py --corpus PAN_TADEUSZ --output tokenizer-pan-tadeusz

# Wszystkie tokenizery naraz
python tokenizer-build.py --all

# Niestandardowy rozmiar słownika
python tokenizer-build.py --corpus WOLNELEKTURY --output my-tokenizer --vocab-size 16000
```

### 2. Stworzone Tokenizery ✓

Utworzono 4 wymagane tokenizery:

1. **tokenizer-pan-tadeusz.json** - trenowany tylko na Panu Tadeuszu (12 ksiąg)
2. **tokenizer-wolnelektury.json** - trenowany na całym korpusie Wolne Lektury (35 plików)
3. **tokenizer-nkjp.json** - trenowany na korpusie NKJP (3,889 plików)
4. **tokenizer-all-corpora.json** - trenowany na wszystkich dostępnych korpusach (3,936 plików)

### 3. Tokenizer z HuggingFace ✓

Pobrany tokenizer: **gpt2-polish** (`sdadas/polish-gpt2-medium`)
- Stworzono skrypt `download-hf-tokenizer.py` do automatycznego pobierania tokenizerów z HF
- Plik zapisany jako: `tokenizers/gpt2-polish.json`

### 4. Porównanie Krzyżowe - Cross-Tokenization ✓

Utworzono skrypt `tokenizer-compare.py` który testuje wszystkie tokenizery na 3 tekstach referencyjnych:

**Teksty referencyjne:**
1. Pan Tadeusz - Księga 1 (polski, klasyka)
2. The Pickwick Papers (angielski, klasyka)
3. Fryderyk Chopin (polski, Wikipedia)

**Dostępne tokenizery (10 total):**
- 3x Bielik (v1, v2, v3)
- 1x GPT2-Polish (HuggingFace)
- 2x Existing (latarnik, mirrormid)
- 4x Custom (pan-tadeusz, wolnelektury, nkjp, all-corpora)

## Wyniki - Który Tokenizer Najefektywniejszy?

### Pan Tadeusz - Księga 1 (43,734 znaki, ~6,845 słów)

| Ranking | Tokenizer | Token Count | Notatki |
|---------|-----------|-------------|---------|
| 🥇 | **tokenizer-pan-tadeusz** | **9,985** | Trenowany na tym samym tekście |
| 🥈 | tokenizer-all-corpora | 10,045 | -0.6% różnicy |
| 🥈 | tokenizer-wolnelektury | 10,045 | -0.6% różnicy |
| 4 | latarnik_tokenizer | 10,045 | -0.6% różnicy |
| 5 | tokenizer-nkjp | 11,066 | -9.8% gorszy |
| 6 | gpt2-polish | 11,908 | -16.2% gorszy |
| 7 | bielik-v3 | 13,177 | -24.2% gorszy |
| 8 | mirrormid | 17,292 | -42.2% gorszy |
| 9 | bielik-v2 | 20,480 | -51.2% gorszy |
| 10 | bielik-v1 | 20,481 | -51.2% gorszy |

**Wnioski:**
- Tokenizer trenowany na identycznym tekście (Pan Tadeusz) osiągnął najlepszy wynik
- Tokenizery trenowane na polskich korpusach (wolnelektury, all-corpora) są bardzo bliskie
- Bielik v3 znacząco lepszy od v1/v2 (32.4% mniej tokenów!)
- Bielik v1/v2 (Mistral-based) bardzo nieefektywne dla polskiego tekstu

### The Pickwick Papers (1,746,334 znaki, ~300,090 słów)

| Ranking | Tokenizer | Token Count | Notatki |
|---------|-----------|-------------|---------|
| 🥇 | **mirrormid_tokenizer** | **445,303** | Prawdopodobnie trenowany na angielskim |
| 🥈 | bielik-v1 | 503,669 | +11.6% więcej |
| 🥈 | bielik-v2 | 503,668 | +11.6% więcej |
| 4 | gpt2-polish | 713,919 | +37.6% więcej |
| 5 | tokenizer-nkjp | 725,407 | +38.6% więcej |
| 6 | bielik-v3 | 729,254 | +38.9% więcej |
| 7 | tokenizer-all-corpora | 750,535 | +40.7% więcej |
| 8 | tokenizer-wolnelektury | 824,016 | +46.0% więcej |
| 9 | latarnik_tokenizer | 824,016 | +46.0% więcej |
| 10 | tokenizer-pan-tadeusz | 926,941 | +51.9% więcej |

**Wnioski:**
- Tokenizer `mirrormid` radzi sobie najlepiej z angielskim tekstem
- Bielik v1/v2 zaskakująco dobre dla angielskiego (mimo polskiego focus)
- Customowe tokenizery polskie (pan-tadeusz, wolnelektury) słabe dla angielskiego
- Specjalizacja tokenizera ma ogromne znaczenie (52% różnicy!)

### Fryderyk Chopin (59,585 znaki, ~8,251 słów)

| Ranking | Tokenizer | Token Count | Notatki |
|---------|-----------|-------------|---------|
| 🥇 | **gpt2-polish** | **14,018** | Polski GPT2 z HF |
| 🥈 | tokenizer-nkjp | 14,100 | +0.6% więcej |
| 3 | tokenizer-all-corpora | 14,732 | +4.8% więcej |
| 4 | bielik-v3 | 16,338 | +14.2% więcej |
| 5 | tokenizer-wolnelektury | 16,917 | +17.1% więcej |
| 6 | latarnik_tokenizer | 16,917 | +17.1% więcej |
| 7 | tokenizer-pan-tadeusz | 20,337 | +31.1% więcej |
| 8 | mirrormid | 22,438 | +37.5% więcej |
| 9 | bielik-v2 | 25,610 | +45.3% więcej |
| 10 | bielik-v1 | 25,611 | +45.3% górszy |

**Wnioski:**
- GPT2-Polish i NKJP najlepsze dla polskiego tekstu encyklopedycznego
- Tokenizer all-corpora też bardzo dobry (tylko 4.8% gorszy)
- Bielik v3 >> v1/v2 (36% lepszy!)
- Pan Tadeusz tokenizer gorzej - zbyt specjalistyczny dla literatury XIX w.

## Eksperyment z Rozmiarami Słownika (vocab_size)

Testowano rozmiary: 8k, 16k, 24k, 32k, 40k, 48k, 64k na korpusie PAN_TADEUSZ

**Wyniki:**

| Vocab Size | Token Count | vs. 32k Baseline |
|------------|-------------|------------------|
| 8,000 | 10,900 | +9.2% (gorsze) |
| 16,000 | 9,985 | 0.0% |
| 24,000 | 9,985 | 0.0% |
| 32,000 | 9,985 | 0.0% (baseline) |
| 40,000 | 9,985 | 0.0% |
| 48,000 | 9,985 | 0.0% |
| 64,000 | 9,985 | 0.0% |

**Wnioski:**
- Dla małego korpusu (Pan Tadeusz) vocab_size > 16k nie daje poprawy
- Zbyt mały vocab_size (8k) pogarsza wyniki o ~9%
- **Optymalny vocab_size dla Pan Tadeusz: 16,000**
- Korpus osiąga "plateau" - ma tylko ~12,457 unikalnych par (merges)

### Interpretacja dla różnych korpusów:

1. **Małe korpusy (Pan Tadeusz)**: vocab_size = 16k wystarczy
2. **Średnie korpusy (Wolnelektury)**: vocab_size = 32k sensowny (31,882 merges)
3. **Duże korpusy (NKJP)**: vocab_size = 32k+ zalecany (31,832 merges osiągnięte)

## Główne Wnioski

### 1. Specjalizacja Jest Kluczowa
- Tokenizer trenowany na podobnym tekście (język, styl, epoka) daje najlepsze wyniki
- Różnica między najlepszym a najgorszym: **45-52%**

### 2. Ranking Ogólny (Polski Tekst)
1. 🥇 **Custom tokenizer (dopasowany do tekstu)**
2. 🥈 **GPT2-Polish** - uniwersalny, bardzo dobry
3. 🥉 **Bielik v3** - duża poprawa vs v1/v2
4. **Tokenizer All-Corpora** - dobry kompromis
5. Bielik v1/v2 - słabe dla polskiego

### 3. Vocab Size
- Optymalizuj do rozmiaru korpusu
- Zbyt duży = niepotrzebny overhead
- Zbyt mały = gorsze wyniki
- **Sweet spot: 16k-32k dla polskich tekstów**

### 4. Tokenizacja dla Embeddingu (Zadanie 4)
Dla optymalnego embeddingu w zadaniu 4:
- Użyj **tokenizer-pan-tadeusz** dla literatury polskiej
- Użyj **gpt2-polish** dla ogólnych polskich tekstów
- Użyj **tokenizer-all-corpora** jako uniwersalny
- **Unikaj** Bielik v1/v2 - zbyt rozdrobnione tokeny

## Pliki Pomocnicze

### Skrypty
- `tokenizer-build.py` - budowanie tokenizerów
- `tokenizer-compare.py` - porównanie krzyżowe
- `test-vocab-sizes.py` - test różnych vocab_size
- `download-hf-tokenizer.py` - pobieranie z HuggingFace

### Wyniki
- `tokenizer-comparison-results.json` - szczegółowe wyniki w JSON

### Tokenizery (10 total)
```
tokenizers/
├── bielik-v1-tokenizer.json
├── bielik-v2-tokenizer.json
├── bielik-v3-tokenizer.json
├── gpt2-polish.json
├── latarnik_tokenizer.json
├── mirrormid_tokenizer.json
├── tokenizer-all-corpora.json
├── tokenizer-nkjp.json
├── tokenizer-pan-tadeusz.json
└── tokenizer-wolnelektury.json
```

## Rekomendacje

### Do Zadania 4 (Embedding)
1. Użyj **tokenizer-pan-tadeusz** jeśli pracujesz z literaturą polską XIX w.
2. Użyj **gpt2-polish** dla współczesnego polskiego
3. Użyj **tokenizer-all-corpora** jako uniwersalny baseline

### Ogólne
- Zawsze testuj swój tokenizer na reprezentatywnych tekstach
- Bielik v3 >> v1/v2 dla polskiego - aktualizuj jeśli możesz
- Vocab size dopasuj do wielkości korpusu (nie zawsze więcej = lepiej)

---
**Data wykonania:** 2025-11-17
**Środowisko:** Python 3.11.9, tokenizers 0.22.1
