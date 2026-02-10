import mongoose from 'mongoose';
import { logger } from '~/server/utils/logger';

/**
 * Nitro plugin to handle MongoDB connection.
 * Mongoose maintains an internal connection pool.
 */
export default defineNitroPlugin(async (nitroApp) => {
    const config = useRuntimeConfig();

    if (!config.mongodbUri) {
        logger.error('MONGODB_URI is not defined in runtimeConfig');
        return;
    }

    try {
        await mongoose.connect(config.mongodbUri, {
            autoIndex: true, // Recommended for development to build indexes
        });
        logger.info('Successfully connected to MongoDB', { uri: config.mongodbUri.replace(/:[^:@]+@/, ':****@') });
    } catch (e) {
        logger.error('MongoDB connection error', e as Error, { uri: config.mongodbUri.replace(/:[^:@]+@/, ':****@') });
    }
});
