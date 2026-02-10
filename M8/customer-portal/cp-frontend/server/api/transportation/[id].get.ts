import { TransportationRequest } from './TransportationRequest.model';
import { createScopedLogger } from '~/server/utils/logger';

const logger = createScopedLogger('API:transportation:detail');

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');
        
        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Request ID is required',
            });
        }
        
        const request = await TransportationRequest.findOne({ requestNumber: id })
            .select('-__v')
            .lean();
        
        if (!request) {
            logger.warn(`Transportation request not found: ${id}`);
            throw createError({
                statusCode: 404,
                statusMessage: 'Transportation request not found',
            });
        }
        
        logger.info(`Fetched transportation request: ${id}`);
        
        // Map MongoDB document to include id field (using requestNumber)
        return {
            ...request,
            id: request.requestNumber
        };
    } catch (e) {
        if ((e as any).statusCode) {
            throw e;
        }
        logger.error('Failed to fetch transportation request', e as Error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch transportation request from database',
        });
    }
});
