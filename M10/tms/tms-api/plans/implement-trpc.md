### Zależności

```bash
npm install @trpc/server @trpc/client zod

```

---

### Serwer (Node.js + Express)

#### 1. Inicjalizacja tRPC (`src/trpc.ts`)

```typescript
import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

```

#### 2. Definicja Routera (`src/router.ts`)

```typescript
import { z } from 'zod';
import { router, publicProcedure } from './trpc';

export const appRouter = router({
  getVehicles: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100),
      offset: z.number().min(0),
    }))
    .query(async ({ input }) => {
      // TODO: Implement getVehicles logic
    }),

  getVehicleById: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      // TODO: Implement getVehicleById logic
    }),

  createVehicle: publicProcedure
    .input(z.object({
      make: z.string().optional(),
      model: z.string().optional(),
      year: z.number().optional(),
      fuel_tank_capacity: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      // TODO: Implement createVehicle logic
    }),

  updateVehicle: publicProcedure
    .input(z.object({
      id: z.string(),
      data: z.object({
        make: z.string().optional(),
        model: z.string().optional(),
        year: z.number().optional(),
        fuel_tank_capacity: z.number().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      // TODO: Implement updateVehicle logic
    }),

  deleteVehicle: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      // TODO: Implement deleteVehicle logic
    }),
});

export type AppRouter = typeof appRouter;

```

#### 3. Integracja z Express (`src/index.ts`)

```typescript
import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './router';

const app = express();

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    // Optional: createContext to inject DB or Auth
    createContext: () => ({}), 
  }),
);

app.listen(3000);

```

---

### Klient (`src/client.ts`)

```typescript
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './router';

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});

/**
 * Example usage:
 * const vehicles = await client.getVehicles.query({ limit: 10, offset: 0 });
 * const newVehicle = await client.createVehicle.mutate({ make: 'Toyota' });
 */

---

Pliki specyficzne dla tRPC mają być w folderze `src/trpc`.
natomiast podpięcie trpc pod expressa - niech pozostanie w pliku `index.ts` czyli tam gdzie express jest już inicjowany.

URUCHOM KLIENTA ABY UPEWNIĆ SIĘ, ŻE DZIAŁA. Wywołanie klienta ma się znajdować w `tms-api/Taskfile.yml`