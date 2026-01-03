import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { ObjectId } from 'mongodb';
import request from 'supertest';

import { createApp } from './app';
import mongodb from './mongo';
import { setupMongoContainer, teardownMongoContainer, clearCollections } from './mongo-tc';

describe('Products API', () => {
  let mongoSetup;
  let app;
  
  // Setup - start container before all tests
  beforeAll(async () => {
    // Setup MongoDB container
    mongoSetup = await setupMongoContainer();
    
    // Create Express app with MongoDB connection
    app = await createApp(mongoSetup.connectionString);
  }, 60000);

  // Cleanup - stop container after all tests
  afterAll(async () => {
    // Disconnect app's MongoDB client
    await mongodb.disconnect();
    
    // Teardown MongoDB container
    await teardownMongoContainer(mongoSetup);
  });

  // Clean products collection before each test
  beforeEach(async () => {
    await clearCollections(mongoSetup.client);
  });

  // Test cases
  it('should return empty array when no products exist', async () => {
    const response = await request(app).get('/products');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should add a new product', async () => {
    const newProduct = { name: 'Test Product', price: 99.99 };
    
    const response = await request(app)
      .post('/products')
      .send(newProduct);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(newProduct.name);
    expect(response.body.price).toBe(newProduct.price);
  });

  it('should return added products', async () => {
    // Add test products
    const db = mongoSetup.client.db();
    const collection = db.collection('products');
    
    const testProducts = [
      { name: 'Product 1', price: 10.99 },
      { name: 'Product 2', price: 20.99 }
    ];
    
    await collection.insertMany(testProducts);
    
    // Get products
    const response = await request(app).get('/products');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty('_id');
    
    const productNames = response.body.map(p => p.name);
    expect(productNames).toContain(testProducts[0].name);
    expect(productNames).toContain(testProducts[1].name);
  });

  it('should delete a product', async () => {
    // Add a test product
    const db = mongoSetup.client.db();
    const collection = db.collection('products');
    
    const result = await collection.insertOne({ name: 'Product to delete', price: 15.99 });
    const productId = result.insertedId.toString();
    
    // Delete the product
    const deleteResponse = await request(app).delete(`/products/${productId}`);
    expect(deleteResponse.status).toBe(204);
    
    // Verify deletion
    const product = await collection.findOne({ _id: new ObjectId(productId) });
    expect(product).toBeNull();
  });

  it('should return 404 when deleting non-existent product', async () => {
    const nonExistentId = new ObjectId().toString();
    
    const response = await request(app).delete(`/products/${nonExistentId}`);
    
    expect(response.status).toBe(404);
  });

  it('should return 400 when adding product with invalid data', async () => {
    const invalidProduct = { name: 'Invalid Product' }; // Missing price
    
    const response = await request(app)
      .post('/products')
      .send(invalidProduct);
    
    expect(response.status).toBe(400);
  });
});
