/**
 * GraphQL client demonstrating queries and mutations against the /graphql endpoint.
 * Run with: npx tsx src/graphql/client.ts  (from tms-api directory with DATABASE_URL set)
 */

const BASE_URL = process.env.GRAPHQL_URL ?? 'http://localhost:3000/graphql';

async function gql<T = unknown>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join(', '));
  }
  return json.data as T;
}

const LIST_DRIVERS = `
  query ListDrivers {
    listDrivers {
      id
      firstName
      lastName
      contractType
      status
      licenses {
        licenseType {
          code
          name
        }
        expiryDate
        status
      }
    }
  }
`;

const GET_DRIVER = `
  query GetDriver($id: Int!) {
    getDriver(id: $id) {
      id
      firstName
      lastName
      email
      licenses {
        licenseType {
          name
        }
        expiryDate
        status
      }
    }
  }
`;

async function main() {
  console.log('--- GraphQL client test ---\n');
  console.log(`Connecting to: ${BASE_URL}\n`);

  const { listDrivers } = await gql<{ listDrivers: Record<string, unknown>[] }>(LIST_DRIVERS);
  console.log(`Fetched ${listDrivers.length} drivers:`);
  listDrivers.slice(0, 3).forEach((d) => {
    const licenses = (d.licenses as Record<string, unknown>[]) ?? [];
    console.log(`  [${d.id}] ${d.firstName} ${d.lastName} (${d.contractType}) – ${licenses.length} license(s)`);
  });
  if (listDrivers.length > 3) {
    console.log(`  ... and ${listDrivers.length - 3} more`);
  }

  if (listDrivers.length > 0) {
    const firstId = listDrivers[0].id as number;
    console.log(`\nFetching single driver id=${firstId}:`);
    const { getDriver } = await gql<{ getDriver: Record<string, unknown> | null }>(GET_DRIVER, { id: firstId });
    if (getDriver) {
      const licenses = (getDriver.licenses as Record<string, unknown>[]) ?? [];
      console.log(`  ${getDriver.firstName} ${getDriver.lastName} <${getDriver.email}>`);
      licenses.forEach((l) => {
        const lt = l.licenseType as Record<string, unknown>;
        console.log(`    License: ${lt.name}, expires: ${l.expiryDate}, status: ${l.status}`);
      });
    }
  }

  console.log('\n--- Done ---');
}

main().catch((err) => {
  console.error('GraphQL client error:', err);
  process.exit(1);
});
