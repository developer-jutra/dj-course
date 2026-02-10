# Zapytania MongoDB - Transportation i Warehousing Requests

## Transportation Requests (kolekcja: `transportation_requests`)

### 1. Podstawowe filtrowanie po statusie
```javascript
db.transportation_requests.find({
  status: "IN_PROGRESS"
})
```

### 2. Filtrowanie po priorytecie
```javascript
db.transportation_requests.find({
  priority: "URGENT"
})
```

### 3. Filtrowanie po typie usługi
```javascript
db.transportation_requests.find({
  serviceType: "EXPRESS_DELIVERY"
})
```

### 4. Filtrowanie po dacie odbioru (zakres dat)
```javascript
db.transportation_requests.find({
  requestedPickupDate: {
    $gte: ISODate("2024-01-01T00:00:00Z"),
    $lte: ISODate("2024-12-31T23:59:59Z")
  }
})
```

### 5. Filtrowanie po dacie dostawy
```javascript
db.transportation_requests.find({
  requestedDeliveryDate: {
    $gte: ISODate("2024-01-01T00:00:00Z")
  }
})
```

### 6. Filtrowanie po wymaganiu ubezpieczenia
```javascript
db.transportation_requests.find({
  requiresInsurance: true
})
```

### 7. Filtrowanie po wymaganiu odprawy celnej
```javascript
db.transportation_requests.find({
  requiresCustomsClearance: true
})
```

### 8. Filtrowanie po typie ładunku
```javascript
db.transportation_requests.find({
  "cargo.cargoType": "HAZARDOUS"
})
```

### 9. Filtrowanie po wadze ładunku (minimalna waga)
```javascript
db.transportation_requests.find({
  "cargo.weight": { $gte: 1000 }
})
```

### 10. Filtrowanie po wartości ładunku
```javascript
db.transportation_requests.find({
  "cargo.value": { $gte: 10000 }
})
```

### 11. Filtrowanie po fragilności ładunku
```javascript
db.transportation_requests.find({
  "cargo.fragile": true
})
```

### 12. Filtrowanie po typie pojazdu
```javascript
db.transportation_requests.find({
  "vehicleRequirements.vehicleType": "REFRIGERATED"
})
```

### 13. Filtrowanie po lokalizacji odbioru (miasto)
```javascript
db.transportation_requests.find({
  "pickupLocation.address.city": "Warsaw"
})
```

### 14. Filtrowanie po lokalizacji dostawy (kraj)
```javascript
db.transportation_requests.find({
  "deliveryLocation.address.country": "Poland"
})
```

### 15. Filtrowanie po numerze śledzenia
```javascript
db.transportation_requests.find({
  trackingNumber: { $exists: true, $ne: null }
})
```

### 16. Filtrowanie po przypisaniu do użytkownika
```javascript
db.transportation_requests.find({
  assignedTo: "user123"
})
```

### 17. Filtrowanie po ID firmy
```javascript
db.transportation_requests.find({
  companyId: "company456"
})
```

### 18. Filtrowanie po koszcie (szacowany koszt)
```javascript
db.transportation_requests.find({
  estimatedCost: { $gte: 1000, $lte: 5000 }
})
```

### 19. Filtrowanie po finalnym koszcie
```javascript
db.transportation_requests.find({
  finalCost: { $exists: true, $ne: null }
})
```

### 20. Złożone zapytanie - wiele warunków (AND)
```javascript
db.transportation_requests.find({
  status: { $in: ["IN_PROGRESS", "IN_TRANSIT"] },
  priority: "HIGH",
  "cargo.fragile": true,
  requiresInsurance: true
})
```

### 21. Filtrowanie po statusie (OR)
```javascript
db.transportation_requests.find({
  $or: [
    { status: "DELIVERED" },
    { status: "COMPLETED" }
  ]
})
```

### 22. Filtrowanie po dacie utworzenia
```javascript
db.transportation_requests.find({
  createdAt: {
    $gte: ISODate("2024-01-01T00:00:00Z"),
    $lte: ISODate("2024-12-31T23:59:59Z")
  }
})
```

### 23. Filtrowanie po dacie aktualizacji
```javascript
db.transportation_requests.find({
  updatedAt: {
    $gte: ISODate("2024-01-01T00:00:00Z")
  }
})
```

### 24. Filtrowanie po klasie niebezpieczeństwa
```javascript
db.transportation_requests.find({
  "cargo.hazardousClass": { $exists: true }
})
```

### 25. Filtrowanie po wymaganiach temperaturowych
```javascript
db.transportation_requests.find({
  "cargo.temperatureRequirements": { $exists: true }
})
```

---

## Warehousing Requests (kolekcja: `warehousing_requests`)

### 1. Podstawowe filtrowanie po statusie
```javascript
db.warehousing_requests.find({
  status: "IN_STORAGE"
})
```

### 2. Filtrowanie po priorytecie
```javascript
db.warehousing_requests.find({
  priority: "HIGH"
})
```

### 3. Filtrowanie po typie magazynu
```javascript
db.warehousing_requests.find({
  storageType: "REFRIGERATED"
})
```

### 4. Filtrowanie po poziomie bezpieczeństwa
```javascript
db.warehousing_requests.find({
  securityLevel: "MAXIMUM"
})
```

### 5. Filtrowanie po planowanej dacie rozpoczęcia (zakres dat)
```javascript
db.warehousing_requests.find({
  plannedStartDate: {
    $gte: ISODate("2024-01-01T00:00:00Z"),
    $lte: ISODate("2024-12-31T23:59:59Z")
  }
})
```

### 6. Filtrowanie po planowanej dacie zakończenia
```javascript
db.warehousing_requests.find({
  plannedEndDate: {
    $gte: ISODate("2024-01-01T00:00:00Z")
  }
})
```

### 7. Filtrowanie po wymaganiu kontroli temperatury
```javascript
db.warehousing_requests.find({
  requiresTemperatureControl: true
})
```

### 8. Filtrowanie po wymaganiu kontroli wilgotności
```javascript
db.warehousing_requests.find({
  requiresHumidityControl: true
})
```

### 9. Filtrowanie po wymaganiu specjalnej obsługi
```javascript
db.warehousing_requests.find({
  requiresSpecialHandling: true
})
```

### 10. Filtrowanie po szacowanej objętości
```javascript
db.warehousing_requests.find({
  estimatedVolume: { $gte: 100 }
})
```

### 11. Filtrowanie po szacowanej wadze
```javascript
db.warehousing_requests.find({
  estimatedWeight: { $gte: 5000 }
})
```

### 12. Filtrowanie po typie ładunku
```javascript
db.warehousing_requests.find({
  "cargo.cargoType": "PERISHABLE"
})
```

### 13. Filtrowanie po statusie inwentarza
```javascript
db.warehousing_requests.find({
  inventoryStatus: "IN_STORAGE"
})
```

### 14. Filtrowanie po lokalizacji magazynu
```javascript
db.warehousing_requests.find({
  storageLocation: { $exists: true, $ne: null }
})
```

### 15. Filtrowanie po typie rozliczenia
```javascript
db.warehousing_requests.find({
  billingType: "MONTHLY"
})
```

### 16. Filtrowanie po usługach obsługi (zawiera)
```javascript
db.warehousing_requests.find({
  handlingServices: { $in: ["LOADING", "UNLOADING"] }
})
```

### 17. Filtrowanie po usługach dodatkowych
```javascript
db.warehousing_requests.find({
  valueAddedServices: { $in: ["LABELING", "QUALITY_CONTROL"] }
})
```

### 18. Filtrowanie po przypisaniu do użytkownika
```javascript
db.warehousing_requests.find({
  assignedTo: "user123"
})
```

### 19. Filtrowanie po ID firmy
```javascript
db.warehousing_requests.find({
  companyId: "company456"
})
```

### 20. Filtrowanie po koszcie (szacowany koszt)
```javascript
db.warehousing_requests.find({
  estimatedCost: { $gte: 500, $lte: 2000 }
})
```

### 21. Filtrowanie po finalnym koszcie
```javascript
db.warehousing_requests.find({
  finalCost: { $exists: true, $ne: null }
})
```

### 22. Filtrowanie po czasie przechowywania (wartość)
```javascript
db.warehousing_requests.find({
  "estimatedStorageDuration.value": { $gte: 30 }
})
```

### 23. Filtrowanie po jednostce czasu przechowywania
```javascript
db.warehousing_requests.find({
  "estimatedStorageDuration.unit": "months"
})
```

### 24. Filtrowanie po wadze ładunku
```javascript
db.warehousing_requests.find({
  "cargo.weight": { $gte: 1000 }
})
```

### 25. Filtrowanie po fragilności ładunku
```javascript
db.warehousing_requests.find({
  "cargo.fragile": true
})
```

### 26. Złożone zapytanie - wiele warunków (AND)
```javascript
db.warehousing_requests.find({
  status: "IN_STORAGE",
  storageType: "REFRIGERATED",
  requiresTemperatureControl: true,
  securityLevel: "HIGH"
})
```

### 27. Filtrowanie po statusie (OR)
```javascript
db.warehousing_requests.find({
  $or: [
    { status: "STORED" },
    { status: "IN_STORAGE" }
  ]
})
```

### 28. Filtrowanie po dacie utworzenia
```javascript
db.warehousing_requests.find({
  createdAt: {
    $gte: ISODate("2024-01-01T00:00:00Z"),
    $lte: ISODate("2024-12-31T23:59:59Z")
  }
})
```

### 29. Filtrowanie po dacie aktualizacji
```javascript
db.warehousing_requests.find({
  updatedAt: {
    $gte: ISODate("2024-01-01T00:00:00Z")
  }
})
```

### 30. Filtrowanie po klasie niebezpieczeństwa
```javascript
db.warehousing_requests.find({
  "cargo.hazardousClass": { $exists: true }
})
```

---

## Zaawansowane zapytania - obie kolekcje

### 1. Agregacja - liczba requestów po statusie (Transportation)
```javascript
db.transportation_requests.aggregate([
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 }
    }
  },
  {
    $sort: { count: -1 }
  }
])
```

### 2. Agregacja - liczba requestów po statusie (Warehousing)
```javascript
db.warehousing_requests.aggregate([
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 }
    }
  },
  {
    $sort: { count: -1 }
  }
])
```

### 3. Agregacja - średni koszt po priorytecie (Transportation)
```javascript
db.transportation_requests.aggregate([
  {
    $match: {
      estimatedCost: { $exists: true, $ne: null }
    }
  },
  {
    $group: {
      _id: "$priority",
      avgCost: { $avg: "$estimatedCost" },
      count: { $sum: 1 }
    }
  }
])
```

### 4. Agregacja - średni koszt po typie magazynu (Warehousing)
```javascript
db.warehousing_requests.aggregate([
  {
    $match: {
      estimatedCost: { $exists: true, $ne: null }
    }
  },
  {
    $group: {
      _id: "$storageType",
      avgCost: { $avg: "$estimatedCost" },
      count: { $sum: 1 }
    }
  }
])
```

### 5. Znajdź requesty wymagające specjalnej obsługi (Transportation)
```javascript
db.transportation_requests.find({
  $or: [
    { "cargo.fragile": true },
    { "cargo.hazardousClass": { $exists: true } },
    { "cargo.temperatureRequirements": { $exists: true } }
  ]
})
```

### 6. Znajdź requesty wymagające specjalnej obsługi (Warehousing)
```javascript
db.warehousing_requests.find({
  $or: [
    { requiresTemperatureControl: true },
    { requiresHumidityControl: true },
    { requiresSpecialHandling: true },
    { "cargo.fragile": true }
  ]
})
```

### 7. Sortowanie i limitowanie wyników (Transportation)
```javascript
db.transportation_requests.find({})
  .sort({ createdAt: -1 })
  .limit(10)
```

### 8. Sortowanie i limitowanie wyników (Warehousing)
```javascript
db.warehousing_requests.find({})
  .sort({ createdAt: -1 })
  .limit(10)
```

### 9. Projektowanie wybranych pól (Transportation)
```javascript
db.transportation_requests.find(
  { status: "IN_PROGRESS" },
  {
    requestNumber: 1,
    status: 1,
    priority: 1,
    requestedPickupDate: 1,
    requestedDeliveryDate: 1,
    estimatedCost: 1
  }
)
```

### 10. Projektowanie wybranych pól (Warehousing)
```javascript
db.warehousing_requests.find(
  { status: "IN_STORAGE" },
  {
    requestNumber: 1,
    status: 1,
    priority: 1,
    storageType: 1,
    plannedStartDate: 1,
    estimatedCost: 1
  }
)
```

---

## Dostępne wartości enum

### RequestStatus
- DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED
- IN_PROGRESS, PICKUP_SCHEDULED, PICKED_UP, IN_TRANSIT
- ARRIVED_AT_TERMINAL, OUT_FOR_DELIVERY, DELIVERED, STORED
- COMPLETED, CANCELLED, ON_HOLD

### Priority
- LOW, NORMAL, HIGH, URGENT

### TransportServiceType
- FULL_TRUCKLOAD, LESS_THAN_TRUCKLOAD, EXPRESS_DELIVERY
- OVERSIZED_CARGO, HAZARDOUS_MATERIALS

### StorageType
- AMBIENT, REFRIGERATED, FROZEN, CLIMATE_CONTROLLED
- HAZARDOUS, SECURE

### SecurityLevel
- STANDARD, HIGH, MAXIMUM

### InventoryStatus
- PENDING_ARRIVAL, RECEIVED, IN_STORAGE, PICKED, DISPATCHED

### BillingType
- MONTHLY, DAILY, PER_UNIT, PER_PALLET

### CargoType
- GENERAL_CARGO, BULK_DRY, BULK_LIQUID, CONTAINERIZED
- BREAK_BULK, HAZARDOUS, OVERSIZED, PERISHABLE, VALUABLE
