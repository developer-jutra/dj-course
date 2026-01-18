import { MongoDBContainer } from '@testcontainers/mongodb';
import { MongoClient } from 'mongodb';

/**
 * Set up a MongoDB container for testing
 */
export async function setupMongoContainer() {
  // Start MongoDB container
  const mongoContainer = await new MongoDBContainer().start();
  
  // Get connection string with directConnection option
  const connectionString = `${mongoContainer.getConnectionString()}?directConnection=true`;
  
  // Create a client for test setup/teardown
  const mongoClientForTests = new MongoClient(connectionString);
  await mongoClientForTests.connect();
  
  return {
    container: mongoContainer,
    connectionString,
    client: mongoClientForTests
  };
}

/**
 * Clean up a MongoDB container after testing
 */
export async function teardownMongoContainer({ container, client }) {
  // Close the test MongoDB client
  if (client) {
    await client.close();
  }
  
  // Stop MongoDB container
  if (container) {
    await container.stop();
  }
}

/**
 * Clear all collections in the database
 */
export async function clearCollections(client) {
  const db = client.db();
  await db.collection('products').deleteMany({});
}
