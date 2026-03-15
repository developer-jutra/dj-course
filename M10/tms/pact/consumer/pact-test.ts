import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import path from 'path';
import pact from '@pact-foundation/pact-cli';

const { like, integer, string, eachLike } = MatchersV3;

const provider = new PactV3({
  consumer: 'TmsFrontend',
  provider: 'TmsApi',
  dir: path.resolve(process.cwd(), 'pacts'),
});

async function runTest(): Promise<void> {
  // Interaction 1: GET /customers – paginated customer list
  provider
    .given('customers exist')
    .uponReceiving('a request for the customer list')
    .withRequest({ method: 'GET', path: '/customers' })
    .willRespondWith({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: {
        data: eachLike({
          id: integer(1),
          first_name: string('Maida'),
          last_name: string('Dach'),
          nationality: string('Poland'),
          email: string('forestraynor@bauch.io'),
        }),
        pagination: {
          page: integer(1),
          limit: integer(20),
          total: integer(500),
          totalPages: integer(25),
        },
      },
    });

  // Interaction 2: GET /transportation-orders?customer_id=1 – orders for customer 1
  provider
    .given('customer 1 has transportation orders')
    .uponReceiving('a request for transportation orders of customer 1')
    .withRequest({
      method: 'GET',
      path: '/transportation-orders',
      query: { customer_id: '1' },
    })
    .willRespondWith({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: eachLike({
        customer_id: integer(1),
        order_number: like('#00472'),
        amount: like('43.19'),
        status: like('DELIVERED'),
      }),
    });

  await provider.executeTest(async (mockService) => {
    // Verify customer list
    const customersRes = await fetch(`${mockService.url}/customers`);
    const customersData = (await customersRes.json()) as {
      data: Array<{
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        nationality: string;
      }>;
      pagination: { page: number; limit: number; total: number; totalPages: number };
    };

    if (!Array.isArray(customersData.data) || customersData.data.length === 0) {
      throw new Error(`Expected non-empty data array, got: ${JSON.stringify(customersData)}`);
    }
    if (!customersData.pagination || typeof customersData.pagination.total !== 'number') {
      throw new Error(`Expected pagination object, got: ${JSON.stringify(customersData)}`);
    }

    if (customersData.data[0].nationality !== 'Poland') {
      throw new Error(`Expected nationality=Poland, got: ${JSON.stringify(customersData.data[0])}`);
    }
    

    // Verify transportation orders for customer 1
    const ordersRes = await fetch(`${mockService.url}/transportation-orders?customer_id=1`);
    const ordersData = (await ordersRes.json()) as Array<{
      customer_id: number;
      order_number: string;
      amount: string;
      status: string;
    }>;

    if (!Array.isArray(ordersData) || ordersData.length === 0) {
      throw new Error(`Expected non-empty orders array, got: ${JSON.stringify(ordersData)}`);
    }
    if (ordersData[0].customer_id !== 1) {
      throw new Error(`Expected customer_id=1, got: ${JSON.stringify(ordersData[0])}`);
    }
  });

  const opts = {
    pactFilesOrDirs: [path.resolve(process.cwd(), 'pacts')],
    pactBroker: 'http://localhost:9292',
    consumerVersion: '1.0.0-' + Date.now(),
    tags: ['main'],
  };

  try {
    await pact.publishPacts(opts);
    console.log('Pacts published to Broker');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('Could not publish to Broker (is it running?):', message);
  }
}

runTest().catch((err) => {
  console.error(err);
  process.exit(1);
});
