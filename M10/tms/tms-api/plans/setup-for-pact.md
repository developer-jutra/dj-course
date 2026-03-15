Poniżej znajduje się kompletny, merytoryczny setup lokalnego środowiska **Pact Broker** opartego na Dockerze, wraz z dostosowanym kodem Node.js do komunikacji z brokerem.

### 1. Struktura plików

```text
.
├── .env
├── docker-compose.yml
├── package.json
├── consumer/
│   ├── pact-test.js      # Generuje pakt i wysyła do brokera
└── provider/
    └── verify-pact.js    # Pobiera pakt z brokera i weryfikuje
```

---

### 2. Konfiguracja Docker (`docker-compose.yml` & `.env`)

**Plik `.env**`

```env
POSTGRES_USER=pact_user
POSTGRES_PASSWORD=pact_password
POSTGRES_DB=pact_broker
PACT_BROKER_DATABASE_USERNAME=pact_user
PACT_BROKER_DATABASE_PASSWORD=pact_password
PACT_BROKER_DATABASE_NAME=pact_broker

```

**Plik `docker-compose.yml**`

```yaml
services:
  postgres:
    image: postgres:15-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U pact_user -d pact_broker"]
      interval: 5s
      timeout: 5s
      retries: 5
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  pact-broker:
    image: pactfoundation/pact-broker:latest
    ports:
      - "9292:9292"
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      PACT_BROKER_DATABASE_HOST: postgres
      PACT_BROKER_DATABASE_USERNAME: ${PACT_BROKER_DATABASE_USERNAME}
      PACT_BROKER_DATABASE_PASSWORD: ${PACT_BROKER_DATABASE_PASSWORD}
      PACT_BROKER_DATABASE_NAME: ${PACT_BROKER_DATABASE_NAME}
      PACT_BROKER_LOG_LEVEL: INFO

volumes:
  postgres_data:

```

---

### 3. Kod Konsumenta (Publikacja do Brokera)

W wersji z Brokerem używamy `Pact` (klasa wyższego poziomu) lub CLI do publikacji. Poniżej przykład zintegrowany z testem.

**`consumer/pact-test.js`**

```javascript
const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const path = require('path');
const { Publisher } = require('@pact-foundation/pact');

const provider = new PactV3({
  consumer: 'FrontendApp',
  provider: 'UserService',
  dir: path.resolve(process.cwd(), 'pacts')
});

async function runTest() {
  await provider.executeTest(async (mockService) => {
    // Standard logic for defining interaction
    provider.addInteraction({
      states: [{ description: 'user with ID 10 exists' }],
      uponReceiving: 'a request for user 10',
      withRequest: { method: 'GET', path: '/users/10' },
      willRespondWith: {
        status: 200,
        body: { id: 10, name: MatchersV3.like('Tomek') }
      },
    });

    const response = await fetch(`${mockService.url}/users/10`);
    return response.json();
  });

  // After tests, publish to Broker
  // In real CI/CD, this is often a separate step using Pact CLI
  const opts = {
    pactFilesOrDirs: [path.resolve(process.cwd(), 'pacts')],
    pactBroker: 'http://localhost:9292',
    consumerVersion: '1.0.0-' + Date.now(), // Unique version for each build
    tags: ['main']
  };

  await new Publisher(opts).publishPacts();
  console.log('Pacts published to Broker');
}

runTest();

```

---

### 4. Kod Providera (Weryfikacja z Brokera)

Provider nie czyta już pliku z dysku, lecz pyta Brokera o najnowszy kontrakt.

**`provider/verify-pact.js`**

```javascript
const { Verifier } = require('@pact-foundation/pact');

const opts = {
  provider: 'UserService',
  providerBaseUrl: 'http://localhost:8080', // URL of your running microservice
  pactBrokerUrl: 'http://localhost:9292',
  publishVerificationResult: true, // Send results back to Broker
  providerVersion: '1.0.0',        // Version of this provider build
  
  // Consumer version selectors: tells Broker which pacts to verify
  consumerVersionSelectors: [
    { tag: 'main', latest: true },
    { deployed: true }
  ],
  
  stateHandlers: {
    'user with ID 10 exists': () => {
      // Logic to prepare the system state
      return Promise.resolve('User injected');
    },
  },
};

new Verifier(opts).verifyProvider()
  .then(() => console.log('Verification finished'));

```

---

### 5. Kluczowe skrypty pomocnicze

Możesz dodać je do `package.json` w odpowiednich katalogach:

* **`can-i-deploy`**: Sprawdza, czy możesz bezpiecznie wdrożyć daną wersję.
```bash
# Skrypt CLI (wymaga zainstalowanego pact-ruby-cli lub obrazu docker)
docker run --rm \
  --network="host" \
  pactfoundation/pact-cli:latest \
  broker can-i-deploy \
  --pact-broker-base-url http://localhost:9292 \
  --pacticipant FrontendApp \
  --version 1.0.0

```


*Zastosowanie: Blokuje build w CI, jeśli kontrakt nie został zweryfikowany przez drugą stronę.*
* **`record-deployment`**: Informuje Brokera, że dana wersja trafiła na konkretne środowisko (np. `production`).
```bash
docker run --rm \
  --network="host" \
  pactfoundation/pact-cli:latest \
  broker record-deployment \
  --pact-broker-base-url http://localhost:9292 \
  --pacticipant UserService \
  --version 1.0.0 \
  --environment production

```


*Zastosowanie: Pozwala Brokerowi wiedzieć, co aktualnie "żyje" na produkcji, aby chronić przed niekompatybilnymi zmianami.*

### Jak to uruchomić?

1. Uruchom infrastrukturę: `docker-compose up -d`.
2. Wejdź na `http://localhost:9292` (UI Brokera będzie puste).
3. Uruchom test konsumenta (`node consumer/pact-test.js`) – kontrakt pojawi się w Brokerze.
4. Uruchom weryfikację providera (`node provider/verify-pact.js`) – w UI zobaczysz zielony status weryfikacji.
