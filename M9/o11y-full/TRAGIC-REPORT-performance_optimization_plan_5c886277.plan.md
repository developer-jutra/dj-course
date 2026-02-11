---
name: Performance Optimization Plan
overview: "Naprawa krytycznych problemów wydajnościowych w products-api: dodanie brakującego endpointu POST, implementacja paginacji dla GET /products, optymalizacja database pool, redukcja loggingu, oraz naprawa konfiguracji load testu."
todos:
  - id: implement-post-products
    content: Dodaj funkcję createProduct w database.ts i endpoint POST /products w index.ts
    status: pending
  - id: add-pagination
    content: Zaimplementuj paginację w getProducts z parametrami limit/offset
    status: pending
  - id: configure-db-pool
    content: Dodaj limity do PostgreSQL pool (max, timeouts, query_timeout)
    status: pending
  - id: fix-middleware-order
    content: Przenieś error handling middleware na koniec po wszystkich routach
    status: pending
  - id: add-404-validation
    content: Dodaj walidację NotFoundError w getProductById i obsługę w route
    status: pending
  - id: optimize-logging
    content: Usuń file transports w development, zostaw tylko console i OTel
    status: pending
  - id: fix-load-test
    content: Odwróć arrivalRate/rampTo, dodaj paginację i losowe ID w scenariuszu
    status: pending
isProject: false
---

# Plan Optymalizacji Wydajności Products API

## Problemy Zidentyfikowane

### Krytyczne (SHOW-STOPPERS)

1. **Brak endpointu POST /products** - load test wywołuje nieistniejący endpoint
2. **SELECT * bez paginacji** - zwraca wszystkie 10,000 produktów na każde żądanie (631 MB!)
3. **Brak limitów connection pool** - PostgreSQL pool bez ograniczeń

### Wysokie Opóźnienia

1. **Zbyt intensywny file logging** - Winston zapisuje do 2 plików lokalnych przy każdym żądaniu
2. **Błędna kolejność middleware** - error handler przed routami
3. **Brak walidacji 404** - getProductById zwraca undefined zamiast błędu

### Konfiguracja

1. **Odwrócony load test** - arrivalRate: 50 → 10 (shock loading)
2. **Niski limit pamięci** - 256MB może być za mało

## Implementacja Poprawek

### 1. Dodanie Endpointu POST /products

W `[products-api/src/index.ts](products-api/src/index.ts)`:

```typescript
// Dodaj funkcję createProduct w database.ts
const createProduct = async (name: string, price: number) => {
  const span = tracer.startSpan('createProduct');
  try {
    const { rows } = await pool.query(
      'INSERT INTO products (name, price, sku) VALUES ($1, $2, $3) RETURNING *',
      [name, price, `SKU-${Date.now()}`]
    );
    return rows[0];
  } finally {
    span.end();
  }
};

// Dodaj route:
app.post('/products', async (req, res) => {
  const { name, price } = req.body;
  const product = await createProduct(name, price);
  res.status(201).json(product);
});
```

### 2. Implementacja Paginacji GET /products

Zmień endpoint GET /products na:

```typescript
app.get('/products', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100); // max 100
  const offset = parseInt(req.query.offset) || 0;
  
  const products = await getProducts(limit, offset);
  res.json({
    data: products,
    limit,
    offset,
    total: await getTotalProductsCount()
  });
});
```

Aktualizuj `database.ts`:

```typescript
const getProducts = async (limit = 20, offset = 0) => {
  const { rows } = await pool.query(
    'SELECT * FROM products LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return rows;
};
```

### 3. Optymalizacja Database Pool

W `[products-api/src/database.ts](products-api/src/database.ts)`:

```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                      // max 20 połączeń
  idleTimeoutMillis: 30000,     // zamknij idle po 30s
  connectionTimeoutMillis: 2000, // timeout na połączenie: 2s
  query_timeout: 5000,          // timeout na query: 5s
});
```

### 4. Redukcja File Logging

W `[products-api/src/logger.ts](products-api/src/logger.ts)` - usuń file transports w środowisku development:

```typescript
const transports = [
  new winston.transports.Console({
    format: winston.format.json(),
  }),
];

// Tylko w production zapisuj do plików
if (NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  );
}

const logger = winston.createLogger({
  level: NODE_ENV === 'production' ? 'info' : 'debug',
  transports,
  // ... reszta config
});
```

### 5. Naprawa Kolejności Middleware

W `[products-api/src/index.ts](products-api/src/index.ts)` - przenieś error handler **NA KONIEC** po wszystkich routach:

```typescript
// PRZED:
// app.use(bodyParser.json())
// app.use(errorHandler) ← ŹLE!
// app.get('/products', ...)

// PO:
app.use(bodyParser.json())
app.get('/products', ...)
app.post('/products', ...)
// ... wszystkie routes

// Error handler NA KOŃCU
app.use((err, req, res, next) => {
  logger.error('Request processing error', {...});
  res.status(500).json({ error: 'Internal Server Error' });
});
```

### 6. Walidacja 404 w getProductById

W `[products-api/src/database.ts](products-api/src/database.ts)`:

```typescript
const getProductById = async (id: string) => {
  const span = tracer.startSpan('getProductById');
  try {
    const { rows } = await pool.query(
      'SELECT * FROM products WHERE product_id = $1',
      [id]
    );
    
    if (rows.length === 0) {
      const error = new Error('Product not found');
      error.name = 'NotFoundError';
      throw error;
    }
    
    return rows[0];
  } finally {
    span.end();
  }
};
```

W `[products-api/src/index.ts](products-api/src/index.ts)`:

```typescript
app.get('/products/:id', async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.status(404).json({ error: 'Product not found' });
    }
    logger.error('Failed to fetch product', {...});
    res.status(500).json({ error: 'Internal error' });
  }
});
```

### 7. Naprawa Load Test Config

W `[product-load-test.yml](product-load-test.yml)`:

```yaml
phases:
  - name: "Warm up"
    duration: 10
    arrivalRate: 5  # Start łagodnie

  - name: "Ramp up to peak"
    duration: 20
    arrivalRate: 5
    rampTo: 30     # Stopniowo zwiększaj (było odwrotnie!)

  - name: "Sustain peak load"
    duration: 30
    arrivalRate: 30

  - name: "Ramp down"
    duration: 15
    arrivalRate: 30
    rampTo: 0
```

Dodaj paginację w scenariuszu:

```yaml
scenarios:
  - name: "Product browsing + creation flow"
    flow:
      - get:
          url: "/products?limit=20&offset=0"  # Paginacja!
      - think: 1  # Zmniejsz z 3s
      - get:
          url: "/products/{{ $randomNumber(1, 100) }}"  # Losowy ID
      - post:
          url: "/products"
          json:
            name: "Load Test Product {{ $randomString(5) }}"
            price: {{ $randomNumber(10, 200) }}
      - think: 1  # Zmniejsz z 2s
```

### 8. Zwiększenie Limitu Pamięci (opcjonalnie)

W `[docker-compose.yml](docker-compose.yml)`:

```yaml
services:
  products-api:
    mem_limit: 512m  # Zwiększ z 256m
    # ... reszta config
```

## Kolejność Implementacji

1. **Napraw POST /products** (krytyczne - test się wywala bez tego)
2. **Dodaj paginację GET /products** (największy wpływ na wydajność)
3. **Skonfiguruj database pool** (stabilność pod obciążeniem)
4. **Napraw middleware order** (poprawność error handling)
5. **Walidacja 404** (lepsze komunikaty błędów)
6. **Zmniejsz file logging** (mniejszy I/O overhead)
7. **Popraw load test config** (realistyczne obciążenie)
8. **Zwiększ mem_limit** (jeśli nadal problemy)

## Oczekiwane Rezultaty

Po implementacji:

- **0 błędów ETIMEDOUT** (z 976)
- **p95 < 500ms** (z 9.2s)
- **0 błędów 404** dla POST /products
- **Znacząco mniejszy transfer** (~20 KB zamiast 631 MB)
- **Stabilność** przy 30 req/s arrival rate

