"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./logger"));
const database_1 = require("./database");
const router = express_1.default.Router();
// Server start time for uptime calculation (index route)
const serverStartTime = new Date();
// Index: server uptime (ported from tms-api-py routes/index.py)
router.get('/', (_req, res) => {
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
    res.type('text/plain').send(`Server up and running since ${startStr}. Uptime: ${uptimeStr}`);
});
// Health check
router.get('/health', (_req, res) => {
    logger_1.default.debug('Health check requested');
    res.json({ status: 'ok', service: process.env.SERVICE_NAME || 'tms-api' });
});
// Route to get all vehicles
router.get('/vehicles', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.info('Fetching all vehicles');
        const vehicles = yield (0, database_1.getVehicles)();
        logger_1.default.info('Retrieved vehicles', {
            vehicle_count: vehicles.length,
            operation: 'get_all_vehicles',
        });
        res.json(vehicles);
    }
    catch (error) {
        const err = error;
        logger_1.default.error('Failed to fetch vehicles', {
            error: { message: err.message, stack: err.stack },
            operation: 'get_all_vehicles',
        });
        res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
}));
// Route to get vehicle by ID
router.get('/vehicles/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: 'Vehicle ID is required' });
        }
        const vehicle = yield (0, database_1.getVehicleById)(String(req.params.id));
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        logger_1.default.info('Retrieved vehicle', {
            vehicle_id: vehicle.id,
            operation: 'get_vehicle_by_id',
        });
        res.json(vehicle);
    }
    catch (error) {
        const err = error;
        logger_1.default.error('Failed to fetch vehicle by id', {
            error: { message: err.message, stack: err.stack },
            vehicle_id: req.params.id,
            operation: 'get_vehicle_by_id',
        });
        res
            .status(500)
            .json({ error: 'Failed to fetch vehicle by id', id: req.params.id });
    }
}));
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
router.get('/notifications', (_req, res) => {
    res.json(mockNotifications);
});
// Route to get transportation orders
router.get('/transportation-orders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.info('Fetching transportation orders');
        const orders = yield (0, database_1.getTransportationOrders)();
        logger_1.default.info('Retrieved transportation orders', {
            order_count: orders.length,
            operation: 'get_transportation_orders',
        });
        res.json(orders);
    }
    catch (error) {
        const err = error;
        logger_1.default.error('Failed to fetch transportation orders', {
            error: { message: err.message, stack: err.stack },
            operation: 'get_transportation_orders',
        });
        res.status(500).json({ error: 'Failed to fetch transportation orders' });
    }
}));
// Route to get all drivers
router.get('/drivers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield database_1.pool.query('SELECT * FROM drivers LIMIT 100');
        logger_1.default.debug('Drivers fetched successfully', { count: rows.length });
        res.json(rows);
    }
    catch (err) {
        const error = err;
        logger_1.default.error('Failed to fetch drivers', { error: error.message });
        res.status(500).json({ error: error.message });
    }
}));
// Route to get driver by ID (ported from tms-api-py routes/drivers.py)
router.get('/drivers/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = String(req.params.id);
    try {
        const driver = yield (0, database_1.getDriverById)(id);
        if (!driver) {
            return res.status(404).json({ error: 'Driver not found' });
        }
        logger_1.default.debug('Driver fetched', { driver_id: driver.id });
        res.json(driver);
    }
    catch (err) {
        const error = err;
        logger_1.default.error('Failed to fetch driver by id', {
            error: error.message,
            driver_id: id,
        });
        res.status(500).json({ error: error.message });
    }
}));
// Route to create driver (ported from tms-api-py routes/drivers.py)
router.post('/drivers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        if (!body || typeof body !== 'object') {
            return res.status(400).json({ error: 'Invalid data' });
        }
        const driver = yield (0, database_1.createDriver)({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            phone: body.phone,
            contract_type: body.contract_type,
            status: body.status,
        });
        logger_1.default.info('Driver created', { driver_id: driver.id });
        res.status(201).json(driver);
    }
    catch (err) {
        const error = err;
        logger_1.default.error('Failed to create driver', { error: error.message });
        res.status(500).json({ error: error.message });
    }
}));
// Route to create vehicle (ported from tms-api-py routes/vehicles.py)
router.post('/vehicles', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        if (!body || typeof body !== 'object') {
            return res.status(400).json({ error: 'Invalid data' });
        }
        const vehicle = yield (0, database_1.createVehicle)({
            make: body.make,
            model: body.model,
            year: body.year,
            fuel_tank_capacity: body.fuel_tank_capacity,
        });
        logger_1.default.info('Vehicle created', { vehicle_id: vehicle.id });
        res.status(201).json(vehicle);
    }
    catch (err) {
        const error = err;
        logger_1.default.error('Failed to create vehicle', { error: error.message });
        res.status(500).json({ error: error.message });
    }
}));
// Route to update vehicle (ported from tms-api-py routes/vehicles.py)
router.put('/vehicles/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = String(req.params.id);
    try {
        const body = req.body;
        const vehicle = yield (0, database_1.updateVehicle)(id, {
            make: body === null || body === void 0 ? void 0 : body.make,
            model: body === null || body === void 0 ? void 0 : body.model,
            year: body === null || body === void 0 ? void 0 : body.year,
            fuel_tank_capacity: body === null || body === void 0 ? void 0 : body.fuel_tank_capacity,
        });
        if (!vehicle) {
            return res.status(404).json({
                error: 'Vehicle not found or invalid data',
            });
        }
        logger_1.default.info('Vehicle updated', { vehicle_id: vehicle.id });
        res.json(vehicle);
    }
    catch (err) {
        const error = err;
        logger_1.default.error('Failed to update vehicle', {
            error: error.message,
            vehicle_id: id,
        });
        res.status(500).json({ error: error.message });
    }
}));
// Route to delete vehicle (ported from tms-api-py routes/vehicles.py)
router.delete('/vehicles/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = String(req.params.id);
    try {
        const deleted = yield (0, database_1.deleteVehicle)(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        logger_1.default.info('Vehicle deleted', { vehicle_id: id });
        res.status(204).send();
    }
    catch (err) {
        const error = err;
        logger_1.default.error('Failed to delete vehicle', {
            error: error.message,
            vehicle_id: id,
        });
        res.status(500).json({ error: error.message });
    }
}));
exports.default = router;
