import { WarehousingRequest } from './WarehousingRequest.model';
import { createScopedLogger } from '~/server/utils/logger';

const logger = createScopedLogger('API:warehousing:create');

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        
        // Generate request number
        const requestNumber = `WH-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
        
        // Create new warehousing request
        const newRequest = new WarehousingRequest({
            requestNumber,
            type: 'WAREHOUSING',
            status: 'SUBMITTED',
            priority: body.priority,
            storageType: body.storageType,
            estimatedVolume: body.estimatedVolume,
            estimatedWeight: body.estimatedWeight,
            cargo: body.cargo,
            estimatedStorageDuration: body.estimatedStorageDuration,
            plannedStartDate: new Date(body.plannedStartDate),
            plannedEndDate: body.plannedEndDate ? new Date(body.plannedEndDate) : undefined,
            handlingServices: body.handlingServices || [],
            valueAddedServices: body.valueAddedServices || [],
            securityLevel: body.securityLevel,
            requiresTemperatureControl: body.requiresTemperatureControl,
            requiresHumidityControl: body.requiresHumidityControl,
            requiresSpecialHandling: body.requiresSpecialHandling,
            specialInstructions: body.specialInstructions,
            currency: body.currency || 'EUR',
            billingType: body.billingType,
            inventoryStatus: 'PENDING_ARRIVAL',
            progressUpdates: [],
            createdBy: body.createdBy || '1',
            companyId: body.companyId || '1'
        });
        
        await newRequest.save();
        
        logger.info(`Created warehousing request: ${requestNumber}`);
        
        const requestData = newRequest.toObject();
        
        return {
            success: true,
            message: 'Warehousing request submitted successfully',
            requestNumber,
            data: {
                ...requestData,
                id: requestNumber
            }
        };
    } catch (e) {
        logger.error('Failed to create warehousing request', e as Error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to create warehousing request',
        });
    }
});
