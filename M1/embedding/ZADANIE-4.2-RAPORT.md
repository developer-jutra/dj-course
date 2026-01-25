# Zadanie 4.2 - Raport z testów Doc2Vec

## 📋 Przegląd testów

### Zakres testowania
- **Korpusy**: 2 (WOLNELEKTURY, ALL)
- **Parametry zmienne**: VECTOR_LENGTH, WINDOW_SIZE, EPOCHS
- **Całkowita liczba testów**: 48 (24 × 2 korpusy)

### Testowane parametry

| Parametr | Wartości testowane | Liczba wariantów |
|----------|-------------------|------------------|
| VECTOR_LENGTH | 20, 50, 100 | 3 |
| WINDOW_SIZE | 5, 10 | 2 |
| EPOCHS | 10, 20, 40, 80 | 4 |
| **Kombinacji na korpus** | - | **24** |

### Parametry stałe
- **MIN_COUNT**: 4
- **WORKERS**: 4
- **SG_MODE**: 0 (PV-DM - Distributed Memory)
- **dm**: 1

---

## 🏆 Wyniki testów

### Ranking globalny (Top 10)

> _Ta sekcja zostanie wypełniona po wykonaniu testów_

```
# Uruchom testy:
python test-doc2vec-params.py

# Wyniki automatycznie zapisane w:
# - doc2vec_training_registry.json
# - Podsumowanie wyświetlone na końcu testów
```

---

## 📊 Analiza wpływu parametrów

### 1. VECTOR_LENGTH (Wymiar wektora embeddingu)

**Hipoteza**: Większe wektory = lepsza reprezentacja semantyczna, ale dłuższy trening

| VECTOR_LENGTH | Oczekiwany wpływ |
|---------------|------------------|
| 20 | Szybki trening, podstawowa jakość |
| 50 | Balans jakość/czas |
| 100 | Najlepsza jakość, najdłuższy trening |

**Wyniki**: _Do wypełnienia po testach_

---

### 2. WINDOW_SIZE (Rozmiar okna kontekstowego)

**Hipoteza**: Większe okno = lepsze uchwycenie długodystansowych relacji

| WINDOW_SIZE | Oczekiwany wpływ |
|-------------|------------------|
| 5 | Kontekst lokalny, szybki trening |
| 10 | Szerszy kontekst, lepsza semantyka |

**Wyniki**: _Do wypełnienia po testach_

---

### 3. EPOCHS (Liczba epok treningu)

**Hipoteza**: Więcej epok = lepsze embeddingi, ale większy koszt czasowy

| EPOCHS | Oczekiwany wpływ |
|--------|------------------|
| 10 | Szybki baseline |
| 20 | Standardowy trening |
| 40 | Lepsze embeddingi |
| 80 | Maksymalna jakość (ryzyko overfittingu) |

**Wyniki**: _Do wypełnienia po testach_

---

### 4. CORPUS SIZE (Rozmiar korpusu)

**Porównanie korpusów**:

| Korpus | Przybliżony rozmiar | Oczekiwany wpływ |
|--------|---------------------|------------------|
| WOLNELEKTURY | ~35 plików, tysiące zdań | Dobra jakość, szybki trening |
| ALL | ~50+ plików, dziesiątki tysięcy zdań | Najlepsza jakość, długi trening |

**Wyniki**: _Do wypełnienia po testach_

---

## 🎯 Kluczowe wnioski

> _Ta sekcja zostanie wypełniona automatycznie po uruchomieniu testów_

### Najlepsze parametry
- **Korpus**: ?
- **VECTOR_LENGTH**: ?
- **WINDOW_SIZE**: ?
- **EPOCHS**: ?
- **Jakość**: ?
- **Czas treningu**: ?

### Wpływ na jakość embeddingu
1. **VECTOR_LENGTH**: ?
2. **WINDOW_SIZE**: ?
3. **EPOCHS**: ?
4. **Rozmiar korpusu**: ?

### Trade-off jakość vs. czas
- **Najszybsza konfiguracja**: ?
- **Najlepsza konfiguracja**: ?
- **Rekomendacja**: ?

---

## 📁 Pliki wyjściowe

Po uruchomieniu testów wygenerowane zostaną:

1. **doc2vec_training_registry.json**
   - Pełny rejestr wszystkich 48 treningów
   - Parametry, metryki, czasy dla każdego testu

2. **doc2vec_model_test.model**
   - Model z ostatniego testu
   - Format: gensim Doc2Vec

3. **doc2vec_model_sentence_map_test.json**
   - Mapa ID → oryginalne zdania
   - Format: JSON array

---

## 🔍 Jak przeglądać wyniki

### 1. Przeglądanie rejestru
```bash
# Wszystkie treningi
python view-training-registry.py

# Ranking jakości
python view-training-registry.py --best

# Analiza parametrów
python view-training-registry.py --compare
```

### 2. Bezpośrednia analiza JSON
```bash
# Windows PowerShell
Get-Content doc2vec_training_registry.json | ConvertFrom-Json | Format-List

# Wyciągnij tylko jakość
(Get-Content doc2vec_training_registry.json | ConvertFrom-Json).quality_metrics.avg_top1_similarity
```

---

## 📈 Metodyka oceny jakości

### Metryka: `avg_top1_similarity`

Dla każdego testowego zapytania:
1. Tokenizacja zdania
2. Wygenerowanie wektora (inference)
3. Znalezienie najbardziej podobnego zdania z korpusu
4. Zmierzenie podobieństwa cosinusowego

**Finalna metryka**: Średnie podobieństwo top-1 wyniku ze wszystkich zapytań

### Testowe zapytania
```python
test_queries = [
    "Jestem głodny i bardzo chętnie zjadłbym coś.",
    "Król siedział na tronie.",
    "Szlachta polska była dumna ze swoich tradycji.",
    "Wojsko maszerowało przez las.",
    "Miłość jest najważniejsza w życiu."
]
```

### Kategorie jakości
- **excellent**: > 0.8
- **good**: 0.6 - 0.8
- **fair**: 0.4 - 0.6
- **poor**: < 0.4

---

## ⏱️ Szacowany czas wykonania

### Korpus WOLNELEKTURY (24 testy)
- **EPOCHS=10**: ~0.5-1 min/test
- **EPOCHS=20**: ~1-2 min/test
- **EPOCHS=40**: ~2-4 min/test
- **EPOCHS=80**: ~4-8 min/test
- **Razem**: ~30-60 minut

### Korpus ALL (24 testy)
- **EPOCHS=10**: ~1-2 min/test
- **EPOCHS=20**: ~2-4 min/test
- **EPOCHS=40**: ~4-8 min/test
- **EPOCHS=80**: ~8-16 min/test
- **Razem**: ~60-120 minut

### **Całkowity czas**: 90-180 minut (1.5-3 godziny)

---

## 🚀 Uruchomienie testów

```bash
# Przejdź do katalogu
cd C:\djc\dj-course\M1\embedding

# Uruchom testy (uwaga: długi proces!)
python test-doc2vec-params.py

# Wyniki zapisywane na bieżąco do rejestru
# W razie przerwania: wyniki już wykonanych testów są zachowane
```

---

## 📝 Dodatkowe notatki

### Tokenizer
- **Użyty**: `bielik-v3-tokenizer.json`
- **Uzasadnienie**: Najlepsze wyniki w testach zadania 3

### Uwagi techniczne
- Wszystkie testy używają PV-DM (Distributed Memory)
- Workers=4 dla równoległego przetwarzania
- MIN_COUNT=4 aby filtrować rzadkie tokeny

---

## ✅ Status zadania

- [x] Implementacja systemu rejestru treningów
- [x] Funkcja oceny jakości embeddingu
- [x] Skrypt testowy 48 kombinacji
- [x] Skrypt przeglądania wyników
- [ ] Uruchomienie testów _(oczekuje na wykonanie)_
- [ ] Analiza wyników _(po testach)_
- [ ] Wnioski końcowe _(po testach)_

---

**Data utworzenia**: 2025-11-21  
**Autor**: Zadanie 4.2 - Doc2Vec Paragraph Embeddings  
**Pliki**: `run-doc2vec.py`, `test-doc2vec-params.py`, `view-training-registry.py`
