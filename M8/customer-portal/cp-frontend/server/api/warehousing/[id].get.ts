import { WarehousingRequest } from './WarehousingRequest.model';
import { createScopedLogger } from '~/server/utils/logger';

const logger = createScopedLogger('API:warehousing:detail');

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');
        
        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Request ID is required',
            });
        }
        
        const request = await WarehousingRequest.findOne({ requestNumber: id })
            .select('-__v')
            .lean();
        
        if (!request) {
            logger.warn(`Warehousing request not found: ${id}`);
            throw createError({
                statusCode: 404,
                statusMessage: 'Warehousing request not found',
            });
        }
        
        logger.info(`Fetched warehousing request: ${id}`);
        
        // Map MongoDB document to include id field (using requestNumber)
        return {
            ...request,
            id: request.requestNumber
        };
    } catch (e) {
        if ((e as any).statusCode) {
            throw e;
        }
        logger.error('Failed to fetch warehousing request', e as Error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch warehousing request from database',
        });
    }
});
