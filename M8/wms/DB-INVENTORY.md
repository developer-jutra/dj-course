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
