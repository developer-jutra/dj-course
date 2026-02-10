# Quick Start Guide

## 🚀 Szybki start

Aplikacja może działać w **dwóch trybach**. Zobacz pełną dokumentację w [DEVELOPMENT_MODES.md](./DEVELOPMENT_MODES.md)

### Tryb 1: Pełny Docker (Nuxt + MongoDB)

```bash
cd M8/customer-portal
./scripts/start.sh
```

**Dostęp:**
- Frontend: http://localhost:4003
- MongoDB: `mongodb://root:example@localhost:27017/customer_portal?authSource=admin`

### Tryb 2: Hybrydowy (MongoDB w Docker, Nuxt lokalnie) ⚡ Zalecany dla dev

```bash
# Terminal 1 - MongoDB
./scripts/start-mongo-only.sh

# Terminal 2 - Frontend lokalnie
cd cp-frontend
npm run dev:local
```

**Dostęp:**
- Frontend: http://localhost:3000
- MongoDB: `mongodb://root:example@localhost:27017/customer_portal?authSource=admin`

**Zalety trybu hybrydowego:**
- ⚡ Szybszy HMR (Hot Module Replacement)
- 🐛 Łatwiejszy debugging
- 💾 Mniejsze zużycie RAM
- 📦 Szybsze `npm install`

### Sprawdzanie logów

```bash
# Wszystkie logi
./scripts/logs.sh

# Tylko frontend
./scripts/logs.sh frontend

# Tylko MongoDB
./scripts/logs.sh mongo
```

### Reset bazy danych

Jeśli chcesz zresetować bazę danych do początkowego stanu:

```bash
./scripts/reset-db.sh
```

### Zatrzymanie

```bash
docker compose down
```

## 📁 Struktura danych

### Kolekcje MongoDB

W bazie `customer_portal` znajdują się następujące kolekcje:

#### 1. dashboard_stats
Statystyki wyświetlane na dashboardzie:

```json
{
  "name": "Active Shipments",
  "value": "12",
  "iconName": "TruckIcon",
  "color": "text-blue-600"
}
```

#### 2. quick_actions
Szybkie akcje dostępne na dashboardzie:

```json
{
  "name": "New Transportation Request",
  "description": "Book a new shipment",
  "iconName": "TruckIcon",
  "href": "/dashboard/transportation/new"
}
```

#### 3. recent_requests
Ostatnie żądania:

```json
{
  "id": "TR-2024-001",
  "type": "Transportation",
  "status": "In Transit",
  "route": "Warsaw → Berlin",
  "date": "2024-01-15T00:00:00.000Z"
}
```

#### 4. metrics
Metryki ogólne (pojedynczy dokument):

```json
{
  "totalShipments": 156,
  "onTimeDelivery": 94.2,
  "totalCost": 45750,
  "storageVolume": 2340
}
```

#### 5. route_performance
Wydajność poszczególnych tras:

```json
{
  "route": "Warsaw → Berlin",
  "shipments": 45,
  "onTimePercentage": 96,
  "avgCost": 850,
  "totalRevenue": 38250
}
```

## 🔌 API Endpoints

Dostępne endpointy:

- `GET /api/dashboard/stats` - Statystyki dashboardu
- `GET /api/dashboard/quick-actions` - Szybkie akcje
- `GET /api/dashboard/recent-requests` - Ostatnie żądania
- `GET /api/dashboard/metrics` - Metryki ogólne
- `GET /api/dashboard/route-performance` - Wydajność tras

### Przykład użycia

```typescript
// W komponencie Vue
const stats = await $fetch('/api/dashboard/stats')
```

## 🔧 Konfiguracja

### Przełączanie między mockami a MongoDB

W pliku `features/dashboard/composables/useDashboardData.ts` znajdziesz:

```typescript
const USE_MOCKS = false // Set to true to use mocks instead of MongoDB
```

Ustaw na `true` aby używać mocków, lub `false` aby używać danych z MongoDB.

### Zmienne środowiskowe

Aplikacja wymaga zmiennej środowiskowej `MONGODB_URI`:

```bash
# W kontenerze Docker (automatycznie ustawione)
MONGODB_URI=mongodb://root:example@cp-mongodb:27017/customer_portal?authSource=admin

# Lokalnie (poza Dockerem)
MONGODB_URI=mongodb://root:example@localhost:27017/customer_portal?authSource=admin
```

## 🐛 Troubleshooting

### Problem: Brak danych w bazie

**Rozwiązanie:** Zresetuj bazę danych:

```bash
./scripts/reset-db.sh
```

### Problem: Frontend nie może się połączyć z MongoDB

**Sprawdź:**

1. Czy kontenery działają:
```bash
docker compose ps
```

2. Logi frontendu:
```bash
./scripts/logs.sh frontend
```

Powinieneś zobaczyć: `Successfully connected to MongoDB.`

### Problem: Port 27017 zajęty

Jeśli masz już uruchomiony MongoDB na localhost:27017, zmień port w `docker-compose.yml`:

```yaml
ports:
  - "27018:27017"  # Użyj 27018 zamiast 27017
```

## 📊 Połączenie z MongoDB Compass

Możesz użyć MongoDB Compass do przeglądania danych:

**Connection String:**
```
mongodb://root:example@localhost:27017/customer_portal?authSource=admin
```

## 🎯 Następne kroki

1. Sprawdź dostępne API endpoints w przeglądarce
2. Zmodyfikuj dane w MongoDB i zobacz zmiany w aplikacji
3. Dodaj nowe kolekcje zgodnie z potrzebami projektu
4. Przełącz `USE_MOCKS` na `false` w composable aby używać prawdziwych danych

## 📚 Więcej informacji

Zobacz pełną dokumentację w pliku [README.md](./README.md)
