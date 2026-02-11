# Dopasowanie Scenariuszy Taurus do Artillery

## Podsumowanie Zmian

Wszystkie scenariusze testowe Taurus zostały przepisane, aby dokładnie odzwierciedlały zachowanie Artillery z uwzględnieniem kluczowej różnicy w modelu obciążenia.

## Kluczowa Różnica: Arrival Rate vs Concurrency

### Artillery (przed zmianami w Taurus)
- Używa modelu **Arrival Rate** (przepustowość)
- `arrivalRate: 30` = 30 **nowych użytkowników na sekundę**
- `rampTo: 200` = zwiększ do 200 **nowych użytkowników na sekundę**
- `maxVusers: 5000` = maksymalnie 5000 **równoczesnych połączeń**

### Taurus (po zmianach)
- Teraz używa kombinacji `throughput` + `concurrency`
- `throughput: 30` = 30 **nowych użytkowników na sekundę** (odpowiednik `arrivalRate`)
- `ramp-up: 15s` + zmiana `throughput` = zwiększenie do 200 użytkowników/s (odpowiednik `rampTo`)
- `concurrency: 5000` = maksymalnie 5000 **równoczesnych połączeń** (odpowiednik `maxVusers`)

## Szczegółowe Mapowanie Scenariuszy

### 1. product-error-test.yml

**Artillery:**
- Phase 1: `arrivalRate: 1 → rampTo: 3`, duration: 10s, maxVusers: 50
- Phase 2: `arrivalRate: 2`, duration: 30s, maxVusers: 50
- Phase 3: `arrivalRate: 1 → rampTo: 0`, duration: 10s, maxVusers: 50

**Taurus (teraz):**
- Phase 1: `throughput: 1`, ramp-up: 10s, concurrency: 50
- Phase 2: `throughput: 2`, hold-for: 30s, concurrency: 50
- Phase 3: `throughput: 1`, hold-for: 10s, concurrency: 50

### 2. product-load-test.yml

**Artillery:**
- Phase 1: `arrivalRate: 30 → rampTo: 200`, duration: 15s, maxVusers: 5000
- Phase 2: `arrivalRate: 200`, duration: 30s, maxVusers: 5000
- Phase 3: `arrivalRate: 200 → rampTo: 10`, duration: 15s, maxVusers: 5000

**Taurus (teraz):**
- Phase 1: `throughput: 30`, ramp-up: 15s, concurrency: 5000
- Phase 2: `throughput: 200`, hold-for: 30s, concurrency: 5000
- Phase 3: `throughput: 200`, ramp-up: 15s (ramping down to 10), concurrency: 5000

**Dodatkowa zmiana:** Zmienne `productId` (1, 2, 3, 4, 1000) teraz zgodne z Artillery.

### 3. product-massive-test.yml

**NOWY PLIK** - wcześniej nie istniał w Taurus!

**Artillery:**
- Phase 1: `arrivalRate: 500 → rampTo: 100`, duration: 15s, maxVusers: 25000
- Phase 2: `arrivalRate: 500`, duration: 30s, maxVusers: 25000
- Phase 3: `arrivalRate: 50 → rampTo: 0`, duration: 15s, maxVusers: 25000

**Taurus (nowy):**
- Phase 1: `throughput: 500`, ramp-up: 15s, concurrency: 25000
- Phase 2: `throughput: 500`, hold-for: 30s, concurrency: 25000
- Phase 3: `throughput: 50`, ramp-up: 15s (ramping down to 0), concurrency: 25000

**Dodano task w Taskfile.yml:** `task test-massive`

### 4. product-minimal-test.yml

**Artillery:**
- Single phase: `arrivalRate: 5 → rampTo: 20`, duration: 60s, maxVusers: 100

**Taurus (teraz):**
- Single phase: `throughput: 5`, ramp-up: 60s (to 20), concurrency: 100

### 5. product-slow-test.yml

**Artillery:**
11 faz z różnymi wartościami `arrivalRate` i `rampTo`, wszystkie z maxVusers: 5000

**Taurus (teraz):**
Wszystkie 11 faz przepisane z:
- Odpowiednimi wartościami `throughput` (zamiast `arrivalRate`)
- Odpowiednimi wartościami `concurrency: 5000` (zamiast sztywnych wartości jak 2, 12, 6, 22, 16)
- Odpowiednimi wartościami `ramp-up` dla faz z `rampTo`
- Odpowiednimi wartościami `hold-for` dla faz bez `rampTo`

## Różnice w Zachowaniu

### Poprzednie Taurus (błędne)
```yaml
concurrency: 50  # 50 równoczesnych użytkowników
ramp-up: 15s     # Zwiększ do 50 w ciągu 15s
```
- Generowało **maksymalnie 50 równoczesnych połączeń**
- Nie kontrolowało **tempa przybywania nowych użytkowników**
- Przy wolnym API nie mogło przekroczyć 50 połączeń

### Obecne Taurus (poprawne)
```yaml
concurrency: 5000  # Maksymalnie 5000 równoczesnych połączeń (limit)
throughput: 200    # 200 nowych użytkowników na sekundę
ramp-up: 15s       # Zwiększ throughput do docelowej wartości
```
- Kontroluje **tempo przybywania** (200 nowych żądań/s)
- Pozwala na **akumulację** do 5000 równoczesnych połączeń
- Przy wolnym API liczba równoczesnych połączeń rośnie naturalnie

## Przykład Matematyczny

**Scenariusz:** API odpowiada w 2 sekundy, Artillery/Taurus wysyła 200 nowych użytkowników/s.

### Artillery (Arrival Rate)
- Co sekundę: 200 nowych użytkowników zaczyna żądania
- Każde żądanie trwa 2s
- Po 2 sekundach: **~400 równoczesnych połączeń** (200 z każdej sekundy)

### Taurus - Stare (Concurrency)
- `concurrency: 50` ogranicza do 50 połączeń
- **Nie może wygenerować 200 żądań/s** jeśli każde trwa 2s
- Rzeczywista przepustowość: ~25 żądań/s (50 połączeń / 2s)

### Taurus - Nowe (Throughput + Concurrency)
- `throughput: 200` = 200 nowych żądań/s
- `concurrency: 5000` = limit 5000 równoczesnych połączeń
- Po 2 sekundach: **~400 równoczesnych połączeń** (identycznie jak Artillery!)

## Weryfikacja

Aby sprawdzić, czy scenariusze działają poprawnie:

```bash
# Uruchom test minimalny (niskie obciążenie)
cd M9/load-testing-taurus
task test-minimal

# Sprawdź w raportach:
# - Throughput (żądań/s) powinien odpowiadać wartościom z Artillery
# - Number of concurrent users powinien rosnąć naturalnie przy wolnym API
```

## Dostępne Testy

Wszystkie testy dostępne w Taskfile.yml:

```bash
task test-minimal   # Minimalny test (5→20 users/s)
task test-load      # Standardowy test (30→200 users/s)
task test-massive   # Masywny test (500 users/s) - NOWY!
task test-errors    # Test błędów (1→3 users/s)
task test-slow      # 10-minutowy test z falami (2→22 users/s)
```

## Uwagi Techniczne

1. **Taurus nie obsługuje `weight`** - Artillery używa wag dla scenariuszy (weight: 3, weight: 2), Taurus wykonuje wszystkie requesty sekwencyjnie.
2. **Fazy jako osobne execution blocks** - Każda faza Artillery to osobny blok execution w Taurus.
3. **Zmienne** - Poprawiono zmienne `productId` aby dokładnie odpowiadały tym z Artillery.
4. **Think time** - Wartości `think-time` w Taurus odpowiadają `think` w Artillery.

## Źródła

- Dokumentacja problemu: `help.md`
- Teoria kolejkowania: Arrival Rate ≠ Concurrency
- Taurus documentation: https://gettaurus.org/docs/ExecutionSettings/
- Artillery documentation: https://www.artillery.io/docs/reference/engines/http
