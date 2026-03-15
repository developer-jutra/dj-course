---
name: Fix Contract Test Failures
overview: Analiza 6 błędów wykrytych przez testy Schemathesis i wskazanie opcji naprawy dla każdego z nich.
todos:
  - id: fix-json-error-handler
    content: Dodać globalny JSON SyntaxError error-handler w src/index.ts (naprawi błędy 1 i 6)
    status: pending
  - id: fix-delete-customer-fk
    content: Obsłużyć FK constraint error w DELETE /customers/{id} – zwracać 409 zamiast 500, dodać 409 do kontraktu
    status: pending
  - id: fix-vehicles-maxlength
    content: Dodać walidację maxLength(50) dla pól make i model w POST i PUT /vehicles (naprawi błędy 3 i 4)
    status: pending
  - id: fix-drivers-array-body
    content: Dodać Array.isArray(body) check w POST /drivers (naprawi błąd 5)
    status: pending
isProject: false
---

# Analiza błędów testów kontraktowych Schemathesis

6 testów nie przeszło. Poniżej szczegółowa analiza każdego błędu i opcje naprawy.

---

## Błąd 1: `PATCH /customers/{id}` — Undocumented Content-Type

**Co się dzieje:** Schemathesis wysyła body `""` (pusty string JSON). Express `body-parser` nie może sparsować tego jako obiekt i wyrzuca błąd, który Express domyślnie obsługuje jako HTML 400 (`text/html; charset=utf-8`). Kontrakt deklaruje tylko `application/json` dla odpowiedzi 400.

**Przyczyna:** Błąd parsowania body przez Express przed wejściem w handler routy – Express sam zwraca HTML zanim kod routy zdąży cokolwiek zrobić.

**Opcje naprawy:**

- **Opcja A (po stronie API):** Dodać globalny error-handler w `src/index.ts` wyłapujący `SyntaxError` z body-parsera i zwracający `application/json` z `{ error: "Invalid JSON" }` zamiast domyślnego HTML. To poprawna i czysta napraw.
- **Opcja B (po stronie kontraktu):** Dodać do odpowiedzi 400 w `customers-openapi.yaml` drugi content-type `text/html` dla PATCH. To jednak błędne semantycznie – kontrakt powinien opisywać intencję API, nie defekt.

**Rekomendacja: Opcja A** – dodanie globalnego JSON error-handler w `index.ts`.

---

## Błąd 2: `DELETE /customers/{id}` — Server error 500

**Co się dzieje:** Schemathesis wysyła `DELETE /customers/1`. Baza zwraca błąd FK: `violates foreign key constraint "transportation_orders_customer_id_fkey"` – klient id=1 ma przypisane zlecenia transportowe.

**Przyczyna:** API nie obsługuje przypadku naruszenia ograniczenia FK – trafia prosto do bloku `catch` i zwraca 500.

**Opcje naprawy:**

- **Opcja A (po stronie API):** W `customers.routes.ts` w bloku `catch` sprawdzać, czy błąd to naruszenie FK (`error.code === '23503'` dla node-postgres) i zwracać `409 Conflict` z komunikatem `"Cannot delete customer with existing orders"`. Dodatkowo dodać 409 do kontraktu w `customers-openapi.yaml`.
- **Opcja B (po stronie API):** Przed usunięciem klienta sprawdzić, czy ma zlecenia (query), i zwrócić 409 jeśli tak. Bardziej explicite, ale kosztuje dodatkowe zapytanie.
- **Opcja C (po stronie danych testowych):** W `schemathesis` użyć innego przykładowego ID dla DELETE (klient bez zleceń). Jednak to tylko ukryłoby problem.

**Rekomendacja: Opcja A** – obsługa błędu FK w catch + dodanie 409 do kontraktu.

---

## Błąd 3: `POST /vehicles` — Server error 500

**Co się dzieje:** Schemathesis wysyła `model` o długości 51 znaków (`"000...0"` × 51). Drizzle ORM rzuca błąd bazy danych – kolumna `model` ma `maxLength: 50` w schemacie OpenAPI, ale baza ma `VARCHAR(50)` i odrzuca za długą wartość.

**Przyczyna:** Brak walidacji długości pola `model` przed zapytaniem do bazy w `vehicles.routes.ts`. Widać w logach: `Failed query: ... params: Toyota,000...000(51 chars),2024,55,1`.

**Opcje naprawy:**

- **Opcja A (po stronie API):** Dodać w `POST /vehicles` handler walidację `model.length <= 50` (i analogicznie `make.length <= 50`) i zwracać 400 jeśli przekroczone.
- **Opcja B (po stronie API):** Użyć biblioteki walidacyjnej (np. Zod) do walidacji całego body, analogicznie jak robi to `queryParams.getVehicles` dla query params.
- **Opcja C:** Przechwytywać błędy DB `22001` (string too long) w catch i zwracać 400 zamiast 500. To defensywna warstwa, ale nie zastąpi walidacji wejścia.

**Rekomendacja: Opcja A lub B** – walidacja długości pól w handlerze przed wykonaniem zapytania.

---

## Błąd 4: `PUT /vehicles/{id}` — Server error 500

**Identyczna przyczyna co Błąd 3.** Schemathesis wysyła `model` = 51 znaków dla PUT, Drizzle rzuca błąd DB.

**Opcje naprawy:** Identyczne jak wyżej – walidacja `model.length <= 50` i `make.length <= 50` w handlerze `PUT /vehicles/{id}`.

---

## Błąd 5: `POST /drivers` — API accepted schema-violating request

**Co się dzieje:** Schemathesis wysyła body `[null, null]` (tablica zamiast obiektu). Handler w `drivers.routes.ts` sprawdza `!body || typeof body !== 'object'`, ale `Array.isArray([null, null])` jest `true` i `typeof [] === 'object'` również – więc walidacja przepuszcza tablicę. Driver zostaje utworzony z samymi polami `null` (ID 24 w logach). Schemathesis oczekuje odrzucenia z 4xx.

**Przyczyna:** Warunek `typeof body !== 'object'` nie wyłapuje tablic – w JavaScript tablice są obiektami.

**Opcje naprawy:**

- **Opcja A (po stronie API):** Zmienić warunek na `!body || typeof body !== 'object' || Array.isArray(body)` w handlerze POST /drivers. Prosta, jednoliniowa poprawka.
- **Opcja B:** Użyć Zod do walidacji całego body (tak jak `queryParams` dla query string). Wyklucza tablice automatycznie przez `z.object({...})`.

**Rekomendacja: Opcja A** – minimalna, precyzyjna poprawka.

---

## Błąd 6: `PUT /transportation-orders/{id}/driver` — Undocumented Content-Type

**Identyczna przyczyna co Błąd 1.** Schemathesis wysyła `""` jako body, body-parser nie może sparsować, Express zwraca HTML 400 zamiast JSON.

**Opcje naprawy:** Identyczne jak Błąd 1 – globalny JSON error-handler w `index.ts`.

---

## Podsumowanie opcji


| Błąd | Endpoint                                 | Typ                       | Opcja naprawy                            |
| ---- | ---------------------------------------- | ------------------------- | ---------------------------------------- |
| 1    | `PATCH /customers/{id}`                  | Undocumented Content-Type | Globalny JSON error-handler w `index.ts` |
| 2    | `DELETE /customers/{id}`                 | 500 zamiast 409           | Obsługa FK constraint error w catch      |
| 3    | `POST /vehicles`                         | 500 zamiast 400           | Walidacja `maxLength` pól w handlerze    |
| 4    | `PUT /vehicles/{id}`                     | 500 zamiast 400           | Walidacja `maxLength` pól w handlerze    |
| 5    | `POST /drivers`                          | Brak odrzucenia tablicy   | `Array.isArray(body)` check w walidacji  |
| 6    | `PUT /transportation-orders/{id}/driver` | Undocumented Content-Type | Ten sam globalny JSON error-handler      |


Błędy 1 i 6 naprawia jedna zmiana (globalny handler). Błędy 3 i 4 naprawia walidacja w obu handlerach vehicles. Błędy 2 i 5 wymagają osobnych zmian.