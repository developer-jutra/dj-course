// =============================================================================
// Migracja 001 - add-portal-entities
// -----------------------------------------------------------------------------
// Sprowadza istniejącą bazę `customer_portal` do stanu oczekiwanego z init-db.js,
// dodając 4 kolekcje (companies, users, notifications, invoices) wraz ze
// schematami walidacji i indeksami. NIE wymazuje wolumenu - w przeciwieństwie do
// init-db.js (uruchamianego tylko na świeżym wolumenie) działa na żywej bazie.
//
// Idempotentna: bezpieczna do wielokrotnego uruchomienia.
//   - kolekcja nie istnieje -> createCollection z walidatorem  (≈ CREATE TABLE)
//   - kolekcja istnieje      -> collMod aktualizuje walidator   (≈ ALTER TABLE)
//   - dane wstawiane tylko gdy kolekcja pusta                   (≈ INSERT ... WHERE NOT EXISTS)
//   - createIndex jest no-op gdy indeks już istnieje            (≈ CREATE INDEX IF NOT EXISTS)
//
// Użycie:
//   docker exec -i cp-mongodb-container mongosh -u root -p example \
//     --authenticationDatabase admin < 001-add-portal-entities.js
// =============================================================================

db = db.getSiblingDB('customer_portal');

print('=== Migration 001-add-portal-entities: START ===');

// --- Helpery -----------------------------------------------------------------

// Tworzy kolekcję z walidatorem lub - jeśli istnieje - aktualizuje walidator.
function ensureCollection(name, validator) {
  const exists = db.getCollectionNames().includes(name);
  if (!exists) {
    db.createCollection(name, {
      validator: validator,
      validationLevel: 'moderate',
      validationAction: 'error'
    });
    print('  [CREATE] kolekcja ' + name + ' utworzona z walidatorem');
  } else {
    db.runCommand({
      collMod: name,
      validator: validator,
      validationLevel: 'moderate',
      validationAction: 'error'
    });
    print('  [ALTER ] kolekcja ' + name + ' - walidator zaktualizowany');
  }
}

// Wstawia dane tylko gdy kolekcja jest pusta (chroni przed duplikatami).
function seedIfEmpty(name, docs) {
  const count = db.getCollection(name).countDocuments();
  if (count === 0) {
    db.getCollection(name).insertMany(docs);
    print('  [SEED  ] ' + name + ': wstawiono ' + docs.length + ' dok.');
  } else {
    print('  [SKIP  ] ' + name + ': już zawiera ' + count + ' dok. - pomijam seed');
  }
}

// --- companies ---------------------------------------------------------------

ensureCollection('companies', {
  $jsonSchema: {
    bsonType: 'object',
    required: ['id', 'name', 'taxId', 'isActive', 'createdAt'],
    properties: {
      id: { bsonType: 'string' },
      name: { bsonType: 'string' },
      taxId: { bsonType: 'string' },
      industry: { bsonType: 'string' },
      accountTier: { enum: ['STANDARD', 'PREMIUM', 'ENTERPRISE'] },
      isActive: { bsonType: 'bool' },
      createdAt: { bsonType: 'date' }
    }
  }
});

seedIfEmpty('companies', [
  { id: '1', name: 'Deliveroo Logistics Sp. z o.o.', taxId: 'PL1234567890', industry: 'AUTOMOTIVE', accountTier: 'ENTERPRISE', address: { city: 'Warsaw', country: 'Poland', street: 'ul. Logistyczna 123', postalCode: '00-001' }, contactEmail: 'office@deliveroo-logistics.example', contactPhone: '+48123456789', isActive: true, createdAt: new Date('2023-06-01') },
  { id: '2', name: 'NordFresh Foods AB', taxId: 'SE556677889901', industry: 'FOOD_AND_BEVERAGE', accountTier: 'STANDARD', address: { city: 'Stockholm', country: 'Sweden', street: 'Hamngatan 12', postalCode: '111 47' }, contactEmail: 'logistics@nordfresh.example', contactPhone: '+46812345678', isActive: true, createdAt: new Date('2023-09-15') },
  { id: '3', name: 'MediPharm GmbH', taxId: 'DE811569876', industry: 'PHARMACEUTICAL', accountTier: 'PREMIUM', address: { city: 'Berlin', country: 'Germany', street: 'Hauptstraße 456', postalCode: '10115' }, contactEmail: 'supply@medipharm.example', contactPhone: '+49123456789', isActive: false, createdAt: new Date('2024-01-05') }
]);

db.companies.createIndex({ id: 1 }, { unique: true });
db.companies.createIndex({ taxId: 1 }, { unique: true });
db.companies.createIndex({ accountTier: 1 });

// --- users -------------------------------------------------------------------

ensureCollection('users', {
  $jsonSchema: {
    bsonType: 'object',
    required: ['id', 'companyId', 'email', 'role', 'isActive'],
    properties: {
      id: { bsonType: 'string' },
      companyId: { bsonType: 'string' },
      email: { bsonType: 'string', pattern: '^.+@.+\\..+$' },
      firstName: { bsonType: 'string' },
      lastName: { bsonType: 'string' },
      role: { enum: ['ADMIN', 'OPERATOR', 'VIEWER'] },
      isActive: { bsonType: 'bool' }
    }
  }
});

seedIfEmpty('users', [
  { id: '1', companyId: '1', email: 'john.doe@deliveroo-logistics.example', firstName: 'John', lastName: 'Doe', role: 'ADMIN', isActive: true, lastLoginAt: new Date('2024-01-18T07:45:00'), createdAt: new Date('2023-06-01') },
  { id: '2', companyId: '1', email: 'anna.kowalski@deliveroo-logistics.example', firstName: 'Anna', lastName: 'Kowalski', role: 'OPERATOR', isActive: true, lastLoginAt: new Date('2024-01-17T12:30:00'), createdAt: new Date('2023-07-12') },
  { id: '3', companyId: '2', email: 'erik.lindberg@nordfresh.example', firstName: 'Erik', lastName: 'Lindberg', role: 'VIEWER', isActive: true, lastLoginAt: new Date('2024-01-16T09:10:00'), createdAt: new Date('2023-09-15') }
]);

db.users.createIndex({ id: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ companyId: 1 });

// --- notifications -----------------------------------------------------------

ensureCollection('notifications', {
  $jsonSchema: {
    bsonType: 'object',
    required: ['userId', 'type', 'title', 'isRead', 'createdAt'],
    properties: {
      userId: { bsonType: 'string' },
      type: { bsonType: 'string' },
      title: { bsonType: 'string' },
      message: { bsonType: 'string' },
      relatedRequest: { bsonType: 'string' },
      severity: { enum: ['INFO', 'SUCCESS', 'WARNING', 'ERROR'] },
      isRead: { bsonType: 'bool' },
      createdAt: { bsonType: 'date' }
    }
  }
});

seedIfEmpty('notifications', [
  { userId: '1', type: 'STATUS_UPDATE', title: 'Shipment in transit', message: 'TR-2024-001 (Warsaw → Berlin) is now in transit.', relatedRequest: 'TR-2024-001', severity: 'INFO', isRead: false, createdAt: new Date('2024-01-15T14:00:00') },
  { userId: '1', type: 'STATUS_UPDATE', title: 'Shipment delivered', message: 'TR-2024-002 (Krakow → Vienna) was delivered ahead of schedule.', relatedRequest: 'TR-2024-002', severity: 'SUCCESS', isRead: true, createdAt: new Date('2024-01-13T09:05:00') },
  { userId: '2', type: 'WAREHOUSING', title: 'Cargo received', message: 'WH-2024-002 cargo received at Cold Storage B-5.', relatedRequest: 'WH-2024-002', severity: 'INFO', isRead: false, createdAt: new Date('2024-01-18T15:05:00') },
  { userId: '3', type: 'BILLING', title: 'New invoice issued', message: 'Invoice INV-2024-002 for WH-2024-002 has been issued.', relatedRequest: 'WH-2024-002', severity: 'WARNING', isRead: false, createdAt: new Date('2024-01-19T08:00:00') }
]);

db.notifications.createIndex({ userId: 1, createdAt: -1 });
db.notifications.createIndex({ isRead: 1 });
db.notifications.createIndex({ relatedRequest: 1 });

// --- invoices ----------------------------------------------------------------

ensureCollection('invoices', {
  $jsonSchema: {
    bsonType: 'object',
    required: ['invoiceNumber', 'companyId', 'status', 'currency', 'total'],
    properties: {
      invoiceNumber: { bsonType: 'string' },
      companyId: { bsonType: 'string' },
      relatedRequest: { bsonType: 'string' },
      type: { enum: ['TRANSPORTATION', 'WAREHOUSING'] },
      status: { enum: ['DRAFT', 'ISSUED', 'PAID', 'OVERDUE', 'CANCELLED'] },
      currency: { bsonType: 'string' },
      total: { bsonType: ['double', 'int'] }
    }
  }
});

seedIfEmpty('invoices', [
  { invoiceNumber: 'INV-2024-001', companyId: '1', relatedRequest: 'TR-2024-002', type: 'TRANSPORTATION', status: 'PAID', currency: 'EUR', lineItems: [ { description: 'Express delivery Krakow → Vienna', quantity: 1, unitPrice: 720, amount: 720 }, { description: 'Cargo insurance', quantity: 1, unitPrice: 95, amount: 95 } ], subtotal: 815, taxRate: 0.23, taxAmount: 187.45, total: 1002.45, issueDate: new Date('2024-01-13'), dueDate: new Date('2024-01-27'), paidAt: new Date('2024-01-20') },
  { invoiceNumber: 'INV-2024-002', companyId: '1', relatedRequest: 'WH-2024-002', type: 'WAREHOUSING', status: 'ISSUED', currency: 'EUR', lineItems: [ { description: 'Refrigerated storage (14 days)', quantity: 14, unitPrice: 35, amount: 490 }, { description: 'Quality control service', quantity: 1, unitPrice: 120, amount: 120 } ], subtotal: 610, taxRate: 0.23, taxAmount: 140.3, total: 750.3, issueDate: new Date('2024-01-19'), dueDate: new Date('2024-02-02'), paidAt: null },
  { invoiceNumber: 'INV-2024-003', companyId: '3', relatedRequest: 'WH-2024-003', type: 'WAREHOUSING', status: 'OVERDUE', currency: 'EUR', lineItems: [ { description: 'Climate-controlled storage (1 month)', quantity: 1, unitPrice: 1850, amount: 1850 }, { description: 'Maximum security surcharge', quantity: 1, unitPrice: 400, amount: 400 } ], subtotal: 2250, taxRate: 0.19, taxAmount: 427.5, total: 2677.5, issueDate: new Date('2024-01-22'), dueDate: new Date('2024-02-05'), paidAt: null }
]);

db.invoices.createIndex({ invoiceNumber: 1 }, { unique: true });
db.invoices.createIndex({ companyId: 1 });
db.invoices.createIndex({ status: 1 });
db.invoices.createIndex({ dueDate: 1 });

// --- Podsumowanie ------------------------------------------------------------

print('--- stan po migracji ---');
['companies', 'users', 'notifications', 'invoices'].forEach(function (c) {
  print('  ' + c + ': ' + db.getCollection(c).countDocuments() + ' dok., '
    + db.getCollection(c).getIndexes().length + ' indeksów');
});

print('=== Migration 001-add-portal-entities: DONE ===');
