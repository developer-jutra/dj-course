// use only for local development (outside of Docker; see .env.local file)
// require('dotenv').config();

import express from 'express';

import { pool } from './database';
import { assertEnvVars } from './env';
import logger from './logger';
import routes from './router';

assertEnvVars('PORT', 'NODE_ENV', 'SERVICE_NAME', 'DATABASE_URL');

const port = process.env.PORT;

const app = express();

// Body parser MUST be first to parse request body
app.use(express.json());

// Mount routers
app.use(routes);

// Start the server
app.listen(port, () => {
  const formattedTime = new Date().toISOString();
  logger.info(`Server started on port ${port} at ${formattedTime}`, {
    port: Number(port),
    env: process.env.NODE_ENV,
    service: process.env.SERVICE_NAME,
    timestamp: formattedTime,
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('Graceful shutdown initiated', { signal: 'SIGTERM' });

  try {
    await pool.end();
    logger.info('Database connection pool closed successfully');
  } catch (err: unknown) {
    const error = err as Error;
    logger.error('Failed to close database connection pool', {
      error: {
        message: error.message,
        stack: error.stack,
      },
    });
  }

  logger.info('HTTP server closed');
  process.exit(0);
});
