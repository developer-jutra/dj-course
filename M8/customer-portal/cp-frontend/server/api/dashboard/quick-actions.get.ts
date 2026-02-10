import { QuickAction, type IQuickAction } from './QuickAction.model';
import { createScopedLogger } from '~/server/utils/logger';

const logger = createScopedLogger('API:dashboard:quick-actions');

export default defineEventHandler(async (event): Promise<IQuickAction[]> => {
    try {
        const actions = await QuickAction.find().select('-createdAt -updatedAt -__v -_id').lean();
        logger.info(`Fetched ${actions.length} quick actions`);
        
        return actions;
    } catch (e) {
        logger.error('Failed to fetch quick actions', e as Error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch quick actions from database',
        });
    }
});
