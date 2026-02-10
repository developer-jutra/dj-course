import { TransportationRequest } from './TransportationRequest.model';
import { createScopedLogger } from '~/server/utils/logger';

const logger = createScopedLogger('API:transportation');

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
        
        if (query.serviceType) {
            filter.serviceType = query.serviceType;
        }
        
        if (query.dateFrom) {
            filter.requestedPickupDate = { 
                $gte: new Date(query.dateFrom as string) 
            };
        }
        
        if (query.dateTo) {
            if (filter.requestedPickupDate) {
                filter.requestedPickupDate.$lte = new Date(query.dateTo as string);
            } else {
                filter.requestedPickupDate = { 
                    $lte: new Date(query.dateTo as string) 
                };
            }
        }
        
        const requests = await TransportationRequest.find(filter)
            .select('-__v')
            .sort({ createdAt: -1 })
            .lean();
        
        // Map MongoDB documents to include id field (using requestNumber)
        const mappedRequests = requests.map((req: any) => ({
            ...req,
            id: req.requestNumber
        }));
        
        logger.info(`Fetched ${mappedRequests.length} transportation requests`, { 
            filters: query,
            count: mappedRequests.length 
        });
        
        return mappedRequests;
    } catch (e) {
        logger.error('Failed to fetch transportation requests', e as Error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch transportation requests from database',
        });
    }
});
