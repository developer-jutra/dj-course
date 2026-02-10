import express, { Request, Response } from 'express';
import logger from "./logger";
import { pool, isDatabaseHealthy } from "./database";

const router = express.Router();

// Helper function to handle database errors consistently
function handleDatabaseError(err: any, operation: string, res: Response) {
  // Check if it's a connection error
  const isConnectionError = err.code === 'ECONNREFUSED' || 
                           err.code === 'ENOTFOUND' || 
                           err.code === 'ETIMEDOUT' ||
                           err.code === '57P01' || // postgres admin shutdown
                           err.code === '57P02' || // postgres crash shutdown
                           err.code === '57P03' || // postgres cannot connect
                           err.message?.includes('connection') ||
                           err.message?.includes('connect ECONNREFUSED');
  
  if (isConnectionError) {
    logger.error(`Database connection error during ${operation}`, { 
      error: err.message,
      code: err.code,
      operation
    });
    return res.status(503).json({ 
      error: 'Service temporarily unavailable',
      message: 'Unable to connect to database. Please try again later.'
    });
  }
  
  logger.error(`Failed to ${operation}`, { 
    error: err.message,
    code: err.code 
  });
  return res.status(500).json({ error: err.message });
}

// Middleware to check database health before processing requests
function checkDatabaseHealth(req: Request, res: Response, next: express.NextFunction) {
  if (!isDatabaseHealthy) {
    logger.warn('Request rejected - database is currently unavailable', {
      method: req.method,
      url: req.originalUrl
    });
    return res.status(503).json({ 
      error: 'Service temporarily unavailable',
      message: 'Database connection is currently unavailable. Please try again later.',
      retryAfter: 5
    });
  }
  next();
}

// Apply database health check to all routes
router.use(checkDatabaseHealth);

router.get('/products', async (req: Request, res: Response) => {
  try {
    const { limit = 50 } = req.query;
    logger.debug('Fetching products from database');
    const { rows } = await pool.query('SELECT * FROM products LIMIT $1', [limit]);
    logger.debug('Products fetched successfully', { count: rows.length });
    res.json(rows);
  } catch (err: any) {
    handleDatabaseError(err, 'fetch products', res);
  }
});

router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    logger.debug('Fetching product from database', { id: req.params.id });
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM products WHERE product_id = $1', [id]);
    logger.debug('Record fetched successfully', { product: rows[0] });
    res.json(rows[0]);
  } catch (err: any) {
    handleDatabaseError(err, 'fetch product', res);
  }
});

router.post('/products', async (req: Request, res: Response) => {
  try {
    logger.debug('Creating product', { body: req.body });
    const { name, price, description, stock, category_id, sku, weight_g, is_active } = req.body;
    await pool.query('INSERT INTO products (name, price, description, stock, category_id, sku, weight_g, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [name, price, description, stock, category_id, sku, weight_g, is_active]);
    logger.debug('Record created successfully', { name, price });
    res.status(201).json({ message: 'Product created successfully' });
  } catch (err: any) {
    const { name, price, description, stock, category_id, sku, weight_g, is_active } = req.body;
    const sql = `INSERT INTO products (name, price, description, stock, category_id, sku, weight_g, is_active) VALUES (${name}, ${price}, ${description}, ${stock}, ${category_id}, ${sku}, ${weight_g}, ${is_active})`;
    logger.error('Failed to create product', { error: err.message, sql });
    handleDatabaseError(err, 'create product', res);
  }
});

router.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.debug('Deleting product', { id });
    await pool.query('DELETE FROM products WHERE product_id = $1', [id]);
    logger.debug('Record deleted successfully', { id });
    res.status(204).send();
  } catch (err: any) {
    handleDatabaseError(err, 'delete product', res);
  }
});

router.get('/top/products-by-category/:categoryId', async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const { limit = 50 } = req.query;
    const { rows } = await pool.query(`SELECT p.name, p.price, c.name AS category FROM products p
JOIN categories c ON p.category_id = c.category_id
WHERE c.category_id = $1
ORDER BY p.price DESC LIMIT $2`,
[categoryId, limit]);
    logger.debug('Products fetched successfully', { count: rows.length });
    res.json(rows);
  } catch (err: any) {
    handleDatabaseError(err, 'fetch products by category', res);
  }
});

router.get('/top/customers-by-total-spent', async (req: Request, res: Response) => {
  const { limit = 50 } = req.query;
  try {
    const { rows } = await pool.query(`SELECT customer_email, SUM(total_amount) AS total_spent FROM orders
GROUP BY customer_email
ORDER BY total_spent DESC LIMIT $1`, [limit]);
    logger.debug('Customers fetched successfully', { count: rows.length });
    res.json(rows);
  } catch (err: any) {
    handleDatabaseError(err, 'fetch customers by total spent', res);
  }
});

router.get('/orders/delivered', async (req: Request, res: Response) => {
  try {
//     const { rows } = await pool.query(`SELECT order_id, customer_name, total_amount, status FROM orders
// WHERE status = 'Delivered' AND order_date >= NOW() - INTERVAL '30 days'`);
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
    AND s.shipping_carrier = 'FedEx'
    AND o.order_id IN (
        SELECT oi.order_id
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        WHERE p.price > (SELECT AVG(price) FROM products)
    )
ORDER BY
    o.order_date DESC;`);
    logger.debug('Orders fetched successfully', { count: rows.length });
    res.json(rows);
  } catch (err: any) {
    handleDatabaseError(err, 'fetch delivered orders', res);
  }
});

export default router;