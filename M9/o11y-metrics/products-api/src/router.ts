import express, { Request, Response } from 'express';
import logger from "./logger";
import { pool } from "./database";

const router = express.Router();

router.get('/products', async (req: Request, res: Response) => {
  try {
    const { limit = 50 } = req.query;
    logger.debug('Fetching products from database');
    const { rows } = await pool.query('SELECT * FROM products LIMIT $1', [limit]);
    logger.debug('Products fetched successfully', { count: rows.length });
    res.json(rows);
  } catch (err: any) {
    logger.error('Failed to fetch products', { error: err.message });
    res.status(500).json({ error: err.message });
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
    logger.error('Failed to fetch product', { error: err.message });
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    logger.error('Failed to delete product', { error: err.message });
    res.status(500).json({ error: err.message });
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
    logger.error('Failed to fetch products by category', { error: err.message });
    res.status(500).json({ error: err.message });
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
    logger.error('Failed to fetch customers by total spent', { error: err.message });
    res.status(500).json({ error: err.message });
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
    AND o.order_date >= NOW() - INTERVAL '30 days'
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
    logger.error('Failed to fetch delivered orders', { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

export default router;