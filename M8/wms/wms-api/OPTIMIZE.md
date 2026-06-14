# Top 5 Spectacular Queries — Problems & Fixes

  Here are the 5 queries with the highest "wow factor" for
  optimization — each illustrates a different class of problem so
  you can practice distinct fixes.

  ---

  ## 1. `GET /storage/cargo?description=X` — leading-wildcard
  ILIKE

  **File:** `wms-api/src/routes/storage.py:23-38`

  ```sql
  SELECT *
  FROM storage_record
  WHERE cargo_description ILIKE '%X%';
  ```

  **Problem.** A leading `%` defeats every B-tree index. Postgres
  must read every row of `storage_record` and run a
  case-insensitive regex on `cargo_description`. With LARGE data
  this scales linearly with table size, every time.

  **Fix.** Trigram index (one-line install, then a GIN index):

  ```sql
  CREATE EXTENSION IF NOT EXISTS pg_trgm;
  CREATE INDEX idx_storage_record_cargo_description_trgm
    ON storage_record USING GIN (cargo_description gin_trgm_ops);
  ```

  The planner will now switch to a Bitmap Index Scan on `ILIKE
  '%...%'`. Also drop `SELECT *` and return only the columns the
  client needs.

  ---

  ## 2. `GET /storage/<id>/events?severity=X` — JSONB scalar
  filter

  **File:** `wms-api/src/routes/storage.py:40-76`

  ```sql
  SELECT event_time, details
  FROM storage_event_history
  WHERE storage_record_id = :record_id
    AND details->>'severity' = :severity
  ORDER BY event_time;
  ```

  **Problems.**
  1. `storage_event_history.storage_record_id` is a FK with **no
  index** → seq scan on a table that grows fastest in the system
  (event log).
  2. `details->>'severity'` cannot use a generic index; even
  adding one on `(storage_record_id)` still re-evaluates the JSON
  path per row.

  **Fix.** Add the FK index, then an expression index on the JSON
  path:

  ```sql
  CREATE INDEX idx_event_history_record_time
    ON storage_event_history(storage_record_id, event_time);

  CREATE INDEX idx_event_history_severity
    ON storage_event_history((details->>'severity'));
  ```

  The composite `(storage_record_id, event_time)` lets Postgres do
   an index-only scan that already returns rows in the required
  sort order — the `ORDER BY` becomes free. For very selective
  severity filters add the expression index above; for broad JSONB
   querying long-term, use `CREATE INDEX ... USING GIN (details
  jsonb_path_ops)`.

  ---

  ## 3. `GET /storage/reservations/active` — low-cardinality
  filter + LIMIT/ORDER BY

  **File:** `wms-api/src/routes/storage.py:8-21`

  ```sql
  SELECT *
  FROM storage_reservation
  WHERE status = 'active'
  ORDER BY reserved_from ASC
  LIMIT 50;
  ```

  **Problem.** Schema has `CREATE INDEX
  idx_reservation_status_filter ON storage_reservation(status)`.
  Status has 4 values; "active" probably matches ~25% of rows.
  Even when Postgres uses the index, it has to **sort all matching
   rows by `reserved_from`** before applying the LIMIT — the index
   doesn't help the sort.

  **Fix.** Partial index that already encodes the sort order:

  ```sql
  DROP INDEX idx_reservation_status_filter;  -- low value as-is
  CREATE INDEX idx_reservation_active_by_from
    ON storage_reservation(reserved_from)
    WHERE status = 'active';
  ```

  Now the query becomes an **index-only scan with implicit
  ordering** — read the first 50 entries and stop. Same trick
  applies to `idx_customer_is_deleted` and
  `idx_employee_is_deleted` (replace with partial indexes filtered
   on the common case).

  ---

  ## 4. `GET /contractors/<id>` — multi-CTE join with no FK
  indexes

  **File:** `wms-api/src/routes/contractors.py:75-195`

  (The big CTE — `contractor_base` + `contractor_contacts` +
  `contractor_addresses` + `employee_contacts` +
  `customer_employees` + `aggregated_employees`.)

  **Problems.**
  1. Every CTE filters by `customer_id` on a table where
  `customer_id` is a **FK with no index**: `customer_contact`,
  `customer_address`, `customer_employee`. PostgreSQL does **not**
   auto-index FK columns. Result: 4 sequential scans for one
  record lookup.
  2. The `employee_contacts` CTE does `WHERE e.employee_id IN
  (SELECT employee_id FROM customer_employee WHERE customer_id =
  :id)` — another seq scan on `customer_employee`.
  3. `json_agg(... ORDER BY 'email')` — ordering by a string
  literal `'email'` is a no-op (Postgres treats `'email'` as a
  constant, not a column). Looks like a bug.

  **Fix.**

  ```sql
  CREATE INDEX idx_customer_contact_customer_id  ON
  customer_contact(customer_id);
  CREATE INDEX idx_customer_address_customer_id  ON
  customer_address(customer_id);
  -- customer_employee already has PK (customer_id, employee_id)
  so customer_id is leading → covered
  ```

  `customer_employee(customer_id, employee_id)` PK already covers
  customer_id lookups (leading column). And fix the bogus `ORDER
  BY 'email'` — either drop it or order by an actual column.

  ---

  ## 5. `GET /warehouse/<id>` — join fan-out + STRING_AGG with
  unindexed FKs

  **File:** `wms-api/src/routes/warehouse.py:45-75`

  ```sql
  SELECT e.employee_id, e.name, ..., STRING_AGG(r.name, ', ') AS
  roles
  FROM employee e
  JOIN employee_warehouse ew ON e.employee_id = ew.employee_id
  JOIN employee_role      er ON e.employee_id = er.employee_id
  JOIN role               r  ON er.role_id    = r.role_id
  WHERE ew.warehouse_id = :warehouse_id
    AND e.is_deleted = false
  GROUP BY e.employee_id, e.name, e.email, e.phone, e.hire_date
  ORDER BY e.name;
  ```

  **Problems.**
  1. `employee_warehouse` PK is `(employee_id, warehouse_id,
  assigned_from)` — filtering by **warehouse_id alone uses no
  index** (leading column is employee_id). Seq scan on the
  assignment table.
  2. `employee_role` PK is `(employee_id, role_id)` — fine for the
   join, but combined with the above it can still cause a join
  order that materializes too many rows.
  3. Cartesian-style fan-out: if an employee has 3 roles, you get
  3 rows before `STRING_AGG` collapses them. Cost grows with
  `roles × warehouses`.
  4. The query returns **all employees assigned to the
  warehouse**, including those whose assignment has expired
  (`assigned_until < NOW()`) — likely unintended.

  **Fix.**

  ```sql
  CREATE INDEX idx_employee_warehouse_warehouse_id
    ON employee_warehouse(warehouse_id, employee_id);  -- covers
  join

  -- Partial index for active staff if "is_deleted" is mostly
  false:
  CREATE INDEX idx_employee_active_by_name
    ON employee(name) WHERE is_deleted = false;
  ```

  For the fan-out, pre-aggregate roles in a subquery instead of
  joining-then-grouping:

  ```sql
  SELECT e.employee_id, e.name, e.email, e.phone, e.hire_date,
  r.roles
  FROM employee e
  JOIN employee_warehouse ew ON e.employee_id = ew.employee_id AND
   ew.warehouse_id = :warehouse_id
  LEFT JOIN LATERAL (
      SELECT STRING_AGG(role.name, ', ') AS roles
      FROM employee_role er JOIN role ON role.role_id = er.role_id
      WHERE er.employee_id = e.employee_id
  ) r ON true
  WHERE e.is_deleted = false
  ORDER BY e.name;
  ```

  That keeps role aggregation per-employee instead of multiplying
  rows across the whole result set.

  ---

  ## Summary table

  | # | Endpoint | Class of problem | Key fix |
  |---|---|---|---|
  | 1 | `/storage/cargo` | Leading-wildcard `ILIKE` | `pg_trgm` +
  GIN index |
  | 2 | `/storage/<id>/events?severity` | JSONB filter + missing
  FK index | Composite index + expression index on JSON path |
  | 3 | `/storage/reservations/active` | Low-cardinality filter +
  ORDER BY + LIMIT | Partial index that pre-sorts |
  | 4 | `/contractors/<id>` | Many unindexed FK joins in CTEs |
  Index the FK columns; fix bogus `ORDER BY 'email'` |
  | 5 | `/warehouse/<id>` | PK leading column wrong; join fan-out
  before agg | Index on `(warehouse_id, employee_id)`; LATERAL
  pre-aggregate |

  Run `EXPLAIN (ANALYZE, BUFFERS)` before and after each fix to
  capture concrete improvements — the buffer counts often tell the
   story even better than wall time.


  ## Test for step 4.
   
     Step 1 — pick a representative customer_id
   
     Don't measure with id 1 if it has only one address and zero employees — you'll see nothing. Find one that
     actually exercises every CTE branch:
   
       SELECT *
       FROM (
           SELECT c.customer_id,
                  (SELECT COUNT(*) FROM customer_contact  WHERE customer_id = c.customer_id) AS n_contacts,
                  (SELECT COUNT(*) FROM customer_address  WHERE customer_id = c.customer_id) AS n_addresses,
                  (SELECT COUNT(*) FROM customer_employee WHERE customer_id = c.customer_id) AS n_employees
           FROM customer c
           WHERE c.is_deleted = false
       ) t
       ORDER BY n_contacts + n_addresses + n_employees DESC
       LIMIT 5;
   
     Pick the id with the largest sum.
   
     Step 2 — prepare the query
   
     Highlight the whole PREPARE ... block and press F5 (Execute, not Explain):
   
     PREPARE contractor_details(int) AS
     WITH contractor_base AS (
         SELECT c.customer_id, c.name AS contractor_name, c.status, c.tax_id_number,
                c.created_at, c.updated_at
         FROM customer c
         WHERE c.customer_id = $1 AND c.is_deleted = false
     ),
     contractor_contacts AS (
         SELECT customer_id,
                json_agg(json_build_object('type', type, 'details', details)) AS contacts
         FROM customer_contact
         WHERE customer_id = $1
         GROUP BY customer_id
     ),
     contractor_addresses AS (
         SELECT customer_id,
                json_agg(json_build_object(
                    'address_id', address_id, 'street_address', street_address,
                    'city', city, 'country', country, 'postal_code', postal_code,
                    'address_type', address_type)) AS addresses
         FROM customer_address
         WHERE customer_id = $1
         GROUP BY customer_id
     ),
     employee_contacts AS (
         SELECT e.employee_id,
                json_agg(json_build_object('type', 'email', 'details', e.email)
                         ORDER BY 'email') AS contacts
         FROM employee e
         WHERE e.employee_id IN (SELECT employee_id FROM customer_employee WHERE customer_id = $1)
         GROUP BY e.employee_id
     ),
     customer_employees AS (
         SELECT ce.customer_id, e.employee_id, e.name AS employee_name,
                ce.employee_type, ce.job_title, ec.contacts
         FROM customer_employee ce
         JOIN employee e ON ce.employee_id = e.employee_id
         LEFT JOIN employee_contacts ec ON e.employee_id = ec.employee_id
         WHERE ce.customer_id = $1 AND e.is_deleted = false
     ),
     aggregated_employees AS (
         SELECT customer_id,
                json_agg(json_build_object(
                    'employee_id', employee_id, 'employee_name', employee_name,
                    'employee_data', json_build_object('type', employee_type, 'job_title', job_title),
                    'contacts', contacts)) AS employees
         FROM customer_employees
         GROUP BY customer_id
     )
     SELECT cb.customer_id AS id, cb.contractor_name AS name, cb.status, cb.tax_id_number,
            cb.created_at, cb.updated_at, cc.contacts, ca.addresses, ae.employees
     FROM contractor_base cb
     LEFT JOIN contractor_contacts  cc ON cb.customer_id = cc.customer_id
     LEFT JOIN contractor_addresses ca ON cb.customer_id = ca.customer_id
     LEFT JOIN aggregated_employees ae ON cb.customer_id = ae.customer_id;
   
     Step 3 — capture the baseline plan
   
     Use EXPLAIN (ANALYZE, BUFFERS) — not just plain EXPLAIN. Run twice; the second run is the steady-state
     number (the first pays for cold cache).
   
     EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
     EXECUTE contractor_details(42);   -- <-- the id you picked in step 1
   
     Save the output to a text file or screenshot — you'll diff against it after the index is added.
   
     Step 4 — what to look for in the plan
   
     In the baseline you should see at least 3 Seq Scan nodes with predicates like Filter: (customer_id = 42):
     - Seq Scan on customer_contact ... Filter: (customer_id = 42)
     - Seq Scan on customer_address ... Filter: (customer_id = 42)
     - Possibly Seq Scan on employee for the IN (...) subquery
   
     Note their actual time= and Buffers: shared read=... numbers. Those are what should drop most after the
     indexes land.
   
     Step 5 — clean up
   
     DEALLOCATE contractor_details;
   
     Then apply the index from fix #4 with F5, re-PREPARE (Postgres caches plans per-prepare, so a fresh
     prepare picks up new indexes), and re-run the EXPLAIN. Compare.
   
     ▎ Tip: keep both EXPLAIN outputs in two side-by-side pgAdmin tabs, or paste into
     ▎ https://explain.dalibo.com/ for a visual diff.
