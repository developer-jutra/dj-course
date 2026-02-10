import { WarehousingRequest } from './WarehousingRequest.model';
import { createScopedLogger } from '~/server/utils/logger';

const logger = createScopedLogger('API:warehousing');

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);
        
        // Build filter object
        const filter: any = {};
        
        if (query.status) {
            filter.status = query.status;
        }
        
        if (query.priority) {
            filter.priority = query.priority;
        }
        
        if (query.storageType) {
            filter.storageType = query.storageType;
        }
        
        if (query.securityLevel) {
            filter.securityLevel = query.securityLevel;
        }
        
        if (query.dateFrom) {
            filter.plannedStartDate = { 
                $gte: new Date(query.dateFrom as string) 
            };
        }
        
        if (query.dateTo) {
            if (filter.plannedStartDate) {
                filter.plannedStartDate.$lte = new Date(query.dateTo as string);
            } else {
                filter.plannedStartDate = { 
                    $lte: new Date(query.dateTo as string) 
                };
            }
        }
        
        const requests = await WarehousingRequest.find(filter)
            .select('-__v')
            .sort({ createdAt: -1 })
            .lean();
        
        // Map MongoDB documents to include id field (using requestNumber)
        const mappedRequests = requests.map((req: any) => ({
            ...req,
            id: req.requestNumber
        }));
        
        logger.info(`Fetched ${mappedRequests.length} warehousing requests`, { 
            filters: query,
            count: mappedRequests.length 
        });
        
        return mappedRequests;
    } catch (e) {
        logger.error('Failed to fetch warehousing requests', e as Error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch warehousing requests from database',
        });
    }
});
