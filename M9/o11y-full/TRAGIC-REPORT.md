### Podsumowanie kluczowych wniosków

* **Krytyczna niestabilność pod obciążeniem:** System uległ całkowitemu załamaniu (976 błędów `ETIMEDOUT` na 1132 utworzonych użytkowników).
* **Drastyczny wzrost opóźnień:** Średni czas odpowiedzi 2xx wyniósł aż 2,9s, a p95 przekroczyło 9,2s, co jest niedopuszczalne dla aplikacji webowej.
* **Błędy logiczne/brak danych:** Wysoka liczba kodów 404 (156) sugeruje problemy z dostępnością zasobów (np. `/products/1`) podczas testu.
* **Zjawisko "nasycenia" (Saturation):** Już w pierwszej fazie (Ramp up) system przestał radzić sobie z kolejką żądań, co doprowadziło do kaskadowych timeoutów w kolejnych krokach.

---

### Szczegółowa analiza raportu

#### 1. Niewydolność i błędy sieciowe

Największym problemem jest liczba błędów **ETIMEDOUT (976)**.

* **Analiza:** Prawie 86% wirtualnych użytkowników (`vusers.failed`) nie ukończyło scenariusza z powodu przekroczenia czasu oczekiwania na połączenie/odpowiedź.
* **Źródło:** System nie był w stanie przetworzyć `arrivalRate: 50` w fazie Ramp Up. Kolejka żądań urosła tak bardzo, że serwer przestał odpowiadać w zadanym limicie czasu (standardowo w Artillery to 10s, co potwierdza `max response_time` bliski 9.9s).

#### 2. Wydajność odpowiedzi (Response Times)

Rozbieżność między medianą a p95/p99 wskazuje na ogromną degradację wydajności:

* **Median (232.8ms):** Połowa żądań (głównie te na początku i błędy 404) była relatywnie szybka.
* **p95 (8.8s) i p99 (9.8s):** Dla niemal każdego użytkownika, który nie dostał timeoutu natychmiast, doświadczenie było tragiczne.
* **Porównanie 2xx vs 4xx:** Średni czas dla sukcesów (2.9s) jest znacznie wyższy niż dla błędów 4xx (102ms). Oznacza to, że logika biznesowa (np. pobieranie listy produktów lub zapis do bazy przy POST) jest wąskim gardłem, podczas gdy błędy 404 są zwracane szybko.

#### 3. Błędy 404 (Not Found)

Zarejestrowano 156 odpowiedzi 404.

* **Kontekst:** W scenariuszu masz na sztywno wpisany URL `/products/1`.
* **Wniosek:** Jeśli baza danych jest czyszczona przed testem lub produkt o ID 1 nie istnieje, każdy użytkownik generuje błąd. W testach obciążeniowych należy sparametryzować ID produktów, aby uniknąć testowania wyłącznie obsługi błędów 404.

#### 4. Anomalie w konfiguracji testu

W konfiguracji fazy pierwszej masz:

* `arrivalRate: 50`
* `rampTo: 10`
* **Błąd logiczny:** Zazwyczaj ramp-up polega na zwiększaniu obciążenia (np. od 10 do 50). Tutaj uderzasz w system bardzo mocno na starcie (50 nowych użytkowników na sekundę), a potem zmniejszasz intensywność. To spowodowało natychmiastowe zatkanie serwera (tzw. *shock loading*).

#### 5. Przepustowość (Throughput)

* **Downloaded bytes:** Pobrano ponad 631 MB danych. Przy tak małej liczbie udanych żądań (470) sugeruje to, że endpoint `/products` zwraca bardzo duże payloady (prawdopodobnie brak paginacji), co dodatkowo obciąża I/O serwera i sieć.

---

### Rekomendacje

1. **Naprawa faz obciążenia:** Odwróć wartości w pierwszej fazie (`arrivalRate: 10`, `rampTo: 50`), aby dać systemowi czas na rozgrzanie i skalowanie.
2. **Optymalizacja `/products`:** Sprawdź, czy endpoint nie zwraca zbyt wielu danych na raz. Rozważ dodanie paginacji.
3. **Dynamiczne dane:** Zamiast `/products/1`, pobierz listę produktów i wybierz losowe ID do kolejnego kroku, aby test był bardziej realistyczny.
4. **Monitoring zasobów:** Podczas kolejnego testu monitoruj zużycie CPU i RAM serwera oraz bazy danych – przy takiej liczbie timeoutów prawdopodobnie procesor osiągnął 100% lub wystąpił deadlocking na bazie przy POST-ach.
