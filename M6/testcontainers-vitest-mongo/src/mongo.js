const { MongoClient } = require('mongodb');

class MongoDB {
  constructor() {
    this.client = null;
    this.db = null;
  }

  async connect(uri) {
    if (this.client) return this;
    
    this.client = new MongoClient(uri);
    await this.client.connect();
    this.db = this.client.db();
    
    return this;
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
    }
  }

  getProductsCollection() {
    if (!this.db) throw new Error('Database not connected');
    return this.db.collection('products');
  }
}

// Singleton instance
const mongodb = new MongoDB();

module.exports = mongodb;
