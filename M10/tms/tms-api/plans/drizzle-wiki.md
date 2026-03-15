# Drizzle ORM – Wiki dla TMS API (moduł Vehicles)

## 1. Instalacja i konfiguracja

### Zależności
```bash
npm install drizzle-orm        # runtime ORM
npm install --save-dev drizzle-kit  # narzędzie CLI do migracji / introspekcji
```

### Struktura plików
```
tms-api/
├── drizzle.config.ts          # konfiguracja Drizzle Kit (CLI)
├── .env                       # DATABASE_URL do lokalnego połączenia (localhost:5433)
├── src/
│   └── db/
│       ├── schema.ts          # definicja tabel jako TypeScript (kod-źródłem prawdy)
│       └── drizzle.ts         # instancja db – opakowuje istniejący Pool z pg
└── drizzle/                   # artefakty Drizzle Kit (migracje, snapshoty)
    ├── schema.ts              # ← wygenerowany przez `pull`, NIE edytuj ręcznie
    ├── relations.ts           # ← wygenerowany przez `pull`
    ├── 0000_big_stephen_strange.sql   # baseline migration (pull – cały DB)
    ├── 0001_classy_skullbuster.sql    # ⚠️ NIE WYKONUJ – patrz sekcja 5
    └── meta/
        ├── _journal.json      # rejestr wszystkich migracji
        └── 0000_snapshot.json # snapshot stanu DB w momencie pull
```

---

## 2. Stan bazy danych (drizzle-kit pull)

`drizzle-kit pull` połączył się z DB (`localhost:5433`) i zebrał pełny obraz bazy.

### Wykryte tabele (7)

| Tabela                   | Kolumny | Indeksy | FK |
|--------------------------|---------|---------|----|
| `vehicles`               | 5       | 0       | 0  |
| `drivers`                | 7       | 0       | 0  |
| `customers`              | 8       | 2       | 0  |
| `transportation_orders`  | 13      | 2       | 1  |
| `order_timeline_events`  | 7       | 1       | 1  |
| `order_items`            | 7       | 1       | 1  |
| `notifications`          | 6       | 2       | 0  |

**Łącznie:** 53 kolumny, 8 indeksów, 3 klucze obce

### Schemat tabeli `vehicles` (weryfikacja z DB)

```sql
CREATE TABLE "vehicles" (
    "id"                 integer         PRIMARY KEY NOT NULL,
    "make"               varchar(50),
    "model"              varchar(50),
    "year"               integer,
    "fuel_tank_capacity" numeric(5, 1)
);
```

> Snapshot JSON zapisany w `drizzle/meta/0000_snapshot.json`.  
> Plik SQL (zakomentowany) w `drizzle/0000_big_stephen_strange.sql`.

---

## 3. Definicja schematu w Drizzle (`src/db/schema.ts`)

```ts
import { pgTable, integer, varchar, decimal } from 'drizzle-orm/pg-core';

export const vehicles = pgTable('vehicles', {
  id: integer('id').primaryKey(),
  make: varchar('make', { length: 50 }),
  model: varchar('model', { length: 50 }),
  year: integer('year'),
  fuel_tank_capacity: decimal('fuel_tank_capacity', { precision: 5, scale: 1 }),
});

export type Vehicle    = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
```

`$inferSelect` i `$inferInsert` to kluczowe narzędzia type-safety:
- `Vehicle` – typ zwracany przez SELECT (pola nullable = `string | null` itp.)
- `NewVehicle` – typ wejściowy dla INSERT (wszystkie pola opcjonalne oprócz required)

---

## 4. Instancja Drizzle (`src/db/drizzle.ts`)

```ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { pool } from '../database.js';
import * as schema from './schema.js';

export const db = drizzle(pool, { schema });
```

Drizzle **opakowuje istniejący `Pool` z `pg`** – nie tworzy nowego połączenia.  
Dzięki `{ schema }` możliwe jest type-safe relational querying (`db.query.vehicles.findMany()`).

---

## 5. Migracje – komendy i przepływ

### Dostępne skrypty npm

```bash
npm run db:pull      # drizzle-kit pull    – introspekcja DB → snapshot + schema.ts
npm run db:generate  # drizzle-kit generate – różnica schema ↔ snapshot → SQL migration
npm run db:migrate   # drizzle-kit migrate  – aplikuje migracje na bazie
npm run db:push      # drizzle-kit push     – push schema bezpośrednio (bez migration files)
npm run db:studio    # drizzle-kit studio   – lokalne GUI do przeglądania DB
```

### Przepływ: istniejąca baza → Drizzle

```
istniejąca baza
      │
      ▼
npm run db:pull        ← tworzy baseline snapshot (stan "dzień zerowy")
      │
      ▼
edytujesz src/db/schema.ts   ← np. dodajesz kolumnę
      │
      ▼
npm run db:generate    ← generuje SQL z różnicy schema vs snapshot
      │
      ▼
npm run db:migrate     ← aplikuje SQL na bazie
```

---

## 6. ⚠️ Uwaga: `0001_classy_skullbuster.sql`

Ten plik **NIE POWINIEN być wykonany** i istnieje wyłącznie jako materiał edukacyjny.

```sql
-- DANGER: NIE WYKONUJ
DROP TABLE "drivers" CASCADE;
DROP TABLE "customers" CASCADE;
DROP TABLE "transportation_orders" CASCADE;
DROP TABLE "order_timeline_events" CASCADE;
DROP TABLE "order_items" CASCADE;
DROP TABLE "notifications" CASCADE;
```

### Dlaczego tak się stało?

Drizzle Kit działa **code-first**: traktuje `src/db/schema.ts` jako jedyne źródło prawdy.  
Ponieważ nasz schemat deklaruje **tylko tabelę `vehicles`**, a baseline snapshot (z `pull`) zawierał **7 tabel**, `generate` obliczył różnicę i wygenerował usunięcie 6 nieznanych mu tabel.

### Jak temu zapobiec?

**Opcja A – `tablesFilter` (użyta w projekcie)**

W `drizzle.config.ts` dodano:
```ts
tablesFilter: ['vehicles'],
```
Dzięki temu przyszłe wywołania `pull` i `generate` będą brać pod uwagę **tylko tabelę `vehicles`**.  
Kolejne `generate` po tym ustawieniu nie wygeneruje DROP TABLE dla innych tabel.

**Opcja B – zadeklaruj wszystkie tabele w schema.ts**

Jeśli chcesz zarządzać całą bazą przez Drizzle, przenieś zawartość `drizzle/schema.ts`  
(wygenerowanego przez pull) do `src/db/schema.ts` i usuń stary snapshot.

---

## 7. `tablesFilter` – wyjaśnienie

```ts
// drizzle.config.ts
tablesFilter: ['vehicles'],
```

- `pull` – pobierze z DB tylko tabelę `vehicles`
- `generate` – porówna tylko `vehicles` ze snapshotem, ignoruje resztę
- `push` / `migrate` – stosuje zmiany tylko do `vehicles`

Wzorzec ten jest idealny, gdy **stopniowo migrujesz istniejącą bazę do Drizzle** moduł po module.

---

## 8. Snapshot JSON (`drizzle/meta/0000_snapshot.json`)

Snapshot to wewnętrzna reprezentacja schematu używana przez Drizzle Kit do obliczania diff-ów między migracjami. Zawiera:

```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "version": "7",
  "dialect": "postgresql",
  "tables": {
    "public.vehicles": {
      "name": "vehicles",
      "columns": {
        "id":                 { "type": "integer",    "primaryKey": true,  "notNull": true  },
        "make":               { "type": "varchar(50)","primaryKey": false, "notNull": false },
        "model":              { "type": "varchar(50)","primaryKey": false, "notNull": false },
        "year":               { "type": "integer",    "primaryKey": false, "notNull": false },
        "fuel_tank_capacity": { "type": "numeric(5, 1)","primaryKey": false,"notNull": false }
      }
    }
    // … pozostałe 6 tabel z pierwszego pull (bez filtra)
  }
}
```

**Nigdy nie edytuj snapshot ręcznie** – jest zarządzany przez Drizzle Kit.

---

## 9. Type-safety w `vehicles.queries.ts`

Dzięki Drizzle, wszystkie zapytania są w pełni typowane:

```ts
// getVehicles – return type inferowany automatycznie
const rows = await db
  .select({ id: vehicles.id, make: vehicles.make, ... })
  .from(vehicles)
  .orderBy(vehicles.id)
  .limit(params.limit)
  .offset(params.offset);
// rows: { id: number; make: string | null; model: string | null; year: number | null; fuel_tank_capacity: string | null }[]

// getVehicleById – result[0] ma typ Vehicle | undefined
const result = await db.select().from(vehicles).where(eq(vehicles.id, parseInt(id)));

// deleteVehicle – result.rowCount dostępny przez pool.query (pg standard)
const result = await db.delete(vehicles).where(eq(vehicles.id, parseInt(id)));
```

`VehicleDto` w `vehicles.dto.ts` jest teraz aliasem dla `Vehicle` (z `$inferSelect`), co zamyka łańcuch typowania: **DB schema → Drizzle types → HTTP response type**.
