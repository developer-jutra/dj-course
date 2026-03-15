import { Request, Response } from 'express';
import express from 'express';

import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from './vehicles.queries';
import logger from '../logger';
import { parsePositiveInt, parsePathId } from '../shared/query-parsers';
import { ErrorResponse } from '../types/data-contracts';
import { Vehicles } from '../types/VehiclesRoute';
import { queryParams } from '../zod/contract';

const router = express.Router();

router.get(
  '/',
  async (
    req: Request<
      Vehicles.GetVehicles.RequestParams,
      Vehicles.GetVehicles.ResponseBody | ErrorResponse,
      Vehicles.GetVehicles.RequestBody,
      Vehicles.GetVehicles.RequestQuery
    >,
    res: Response<Vehicles.GetVehicles.ResponseBody | ErrorResponse>,
  ) => {
    try {
      const queryValidation = queryParams.getVehicles.safeParse(req.query);
      if (!queryValidation.success) {
        return res.status(400).json({ error: queryValidation.error.issues.map(i => i.message).join(', ') });
      }

      const page = parsePositiveInt(req.query.page, 1);
      const limit = Math.min(parsePositiveInt(req.query.limit, 20), 100);
      const offset = (page - 1) * limit;

      const result = await getVehicles({ limit, offset });
      const totalPages = Math.ceil(result.total / limit);

      const responseBody: Vehicles.GetVehicles.ResponseBody = {
        data: result.rows,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages,
        },
      };

      logger.info('Retrieved vehicles', {
        vehicle_count: result.rows.length,
        operation: 'get_all_vehicles',
      });
      res.json(responseBody);
    } catch (error: unknown) {
      const err = error as Error;
      logger.error('Failed to fetch vehicles', {
        error: { message: err.message, stack: err.stack },
        operation: 'get_all_vehicles',
      });
      res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
  },
);

router.get(
  '/:id',
  async (
    req: Request<
      Vehicles.GetVehicleById.RequestParams,
      Vehicles.GetVehicleById.ResponseBody | ErrorResponse,
      Vehicles.GetVehicleById.RequestBody,
      Vehicles.GetVehicleById.RequestQuery
    >,
    res: Response<Vehicles.GetVehicleById.ResponseBody | ErrorResponse>,
  ) => {
    const id = parsePathId(req.params.id);
    if (id === null) {
      return res.status(400).json({ error: 'Vehicle ID must be a positive integer' });
    }
    try {
      const vehicle = await getVehicleById(String(id));
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }
      logger.info('Retrieved vehicle', {
        vehicle_id: vehicle.id,
        operation: 'get_vehicle_by_id',
      });
      res.json(vehicle);
    } catch (error: unknown) {
      const err = error as Error;
      logger.error('Failed to fetch vehicle by id', {
        error: { message: err.message, stack: err.stack },
        vehicle_id: id,
        operation: 'get_vehicle_by_id',
      });
      res.status(500).json({ error: 'Failed to fetch vehicle by id' });
    }
  },
);

router.post(
  '/',
  async (
    req: Request<
      Vehicles.CreateVehicle.RequestParams,
      Vehicles.CreateVehicle.ResponseBody | ErrorResponse,
      Vehicles.CreateVehicle.RequestBody,
      Vehicles.CreateVehicle.RequestQuery
    >,
    res: Response<Vehicles.CreateVehicle.ResponseBody | ErrorResponse>,
  ) => {
    const body = req.body;
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Invalid request body' });
    }
    if (!body.model || typeof body.model !== 'string') {
      return res.status(400).json({ error: 'model is required and must be a string' });
    }
    if (body.year !== undefined && body.year !== null && !Number.isInteger(body.year)) {
      return res.status(400).json({ error: 'year must be an integer' });
    }
    try {
      const vehicle = await createVehicle({
        make: body.make ?? undefined,
        model: body.model ?? undefined,
        year: body.year ?? undefined,
        fuel_tank_capacity: body.fuel_tank_capacity ?? undefined,
      });
      logger.info('Vehicle created', { vehicle_id: vehicle.id });
      res.status(201).json(vehicle);
    } catch (err: unknown) {
      const error = err as Error;
      logger.error('Failed to create vehicle', {
        error: { message: error.message, stack: error.stack },
        operation: 'create_vehicle',
      });
      res.status(500).json({ error: 'Failed to create vehicle' });
    }
  },
);

router.put(
  '/:id',
  async (
    req: Request<
      Vehicles.UpdateVehicle.RequestParams,
      Vehicles.UpdateVehicle.ResponseBody | ErrorResponse,
      Vehicles.UpdateVehicle.RequestBody,
      Vehicles.UpdateVehicle.RequestQuery
    >,
    res: Response<Vehicles.UpdateVehicle.ResponseBody | ErrorResponse>,
  ) => {
    const id = parsePathId(req.params.id);
    if (id === null) {
      return res.status(400).json({ error: 'Vehicle ID must be a positive integer' });
    }
    const body = req.body;
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Invalid request body' });
    }
    if (body.year !== undefined && body.year !== null && !Number.isInteger(body.year)) {
      return res.status(400).json({ error: 'year must be an integer' });
    }
    try {
      const vehicle = await updateVehicle(String(id), {
        make: body.make ?? undefined,
        model: body.model ?? undefined,
        year: body.year ?? undefined,
        fuel_tank_capacity: body.fuel_tank_capacity ?? undefined,
      });
      if (!vehicle) {
        return res.status(404).json({
          error: 'Vehicle not found or invalid data',
        });
      }
      logger.info('Vehicle updated', { vehicle_id: vehicle.id });
      res.json(vehicle);
    } catch (err: unknown) {
      const error = err as Error;
      logger.error('Failed to update vehicle', {
        error: { message: error.message, stack: error.stack },
        vehicle_id: id,
        operation: 'update_vehicle',
      });
      res.status(500).json({ error: 'Failed to update vehicle' });
    }
  },
);

router.delete(
  '/:id',
  async (
    req: Request<
      Vehicles.DeleteVehicle.RequestParams,
      Vehicles.DeleteVehicle.ResponseBody | ErrorResponse,
      Vehicles.DeleteVehicle.RequestBody,
      Vehicles.DeleteVehicle.RequestQuery
    >,
    res: Response<Vehicles.DeleteVehicle.ResponseBody | ErrorResponse>,
  ) => {
    const id = parsePathId(req.params.id);
    if (id === null) {
      return res.status(400).json({ error: 'Vehicle ID must be a positive integer' });
    }
    try {
      const deleted = await deleteVehicle(String(id));
      if (!deleted) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }
      logger.info('Vehicle deleted', { vehicle_id: id });
      res.status(204).send();
    } catch (err: unknown) {
      const error = err as Error;
      logger.error('Failed to delete vehicle', {
        error: { message: error.message, stack: error.stack },
        vehicle_id: id,
        operation: 'delete_vehicle',
      });
      res.status(500).json({ error: 'Failed to delete vehicle' });
    }
  },
);

router.all('/', (_req, res) => res.status(405).set('Allow', 'GET, POST').json({ error: 'Method Not Allowed' }));
router.all('/:id', (_req, res) => res.status(405).set('Allow', 'GET, PUT, DELETE').json({ error: 'Method Not Allowed' }));

export default router;
