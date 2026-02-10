# Setup Summary - Customer Portal z MongoDB

## ✅ Co zostało utworzone

### 1. Docker Compose Configuration
**Plik:** `docker-compose.yml`

Skonfigurowane serwisy:
- **cp-mongodb** - kontener MongoDB 7.0.16
  - Port: 27017
  - Credentials: root/example
  - Baza: customer_portal
  - Wolumen: cp-mongodb_data
  - Init script: mongodb/cp/init-db.js

- **cp** - kontener Nuxt.js frontend
  - Port: 4003 (mapowany na 3000 wewnątrz kontenera)
  - Build context: ./cp-frontend
  - Połączenie z MongoDB: `MONGODB_URI` environment variable

### 2. MongoDB Initialization Script
**Plik:** `mongodb/cp/init-db.js`

Tworzy i wypełnia kolekcje:
- `dashboard_stats` - 4 dokumenty (statystyki)
- `quick_actions` - 3 dokumenty (szybkie akcje)
- `recent_requests` - 3 dokumenty (ostatnie żądania)
- `metrics` - 1 dokument (metryki ogólne)
- `route_performance` - 5 dokumentów (wydajność tras)

Dane w kolekcjach odpowiadają strukturze z:
- `features/dashboard/dashboard.mocks.ts`
- `features/dashboard/dashboard.model.ts`

### 3. Nuxt Configuration
**Zmiany w:** `cp-frontend/nuxt.config.ts`

Dodano:
```typescript
runtimeConfig: {
  mongodbUri: process.env.MONGODB_URI
}
```

### 4. MongoDB Connection Plugin
**Plik:** `cp-frontend/server/plugins/mongodb.ts`

- Używa Mongoose ODM
- Nawiązuje połączenie przy starcie serwera Nitro
- Automatyczne zarządzanie connection pool
- Loguje sukces/błędy połączenia

### 5. Mongoose Models
**Katalog:** `cp-frontend/server/models/`

Utworzone modele:
- `DashboardStat.ts`
- `QuickAction.ts`
- `RecentRequest.ts`
- `Metrics.ts`
- `RoutePerformance.ts`

Każdy model:
- Definiuje interfejs TypeScript
- Definiuje schemat Mongoose
- Używa wzorca Singleton (unika duplikowania modeli przy HMR)
- Ma timestamps (createdAt, updatedAt)

### 6. API Endpoints
**Katalog:** `cp-frontend/server/api/dashboard/`

Utworzone endpointy:
- `stats.get.ts` - GET /api/dashboard/stats
- `quick-actions.get.ts` - GET /api/dashboard/quick-actions
- `recent-requests.get.ts` - GET /api/dashboard/recent-requests
- `metrics.get.ts` - GET /api/dashboard/metrics
- `route-performance.get.ts` - GET /api/dashboard/route-performance

Każdy endpoint:
- Pobiera dane z MongoDB przez Mongoose
- Obsługuje błędy
- Zwraca clean data (bez __v, timestamps w response)

### 7. Icon Mapper Utility
**Plik:** `cp-frontend/server/utils/iconMapper.ts`

Mapuje nazwy ikon z MongoDB (string) na komponenty Vue (HeroIcons).

### 8. Dashboard Composable
**Plik:** `cp-frontend/features/dashboard/composables/useDashboardData.ts`

- Unified API do pobierania danych dashboard
- Przełącznik `USE_MOCKS` (true/false)
- Mapowanie ikon z stringów na komponenty
- Kompatybilny z istniejącymi interfejsami

### 9. Helper Scripts
**Katalog:** `scripts/`

- `start.sh` - Uruchamia cały stack, pokazuje status
- `start-mongo-only.sh` - Uruchamia tylko MongoDB (przydatne do lokalnego dev frontendu)
- `reset-db.sh` - Resetuje bazę danych do stanu początkowego
- `logs.sh` - Pokazuje logi (wszystkie/frontend/mongo)

### 10. Documentation
**Pliki:**
- `README.md` - Pełna dokumentacja projektu
- `QUICK_START.md` - Szybki start guide
- `.env.example` - Przykładowa konfiguracja env variables
- `.gitignore` - Ignorowanie plików (env, logs, etc.)

## 🎯 Jak używać

### Quick Start - Cały stack

```bash
cd M8/customer-portal
./scripts/start.sh
```

Otwórz: http://localhost:4003

### Tylko MongoDB (frontend lokalnie)

```bash
# Terminal 1 - MongoDB w Docker
./scripts/start-mongo-only.sh

# Terminal 2 - Frontend lokalnie
cd cp-frontend
export MONGODB_URI=mongodb://root:example@localhost:27017/customer_portal?authSource=admin
npm run dev
```

Otwórz: http://localhost:3000

### Przełączanie między mockami a MongoDB

W pliku `features/dashboard/composables/useDashboardData.ts`:

```typescript
const USE_MOCKS = false  // MongoDB
const USE_MOCKS = true   // Mocks
```

### Testowanie API

```bash
# Stats
curl http://localhost:4003/api/dashboard/stats

# Metrics
curl http://localhost:4003/api/dashboard/metrics

# Recent Requests
curl http://localhost:4003/api/dashboard/recent-requests

# Route Performance
curl http://localhost:4003/api/dashboard/route-performance

# Quick Actions
curl http://localhost:4003/api/dashboard/quick-actions
```

## 📊 Struktura danych

### Schemat kolekcji vs. Frontend Models

| MongoDB Collection | Frontend Model | Server Model | API Endpoint |
|-------------------|----------------|--------------|--------------|
| dashboard_stats | DashboardStat | DashboardStat.ts | /api/dashboard/stats |
| quick_actions | QuickAction | QuickAction.ts | /api/dashboard/quick-actions |
| recent_requests | RecentRequest | RecentRequest.ts | /api/dashboard/recent-requests |
| metrics | Metrics | Metrics.ts | /api/dashboard/metrics |
| route_performance | RoutePerformance | RoutePerformance.ts | /api/dashboard/route-performance |

### Różnice: MongoDB vs. Frontend

**MongoDB (init-db.js):**
```javascript
{
  iconName: "TruckIcon"  // String
}
```

**Frontend (dashboard.mocks.ts):**
```typescript
{
  icon: TruckIcon  // Vue Component
}
```

**Rozwiązanie:** `useDashboardData.ts` mapuje `iconName` → `icon`

## 🔧 Architektura

```
┌─────────────────────────────────────────────────┐
│            Frontend (Nuxt.js)                   │
│  ┌──────────────────────────────────────────┐   │
│  │  features/dashboard/                     │   │
│  │  ├── composables/useDashboardData.ts     │   │
│  │  ├── dashboard.model.ts                  │   │
│  │  └── dashboard.mocks.ts                  │   │
│  └──────────────────────────────────────────┘   │
│                      ↓                           │
│  ┌──────────────────────────────────────────┐   │
│  │  server/api/dashboard/*.get.ts           │   │
│  └──────────────────────────────────────────┘   │
│                      ↓                           │
│  ┌──────────────────────────────────────────┐   │
│  │  server/models/*.ts (Mongoose)           │   │
│  └──────────────────────────────────────────┘   │
│                      ↓                           │
│  ┌──────────────────────────────────────────┐   │
│  │  server/plugins/mongodb.ts               │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│            MongoDB (cp-mongodb)                 │
│  ┌──────────────────────────────────────────┐   │
│  │  customer_portal database                │   │
│  │  ├── dashboard_stats                     │   │
│  │  ├── quick_actions                       │   │
│  │  ├── recent_requests                     │   │
│  │  ├── metrics                             │   │
│  │  └── route_performance                   │   │
│  └──────────────────────────────────────────┘   │
│                      ↑                           │
│  ┌──────────────────────────────────────────┐   │
│  │  mongodb/cp/init-db.js                   │   │
│  │  (runs once on first start)              │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

## 🚀 Następne kroki

### 1. Integracja z komponentami Vue

W komponentach dashboard użyj composable:

```vue
<script setup lang="ts">
import { useDashboardData } from '~/features/dashboard/composables/useDashboardData'

const { fetchDashboardStats, fetchMetrics } = useDashboardData()

const stats = await fetchDashboardStats()
const metrics = await fetchMetrics()
</script>
```

### 2. Dodanie nowych kolekcji

1. Stwórz model w `server/models/YourModel.ts`
2. Dodaj dane w `mongodb/cp/init-db.js`
3. Stwórz endpoint w `server/api/your-endpoint.get.ts`
4. Dodaj funkcję w composable (jeśli potrzebna)

### 3. Użycie z @tanstack/vue-query

```typescript
import { useQuery } from '@tanstack/vue-query'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => $fetch('/api/dashboard/stats')
  })
}
```

### 4. Dodanie mutacji

Stwórz POST endpoint:

```typescript
// server/api/dashboard/stats.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const newStat = await DashboardStat.create(body)
  return newStat
})
```

## 🎓 Zgodność z Vertical Slices Architecture (VSA)

Setup jest zgodny z VSA:

✅ Feature `dashboard` ma własne:
- Models (`dashboard.model.ts`)
- Mocks (`dashboard.mocks.ts`)
- Composables (`composables/useDashboardData.ts`)
- Components (Vue files)

✅ Server-side code jest oddzielony:
- Models w `server/models/`
- API w `server/api/dashboard/`
- Utilities w `server/utils/`

✅ Brak barrel files (index.ts)

✅ Każda funkcja API jest osobnym plikiem

## 📝 Checklist

- [x] Docker Compose z MongoDB i Nuxt
- [x] MongoDB init script z seed data
- [x] Mongoose models dla wszystkich kolekcji
- [x] API endpoints dla wszystkich kolekcji
- [x] Nuxt plugin dla połączenia MongoDB
- [x] Composable do pobierania danych
- [x] Icon mapper dla Vue components
- [x] Helper scripts (start, start-mongo-only, reset, logs, verify)
- [x] Dokumentacja (README, QUICK_START, COMMANDS)
- [x] .env.example
- [x] .gitignore

## ✨ Gotowe do użycia!

Cały setup jest gotowy. Możesz rozpocząć development uruchamiając:

```bash
./scripts/start.sh
```
