# Database Resilience - Quick Start Guide

## Co zostało zaimplementowane?

Aplikacja `products-api` została wzmocniona mechanizmami resilience, które zapobiegają crashowaniu aplikacji gdy baza danych PostgreSQL jest niedostępna.

### Główne funkcjonalności:

1. **Automatic reconnection** - aplikacja automatycznie ponawia połączenie z bazą co 5-30 sekund
2. **Graceful degradation** - gdy baza jest niedostępna, API zwraca `503 Service Unavailable` zamiast crashować
3. **Health monitoring** - endpoint `/health` pokazuje szczegółowy stan aplikacji i bazy danych
4. **Error handling** - wszystkie błędy połączenia są logowane i obsługiwane bez crashowania aplikacji

## Jak przetestować?

### Opcja 1: Użyj automatycznego skryptu testowego

```bash
cd /Users/tomaszku/Development/devstyle/DJ/dj-course-official/M9/o11y-logs

# Upewnij się że kontenery działają
docker-compose up -d

# Uruchom test
./test-database-resilience.sh
```

Skrypt automatycznie:
1. Sprawdzi czy wszystko działa
2. Zatrzyma PostgreSQL
3. Sprawdzi czy aplikacja nadal działa (powinna!)
4. Przetestuje endpointy (powinny zwracać 503)
5. Uruchomi PostgreSQL ponownie
6. Sprawdzi czy połączenie się odnowiło

### Opcja 2: Manualny test

#### 1. Start aplikacji
```bash
docker-compose up -d
```

#### 2. Sprawdź że wszystko działa
```bash
curl http://localhost:3000/health | jq
# Powinieneś zobaczyć: "status": "OK"

curl http://localhost:3000/products
# Powinieneś dostać listę produktów
```

#### 3. Znajdź i zatrzymaj kontener PostgreSQL
```bash
# Znajdź nazwę kontenera
docker ps | grep postgres

# Zatrzymaj PostgreSQL (zamień NAME na prawdziwą nazwę)
docker stop <postgres-container-name>
```

#### 4. Sprawdź czy aplikacja nadal działa
```bash
# Sprawdź czy kontener products-api nadal działa
docker ps | grep products-api
# Powinien być na liście!

# Sprawdź health check
curl http://localhost:3000/health | jq
# Powinieneś zobaczyć:
# {
#   "status": "DEGRADED",
#   "dependencies": {
#     "database": {
#       "status": "unhealthy"
#     }
#   }
# }

# Spróbuj pobrać produkty
curl http://localhost:3000/products
# Powinieneś dostać:
# {
#   "error": "Service temporarily unavailable",
#   "message": "Database connection is currently unavailable. Please try again later."
# }
```

#### 5. Sprawdź logi aplikacji
```bash
docker logs <products-api-container-name> -f
```

Powinieneś zobaczyć logi typu:
- "Database connection test failed"
- "Database unhealthy - scheduling reconnection attempt"
- "Unexpected database pool error - connection lost"

#### 6. Uruchom PostgreSQL ponownie
```bash
docker start <postgres-container-name>
```

#### 7. Poczekaj na automatyczne odnowienie połączenia (5-30 sekund)
```bash
# Monitoruj logi
docker logs <products-api-container-name> -f

# Zobaczysz:
# "Database pool established new connection"
# "Database connection test successful"
```

#### 8. Sprawdź czy wszystko działa
```bash
curl http://localhost:3000/health | jq
# "status": "OK" ✓

curl http://localhost:3000/products
# Lista produktów ✓
```

## Sprawdzanie logów w Grafana

1. Otwórz Grafana: http://localhost:4000 (admin/secret)
2. Przejdź do Explore
3. Wybierz Loki jako datasource
4. Użyj query:
```logql
{job="products-api"} |= "Database"
```

Zobaczysz wszystkie logi związane z bazą danych, w tym:
- Connection errors
- Reconnection attempts
- Successful reconnections
- Health check results

## Monitoring w produkcji

### Alerty które warto skonfigurować:

1. **Database Unhealthy Alert**
```
Alert gdy /health endpoint zwraca dependencies.database.status: "unhealthy"
przez więcej niż 1 minutę
```

2. **High 503 Rate**
```
Alert gdy więcej niż 10% requestów zwraca 503 
w ciągu ostatnich 5 minut
```

3. **Reconnection Attempts**
```
Alert gdy w logach pojawia się "max reconnection attempts reached"
```

### Metryki do monitorowania:

- Database latency (`dependencies.database.latency` w /health)
- 503 response rate
- Active database connections
- Reconnection attempt frequency

## Troubleshooting

### Problem: Aplikacja nadal crashuje
**Rozwiązanie:** Sprawdź logi z uncaught exceptions:
```bash
docker logs <products-api-container-name> | grep "uncaughtException"
```

### Problem: Połączenie się nie odnawia
**Rozwiązanie:** 
1. Sprawdź czy PostgreSQL faktycznie działa: `docker ps | grep postgres`
2. Sprawdź network connectivity: `docker network inspect o11y-logs_o11y-network`
3. Sprawdź zmienne środowiskowe: `docker exec <products-api-container> env | grep POSTGRES`

### Problem: Zbyt długi czas recovery
**Rozwiązanie:** Zmień parametry w `database.ts`:
```typescript
const RECONNECT_INTERVAL_MS = 2000; // szybsze próby (domyślnie 5000)
const MAX_RECONNECT_ATTEMPTS = 20;  // więcej prób (domyślnie 10)
```

## Dodatkowa dokumentacja

Zobacz pełną dokumentację implementacji w: `DATABASE-RESILIENCE.md`
