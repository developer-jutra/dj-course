const fs = require('fs');
const express = require('express');
const redis = require('redis');

const { invokeMemoryLeak } = require('./memory-leak');
const { assertEnvVars } = require('./env');
const pool = require('./database');
const redisClient = require('./redis');

assertEnvVars(
  'NODE_APP_PORT',
  'SIMULATE_MEMORY_LEAK',
  'REDIS_PASSWORD_FILE',
  'DB_PASSWORD_FILE',
  'DB_USER',
  'DB_HOST',
  'DB_NAME',
  'DB_PORT',
  'REDIS_HOST',
  'REDIS_PORT'
);

const app = express();
const port = process.env.NODE_APP_PORT;

// GET /products endpoint
app.get('/products', async (req, res) => {
  invokeMemoryLeak();

  try {
    // Try to get products from Redis cache
    const cachedProducts = await redisClient.get('products');
    
    if (cachedProducts) {
      console.log('Returning products from cache');
      return res.json(JSON.parse(cachedProducts));
    }
    
    // If not in cache, get from PostgreSQL
    console.log('Fetching products from database');
    const result = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      JOIN categories c ON p.category_id = c.id
    `);
    
    const products = result.rows;
    
    // Store in Redis cache with expiration of 60 seconds
    await redisClient.set('products', JSON.stringify(products), {
      EX: 60
    });
    
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date() });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await redisClient.quit();
  await pool.end();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
