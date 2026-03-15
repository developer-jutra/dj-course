# Optimistic Locking – kolumna `version` na tabeli `customers`

## Cel

Wyeliminowanie warunku wyścigu przy równoczesnych żądaniach `PATCH /customers/:id` poprzez blokowanie optymistyczne (Optimistic Concurrency Control). Klient odczytuje aktualną wartość `version`, przesyła ją z żądaniem modyfikacji, a baza akceptuje UPDATE tylko jeśli `version` nadal zgadza się z tym, co jest w bazie. Konflikt → HTTP 409.

---

## Krok 1 – Schema SQL

### `tms-data-generator/schema/create-tms-schema.sql`

Dodać kolumnę `version` do tabeli `customers`:

```sql
CREATE TABLE customers (
    id            INT PRIMARY KEY,
    first_name    VARCHAR(50),
    last_name     VARCHAR(50),
    email         VARCHAR(100),
    phone         VARCHAR(20),
    customer_type VARCHAR(20),
    address       VARCHAR(255),
    version       INT NOT NULL DEFAULT 1   -- <-- nowa kolumna
);
```

`DEFAULT 1` – każdy nowy rekord startuje z wersją 1. Przy każdej udanej modyfikacji wartość jest inkrementowana przez UPDATE.

---

## Krok 2 – Generator danych (Go)

### 2a. `generator/customers/model.go`

Dodać pole `Version int` do struktury `Customer`.

### 2b. `generator/customers/customers.go`

Dodać kolumnę `version` do bulk INSERT:

```sql
INSERT INTO customers (id, first_name, last_name, email, phone, customer_type, address, version)
VALUES
  (1, 'Jan', 'Kowalski', ..., 1),
  ...
```

Wszystkie generowane rekordy dostają `version = 1` (stała wartość inicjalna).

### 2c. Uruchomienie generatora

```bash
# z katalogu tms-data-generator
task run
```

Weryfikacja: `output/tms-latest.sql` powinien zawierać `version` w INSERT INTO customers.

---

## Krok 3 – Warstwa aplikacyjna (`tms-api`)

### 3a. `src/customers/customers.queries.ts` – `updateCustomerName`

**Typ parametrów** – `version` staje się wymaganym polem:

```typescript
type UpdateCustomerNameParams = {
  id: string;
  version: number;           // wymagane – numer wersji przesłany przez klienta
  first_name?: string;
  last_name?: string;
};
```

**Typ wyniku** – discriminated union zamiast prostego `| null`:

```typescript
type UpdateCustomerNameResult =
  | { status: 'ok';
      data: { id: number; first_name: string | null; last_name: string | null; version: number } }
  | { status: 'not_found' }
  | { status: 'version_conflict' };
```

**Logika UPDATE** – dwa zmiany w klauzulach SQL:
1. SET: dodać `version = version + 1` (inkrementacja przy każdym udanym zapisie)
2. WHERE: dodać `AND version = $X` (guard optymistyczny)
3. RETURNING: dodać `version` (zwracamy nową wartość klientowi)

Przykładowe zapytanie (placeholder indeksy zależą od dynamicznie budowanych `setClauses`):

```sql
UPDATE customers
SET first_name = $1, last_name = $2, version = version + 1
WHERE id = $3 AND version = $4
RETURNING id, first_name, last_name, version
```

**Obsługa braku wiersza** – jeśli UPDATE zwróci 0 wierszy (`rows.length === 0`), nie wiemy czy to 404 czy 409. Rozwiązanie: wykonać dodatkowe SELECT po id:

```typescript
if (!rows[0]) {
  const check = await pool.query('SELECT id FROM customers WHERE id = $1', [params.id]);
  if (check.rows.length === 0) return { status: 'not_found' };
  return { status: 'version_conflict' };
}
return { status: 'ok', data: rows[0] };
```

### 3b. `src/customers/customers.routes.ts` – handler `PATCH /:id`

**Typ body** – `version` staje się wymaganym polem:

```typescript
type PatchCustomerHttpBody = {
  version: number;           // wymagane
  first_name?: string;
  last_name?: string;
};
```

**Walidacja** – przed wywołaniem queries:
- `version` musi być obecny i być dodatnią liczbą całkowitą

**Mapowanie wyniku** na odpowiedź HTTP:

| Wynik z queries         | HTTP status | Body                                                   |
|-------------------------|-------------|--------------------------------------------------------|
| `status: 'ok'`          | 200         | `{ id, first_name, last_name, version }`               |
| `status: 'not_found'`   | 404         | `{ error: 'Customer not found' }`                      |
| `status: 'version_conflict'` | 409    | `{ error: 'Version conflict – resource was modified by another request. Fetch the latest version and retry.' }` |

### 3c. `tms-api/.http`

Zaktualizować wszystkie żądania PATCH customers, dodając pole `version`:

```http
### Update customer first name
PATCH {{customersUrl}}/{{customerId}}
Content-Type: application/json

{
  "version": 1,
  "first_name": "Jan"
}
```

Dodać nowy scenariusz testowy dla konfliktu wersji (409):

```http
### Patch with stale version – should return 409
PATCH {{customersUrl}}/{{customerId}}
Content-Type: application/json

{
  "version": 0,
  "first_name": "Konflikt"
}
```

---

## Kolejność wykonania

| # | Krok | Plik(i) |
|---|------|---------|
| 1 | Dodać kolumnę `version` do schematu SQL | `schema/create-tms-schema.sql` |
| 2 | Dodać pole `Version` do modelu Go | `generator/customers/model.go` |
| 3 | Dodać `version` do INSERT | `generator/customers/customers.go` |
| 4 | Uruchomić generator | `task run` (w katalogu `tms-data-generator`) |
| 5 | Zaktualizować typy i logikę UPDATE | `src/customers/customers.queries.ts` |
| 6 | Zaktualizować walidację i mapowanie HTTP | `src/customers/customers.routes.ts` |
| 7 | Zaktualizować plik HTTP | `tms-api/.http` |
| 8 | Przebudować Docker i przetestować end-to-end | `docker compose build --no-cache tms-api && docker compose up -d` |

---

## Otwarte kwestie / decyzje

1. **`version` w GET /customers/:id** – czy odpowiedź GET powinna zwracać `version`, żeby klient mógł go odczytać przed wysłaniem PATCH? Rekomendacja: tak – bez tego klient nie zna aktualnej wersji i musiałby ją zgadywać.

2. **`version` w GET /customers (lista)** – czy lista powinna zawierać `version`? Raczej nie – klient i tak pobierze szczegóły przed edycją.
