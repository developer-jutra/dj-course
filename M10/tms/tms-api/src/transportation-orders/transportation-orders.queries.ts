import { pool } from '../database';
import logger from '../logger';

export const getTransportationOrders = async (customerId?: string) => {
  try {
    const { rows } = customerId
      ? await pool.query(
          'SELECT * FROM transportation_orders WHERE customer_id = $1 ORDER BY order_date DESC LIMIT 100',
          [customerId]
        )
      : await pool.query(
          'SELECT * FROM transportation_orders ORDER BY order_date DESC LIMIT 100'
        );
    return rows;
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Error fetching transportation orders', {
      error: err.message,
      customer_id: customerId,
    });
    throw error;
  }
};
