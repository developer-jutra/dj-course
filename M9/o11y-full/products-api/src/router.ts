import express, { Request, Response } from 'express';
import logger from './logger';
import { getProducts, getProductById, pool } from './database';

const router = express.Router();

// Route to get all products
router.get('/products', async (req: Request, res: Response) => {
  try {
    logger.info('Fetching all products');
    const products = await getProducts();
    logger.info('Retrieved products', { 
      product_count: products.length,
      operation: 'get_all_products'
    });
    res.json(products);
  } catch (error: any) {
    logger.error('Failed to fetch products', { 
      error: {
        message: error.message,
        stack: error.stack,
      },
      operation: 'get_all_products'
    });
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Route to get product by ID
router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    const product = await getProductById(String(req.params.id));
    logger.info('Retrieved product', { 
      product_id: product.product_id,
      operation: 'get_product_by_id'
    });
    res.json(product);
  } catch (error: any) {
    logger.error('Failed to fetch product by id', { 
      error: {
        message: error.message,
        stack: error.stack,
      },
      product_id: req.params.id,
      operation: 'get_product_by_id'
    });
    res.status(500).json({ error: 'Failed to fetch product by id', id: req.params.id });
  }
});

// Route to create a new product
router.post('/products', async (req: Request, res: Response) => {
  try {
    logger.debug('Creating product', { body: req.body });
    const {
      name,
      price,
      description = null,
      stock = 0,
      category_id = null,
      sku = `SKU-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      weight_g = null,
      is_active = true
    } = req.body;
    const result = await pool.query(
      'INSERT INTO products (name, price, description, stock, category_id, sku, weight_g, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING product_id',
      [name, price, description, stock, category_id, sku, weight_g, is_active]
    );
    const productId = result.rows[0].product_id;
    logger.debug('Record created successfully', { id: productId, name, price, sku });
    res.status(201).json({ id: productId, message: 'Product created successfully' });
  } catch (err: any) {
    logger.error('Failed to create product', { error: err.message, body: req.body });
    res.status(500).json({ error: err.message });
  }
});

// Route to delete a product
router.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.debug('Deleting product', { id });
    await pool.query('DELETE FROM products WHERE product_id = $1', [id]);
    logger.debug('Record deleted successfully', { id });
    res.status(204).send();
  } catch (err: any) {
    logger.error('Failed to delete product', { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// Route to get top products by category
router.get('/top/products-by-category/:categoryId', async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const { limit = 50 } = req.query;
    const { rows } = await pool.query(
      `SELECT p.name, p.price, c.name AS category FROM products p
       JOIN categories c ON p.category_id = c.category_id
       WHERE c.category_id = $1
       ORDER BY p.price DESC LIMIT $2`,
      [categoryId, limit]
    );
    logger.debug('Products fetched successfully', { count: rows.length });
    res.json(rows);
  } catch (err: any) {
    logger.error('Failed to fetch products by category', { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// Route to get top customers by total spent
router.get('/top/customers-by-total-spent', async (req: Request, res: Response) => {
  const { limit = 50 } = req.query;
  try {
    const { rows } = await pool.query(
      `SELECT customer_email, SUM(total_amount) AS total_spent FROM orders
       GROUP BY customer_email
       ORDER BY total_spent DESC LIMIT $1`,
      [limit]
    );
    logger.debug('Customers fetched successfully', { count: rows.length });
    res.json(rows);
  } catch (err: any) {
    logger.error('Failed to fetch customers by total spent', { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// Route to get delivered orders
router.get('/orders/delivered', async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        o.order_id,
        o.customer_name,
        o.total_amount,
        o.status,
        s.tracking_number,
        o.order_date
      FROM
        orders o
      JOIN
        shipments s ON o.order_id = s.order_id
      WHERE
        o.status = 'Delivered'
        AND o.order_date >= NOW() - INTERVAL '30 days'
        AND s.shipping_carrier = 'FedEx'
        AND o.order_id IN (
          SELECT oi.order_id
          FROM order_items oi
          JOIN products p ON oi.product_id = p.product_id
          WHERE p.price > (SELECT AVG(price) FROM products)
        )
      ORDER BY
        o.order_date DESC;
    `);
    logger.debug('Orders fetched successfully', { count: rows.length });
    res.json(rows);
  } catch (err: any) {
    logger.error('Failed to fetch delivered orders', { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

export default router;
