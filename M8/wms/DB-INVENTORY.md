# DB Inventory — liczebność rekordów/dokumentów

Zestawienie liczebności we wszystkich tabelach/kolekcjach działających baz.
Stan na: 2026-06-20.

Bazy:
- **Postgres `deliveroo`** (WMS) — kontener `wms-postgres-container`, dane wygenerowane.
- **MongoDB `customer_portal`** (portal klienta) — kontener `cp-mongodb-container`, dane demo.

> Liczby z Postgresa to realny `COUNT(*)` (nie `n_live_tup` z `pg_stat_user_tables`,
> który pokazywał same zera — statystyki nieodświeżone po załadowaniu danych).

## 🐘 Postgres — `deliveroo` (38 tabel)

### Tabele wypełnione (WMS) — 21 tabel, 619 305 wierszy

| Tabela | Wiersze |
|---|---:|
| storage_event_history | 500 000 |
| storage_request | 50 000 |
| payment | 45 000 |
| shelf | 6 000 |
| storage_record | 4 929 |
| storage_reservation | 4 929 |
| customer_contact | 2 219 |
| employee | 1 337 |
| customer_address | 1 210 |
| rack | 1 200 |
| customer_employee | 1 187 |
| customer | 800 |
| employee_role | 185 |
| employee_warehouse | 150 |
| aisle | 120 |
| capacity | 17 |
| storage_event_type | 8 |
| zone | 7 |
| role | 5 |
| location | 1 |
| warehouse | 1 |

### Tabele puste — 17 tabel (0 wierszy)

Moduł TMS + pozostałe, dla których nie wygenerowano danych:
`vehicles`, `trailers`, `vehicle_tyres`, `vehicle_documents`, `vehicle_inspections`,
`tyre_swap_history`, `maintenance_intervals`, `spare_parts`, `spare_part_aliases`,
`service_orders`, `service_order_parts`, `insurance_policies`, `policy_instalments`,
`alerts`, `alert_rules`, `alert_recipient_rules`, `employees`

## 🍃 MongoDB — `customer_portal` (12 kolekcji, 43 dokumenty)

| Kolekcja | Dokumenty |
|---|---:|
| dashboard_stats | 6 |
| tracking_data | 6 |
| route_performance | 5 |
| notifications | 4 |
| companies | 3 |
| invoices | 3 |
| quick_actions | 3 |
| recent_requests | 3 |
| transportation_requests | 3 |
| users | 3 |
| warehousing_requests | 3 |
| metrics | 1 |

## Podsumowanie

| Baza | Obiekty | Z danymi | Puste | Σ rekordów |
|---|---:|---:|---:|---:|
| Postgres `deliveroo` | 38 tabel | 21 | 17 | 619 305 |
| MongoDB `customer_portal` | 12 kolekcji | 12 | 0 | 43 |

## Uwagi

- Baza `deliveroo` miesza moduły **WMS** (wypełniony) i **TMS** (puste tabele
  pojazdów/serwisu/ubezpieczeń) — generator danych pokrywa na razie tylko WMS.
- `employee` (1 337) vs puste `employees` — możliwa zdublowana/legacy tabela do sprzątnięcia.

## Interpretacja zawartości

Dane układają się w jedną **platformę spedycyjno-magazynową „Deliveroo Logistics"**
złożoną z trzech modułów o zupełnie różnym charakterze danych:

| Moduł | Baza | Charakter danych |
|---|---|---|
| **WMS** (magazyn) | Postgres `deliveroo` | wygenerowane masowo (Faker), ~620k wierszy |
| **TMS** (flota) | Postgres `deliveroo` | tylko schemat, **0 danych** |
| **CP** (portal klienta) | Mongo `customer_portal` | ręcznie dobrane dane demo (43 dok.) |

### 1. CP — czego dotyczą zlecone zamówienia

Portal ma **3 firmy-persony**, każda z innej branży, i to one nadają sens całości:

| Firma | Kraj | Branża | Tier | Aktywna? |
|---|---|---|---|---|
| Deliveroo Logistics | Polska | AUTOMOTIVE | ENTERPRISE | tak |
| NordFresh Foods | Szwecja | FOOD_AND_BEVERAGE | STANDARD | tak |
| MediPharm | Niemcy | PHARMACEUTICAL | PREMIUM | nie (nieaktywna) |

**Zamówienia transportowe** (3) — realistyczne korytarze UE, rosnące gabarytowo:
- `TR-2024-001` Warszawa→Berlin, elektronika (1,5 t / 25 k €), FTL, *w transporcie*
- `TR-2024-002` Kraków→Wiedeń, części maszyn (3 t / 50 k €), express, *dostarczone*
- `TR-2024-003` Praga→Hamburg, sprzęt przemysłowy (5 t / 120 k €), ponadgabaryt, *odbiór zaplanowany*

**Zamówienia magazynowe** (3) — typ składowania dobrany pod ładunek (i pod branże firm):
- `WH-2024-001` elektronika automotive → **AMBIENT** (Warehouse A-12), 3 mies.
- `WH-2024-002` świeża żywność → **REFRIGERATED** (Cold Storage B-5), 2 tyg.
- `WH-2024-003` farmaceutyki (250 k €!) → **CLIMATE_CONTROLLED** (Secure Facility C-1), 6 mies.

**Faktury** opowiadają historię należności (AR aging): 1 opłacona, 1 wystawiona,
1 **przeterminowana** — i to ta od *nieaktywnej* MediPharm. Spójna narracja
„klient zalega → konto wyłączone". **Użytkownicy** mapują role RBAC: ADMIN + OPERATOR
(firma 1), VIEWER (firma 2), firma 3 bez użytkownika.

### 2. TMS — jakie są dostępne pojazdy

**Żadne** — tabela `vehicles` i cały moduł TMS są puste (istnieje tylko schemat).
Z definicji tabel widać natomiast zaprojektowaną domenę zarządzania flotą:

- `vehicles` (`specs` JSONB) + `trailers` (VIN, typ nadwozia, paleto-miejsca, winda,
  **chłodnia + czujniki temp.**) → ciągniki i naczepy, w tym chłodnicze
- `vehicle_tyres` (oś, sezon, bieżnik) + `tyre_swap_history` → cykl życia opon
- `service_orders` (klasyfikacja naprawy, nr szkody, warsztat, koszt robocizny) → serwis
- `spare_parts` (nr OEM, stan, próg min.) → magazyn części
- `insurance_policies` + `policy_instalments` → polisy i raty
- `maintenance_intervals` → przeglądy prewencyjne
- `alerts` / `alert_rules` / `alert_recipient_rules` → silnik alertów flotowych

### 3. WMS — interpretacja (odwrotność CP)

Dużo danych, ale treść losowa — zestaw do ćwiczeń wydajnościowych/indeksowych:

- **1 magazyn** („Main Deliveroo Warehouse", Janki k. Warszawy), zamodelowany w głąb:
  7 stref → 120 alejek → 1 200 regałów → **6 000 półek**. Pojemność 10 000 palet / 50 000 m³.
- **Skala**: 50 000 zleceń, ~4 929 składowań, **500 000 zdarzeń** (RECEIVED, MOVED,
  DISPATCHED, DAMAGED, LOST, QUALITY_ISSUE, SAFETY_INCIDENT, CONTRACTOR_CONTACT).
- **Sygnatury danych syntetycznych (Faker)**:
  - opisy ładunku to lorem ipsum („Beat many smile wrong.", „Science hold a.") — nie realne towary;
  - kraje klientów losowe z całego świata (Brunei, Papua-Nowa Gwinea, Wyspy Kokosowe, Zambia);
  - statusy zleceń rozłożone idealnie równo (~16,7 k każdy) i płatności równo po 4 statusach
    × 3 walutach (EUR/PLN/USD, ~3,7–3,8 k każdy, łącznie ~**56 mln** w płatnościach) — rozkład
    jednostajny = generator, nie zachowanie ludzi.
- Klienci: 800 (725 aktywnych / 75 nieaktywnych). Okno dat zleceń: 2026-01-18 → 2026-04-18.

### Obserwacje jakościowe

1. **Dwa reżimy danych**: CP = mała, spójna fabuła pod demo UI; WMS = wolumen pod testy
   indeksów (treść losowa). Stąd sens wcześniejszej pracy nad indeksami na skali WMS.
2. **CP nie domyka się liczbowo** (to fixture): `metrics.totalShipments = 156` i
   `route_performance` (5 tras) nie wynikają z 3 zleceń transportowych; `tracking_data`
   ma 6 przesyłek, a zleceń transportowych są 3 (łączy się tylko `TRK123456789` ↔ `TR-2024-001`).
3. **Niespójność tenantów w CP**: wszystkie 3 zlecenia magazynowe mają `companyId: "1"`
   (automotive), choć dotyczą żywności i farmacji — powinny należeć do firm 2 i 3. Błąd seedu.
4. **TMS to martwy schemat** — gotowy model, czeka na generator/dane.
5. **`employee` (1 337) vs puste `employees`** — `employees` wygląda na legacy/duplikat.
