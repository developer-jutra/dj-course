### Zależności (package.json)

```bash
npm install express graphql graphql-http graphql-tag @graphql-tools/schema pg
npm install -D typescript @types/node @types/express @types/pg ts-node-dev

```

---

### Konfiguracja GraphQL (src/graphql/schema.ts)

Zastosowanie `graphql-tools` pozwala na łatwe wystawienie schemy zarówno do serwera, jak i dla zewnętrznych narzędzi typu codegen.

```typescript
import { makeExecutableSchema } from '@graphql-tools/schema';

const typeDefs = `#graphql
  type Driver {
    id: Int!
    firstName: String
    lastName: String
    email: String
    phone: String
    contractType: String
    status: String
    licenses: [DriverLicense!]!
  }

  type LicenseType {
    id: Int!
    code: String!
    name: String!
    description: String
  }

  type DriverLicense {
    id: Int!
    driverId: Int!
    licenseType: LicenseType!
    documentNumber: String
    issueDate: String
    expiryDate: String!
    status: String
  }

  type Query {
    getDriver(id: Int!): Driver
    listDrivers: [Driver!]!
  }

  type Mutation {
    addDriverLicense(driverId: Int!, licenseTypeId: Int!, expiryDate: String!): DriverLicense
  }
`;

const resolvers = {
  Query: {
    getDriver: async (_: any, { id }: { id: number }) => {
      // TODO: Implement driver fetch from PostgreSQL
    },
    listDrivers: async () => {
      // TODO: Implement drivers list fetch
    }
  },
  Driver: {
    licenses: async (parent: any) => {
      // TODO: Implement license fetch for specific driver
    }
  },
  Mutation: {
    addDriverLicense: async (_: any, args: any) => {
      // TODO: Implement adding driver license
    }
  }
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });

```

---

### Serwer Express (src/index.ts)

Wykorzystanie `graphql-http` (następcy `express-graphql`) do obsługi endpointu.

```typescript
import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { schema } from './graphql/schema';

const app = express();

/**
 * Standard GraphQL endpoint
 * Accessible for clients and codegen tools
 */
app.all('/graphql', createHandler({ schema }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/graphql`);
});

```

---

### Konfiguracja Client-Side Codegen (codegen.ts)

Aby pobrać schemę z `/graphql` i wygenerować typy TypeScript, używamy biblioteki `@graphql-codegen/cli`.

```typescript
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000/graphql",
  documents: "src/**/*.graphql", // Path to your frontend queries
  generates: {
    "src/gql/": {
      preset: "client",
      plugins: []
    }
  }
};

export default config;

```

---

### Przykład wywołania po stronie klienta (fetch)

W przypadku braku ciężkiej biblioteki typu Apollo, można użyć natywnego `fetch`.

```typescript
const GET_DRIVER = `
  query GetDriver($id: Int!) {
    getDriver(id: $id) {
      firstName
      lastName
      licenses {
        licenseType {
          name
        }
        expiryDate
      }
    }
  }
`;

async function fetchDriver(id: number) {
  const response = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: GET_DRIVER,
      variables: { id }
    }),
  });
  
  return response.json();
}

```

---

stwórz plik z klientem graphQL i dodaj taska do `Taskfile.yml` który go uruchomi.

Skompiluj apkę. Przebuduj dockera i upewnij się, że wszystko działa.
