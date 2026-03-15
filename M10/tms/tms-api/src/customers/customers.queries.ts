import { pool } from '../database';
import logger from '../logger';

type CustomerListItem = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  customer_type: string | null;
};

type GetCustomersDbParams = {
  limit: number;
  offset: number;
  search?: string;
};

type GetCustomersDbResult = {
  rows: CustomerListItem[];
  total: number;
};

export const getCustomers = async (
  params: GetCustomersDbParams
): Promise<GetCustomersDbResult> => {
  try {
    const values: Array<string | number> = [];
    let whereClause = '';

    if (params.search) {
      values.push(`${params.search.toLowerCase()}%`);
      whereClause = `WHERE LOWER(first_name) LIKE $1 OR LOWER(last_name) LIKE $1`;
    }

    const countQuery = `SELECT COUNT(*)::int AS total FROM customers ${whereClause}`;
    const countResult = await pool.query<{ total: number }>(countQuery, values);
    const total = countResult.rows[0]?.total ?? 0;

    const dataQuery = `
      SELECT id, first_name, last_name, email, phone, customer_type
      FROM customers
      ${whereClause}
      ORDER BY id
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;

    const dataValues = [...values, params.limit, params.offset];
    const dataResult = await pool.query<CustomerListItem>(dataQuery, dataValues);

    return {
      rows: dataResult.rows,
      total,
    };
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Error fetching customers', { error: err.message });
    throw error;
  }
};

export type CustomerOrderSummary = {
  id: number;
  order_number: string;
  amount: number;
  status: string;
};

export const getCustomerById = async (id: string) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, first_name, last_name, email, phone, customer_type, address, version FROM customers WHERE id = $1',
      [id]
    );
    return rows[0];
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Error fetching customer by id', { error: err.message });
    throw error;
  }
};

export const getOrdersByCustomerId = async (
  customerId: string
): Promise<CustomerOrderSummary[]> => {
  try {
    const { rows } = await pool.query<CustomerOrderSummary>(
      `SELECT id, order_number, amount, status
       FROM transportation_orders
       WHERE customer_id = $1
       ORDER BY order_date DESC`,
      [customerId]
    );
    return rows;
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Error fetching orders by customer id', { error: err.message });
    throw error;
  }
};

type UpdateCustomerNameParams = {
  id: string;
  version: number;
  first_name?: string;
  last_name?: string;
};

type UpdatedCustomer = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  version: number;
};

type UpdateCustomerNameResult =
  | { status: 'ok'; data: UpdatedCustomer }
  | { status: 'not_found' }
  | { status: 'version_conflict' };

export const updateCustomerName = async (
  params: UpdateCustomerNameParams
): Promise<UpdateCustomerNameResult> => {
  try {
    const setClauses: string[] = [];
    const values: Array<string | number> = [];

    if (params.first_name !== undefined) {
      values.push(params.first_name);
      setClauses.push(`first_name = $${values.length}`);
    }
    if (params.last_name !== undefined) {
      values.push(params.last_name);
      setClauses.push(`last_name = $${values.length}`);
    }

    setClauses.push(`version = version + 1`);

    values.push(params.id);
    const idParamIndex = values.length;
    values.push(params.version);
    const versionParamIndex = values.length;

    const { rows } = await pool.query<UpdatedCustomer>(
      `UPDATE customers
       SET ${setClauses.join(', ')}
       WHERE id = $${idParamIndex} AND version = $${versionParamIndex}
       RETURNING id, first_name, last_name, version`,
      values
    );

    if (!rows[0]) {
      const check = await pool.query<{ id: number }>(
        'SELECT id FROM customers WHERE id = $1',
        [params.id]
      );
      if (check.rows.length === 0) return { status: 'not_found' };
      return { status: 'version_conflict' };
    }

    return { status: 'ok', data: rows[0] };
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Error updating customer name', { error: err.message });
    throw error;
  }
};

export const deleteCustomer = async (id: string) => {
  try {
    const result = await pool.query('DELETE FROM customers WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Error deleting customer', { error: err.message });
    throw error;
  }
};
