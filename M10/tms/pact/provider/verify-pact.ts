import { Verifier } from '@pact-foundation/pact';

const opts = {
  provider: 'TmsApi',
  providerBaseUrl: 'http://localhost:3000',
  pactBrokerUrl: 'http://localhost:9292',
  publishVerificationResult: true,
  providerVersion: '1.0.0',

  consumerVersionSelectors: [{ tag: 'main', latest: true }],

  stateHandlers: {
    'customers exist': () => Promise.resolve('Customers already seeded in DB'),
    'customer 1 has transportation orders': () =>
      Promise.resolve('Customer 1 orders already seeded in DB'),
  },
};

new Verifier(opts)
  .verifyProvider()
  .then(() => console.log('Provider verification finished'))
  .catch((err) => {
    console.error('Provider verification failed:', err);
    process.exit(1);
  });
