import { Request, Response } from 'express';
import express from 'express';

import { getDrivers, getDriverById, createDriver } from './drivers.queries';
import { parsePathId } from '../shared/query-parsers';
import logger from '../logger';
import { ErrorResponse } from '../types/data-contracts';
import { Drivers } from '../types/DriversRoute';

const router = express.Router();

router.get(
  '/',
  async (
    req: Request<
      Drivers.GetDrivers.RequestParams,
      Drivers.GetDrivers.ResponseBody | ErrorResponse,
      Drivers.GetDrivers.RequestBody,
      Drivers.GetDrivers.RequestQuery
    >,
    res: Response<Drivers.GetDrivers.ResponseBody | ErrorResponse>,
  ) => {
    try {
      const drivers = await getDrivers();
      logger.debug('Drivers fetched successfully', { count: drivers.length });
      res.json(drivers);
    } catch (err: unknown) {
      const error = err as Error;
      logger.error('Failed to fetch drivers', { error: error.message });
      res.status(500).json({ error: error.message });
    }
  },
);

router.get(
  '/:id',
  async (
    req: Request<
      Drivers.GetDriverById.RequestParams,
      Drivers.GetDriverById.ResponseBody | ErrorResponse,
      Drivers.GetDriverById.RequestBody,
      Drivers.GetDriverById.RequestQuery
    >,
    res: Response<Drivers.GetDriverById.ResponseBody | ErrorResponse>,
  ) => {
    const id = parsePathId(req.params.id);
    if (id === null) {
      return res.status(400).json({ error: 'Driver ID must be a positive integer' });
    }
    try {
      const driver = await getDriverById(String(id));
      if (!driver) {
        return res.status(404).json({ error: 'Driver not found' });
      }
      logger.debug('Driver fetched', { driver_id: driver.id });
      res.json(driver);
    } catch (err: unknown) {
      const error = err as Error;
      logger.error('Failed to fetch driver by id', {
        error: error.message,
        driver_id: id,
      });
      res.status(500).json({ error: error.message });
    }
  },
);

router.post(
  '/',
  async (
    req: Request<
      Drivers.CreateDriver.RequestParams,
      Drivers.CreateDriver.ResponseBody | ErrorResponse,
      Drivers.CreateDriver.RequestBody,
      Drivers.CreateDriver.RequestQuery
    >,
    res: Response<Drivers.CreateDriver.ResponseBody | ErrorResponse>,
  ) => {
    try {
      const body = req.body;
      if (!body || typeof body !== 'object') {
        return res.status(400).json({ error: 'Invalid data' });
      }
      const strFields: Array<[string, number]> = [
        ['first_name', 50], ['last_name', 50], ['email', 100],
        ['phone', 20], ['contract_type', 20], ['status', 20],
      ];
      for (const [field, max] of strFields) {
        const val = body[field as keyof typeof body];
        if (val !== undefined && val !== null) {
          if (typeof val !== 'string') {
            return res.status(400).json({ error: `${field} must be a string` });
          }
          if (val.length > max) {
            return res.status(400).json({ error: `${field} must not exceed ${max} characters` });
          }
        }
      }
      const driver = await createDriver({
        first_name: body.first_name ?? undefined,
        last_name: body.last_name ?? undefined,
        email: body.email ?? undefined,
        phone: body.phone ?? undefined,
        contract_type: body.contract_type ?? undefined,
        status: body.status ?? undefined,
      });
      logger.info('Driver created', { driver_id: driver.id });
      res.status(201).json(driver);
    } catch (err: unknown) {
      const error = err as Error;
      logger.error('Failed to create driver', { error: error.message });
      res.status(500).json({ error: error.message });
    }
  },
);

router.all('/', (_req, res) => res.status(405).set('Allow', 'GET, POST').json({ error: 'Method Not Allowed' }));
router.all('/:id', (_req, res) => res.status(405).set('Allow', 'GET').json({ error: 'Method Not Allowed' }));

export default router;
