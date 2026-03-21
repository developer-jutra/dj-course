import express from 'express';

import statusRoutes from './status/status.routes';
import vehiclesRoutes from './vehicles/vehicles.routes';
import driversRoutes from './drivers/drivers.routes';
import notificationsRoutes from './notifications/notifications.routes';
import transportationOrdersRoutes from './transportation-orders/transportation-orders.routes';
import customersRoutes from './customers/customers.routes';
import cargoPlansRoutes from './cargo-plans/cargo-plans.routes';

const router = express.Router();

router.use('/', statusRoutes);
router.use('/vehicles', vehiclesRoutes);
router.use('/drivers', driversRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/transportation-orders', transportationOrdersRoutes);
router.use('/customers', customersRoutes);
router.use('/cargo-plans', cargoPlansRoutes);

export default router;
