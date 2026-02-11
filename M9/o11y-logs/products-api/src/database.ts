import { Pool } from 'pg';
import logger from './logger';

// Database connection state tracking
export let isDatabaseHealthy = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const RECONNECT_INTERVAL_MS = 5000;

// Control whether to run periodic health checks (recursive) or just initial check
const CHECK_DB_CONN_LOOP = process.env.CHECK_DB_CONN_LOOP === 'true' || false;

// Create and export the pool with resilience configuration
export const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: parseInt(process.env.POSTGRES_PORT!, 10),
  
  // Connection pool settings for resilience
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // return an error after 10 seconds if connection could not be established
  
  // Retry settings
  query_timeout: 10000, // queries timeout after 10 seconds
});

// Handle pool errors to prevent application crashes
pool.on('error', (err: Error) => {
  logger.error('Unexpected database pool error - connection lost', {
    error: err.message,
    stack: err.stack,
    reconnectAttempts
  });
  isDatabaseHealthy = false;
  
  // Don't exit the process - let the app continue running
  // The health check and query error handlers will handle individual requests
});

// Handle successful connections
pool.on('connect', () => {
  logger.info('Database pool established new connection');
  // Only set healthy if we haven't validated yet
  if (!isDatabaseHealthy) {
    isDatabaseHealthy = true;
    reconnectAttempts = 0;
  }
});

// Handle client removal from pool
pool.on('remove', () => {
  logger.debug('Database client removed from pool');
});

// Test initial connection and set up periodic health checks
async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    isDatabaseHealthy = true;
    reconnectAttempts = 0;
    logger.info('Database connection test successful');
    return true;
  } catch (err: any) {
    isDatabaseHealthy = false;
    reconnectAttempts++;
    logger.error('Database connection test failed', {
      error: err.message,
      attempt: reconnectAttempts,
      maxAttempts: MAX_RECONNECT_ATTEMPTS
    });
    return false;
  }
}

// Periodic health check and reconnection logic
async function maintainConnection() {
  const isHealthy = await testConnection();
  
  if (!isHealthy && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    logger.warn('Database unhealthy - scheduling reconnection attempt', {
      nextAttemptIn: `${RECONNECT_INTERVAL_MS}ms`,
      attempt: reconnectAttempts,
      maxAttempts: MAX_RECONNECT_ATTEMPTS
    });
    setTimeout(maintainConnection, RECONNECT_INTERVAL_MS);
  } else if (!isHealthy) {
    logger.error('Database unhealthy - max reconnection attempts reached', {
      attempts: reconnectAttempts,
      maxAttempts: MAX_RECONNECT_ATTEMPTS
    });
    // Reset counter to allow future reconnection attempts
    reconnectAttempts = 0;
    setTimeout(maintainConnection, RECONNECT_INTERVAL_MS * 2);
  } else {
    // Connection is healthy - check again in 30 seconds
    setTimeout(maintainConnection, 30000);
  }
}

// Initialize connection monitoring - wait for initial connection before starting server
export const initializeDatabase = async (): Promise<void> => {
  const isHealthy = await testConnection();
  
  if (isHealthy) {
    logger.info('Initial database connection established successfully');
    isDatabaseHealthy = true;
  } else {
    logger.error('Initial database connection failed');
    throw new Error('Failed to establish initial database connection');
  }
  
  // Only start periodic health checks if CHECK_DB_CONN_LOOP is enabled
  if (CHECK_DB_CONN_LOOP) {
    logger.info('Database connection loop enabled - starting periodic health checks');
    setTimeout(maintainConnection, 30000);
  } else {
    logger.info('Database connection loop disabled - only initial check performed');
  }
};