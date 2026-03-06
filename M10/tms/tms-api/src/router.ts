import express, { Request, Response } from 'express';
import logger from './logger';
import {
  getVehicles,
  getVehicleById,
  getTransportationOrders,
  getDriverById,
  createDriver,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  pool,
} from './database';

const router = express.Router();

// Server start time for uptime calculation (index route)
const serverStartTime = new Date();

// Index: server uptime (ported from tms-api-py routes/index.py)
router.get('/', (_req: Request, res: Response) => {
  const uptimeMs = Date.now() - serverStartTime.getTime();
  const seconds = Math.floor(uptimeMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const d = days;
  const h = hours % 24;
  const m = minutes % 60;
  const s = seconds % 60;
  const uptimeStr = `${d}d ${h}h ${m}m ${s}s`;
  const startStr = serverStartTime.toISOString().replace('T', ' ').replace('Z', ' UTC');
  res.type('text/plain').send(
    `Server up and running since ${startStr}. Uptime: ${uptimeStr}`
  );
});

// Health check
router.get('/health', (_req: Request, res: Response) => {
  logger.debug('Health check requested');
  res.json({ status: 'ok', service: process.env.SERVICE_NAME || 'tms-api' });
});

// Route to get all vehicles
router.get('/vehicles', async (req: Request, res: Response) => {
  try {
    logger.info('Fetching all vehicles');
    const vehicles = await getVehicles();
    logger.info('Retrieved vehicles', {
      vehicle_count: vehicles.length,
      operation: 'get_all_vehicles',
    });
    res.json(vehicles);
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Failed to fetch vehicles', {
      error: { message: err.message, stack: err.stack },
      operation: 'get_all_vehicles',
    });
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// Route to get vehicle by ID
router.get('/vehicles/:id', async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: 'Vehicle ID is required' });
    }
    const vehicle = await getVehicleById(String(req.params.id));
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
      vehicle_id: req.params.id,
      operation: 'get_vehicle_by_id',
    });
    res
      .status(500)
      .json({ error: 'Failed to fetch vehicle by id', id: req.params.id });
  }
});

// Mock notifications (ported from tms-api-py routes/notifications.py)
const mockNotifications = [
  { id: 1, type: 'success', message: 'Payment received', time: '2h' },
  { id: 2, type: 'info', message: 'Order #12345 has been shipped', time: '5h' },
  { id: 3, type: 'message', message: 'New message from Sarah Wilson', time: '8h' },
  { id: 4, type: 'warning', message: '3 orders have delayed', time: '1d' },
  { id: 5, type: 'success', message: 'Driver completed delivery', time: '3h' },
  { id: 6, type: 'info', message: 'Truck TR005 maintenance scheduled', time: '6h' },
  { id: 7, type: 'message', message: 'Customer inquiry from John Doe', time: '12h' },
  { id: 8, type: 'warning', message: 'Low fuel alert for truck TR002', time: '2d' },
  { id: 9, type: 'success', message: 'Route optimization completed', time: '4h' },
  { id: 10, type: 'info', message: 'Weather alert for route I-95', time: '7h' },
  { id: 11, type: 'message', message: 'Driver availability request', time: '1d' },
  { id: 12, type: 'warning', message: 'Traffic delay on Route 101', time: '15h' },
];

// Route to get notifications (ported from tms-api-py routes/notifications.py)
router.get('/notifications', (_req: Request, res: Response) => {
  res.json(mockNotifications);
});

// Route to get transportation orders
router.get('/transportation-orders', async (req: Request, res: Response) => {
  try {
    logger.info('Fetching transportation orders');
    const orders = await getTransportationOrders();
    logger.info('Retrieved transportation orders', {
      order_count: orders.length,
      operation: 'get_transportation_orders',
    });
    res.json(orders);
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Failed to fetch transportation orders', {
      error: { message: err.message, stack: err.stack },
      operation: 'get_transportation_orders',
    });
    res.status(500).json({ error: 'Failed to fetch transportation orders' });
  }
});

// Route to get all drivers
router.get('/drivers', async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM drivers LIMIT 100');
    logger.debug('Drivers fetched successfully', { count: rows.length });
    res.json(rows);
  } catch (err: unknown) {
    const error = err as Error;
    logger.error('Failed to fetch drivers', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Route to get driver by ID (ported from tms-api-py routes/drivers.py)
router.get('/drivers/:id', async (req: Request, res: Response) => {
  const id = String(req.params.id);
  try {
    const driver = await getDriverById(id);
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
});

// Route to create driver (ported from tms-api-py routes/drivers.py)
router.post('/drivers', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Invalid data' });
    }
    const driver = await createDriver({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      phone: body.phone,
      contract_type: body.contract_type,
      status: body.status,
    });
    logger.info('Driver created', { driver_id: driver.id });
    res.status(201).json(driver);
  } catch (err: unknown) {
    const error = err as Error;
    logger.error('Failed to create driver', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Route to create vehicle (ported from tms-api-py routes/vehicles.py)
router.post('/vehicles', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Invalid data' });
    }
    const vehicle = await createVehicle({
      make: body.make,
      model: body.model,
      year: body.year,
      fuel_tank_capacity: body.fuel_tank_capacity,
    });
    logger.info('Vehicle created', { vehicle_id: vehicle.id });
    res.status(201).json(vehicle);
  } catch (err: unknown) {
    const error = err as Error;
    logger.error('Failed to create vehicle', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Route to update vehicle (ported from tms-api-py routes/vehicles.py)
router.put('/vehicles/:id', async (req: Request, res: Response) => {
  const id = String(req.params.id);
  try {
    const body = req.body;
    const vehicle = await updateVehicle(id, {
      make: body?.make,
      model: body?.model,
      year: body?.year,
      fuel_tank_capacity: body?.fuel_tank_capacity,
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
      error: error.message,
      vehicle_id: id,
    });
    res.status(500).json({ error: error.message });
  }
});

// Route to delete vehicle (ported from tms-api-py routes/vehicles.py)
router.delete('/vehicles/:id', async (req: Request, res: Response) => {
  const id = String(req.params.id);
  try {
    const deleted = await deleteVehicle(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    logger.info('Vehicle deleted', { vehicle_id: id });
    res.status(204).send();
  } catch (err: unknown) {
    const error = err as Error;
    logger.error('Failed to delete vehicle', {
      error: error.message,
      vehicle_id: id,
    });
    res.status(500).json({ error: error.message });
  }
});

export default router;
