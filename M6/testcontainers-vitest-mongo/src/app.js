const express = require('express');
const mongodb = require('./mongo');
const { ObjectId } = require('mongodb');

// Create Express app
const createApp = async (mongoUri = 'mongodb://localhost:27017/products') => {
  // Connect to MongoDB
  await mongodb.connect(mongoUri);
  
  const app = express();
  
  // Middleware
  app.use(express.json());
  
  // Products routes
  app.get('/products', async (req, res) => {
    try {
      const collection = mongodb.getProductsCollection();
      const products = await collection.find({}).toArray();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/products', async (req, res) => {
    try {
      const { name, price } = req.body;
      
      if (!name || typeof price !== 'number') {
        return res.status(400).json({ error: 'Name and price are required' });
      }
      
      const collection = mongodb.getProductsCollection();
      const result = await collection.insertOne({ name, price });
      
      res.status(201).json({
        _id: result.insertedId,
        name,
        price
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/products/:id', async (req, res) => {
    try {
      const id = req.params.id;
      
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      
      const collection = mongodb.getProductsCollection();
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  return app;
};

module.exports = { createApp };
