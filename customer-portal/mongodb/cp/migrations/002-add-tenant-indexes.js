// =============================================================================
// Migracja 002 - add-tenant-indexes
// -----------------------------------------------------------------------------
// Dodaje złożone indeksy tenantowe na kolekcjach zleceń. Portal klienta jest
// multi-tenant: praktycznie każde zapytanie zalogowanego użytkownika filtruje po
// `companyId`, a listy zleceń sortuje po `createdAt` malejąco. Dziś te zapytania
// idą przez `COLLSCAN` (indeks `createdAt_-1` daje tylko kolejność sortowania,
// ale i tak bada wszystkie dokumenty i filtruje companyId/status po fetchu).
//
// Indeks (reguła ESR - Equality, Sort, Range):
//   { companyId: 1, status: 1, createdAt: -1 }
//     E -> companyId  (równość: filtr tenanta)
//     E -> status     (równość: 'moje aktywne / zakończone zlecenia')
//     S -> createdAt  (sortowanie 'najnowsze pierwsze')
//
// Pokrywa: "zlecenia mojej firmy" oraz "zlecenia mojej firmy w statusie X,
// od najnowszych". Prefiks { companyId } obsługuje też sam filtr po firmie.
//
// Idempotentna: createIndex jest no-op gdy indeks o tym samym kluczu już istnieje
// (≈ CREATE INDEX IF NOT EXISTS). Bezpieczna do wielokrotnego uruchomienia.
//
// Użycie:
//   docker exec -i cp-mongodb-container mongosh -u root -p example \
//     --authenticationDatabase admin < 002-add-tenant-indexes.js
// =============================================================================

db = db.getSiblingDB('customer_portal');

print('=== Migration 002-add-tenant-indexes: START ===');

// --- Helper ------------------------------------------------------------------

// Tworzy indeks i loguje wynik. createIndex jest idempotentny - powtórne
// wywołanie z tym samym kluczem nic nie zmienia.
function ensureIndex(collName, key) {
  const name = db.getCollection(collName).createIndex(key);
  print('  [INDEX ] ' + collName + ' <- ' + JSON.stringify(key) + ' (' + name + ')');
}

// --- Indeksy tenantowe -------------------------------------------------------

ensureIndex('transportation_requests', { companyId: 1, status: 1, createdAt: -1 });
ensureIndex('warehousing_requests',    { companyId: 1, status: 1, createdAt: -1 });

// --- Podsumowanie ------------------------------------------------------------

print('--- stan po migracji ---');
['transportation_requests', 'warehousing_requests'].forEach(function (c) {
  print('  ' + c + ': ' + db.getCollection(c).getIndexes().length + ' indeksów');
});

print('=== Migration 002-add-tenant-indexes: DONE ===');
