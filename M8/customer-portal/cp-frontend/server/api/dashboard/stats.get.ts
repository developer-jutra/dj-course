import { DashboardStat, type IDashboardStat } from './DashboardStat.model';
import { createScopedLogger } from '~/server/utils/logger';

const logger = createScopedLogger('API:dashboard:stats');

export default defineEventHandler(async (event): Promise<IDashboardStat[]> => {
    try {
        const stats = await DashboardStat.find({ visible: true }).select('-createdAt -updatedAt -__v -_id').lean();
        logger.info(`Fetched ${stats.length} dashboard stats`);
        
        return stats;
    } catch (e) {
        logger.error('Failed to fetch dashboard stats', e as Error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch dashboard stats from database',
        });
    }
});
