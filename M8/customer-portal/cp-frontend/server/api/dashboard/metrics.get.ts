import { Metrics, type IMetrics } from './Metrics.model';
import { createScopedLogger } from '~/server/utils/logger';

const logger = createScopedLogger('API:dashboard:metrics');

export default defineEventHandler(async (event): Promise<IMetrics> => {
    try {
        const metrics = await Metrics.findOne().select('-createdAt -updatedAt -__v -_id').lean();
        // const metrics = await Metrics.findOne().select('-createdAt -updatedAt -__v -_id')
        
        if (!metrics) {
            logger.warn('Metrics not found in database');
            throw createError({
                statusCode: 404,
                statusMessage: 'Metrics not found',
            });
        }
        
        logger.info('fetched metrics', metrics);
        
        return metrics;
    } catch (e) {
        logger.error('Failed to fetch metrics', e as Error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch metrics from database',
        });
    }
});
