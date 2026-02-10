### Podsumowanie setupu

* **Docker Compose:** Wyizolowano serwis `cp` (Nuxt) oraz `cp-mongodb`. Dodano sieć `deliveroo-network` oraz wolumen dla danych.
* **Zależności:** Wykorzystano `mongoose` (już obecny w twoim `package.json`), który jest standardem ODM dla MongoDB w Node.js.
* **Połączenie:** Zastosowano wzorzec Singleton dla `MongoClient/Mongoose`, aby uniknąć problemów z przepełnieniem puli połączeń podczas Hot Module Replacement (HMR) w Nuxt.
* **Błędy logiczne:** W oryginalnym `docker-compose` zmienna `MONGO_URL` kończyła się slashem bez nazwy bazy danych – poprawiono na `mongodb://root:example@cp-mongodb:27017/customer_portal?authSource=admin`.

---

## 1. Wycięty Docker Compose (`docker-compose.yml`)

```yaml
services:
  cp-mongodb:
    image: mongo:7.0.16
    container_name: cp-mongodb-container
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
    ports:
      - "27017:27017"
    volumes:
      - cp-mongodb_data:/data/db
      # Optional: initial scripts
      # - ./mongodb/cp/init.js:/docker-entrypoint-initdb.d/init.js
    networks:
      - deliveroo-network
    restart: unless-stopped

  cp:
    container_name: cp-container
    build:
      context: ./customer-portal
      dockerfile: Dockerfile
      target: development
    ports:
      - "4003:3000"
    volumes:
      - ./customer-portal:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      # Use internal Docker network hostname to connect to Mongo
      - MONGODB_URI=mongodb://root:example@cp-mongodb:27017/customer_portal?authSource=admin
    networks:
      - deliveroo-network
    depends_on:
      - cp-mongodb
    restart: unless-stopped

networks:
  deliveroo-network:
    driver: bridge

volumes:
  cp-mongodb_data:

```

---

## 2. Setup Nuxt 3 (Mongoose ODM)

Mongoose automatycznie zarządza pulą połączeń (**connection pool**). Domyślnie jest to 10 połączeń, co jest wystarczające dla większości aplikacji Nuxt.

### Instalacja zależności

W Twoim `package.json` mongoose już widnieje, ale upewnij się, że agenci wykonają:

```bash
npm install mongoose

```

### Konfiguracja zmiennych środowiskowych (`nuxt.config.ts`)

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    // Only available on the server side
    mongodbUri: process.env.MONGODB_URI
  }
})

```

### Implementacja połączenia (`server/plugins/mongodb.ts`)

Używamy pluginu Nitro, aby nawiązać połączenie raz przy starcie serwera.

```typescript
import mongoose from 'mongoose';

/**
 * Nitro plugin to handle MongoDB connection.
 * Mongoose maintains an internal connection pool.
 */
export default defineNitroPlugin(async (nitroApp) => {
    const config = useRuntimeConfig();

    if (!config.mongodbUri) {
        console.error('MONGODB_URI is not defined in runtimeConfig');
        return;
    }

    try {
        await mongoose.connect(config.mongodbUri, {
            autoIndex: true, // Recommended for development to build indexes
        });
        console.log('Successfully connected to MongoDB.');
    } catch (e) {
        console.error('MongoDB connection error:', e);
    }
});

```

### Przykładowy Model (`server/models/User.ts`)

```typescript
import { Schema, model } from 'mongoose';

interface IUser {
    email: string;
    name: string;
}

const schema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true }
}, { timestamps: true });

export const User = model<IUser>('User', schema);

```

### Przykładowy API Route (`server/api/users.get.ts`)

```typescript
import { User } from '../models/User';

export default defineEventHandler(async (event) => {
    try {
        const users = await User.find().limit(10);
        return users;
    } catch (e) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch users from database',
        });
    }
});

```

---

## Instrukcja dla Agenta LLM

1. **Docker:** Skopiuj powyższy plik `docker-compose.yml`. Zwróć uwagę na zmienną `MONGODB_URI` – zawiera ona `authSource=admin`, ponieważ łączymy się jako `root` zdefiniowany w kontenerze mongo.
2. **Nuxt Config:** Dodaj `mongodbUri` do `runtimeConfig` w `nuxt.config.ts`.
3. **Connection:** Stwórz plik `server/plugins/mongodb.ts`. Dzięki temu połączenie zostanie zainicjalizowane tylko raz podczas startu instancji Nitro.
4. **Models:** Wszystkie schematy bazy danych umieszczaj w katalogu `server/models/`.
5. **Types:** Mongoose automatycznie wygeneruje typy na podstawie interfejsów TypeScript przekazanych do funkcji `model<T>()`.
