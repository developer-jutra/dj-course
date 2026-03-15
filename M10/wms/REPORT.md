Oto dostosowany schemat bazy danych oraz zestaw 20 zapytań SQL podzielonych według stopnia trudności.

Schemat pozostawiłem w większości zgodny z oryginałem, ponieważ **zawiera on tylko podstawowe indeksy na kluczach obcych (FK)**. Jest to idealny punkt wyjścia ("baza nieoptymalna"), ponieważ brakuje w niej indeksów kompozytowych, indeksów na polach filtrujących (np. daty, statusy) oraz indeksów wspierających JSONB.

### Schemat Bazy Danych (DDL)

```sql
**-- Clean up previous tables
DROP TABLE IF EXISTS cargo_event_history CASCADE;
DROP TABLE IF EXISTS cargo_event_type CASCADE;
DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS storage_record CASCADE;
DROP TABLE IF EXISTS storage_reservation CASCADE;
DROP TABLE IF EXISTS storage_request CASCADE;
DROP TABLE IF EXISTS employee_warehouse CASCADE;
DROP TABLE IF EXISTS party_role CASCADE;
DROP TABLE IF EXISTS role CASCADE;
DROP TABLE IF EXISTS address CASCADE;
DROP TABLE IF EXISTS party_relationship CASCADE;
DROP TABLE IF EXISTS party_contact CASCADE;
DROP TABLE IF EXISTS party CASCADE;
DROP TABLE IF EXISTS capacity CASCADE;
DROP TABLE IF EXISTS shelf CASCADE;
DROP TABLE IF EXISTS rack CASCADE;
DROP TABLE IF EXISTS aisle CASCADE;
DROP TABLE IF EXISTS zone CASCADE;
DROP TABLE IF EXISTS warehouse CASCADE;
DROP TABLE IF EXISTS location CASCADE;

-- 1. LOCATIONS
CREATE TABLE location (
    location_id SERIAL PRIMARY KEY,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL
);

-- 2. WAREHOUSES
CREATE TABLE warehouse (
    warehouse_id SERIAL PRIMARY KEY,
    location_id INTEGER NOT NULL REFERENCES location(location_id),
    name TEXT NOT NULL,
    description TEXT NOT NULL
);
-- Basic FK index only
CREATE INDEX idx_warehouse_location_id ON warehouse(location_id);

-- 3. ZONES
CREATE TABLE zone (
    zone_id SERIAL PRIMARY KEY,
    warehouse_id INTEGER NOT NULL REFERENCES warehouse(warehouse_id),
    name TEXT NOT NULL,
    description TEXT NOT NULL
);
CREATE INDEX idx_zone_warehouse_id ON zone(warehouse_id);

-- 4. AISLES
CREATE TABLE aisle (
    aisle_id SERIAL PRIMARY KEY,
    zone_id INTEGER NOT NULL REFERENCES zone(zone_id),
    label TEXT NOT NULL,
    width INTEGER NOT NULL,
    width_unit TEXT NOT NULL
);
CREATE INDEX idx_aisle_zone_id ON aisle(zone_id);

-- 5. RACKS
CREATE TABLE rack (
    rack_id SERIAL PRIMARY KEY,
    aisle_id INTEGER NOT NULL REFERENCES aisle(aisle_id),
    label TEXT NOT NULL,
    max_height INTEGER NOT NULL,
    height_unit TEXT NOT NULL
);
CREATE INDEX idx_rack_aisle_id ON rack(aisle_id);

-- 6. SHELVES
CREATE TABLE shelf (
    shelf_id SERIAL PRIMARY KEY,
    rack_id INTEGER NOT NULL REFERENCES rack(rack_id),
    level TEXT NOT NULL,
    max_weight NUMERIC NOT NULL,
    max_volume NUMERIC NOT NULL
);
CREATE INDEX idx_shelf_rack_id ON shelf(rack_id);

-- 7. CAPACITY
CREATE TABLE capacity (
    capacity_id SERIAL PRIMARY KEY,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('WAREHOUSE','ZONE','RACK','SHELF')),
    entity_id INTEGER NOT NULL,
    value NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    description TEXT
);
-- Composite index exists, but likely insufficient for complex aggregations without covering columns
CREATE INDEX idx_capacity_entity ON capacity(entity_type, entity_id);

-- 8. PARTY
CREATE TABLE party (
    party_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    contact_email TEXT, -- Important: No index here implies full scan on search
    contact_phone TEXT,
    data JSONB, -- Important: No GIN index here
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. PARTY CONTACTS
CREATE TABLE party_contact (
    contact_id SERIAL PRIMARY KEY,
    party_id INTEGER NOT NULL REFERENCES party(party_id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    details TEXT NOT NULL
);
CREATE INDEX idx_party_contact_party_id ON party_contact(party_id);

-- 10. PARTY RELATIONSHIP
CREATE TABLE party_relationship (
    relationship_id SERIAL PRIMARY KEY,
    party_id_primary INTEGER NOT NULL REFERENCES party(party_id) ON DELETE CASCADE,
    party_id_secondary INTEGER NOT NULL REFERENCES party(party_id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL,
    valid_from TIMESTAMP,
    valid_to TIMESTAMP,
    notes TEXT
);
CREATE INDEX idx_party_relationship_primary ON party_relationship(party_id_primary);
CREATE INDEX idx_party_relationship_secondary ON party_relationship(party_id_secondary);

-- 11. ADDRESS
CREATE TABLE address (
    address_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    party_id INTEGER NOT NULL REFERENCES party(party_id) ON DELETE CASCADE,
    street_address TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    address_type TEXT NOT NULL CHECK (address_type IN ('BILLING','SHIPPING','CORPORATE','PERSONAL','OTHER'))
);
CREATE INDEX idx_address_party_id ON address(party_id);

-- 12. ROLES
CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name IN ('DIRECTOR','WAREHOUSE_MANAGER','LOGISTICS_COORDINATOR','STORAGE_APPROVER','OPERATOR')),
    description TEXT NOT NULL
);
CREATE UNIQUE INDEX idx_role_name ON role(name);

-- 13. PARTY ROLES
CREATE TABLE party_role (
    party_id INTEGER NOT NULL REFERENCES party(party_id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES role(role_id) ON DELETE CASCADE,
    assigned_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (party_id, role_id)
);
CREATE INDEX idx_party_role_party_id ON party_role(party_id);
CREATE INDEX idx_party_role_role_id ON party_role(role_id);

-- 14. EMPLOYEE-WAREHOUSE
CREATE TABLE employee_warehouse (
    party_id INTEGER NOT NULL REFERENCES party(party_id) ON DELETE CASCADE,
    warehouse_id INTEGER NOT NULL REFERENCES warehouse(warehouse_id) ON DELETE CASCADE,
    assigned_from TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assigned_until TIMESTAMP,
    PRIMARY KEY (party_id, warehouse_id, assigned_from)
);
CREATE INDEX idx_employee_warehouse_party_id ON employee_warehouse(party_id);
CREATE INDEX idx_employee_warehouse_warehouse ON employee_warehouse(warehouse_id);

-- 15. STORAGE REQUESTS
CREATE TABLE storage_request (
    request_id SERIAL PRIMARY KEY,
    issuing_party_id INTEGER NOT NULL REFERENCES party(party_id),
    warehouse_id INTEGER NOT NULL REFERENCES warehouse(warehouse_id),
    requested_entry_date TIMESTAMP NOT NULL,
    requested_exit_date TIMESTAMP NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PENDING','ACCEPTED','REJECTED')) DEFAULT 'PENDING',
    decisive_party_id INTEGER REFERENCES party(party_id),
    decision_date TIMESTAMP
);
CREATE INDEX idx_storage_request_issuing_party_id ON storage_request(issuing_party_id);
CREATE INDEX idx_storage_request_warehouse_id ON storage_request(warehouse_id);
CREATE INDEX idx_storage_request_decisive_party_id ON storage_request(decisive_party_id);

-- 16. STORAGE RESERVATIONS
CREATE TABLE storage_reservation (
    reservation_id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL REFERENCES storage_request(request_id) ON DELETE CASCADE,
    party_id INTEGER NOT NULL REFERENCES party(party_id),
    shelf_id INTEGER NOT NULL REFERENCES shelf(shelf_id),
    reserved_weight NUMERIC NOT NULL,
    reserved_volume NUMERIC NOT NULL,
    reserved_from TIMESTAMP NOT NULL,
    reserved_until TIMESTAMP NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PENDING','ACTIVE','EXPIRED','CANCELLED')) DEFAULT 'PENDING'
);
CREATE INDEX idx_storage_reservation_request_id ON storage_reservation(request_id);
CREATE INDEX idx_storage_reservation_party_id ON storage_reservation(party_id);
CREATE INDEX idx_storage_reservation_shelf_id ON storage_reservation(shelf_id);

-- 17. STORAGE RECORDS
CREATE TABLE storage_record (
    storage_record_id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL REFERENCES storage_request(request_id),
    party_id INTEGER NOT NULL REFERENCES party(party_id),
    shelf_id INTEGER NOT NULL REFERENCES shelf(shelf_id),
    actual_entry_date TIMESTAMP NOT NULL,
    actual_exit_date TIMESTAMP,
    cargo_description TEXT NOT NULL,
    cargo_weight NUMERIC NOT NULL,
    cargo_volume NUMERIC NOT NULL
);
CREATE INDEX idx_storage_record_request_id ON storage_record(request_id);
CREATE INDEX idx_storage_record_party_id ON storage_record(party_id);
CREATE INDEX idx_storage_record_shelf_id ON storage_record(shelf_id);

-- 18. PAYMENTS
CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    storage_record_id INTEGER NOT NULL REFERENCES storage_record(storage_record_id) ON DELETE CASCADE,
    party_id INTEGER NOT NULL REFERENCES party(party_id),
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PENDING','PAID','FAILED','CANCELLED')) DEFAULT 'PENDING',
    payment_date TIMESTAMP,
    external_reference TEXT
);
CREATE INDEX idx_payment_party_id ON payment(party_id);
CREATE INDEX idx_payment_storage_record_id ON payment(storage_record_id);

-- 19. CARGO EVENT TYPES
CREATE TABLE cargo_event_type (
    event_type_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);
CREATE UNIQUE INDEX idx_cargo_event_type_name ON cargo_event_type(name);

-- 20. CARGO EVENT HISTORY
CREATE TABLE cargo_event_history (
    event_id SERIAL PRIMARY KEY,
    party_id INTEGER NOT NULL REFERENCES party(party_id),
    storage_record_id INTEGER NOT NULL REFERENCES storage_record(storage_record_id) ON DELETE CASCADE,
    event_type_id INTEGER NOT NULL REFERENCES cargo_event_type(event_type_id),
    event_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    details JSONB
);
CREATE INDEX idx_cargo_event_history_party_id ON cargo_event_history(party_id);
CREATE INDEX idx_cargo_event_history_storage_record_id ON cargo_event_history(storage_record_id);
CREATE INDEX idx_cargo_event_history_event_type_id ON cargo_event_history(event_type_id);
**
```

---

### Lista 20 Zapytań SQL do Ćwiczeń

Poniżej znajduje się zestawienie zapytań. Każde z nich jest technicznie poprawne i zwróci wyniki, ale większość będzie działać nieoptymalnie na powyższej strukturze (np. wykonując Sequential Scan zamiast Index Scan).

#### Poziom Łatwy (Simple)

**1. Wyszukiwanie kontrahenta po adresie email**

* **Query:**
```sql
SELECT party_id, name, contact_phone
FROM party
WHERE contact_email = 'jan.kowalski@example.com';

```


* **Optymalne?** NIE.
* **Dlaczego:** Brak indeksu na kolumnie `contact_email`. Baza wykona `Seq Scan` całej tabeli `party`. Należy dodać indeks (ewentualnie `UNIQUE`).

**2. Lista płatności o statusie 'FAILED'**

* **Query:**
```sql
SELECT payment_id, amount, currency, payment_date
FROM payment
WHERE status = 'FAILED';

```


* **Optymalne?** NIE.
* **Dlaczego:** Brak indeksu na `status`. Przy dużej tabeli `payment` będzie to wolne. Zalecany indeks na `status` (lub partycjonowanie, jeśli tabela jest ogromna).

**3. Znalezienie magazynu po fragmencie nazwy (LIKE na początku)**

* **Query:**
```sql
SELECT warehouse_id, name
FROM warehouse
WHERE name LIKE '%Logistics%';

```


* **Optymalne?** NIE.
* **Dlaczego:** Standardowy indeks B-Tree nie obsługuje wildcards na początku ciągu (`%text`). Nawet po dodaniu zwykłego indeksu, query zrobi `Seq Scan`. Rozwiązanie: `pg_trgm` i indeks GIN/GiST.

**4. Wyszukiwanie pracowników po typie adresu**

* **Query:**
```sql
SELECT p.name, a.city, a.street_address
FROM party p
JOIN address a ON p.party_id = a.party_id
WHERE a.address_type = 'SHIPPING';

```


* **Optymalne?** NIE (częściowo).
* **Dlaczego:** Mamy indeks na FK `address(party_id)`, ale brak indeksu na `address(address_type)`. Filtrowanie po typie wymusi skanowanie tabeli `address`.

**5. Ostatnie zdarzenia cargo posortowane po dacie**

* **Query:**
```sql
SELECT event_id, event_time, details
FROM cargo_event_history
ORDER BY event_time DESC
LIMIT 10;

```


* **Optymalne?** NIE.
* **Dlaczego:** Brak indeksu na `event_time`. Baza musi pobrać wszystkie wiersze, posortować je w pamięci (lub na dysku) i dopiero uciąć (LIMIT). Indeks na `event_time` pozwoliłby na natychmiastowe pobranie ostatnich 10.

**6. Znalezienie konkretnego regału (Rack) w alei**

* **Query:**
```sql
SELECT r.rack_id, r.label
FROM rack r
JOIN aisle a ON r.aisle_id = a.aisle_id
WHERE a.label = 'A-10' AND r.label = 'R-05';

```


* **Optymalne?** NIE.
* **Dlaczego:** Filtrujemy po polach tekstowych `label`, które nie mają indeksów. FK indeksy pomogą w złączeniu, ale samo znalezienie wierszy będzie wymagało skanowania.

---

#### Poziom Średni (Medium)

**7. Raport płatności w danym roku (użycie funkcji na kolumnie)**

* **Query:**
```sql
SELECT count(*), sum(amount)
FROM payment
WHERE EXTRACT(YEAR FROM payment_date) = 2024;

```


* **Optymalne?** NIE.
* **Dlaczego:** Nawet jeśli dodasz indeks na `payment_date`, użycie funkcji `EXTRACT` (lub rzutowania) uniemożliwia jego użycie (non-sargable query). Należy zamienić na zakres dat `BETWEEN '2024-01-01' AND '2024-12-31'` lub użyć indeksu funkcyjnego.

**8. Aktywne rezerwacje dla danego klienta (złożone filtrowanie)**

* **Query:**
```sql
SELECT sr.reservation_id, sr.reserved_weight
FROM storage_reservation sr
WHERE sr.party_id = 55
  AND sr.status = 'ACTIVE'
  AND sr.reserved_until > NOW();

```


* **Optymalne?** NIE.
* **Dlaczego:** Mamy indeks na `party_id`, ale baza prawdopodobnie pobierze wszystkie rezerwacje klienta, a potem przefiltruje resztę w pamięci (Heap Fetch). Brakuje indeksu kompozytowego `(party_id, status, reserved_until)`.

**9. Pracownicy przypisani obecnie do magazynu (zakres dat)**

* **Query:**
```sql
SELECT p.name, ew.assigned_from
FROM employee_warehouse ew
JOIN party p ON ew.party_id = p.party_id
WHERE ew.warehouse_id = 1
  AND ew.assigned_until IS NULL;

```


* **Optymalne?** ŚREDNIO.
* **Dlaczego:** Indeks na `warehouse_id` istnieje, więc baza szybko znajdzie rekordy dla magazynu. Jednak warunek `IS NULL` może być słabo selektywny bez indeksu częściowego (Partial Index) dla aktywnych przypisań.

**10. Całkowita waga towaru na magazynie (Join 4 tabel)**

* **Query:**
```sql
SELECT w.name, SUM(rec.cargo_weight) as total_weight
FROM warehouse w
JOIN zone z ON z.warehouse_id = w.warehouse_id
JOIN aisle a ON a.zone_id = z.zone_id
JOIN rack r ON r.aisle_id = a.aisle_id
JOIN shelf s ON s.rack_id = r.rack_id
JOIN storage_record rec ON rec.shelf_id = s.shelf_id
WHERE w.warehouse_id = 2
GROUP BY w.name;

```


* **Optymalne?** NIE.
* **Dlaczego:** Dużo złączeń. Chociaż mamy indeksy FK, brakuje indeksów pokrywających (Covering Indexes), żeby uniknąć skakania do tabeli głównej (Heap) po wagę. Dodatkowo brak indeksów na FK w drugą stronę (np. od `storage_record` w górę) może utrudnić optymalizatorowi wybór innej kolejności złączeń.

**11. Znalezienie "dużych" płatności (Aggregation + Having)**

* **Query:**
```sql
SELECT party_id, SUM(amount)
FROM payment
WHERE payment_date > '2024-01-01'
GROUP BY party_id
HAVING SUM(amount) > 10000;

```


* **Optymalne?** NIE.
* **Dlaczego:** Brak indeksu kompozytowego `(payment_date, party_id, amount)`. Baza musi przeskanować wszystkie płatności od danej daty i wykonać sortowanie/hashowanie dla GROUP BY. Indeks pokrywający znacznie by to przyspieszył (Index Only Scan).

**12. Wyszukiwanie duplikatów kontaktów**

* **Query:**
```sql
SELECT details, count(*)
FROM party_contact
WHERE type = 'PHONE'
GROUP BY details
HAVING count(*) > 1;

```


* **Optymalne?** NIE.
* **Dlaczego:** Grupowanie po polu tekstowym `details` bez indeksu. Wymaga pełnego skanu i kosztownego sortowania/haszowania.

**13. Historia zmian statusu dla konkretnego requestu (Sortowanie)**

* **Query:**
```sql
SELECT *
FROM cargo_event_history
WHERE storage_record_id IN (
    SELECT storage_record_id FROM storage_record WHERE request_id = 100
)
ORDER BY event_time DESC;

```


* **Optymalne?** NIE.
* **Dlaczego:** Podzapytanie. Indeks na `storage_record(request_id)` jest, ale złączenie z historią i sortowanie bez indeksu na `event_time` (w kontekście `storage_record_id`) może być kosztowne.

---

#### Poziom Trudny (Hard)

**14. Zapytanie do pola JSONB (Wyszukiwanie w strukturze)**

* **Query:**
```sql
SELECT party_id, name
FROM party
WHERE data->>'industry' = 'Automotive';

```


* **Optymalne?** KRYTYCZNIE NIE.
* **Dlaczego:** Kolumna `data` jest typu JSONB, ale nie ma indeksu GIN. To jest klasyczny Sequential Scan, gdzie dla każdego wiersza następuje parsowanie JSONa w locie.

**15. Wykrywanie kolizji rezerwacji (Overlapping intervals)**

* **Query:**
```sql
SELECT s1.reservation_id, s2.reservation_id
FROM storage_reservation s1
JOIN storage_reservation s2 ON s1.shelf_id = s2.shelf_id
WHERE s1.reservation_id < s2.reservation_id
  AND s1.status = 'ACTIVE' AND s2.status = 'ACTIVE'
  AND s1.reserved_from < s2.reserved_until
  AND s1.reserved_until > s2.reserved_from;

```


* **Optymalne?** NIE.
* **Dlaczego:** Bardzo kosztowny self-join z warunkami nierówności (`<`, `>`). Bez indeksu typu GiST (zakresowego) na `tsrange(reserved_from, reserved_until)` baza wykona Nested Loop z dużą liczbą porównań.

**16. Analiza "zimnych" towarów (Not Exists / Left Join NULL)**

* **Query:**
```sql
SELECT sr.storage_record_id, sr.actual_entry_date
FROM storage_record sr
LEFT JOIN cargo_event_history ceh ON sr.storage_record_id = ceh.storage_record_id
    AND ceh.event_time > NOW() - INTERVAL '30 days'
WHERE ceh.event_id IS NULL
  AND sr.actual_exit_date IS NULL;

```


* **Optymalne?** NIE.
* **Dlaczego:** Szukamy rekordów, które *nie* miały zdarzeń w ostatnich 30 dniach. Złączenie jest po indeksie FK, ale filtrowanie po dacie w tabeli prawej (`ceh`) i sprawdzanie `IS NULL` jest kosztowne bez odpowiednich indeksów kompozytowych.

**17. Wyliczenie średniego czasu przebywania towaru (Date operations)**

* **Query:**
```sql
SELECT p.name, AVG(EXTRACT(EPOCH FROM (rec.actual_exit_date - rec.actual_entry_date))/3600) as avg_hours
FROM storage_record rec
JOIN party p ON rec.party_id = p.party_id
WHERE rec.actual_exit_date IS NOT NULL
GROUP BY p.name;

```


* **Optymalne?** NIE.
* **Dlaczego:** Musimy obliczyć różnicę dla każdego zakończonego rekordu. Brak indeksu na `actual_exit_date` (żeby szybko odsiać NULLe) oraz konieczność złączenia z `party` po ID, by potem grupować po `name` (tekst), zamiast po ID. Optymalizator może wybrać złe plany przy dużej skali.

**18. Paginacja głęboka (Offset problem)**

* **Query:**
```sql
SELECT *
FROM payment
ORDER BY payment_date DESC
LIMIT 50 OFFSET 10000;

```


* **Optymalne?** NIE.
* **Dlaczego:** Słynny problem offsetu. Baza musi pobrać i posortować 10050 rekordów, żeby wyrzucić pierwsze 10000. Brak indeksu na `payment_date` pogarsza sprawę (pełne sortowanie w pamięci). Nawet z indeksem, wysoki OFFSET jest wolny (rozwiązanie: keyset pagination / seek method).

**19. Ranking pracowników wg liczby obsłużonych eventów (Window Function)**

* **Query:**
```sql
SELECT 
    party_id, 
    COUNT(*) as event_count,
    RANK() OVER (ORDER BY COUNT(*) DESC) as rank
FROM cargo_event_history
GROUP BY party_id;

```


* **Optymalne?** NIE.
* **Dlaczego:** Agregacja całej tabeli historii (potencjalnie największa tabela w systemie). Brak zmaterializowanego widoku lub indeksu pokrywającego `idx(party_id)` (chociaż ten akurat istnieje, ale bez `INCLUDE` innych danych, query może nadal być ciężkie przy pełnym skanie).

**20. Wyszukiwanie full-text bez TSVECTOR**

* **Query:**
```sql
SELECT *
FROM storage_record
WHERE cargo_description ILIKE '%fragile%' 
   OR cargo_description ILIKE '%glass%';

```


* **Optymalne?** NIE.
* **Dlaczego:** Podwójny `ILIKE` z wildcardem na początku. Zabójca wydajności. Wymaga Sequential Scan. Powinno być użyte `tsvector` i indeks GIN/GiST.
