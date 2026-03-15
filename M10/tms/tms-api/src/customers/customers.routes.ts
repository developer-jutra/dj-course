import { Request, Response } from 'express';
import express from 'express';

import {
  deleteCustomer,
  getCustomerById,
  getCustomers,
  getOrdersByCustomerId,
  updateCustomerName,
} from './customers.queries';
import logger from '../logger';
import { ErrorResponse } from '../types/data-contracts';
import { Customers } from '../types/CustomersRoute';
import { parseOptionalQueryString, parsePositiveInt, parsePathId } from '../shared/query-parsers';
import { buildBaseUrl } from '../shared/request-helpers';
import { queryParams } from '../zod/contract';

const router = express.Router();

router.get(
  '/',
  async (
    req: Request<
      Customers.GetCustomers.RequestParams,
      Customers.GetCustomers.ResponseBody | ErrorResponse,
      Customers.GetCustomers.RequestBody,
      Customers.GetCustomers.RequestQuery
    >,
    res: Response<Customers.GetCustomers.ResponseBody | ErrorResponse>,
  ) => {
  try {
    const queryValidation = queryParams.getCustomers.safeParse(req.query);
    if (!queryValidation.success) {
      return res.status(400).json({ error: queryValidation.error.issues.map(i => i.message).join(', ') });
    }

    const page = parsePositiveInt(req.query.page, 1);
    const requestedLimit = parsePositiveInt(req.query.limit, 20);
    const limit = Math.min(requestedLimit, 100);
    const search = parseOptionalQueryString(req.query.search);

    const params = { page, limit, search };
    const offset = (params.page - 1) * params.limit;
    const customersResult = await getCustomers({
      limit: params.limit,
      offset,
      search: params.search,
    });

    const baseUrl = buildBaseUrl(req as unknown as Request);

    const responseBody: Customers.GetCustomers.ResponseBody = {
      data: customersResult.rows.map((customer) => ({
        ...customer,
        _links: {
          orders: `${baseUrl}/transportation-orders?customer_id=${customer.id}`,
        },
      })),
      pagination: {
        page: params.page,
        limit: params.limit,
        total: customersResult.total,
        totalPages:
          customersResult.total === 0
            ? 0
            : Math.ceil(customersResult.total / params.limit),
      },
    };

    logger.info('Customers fetched successfully', {
      operation: 'get_customers',
      count: responseBody.data.length,
      page: params.page,
      limit: params.limit,
      search: params.search ?? null,
    });

    res.json(responseBody);
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Failed to fetch customers', {
      error: { message: err.message, stack: err.stack },
      operation: 'get_customers',
    });
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
},
);

router.get(
  '/:id',
  async (
    req: Request<
      Customers.GetCustomerById.RequestParams,
      Customers.GetCustomerById.ResponseBody | ErrorResponse,
      Customers.GetCustomerById.RequestBody,
      Customers.GetCustomerById.RequestQuery
    >,
    res: Response<Customers.GetCustomerById.ResponseBody | ErrorResponse>,
  ) => {
  try {
    const id = parsePathId(req.params.id);
    if (id === null) {
      return res.status(400).json({ error: 'Customer ID must be a positive integer' });
    }

    const customer = await getCustomerById(String(id));
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const orders = await getOrdersByCustomerId(String(id));

    const responseBody = {
      ...customer,
      orders: orders.map((o) => ({
        id: o.id,
        order_number: o.order_number,
        amount: Number(o.amount),
        status: o.status,
      })),
    };

    logger.info('Customer fetched successfully', {
      operation: 'get_customer_by_id',
      customer_id: customer.id,
    });
    res.json(responseBody);
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Failed to fetch customer by id', {
      error: { message: err.message, stack: err.stack },
      customer_id: req.params.id,
      operation: 'get_customer_by_id',
    });
    res.status(500).json({
      error: 'Failed to fetch customer by id',
      id: req.params.id,
    });
  }
},
);

router.patch(
  '/:id',
  async (
    req: Request<
      Customers.PatchCustomer.RequestParams,
      Customers.PatchCustomer.ResponseBody | ErrorResponse,
      Customers.PatchCustomer.RequestBody,
      Customers.PatchCustomer.RequestQuery
    >,
    res: Response<Customers.PatchCustomer.ResponseBody | ErrorResponse>,
  ) => {
  const parsedId = parsePathId(req.params.id);
  if (parsedId === null) {
    return res.status(400).json({ error: 'Customer ID must be a positive integer' });
  }
  const id = String(parsedId);
  try {
    const { version, first_name, last_name } = req.body;

    if (version === undefined || !Number.isInteger(version) || version < 1) {
      return res.status(400).json({ error: 'version is required and must be a positive integer' });
    }
    if (first_name === undefined && last_name === undefined) {
      return res.status(400).json({ error: 'At least one of first_name or last_name is required' });
    }
    if (first_name !== undefined && typeof first_name !== 'string') {
      return res.status(400).json({ error: 'first_name must be a string' });
    }
    if (first_name !== undefined && first_name.length > 50) {
      return res.status(400).json({ error: 'first_name must not exceed 50 characters' });
    }
    if (last_name !== undefined && typeof last_name !== 'string') {
      return res.status(400).json({ error: 'last_name must be a string' });
    }
    if (last_name !== undefined && last_name.length > 50) {
      return res.status(400).json({ error: 'last_name must not exceed 50 characters' });
    }

    const result = await updateCustomerName({ id, version, first_name, last_name });

    if (result.status === 'not_found') {
      return res.status(404).json({ error: 'Customer not found' });
    }
    if (result.status === 'version_conflict') {
      return res.status(409).json({
        error: 'Version conflict – resource was modified by another request. Fetch the latest version and retry.',
      });
    }

    logger.info('Customer name updated successfully', {
      operation: 'patch_customer',
      customer_id: id,
    });
    res.json(result.data);
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Failed to update customer name', {
      error: { message: err.message, stack: err.stack },
      customer_id: id,
      operation: 'patch_customer',
    });
    res.status(500).json({ error: 'Failed to update customer name' });
  }
},
);

router.delete(
  '/:id',
  async (
    req: Request<
      Customers.DeleteCustomer.RequestParams,
      Customers.DeleteCustomer.ResponseBody | ErrorResponse,
      Customers.DeleteCustomer.RequestBody,
      Customers.DeleteCustomer.RequestQuery
    >,
    res: Response<Customers.DeleteCustomer.ResponseBody | ErrorResponse>,
  ) => {
  const parsedId = parsePathId(req.params.id);
  if (parsedId === null) {
    return res.status(400).json({ error: 'Customer ID must be a positive integer' });
  }
  const id = String(parsedId);
  try {
    const deleted = await deleteCustomer(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    logger.info('Customer deleted successfully', {
      operation: 'delete_customer',
      customer_id: id,
    });
    res.status(204).send();
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Failed to delete customer', {
      error: { message: err.message, stack: err.stack },
      customer_id: id,
      operation: 'delete_customer',
    });
    res.status(500).json({ error: 'Failed to delete customer' });
  }
},
);

router.all('/', (_req, res) => res.status(405).set('Allow', 'GET').json({ error: 'Method Not Allowed' }));
router.all('/:id', (_req, res) => res.status(405).set('Allow', 'GET, PATCH, DELETE').json({ error: 'Method Not Allowed' }));

export default router;
