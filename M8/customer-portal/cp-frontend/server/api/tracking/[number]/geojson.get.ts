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

        const featureCollection = {
            type: 'FeatureCollection' as const,
            trackingNumber: tracking.trackingNumber,
            status: tracking.status,
            serviceType: tracking.serviceType,
            origin: tracking.origin,
            destination: tracking.destination,
            estimatedDelivery: tracking.estimatedDelivery,
            actualDelivery: tracking.actualDelivery,
            features: [
                {
                    type: 'Feature' as const,
                    geometry: {
                        type: 'LineString' as const,
                        coordinates: tracking.route.map(p => [p.lng, p.lat])
                    },
                    properties: {
                        kind: 'route',
                        name: `${tracking.origin} → ${tracking.destination}`,
                        waypoints: tracking.route.map(p => p.name)
                    }
                },
                ...tracking.trackingEvents.map(e => ({
                    type: 'Feature' as const,
                    geometry: {
                        type: 'Point' as const,
                        coordinates: [e.lng, e.lat]
                    },
                    properties: {
                        kind: 'event',
                        type: e.type,
                        name: e.name,
                        description: e.description,
                        estimatedTime: e.estimatedTime ?? null,
                        actualTime: e.actualTime ?? null,
                        isCompleted: e.isCompleted
                    }
                })),
                {
                    type: 'Feature' as const,
                    geometry: {
                        type: 'Point' as const,
                        coordinates: [tracking.currentPosition.lng, tracking.currentPosition.lat]
                    },
                    properties: {
                        kind: 'vehicle',
                        name: 'Current vehicle position'
                    }
                }
            ]
        };

        const filename = `tracking-${tracking.trackingNumber}.geojson`;
        setResponseHeader(event, 'Content-Type', 'application/geo+json');
        setResponseHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`);

        logger.info(`Generated GeoJSON for tracking: ${number}`);
        return featureCollection;
    } catch (e) {
        if ((e as any).statusCode) {
            throw e;
        }
        logger.error('Failed to generate tracking GeoJSON', e as Error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to generate tracking GeoJSON',
        });
    }
});
