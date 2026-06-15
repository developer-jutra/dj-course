import { TrackingData } from '../TrackingData.model';
import { createScopedLogger } from '~/server/utils/logger';

const logger = createScopedLogger('API:tracking:geojson');

export default defineEventHandler(async (event) => {
    try {
        const number = getRouterParam(event, 'number');

        if (!number) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Tracking number is required',
            });
        }

        const tracking = await TrackingData.findOne({ trackingNumber: number })
            .select('-__v -_id')
            .lean();

        if (!tracking) {
            logger.warn(`Tracking not found: ${number}`);
            throw createError({
                statusCode: 404,
                statusMessage: 'Tracking not found',
            });
        }

        const filename = `tracking-${tracking.trackingNumber}.geojson`;
        setResponseHeader(event, 'Content-Type', 'application/geo+json');
        setResponseHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`);

        logger.info(`Downloaded GeoJSON for tracking: ${number}`);
        return tracking;
    } catch (e) {
        if ((e as any).statusCode) {
            throw e;
        }
        logger.error('Failed to fetch tracking GeoJSON', e as Error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch tracking GeoJSON',
        });
    }
});
