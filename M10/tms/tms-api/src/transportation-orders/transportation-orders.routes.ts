import { Request, Response } from 'express';
import express from 'express';

import { getTransportationOrders } from './transportation-orders.queries';
import { ErrorResponse } from '../types/data-contracts';
import { TransportationOrders } from '../types/TransportationOrdersRoute';
import logger from '../logger';
import { parsePathId, parseOptionalQueryString } from '../shared/query-parsers';
import { queryParams } from '../zod/contract';

const router = express.Router();

router.get('/', async (
  req: Request<
    TransportationOrders.GetTransportationOrders.RequestParams,
    TransportationOrders.GetTransportationOrders.ResponseBody | ErrorResponse,
    TransportationOrders.GetTransportationOrders.RequestBody,
    TransportationOrders.GetTransportationOrders.RequestQuery
  >,
  res: Response<TransportationOrders.GetTransportationOrders.ResponseBody | ErrorResponse>,
) => {
  try {
    const qv = queryParams.getTransportationOrders.safeParse(req.query);
    if (!qv.success) {
      return res.status(400).json({ error: qv.error.issues.map(i => i.message).join(', ') });
    }
    const customerId = parseOptionalQueryString(req.query.customer_id);

    logger.info('Fetching transportation orders', { customer_id: customerId });
    const orders = await getTransportationOrders(customerId);
    logger.info('Retrieved transportation orders', {
      order_count: orders.length,
      customer_id: customerId,
      operation: 'get_transportation_orders',
    });
    res.json(orders);
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Failed to fetch transportation orders', {
      error: { message: err.message, stack: err.stack },
      customer_id: req.query.customer_id,
      operation: 'get_transportation_orders',
    });
    res.status(500).json({ error: 'Failed to fetch transportation orders' });
  }
});

router.put('/:id/driver', async (
  req: Request<
    TransportationOrders.AssignDriverToOrder.RequestParams,
    TransportationOrders.AssignDriverToOrder.ResponseBody | ErrorResponse,
    TransportationOrders.AssignDriverToOrder.RequestBody,
    TransportationOrders.AssignDriverToOrder.RequestQuery
  >,
  res: Response<TransportationOrders.AssignDriverToOrder.ResponseBody | ErrorResponse>,
) => {
  const orderId = parsePathId(req.params.id);
  if (orderId === null) {
    return res.status(400).json({ error: 'Order ID must be a positive integer' });
  }
  try {
    const { driver_id } = req.body;

    if (driver_id === undefined || !Number.isInteger(driver_id) || driver_id < 1) {
      return res.status(400).json({ error: 'driver_id is required and must be a positive integer' });
    }

    logger.info('Assigning driver to transportation order', { order_id: orderId, driver_id });

    // TODO: implement DB operation – update transportation order with driver_id

    logger.info('Driver assigned to transportation order', { order_id: orderId, driver_id });
    res.status(200).send();
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Failed to assign driver to transportation order', {
      error: { message: err.message, stack: err.stack },
      order_id: req.params.id,
      operation: 'assign_driver_to_order',
    });
    res.status(500).json({ error: 'Failed to assign driver to transportation order' });
  }
});

router.all('/', (_req, res) => res.status(405).set('Allow', 'GET').json({ error: 'Method Not Allowed' }));
router.all('/:id/driver', (_req, res) => res.status(405).set('Allow', 'PUT').json({ error: 'Method Not Allowed' }));

export default router;
