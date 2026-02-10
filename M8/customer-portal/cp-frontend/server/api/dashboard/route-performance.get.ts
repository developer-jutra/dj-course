import { RoutePerformance, type IRoutePerformance } from './RoutePerformance.model';
import { createScopedLogger } from '~/server/utils/logger';

const logger = createScopedLogger('API:dashboard:route-performance');

export default defineEventHandler(async (event): Promise<IRoutePerformance[]> => {
    try {
        const routePerformance = await RoutePerformance.find()
            .select('-createdAt -updatedAt -__v -_id')
            .lean();
        logger.info(`Fetched ${routePerformance.length} route performance records`);
        
        return routePerformance;
    } catch (e) {
        logger.error('Failed to fetch route performance', e as Error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch route performance from database',
        });
    }
});
