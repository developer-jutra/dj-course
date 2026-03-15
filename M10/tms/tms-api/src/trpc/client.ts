import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './router';

const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});

async function main() {
  console.log('--- tRPC client test ---\n');

  // client.updateVehicle.mutate({
  //   id: '1',
  //   data: {
  //     make: 'Toyota',
  //     model: 'Camry',
  //     year: 2020,
  //     fuel_tank_capacity: 50,
  //   },
  // });

  const result = await client.getVehicles.query({ limit: 10, offset: 0 });
  console.log(`Fetched ${result.rows.length} vehicles (total: ${result.total}):`);
  result.rows.forEach((v) => {
    console.log(`  [${v.id}] ${v.make} ${v.model} (${v.year})`);
  });

  console.log('\n--- Done ---');
}

main().catch((err) => {
  console.error('tRPC client error:', err);
  process.exit(1);
});
