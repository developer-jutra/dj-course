# Database Resilience Implementation

## Problem
Podczas testów chaos engineering, gdy PostgreSQL został zatrzymany, kontener `products-api` całkowicie padał (crashed) zamiast obsłużyć brak dostępu do bazy danych gracefully.

## Solution
Zaimplementowano wielowarstwową strategię resilience:

### 1. Connection Pool Error Handling (`database.ts`)

#### Error Handlers
- **Pool Error Handler**: Nasłuchuje na błędy połączenia i loguje je bez crashowania aplikacji
- **Connection Event Handlers**: Monitoruje zdarzenia `connect`, `error`, i `remove` z puli połączeń
- **Health Status Tracking**: Eksportowana zmienna `isDatabaseHealthy` śledzi stan połączenia

#### Automatic Reconnection
- **Initial Connection Test**: Przy starcie sprawdza czy połączenie działa
- **Periodic Health Checks**: Co 30 sekund testuje połączenie (`SELECT NOW()`)
- **Retry Logic**: Przy utracie połączenia automatycznie próbuje się ponownie połączyć
  - Maksymalnie 10 prób reconnect
  - Odstęp 5 sekund między próbami
  - Po osiągnięciu max prób, czeka 10 sekund i resetuje licznik (pozwala na dalsze próby)

#### Connection Pool Configuration
```typescript
{
  max: 20,                          // maksymalna liczba klientów w puli
  idleTimeoutMillis: 30000,         // zamknij nieaktywne połączenia po 30s
  connectionTimeoutMillis: 10000,   // timeout połączenia: 10s
  query_timeout: 10000              // timeout zapytań: 10s
}
```

### 2. Request-Level Error Handling (`router.ts`)

#### Middleware Check
- **checkDatabaseHealth**: Sprawdza stan bazy przed każdym requestem
- Jeśli baza jest niedostępna → zwraca `503 Service Unavailable` z `Retry-After: 5`
- Request nie dociera do route handlerów gdy baza jest down

#### Database Error Handler
Funkcja `handleDatabaseError()` rozróżnia typy błędów:

**Connection Errors** (503 Service Unavailable):
- `ECONNREFUSED` - odmowa połączenia
- `ENOTFOUND` - host nie znaleziony
- `ETIMEDOUT` - timeout połączenia
- `57P01`, `57P02`, `57P03` - PostgreSQL shutdown/crash kody
- Błędy zawierające "connection" w message

**Other Errors** (500 Internal Server Error):
- Błędy SQL, constraintów, etc.

### 3. Health Check Endpoint (`index.ts`, `otlp-index.ts`)

Enhanced `/health` endpoint teraz zwraca:

```json
{
  "uptime": 123.456,
  "status": "OK",  // lub "DEGRADED" gdy baza down
  "timestamp": 1234567890,
  "dependencies": {
    "database": {
      "status": "healthy",  // lub "unhealthy"
      "latency": "5ms"      // null gdy unhealthy
    }
  }
}
```

**Behavior**:
- Zawsze zwraca `200 OK` (nawet gdy baza down) - aplikacja działa
- Można zmienić na `503` gdy baza down (odkomentować linię w kodzie)
- Aktywnie testuje połączenie z bazą przy każdym wywołaniu `/health`

### 4. Graceful Shutdown

Obsługa sygnałów `SIGTERM` i `SIGINT`:
1. Przestaje przyjmować nowe połączenia HTTP
2. Zamyka istniejące połączenia z bazą danych (`pool.end()`)
3. Shutdown telemetry (w wersji OTLP)
4. Exit z kodem 0 (success) lub 1 (error)
5. Forced shutdown po 30 sekundach jako failsafe

### 5. Uncaught Error Handlers

```typescript
process.on('uncaughtException', ...)
process.on('unhandledRejection', ...)
```

Logują błędy ale **nie crashują aplikacji** - pozwala na recovery.

## Testing

### Test Scenario 1: Stop PostgreSQL
```bash
# Stop PostgreSQL
docker stop <postgres-container-id>

# Expected behavior:
# - products-api continues running
# - /health returns status: "DEGRADED"
# - API requests return 503 with proper error message
# - Logs show reconnection attempts

# Restart PostgreSQL
docker start <postgres-container-id>

# Expected behavior:
# - Connection automatically restored within 5-30 seconds
# - /health returns status: "OK"
# - API requests work normally
```

### Test Scenario 2: Simulate Network Issues
```bash
# Block PostgreSQL port
docker pause <postgres-container-id>

# Test health endpoint
curl http://localhost:3000/health

# Test API endpoint
curl http://localhost:3000/products

# Resume
docker unpause <postgres-container-id>
```

## Benefits

1. **No Application Crashes**: Utrata połączenia z bazą nie powoduje crash aplikacji
2. **Automatic Recovery**: Połączenie automatycznie się odnawia po przywróceniu bazy
3. **User-Friendly Errors**: Klienci dostają 503 z informacją o retry zamiast crash
4. **Observable**: Logi jasno pokazują stan połączenia i próby reconnect
5. **Health Check**: Monitoring może wykryć problemy przez `/health` endpoint
6. **Graceful Degradation**: Aplikacja działa (np. health check, metrics) nawet gdy baza jest down

## Monitoring Recommendations

1. **Alert on DEGRADED status** - gdy `/health` zwraca `dependencies.database.status: "unhealthy"`
2. **Monitor reconnection attempts** - logi z `reconnectAttempts`
3. **Track 503 responses** - wzrost 503 oznacza problemy z bazą
4. **Monitor database latency** - `dependencies.database.latency` w health check
5. **Set up retry logic in clients** - klienci powinni respektować `Retry-After` header

## Future Improvements (Optional)

- [ ] Circuit Breaker pattern (np. używając biblioteki `opossum`)
- [ ] Exponential backoff dla retry logic
- [ ] Caching layer (Redis) dla często używanych danych
- [ ] Read replica fallback dla read-only queries
- [ ] Queue system dla write operations (np. RabbitMQ, Kafka)
- [ ] Connection pooling metrics (ile aktywnych, ile idle połączeń)
