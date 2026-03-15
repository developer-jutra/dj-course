# PACT Contract Testing – TMS API

Testy kontraktowe dla endpointów TMS API (`GET /customers`, `GET /transportation-orders?customer_id`).

## Wymagania

- Node.js 18+, Docker Compose (Pact Broker uruchamiany z głównego `docker-compose.yml` projektu TMS)

## Uruchomienie

```bash
# Broker (z katalogu głównego TMS)
docker compose up -d pact-broker

# Testy (z katalogu pact/)
npm run test:consumer   # generuje kontrakt i publikuje do brokera
npm run test:provider   # weryfikuje kontrakt na żywym API (localhost:3000)
npm run test            # consumer + provider
```

Broker: http://localhost:9292

## Struktura

```
├── consumer/pact-test.ts    # test konsumenta (TmsFrontend → TmsApi)
├── provider/verify-pact.ts  # weryfikacja providera (TmsApi)
└── pacts/                   # wygenerowane pliki pact
```

## Can I Deploy?

```bash
npx pact-broker can-i-deploy \
  --pacticipant TmsFrontend \
  --version 1.0.0 \
  --to-environment production \
  --broker-base-url http://localhost:9292
```

Exit code `0` = OK, `1` = blokada (niespełnione kontrakty).
