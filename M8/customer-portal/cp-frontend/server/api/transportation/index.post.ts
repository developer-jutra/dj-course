import { TransportationRequest } from './TransportationRequest.model';
import { createScopedLogger } from '~/server/utils/logger';
import type { Error as MongooseError } from 'mongoose';

const logger = createScopedLogger('API:transportation:create');

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        
        // Generate request number
        const requestNumber = `TR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
        
        // Create new transportation request
        // Mongoose will automatically validate based on schema during save()
        const newRequest = new TransportationRequest({
            requestNumber,
            type: 'TRANSPORTATION',
            status: 'SUBMITTED',
            priority: body.priority,
            pickupLocation: body.pickupLocation,
            deliveryLocation: body.deliveryLocation,
            cargo: body.cargo,
            serviceType: body.serviceType,
            vehicleRequirements: body.vehicleRequirements || {
                vehicleType: 'TRUCK',
                capacity: 0,
                specialEquipment: [],
                driverRequirements: []
            },
            requestedPickupDate: new Date(body.requestedPickupDate),
            requestedDeliveryDate: body.requestedDeliveryDate ? new Date(body.requestedDeliveryDate) : new Date(),
            specialInstructions: body.specialInstructions,
            requiresInsurance: body.requiresInsurance,
            requiresCustomsClearance: body.requiresCustomsClearance,
            currency: body.currency || 'EUR',
            progressUpdates: [],
            createdBy: body.createdBy || '1',
            companyId: body.companyId || '1'
        });
        
        // Mongoose validates automatically during save() based on schema
        await newRequest.save();
        
        logger.info(`Created transportation request: ${requestNumber}`);
        
        const requestData = newRequest.toObject();
        
        return {
            success: true,
            message: 'Transportation request submitted successfully',
            requestNumber,
            data: {
                ...requestData,
                id: requestNumber
            }
        };
    } catch (e) {
        const error = e as MongooseError;
        
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values((error as any).errors).map((err: any) => ({
                field: err.path,
                message: err.message
            }));
            
            logger.warn('Validation error', { errors: validationErrors });
            
            throw createError({
                statusCode: 400,
                statusMessage: 'Validation failed',
                data: { errors: validationErrors }
            });
        }
        
        logger.error('Failed to create transportation request', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to create transportation request',
        });
    }
});
