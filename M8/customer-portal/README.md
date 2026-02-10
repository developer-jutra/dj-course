# Customer Portal - MongoDB Setup

Aplikacja Customer Portal z frontendem Nuxt.js i bazą danych MongoDB.

## Struktura projektu

```
M8/customer-portal/
├── docker-compose.yml              # Definicja serwisów Docker
├── mongodb/
│   └── cp/
│       └── init-db.js             # Skrypt inicjalizujący dane w MongoDB
├── cp-frontend/                    # Aplikacja Nuxt.js
│   ├── server/
│   │   ├── plugins/
│   │   │   └── mongodb.ts         # Plugin łączenia z MongoDB
│   │   ├── models/                # Modele Mongoose
│   │   │   ├── DashboardStat.ts
│   │   │   ├── QuickAction.ts
│   │   │   ├── RecentRequest.ts
│   │   │   ├── Metrics.ts
│   │   │   └── RoutePerformance.ts
│   │   └── api/
│   │       └── dashboard/         # API endpoints dla dashboardu
│   └── features/
│       └── dashboard/             # Feature dashboard z mockami
└── README.md
```

## Wymagania

- Docker i Docker Compose
- Node.js 22+ (dla lokalnego developmentu)

## Uruchomienie

### Dwa tryby developmentu

Aplikacja wspiera **dwa tryby uruchomienia**. Szczegóły w [DEVELOPMENT_MODES.md](./DEVELOPMENT_MODES.md)

#### Tryb 1: Pełny Docker (zalecany dla pierwszej konfiguracji)

```bash
cd M8/customer-portal
./scripts/start.sh
```

Frontend dostępny: `http://localhost:4003`

#### Tryb 2: Hybrydowy - MongoDB w Docker, Nuxt lokalnie (zalecany do developmentu)

```bash
# Terminal 1
./scripts/start-mongo-only.sh

# Terminal 2
cd cp-frontend
npm run dev:local
```

Frontend dostępny: `http://localhost:3000`

**Zalety trybu hybrydowego:** Szybszy HMR, łatwiejszy debugging, mniejsze zużycie zasobów.

### Weryfikacja setupu

```bash
./scripts/verify-setup.sh
```

Powinieneś zobaczyć komunikat: `All checks passed! Setup is complete.`

### Zatrzymanie

```bash
docker compose down
```

### Zatrzymanie z usunięciem danych

Jeśli chcesz zresetować bazę danych i ponownie uruchomić skrypt inicjalizacyjny:

```bash
docker compose down -v
docker volume rm customer-portal_cp-mongodb_data
docker compose up -d
```

## Kolekcje MongoDB

Aplikacja używa następujących kolekcji w bazie `customer_portal`:

- **dashboard_stats** - statystyki wyświetlane na dashboardzie
- **quick_actions** - szybkie akcje dostępne na dashboardzie
- **recent_requests** - ostatnie żądania transportowe/magazynowe
- **metrics** - metryki ogólne (pojedynczy dokument)
- **route_performance** - wydajność poszczególnych tras

## API Endpoints

Dostępne endpointy:

- `GET /api/dashboard/stats` - pobiera statystyki dashboardu
- `GET /api/dashboard/quick-actions` - pobiera szybkie akcje
- `GET /api/dashboard/recent-requests` - pobiera ostatnie żądania
- `GET /api/dashboard/metrics` - pobiera metryki ogólne
- `GET /api/dashboard/route-performance` - pobiera wydajność tras

## Połączenie z MongoDB

Aplikacja łączy się z MongoDB za pomocą:

- **Zmienna środowiskowa**: `MONGODB_URI`
- **Connection string**: `mongodb://root:example@cp-mongodb:27017/customer_portal?authSource=admin`
- **ODM**: Mongoose
- **Connection pooling**: Automatycznie zarządzane przez Mongoose (domyślnie 10 połączeń)

## Struktura danych

Dane w MongoDB odpowiadają strukturze z plików:

- `cp-frontend/features/dashboard/dashboard.model.ts` - definicje interfejsów
- `cp-frontend/features/dashboard/dashboard.mocks.ts` - przykładowe dane (wykorzystane do seed data)
- `cp-frontend/features/dashboard/dashboard-api.ts` - funkcje API (obecnie używają mocków, można przełączyć na prawdziwe API)

## Development

### Połączenie z MongoDB z localhost

Jeśli chcesz połączyć się z MongoDB spoza kontenera (np. MongoDB Compass):

```
mongodb://root:example@localhost:27017/customer_portal?authSource=admin
```

### Struktura VSA (Vertical Slices Architecture)

Aplikacja wykorzystuje architekturę wertykalnych wycinków (VSA). Każda funkcjonalność (np. dashboard) ma swój folder w `features/` z:

- Komponentami Vue
- Modelami TypeScript
- Mockami danych
- Funkcjami API

Serwer Nuxt (folder `server/`) zawiera:

- Modele Mongoose w `server/models/`
- API routes w `server/api/`
- Pluginy w `server/plugins/`
- Utility functions w `server/utils/`

## Troubleshooting

### MongoDB nie startuje

Sprawdź logi:

```bash
docker logs cp-mongodb-container
```

### Dane nie zostały załadowane

1. Sprawdź czy wolumen był pusty podczas pierwszego uruchomienia
2. Usuń wolumen i uruchom ponownie:

```bash
docker compose down -v
docker compose up -d
```

### Frontend nie łączy się z MongoDB

1. Sprawdź czy zmienna `MONGODB_URI` jest ustawiona w `docker-compose.yml`
2. Sprawdź logi kontenera frontend:

```bash
docker logs cp-container
```

Powinieneś zobaczyć: `Successfully connected to MongoDB.`
