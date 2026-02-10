import { RecentRequest, type IRecentRequest } from './RecentRequest.model';
import { createScopedLogger } from '~/server/utils/logger';

const logger = createScopedLogger('API:dashboard:recent-requests');

export default defineEventHandler(async (event): Promise<IRecentRequest[]> => {
    try {
        const requests = await RecentRequest.find()
            .sort({ date: -1 })
            .select('-createdAt -updatedAt -__v -_id')
            .lean();
        
        logger.info(`Fetched recent requests`, requests);
        
        return requests;
    } catch (e) {
        logger.error('Failed to fetch recent requests', e as Error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch recent requests from database',
        });
    }
});
