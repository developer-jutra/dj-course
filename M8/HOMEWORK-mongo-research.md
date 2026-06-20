1. `readConcern: snapshot` - czym te mongowe mechanizmy się różnią od MVCC/xmin/xmax w Postgresie?
2. Czy `readConcern` i `writeConcern` w mongo odpowiada bardziej różnym poziomom izolacji (jak w Postgresie) czy bardziej mechanizmowi quorum `R` i `W` w Distributed Replication? A może jest to kombinacja obu - albo jeszcze coś innego? Czy przychodzi Ci do głowy lepsza nazwa dla tego mechanizmu?
3. czy Covered Queries oraz SARGability to to samo? Czy Covered Queries sprowadza się do tego samego co Index Only Scan w postgresie?
4. Postgres ma te bloki po 8kb - jak przechowuje pliki Mongo?
5. Postgres ma mnóstwo różnych rodzajów indeksów (b-tree, GiST, GIN etc etc etc) - jak na tym tle wypada Mongo?
6. Mechanizm _copy on write_: jakie ma zastosowanie w Postgresie vs w Mongo? O co w nim chodzi?
7. Czy zasada ESR (determinująca kolejność elementów w indeksie mongo) ma zastosowanie także do postgresa?
8. `db.recent_requests.createIndex({ "status": 1 });` - tutaj 1/-1 określa kierunek (asc/desc) indeksu. Pytanie - po co to, skoro w postgresie się czegoś takiego z reguły nie określa? Skoro indeks używa podobnej struktury drzewiastej co w Postgresie (b-tree) - i można trawersować indeks zarówno od poczatku jak i od końca - to po co w ogóle jest to 1/-1 w API tworzenia indeksu?
9. czy mongo ma WAL albo jakiś jego ekwiwalent? Jeśli tak, czy jakościowo dorównuje postgresowemu WAL? Jeśli nie - na co ludzie narzekają?
10. Cokolwiek specyficznego / kluczowego jeśli chodzi o zarządzanie pamięcią RAM w przypadku kontenerów mongo? O czym SRE powinien wiedzieć?


---

## Operatory użyte w zaawansowanych pipeline'ach (customer portal)

Notatki do zapytań z `customer-portal/mongodb-queries.md` (sekcja „Zaawansowane zapytania - analityka").
Dla każdego operatora dorzucam analogię do Postgresa, bo to ułatwia zapamiętanie.

### `$setWindowFields` — funkcje okna
Odpowiednik `OVER (PARTITION BY ... ORDER BY ...)` z SQL. Pozwala policzyć wartość dla
dokumentu względem „okna" sąsiednich dokumentów bez kolapsowania ich w grupę (czym różni
się od `$group`).
- `sortBy` = `ORDER BY` w oknie, `partitionBy` = `PARTITION BY`.
- `window: { documents: ["unbounded", "current"] }` = `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`
  (suma narastająca). `["unbounded", "unbounded"]` = total po całym oknie.
- Operatory okna: `$rank`, `$denseRank`, `$documentNumber`, `$sum`, `$avg`, `$shift` (≈ `LAG`/`LEAD`).
- Dostępny od MongoDB 5.0. Wymaga sortowania w pamięci/po indeksie — przy dużych oknach
  pilnować limitu 100 MB na etap (albo `allowDiskUse`).

### `$unionWith` — łączenie kolekcji
Odpowiednik `UNION ALL` z SQL (uwaga: `ALL`, NIE deduplikuje). Dokleja wyniki pipeline'u
z innej kolekcji do bieżącego strumienia.
- W przykładzie scala `transportation_requests` + `warehousing_requests` w jeden strumień
  zleceń, każdy oznaczony `kind` przez `$literal`, żeby dało się je potem rozróżnić w `$group`.
- W przeciwieństwie do `$lookup` (który zagnieżdża tablicę w dokumencie) `$unionWith`
  produkuje dodatkowe dokumenty — to konkatenacja „w pionie", nie „w poziomie".
- Schematy kolekcji nie muszą być zgodne; wyrównanie pól robimy sami przez `$project`.
- Dostępny od MongoDB 4.4.

### `$lookup` z pod-pipeline (correlated subquery)
Odpowiednik `LEFT JOIN LATERAL` / skorelowanego podzapytania z SQL.
- Forma `localField/foreignField` = zwykły equi-join (jak w przykładzie z `companies`).
- Forma `let` + `pipeline` + `$expr` = join skorelowany: zmienne z dokumentu nadrzędnego
  (`let: { cid: "$_id" }`) wstrzykujemy do pod-pipeline (`$$cid`), gdzie można je agregować
  PRZED złączeniem. W przykładzie liczę `billed`/`overdue` z faktur per firma już wewnątrz
  `$lookup`, więc do dokumentu wraca gotowa agregacja, nie surowa tablica.
- Wynik zawsze ląduje jako tablica w polu `as` — stąd `$first`/`$ifNull` do wyciągnięcia
  pojedynczej wartości.

### `$dateFromString` + `$dateDiff` — parsowanie i różnica dat
Potrzebne, bo `estimatedTime`/`actualTime` w `tracking_data` są stringami bez strefy
(`"2024-01-15T09:00:00"`), a nie typem `Date` — porównanie wprost nie zadziała.
- `$dateFromString: { dateString: ... }` = `TO_TIMESTAMP`/`CAST(... AS timestamp)` z SQL.
  Można podać `format` i `timezone`; bez nich mongo zakłada ISO 8601 / UTC.
- `$dateDiff: { startDate, endDate, unit }` = `EXTRACT(... FROM (b - a))` / `AGE` z SQL.
  Zwraca liczbę całkowitą jednostek (`minute`, `hour`, `day`, ...). Dodatnia wartość =
  zdarzenie po czasie (opóźnienie), ujemna = przed czasem.
- `$dateDiff` od MongoDB 5.0; alternatywa starszym sposobem to odejmowanie dat
  (`{ $subtract: [b, a] }` daje milisekundy).

### Pozostałe pomocnicze
- `$cond: [warunek, gdy_true, gdy_false]` — odpowiednik `CASE WHEN`. Używany do warunkowych
  sum (`SUM(CASE WHEN status='PAID' THEN total ELSE 0 END)`).
- `$literal` — wymusza traktowanie wartości jako stałej, nawet gdy wygląda jak ścieżka pola
  czy operator (tu: stałe `"TRANSPORT"`/`"WAREHOUSING"`).
- `$first` na tablicy — bierze pierwszy element (po `$lookup` lub w `$group`).
