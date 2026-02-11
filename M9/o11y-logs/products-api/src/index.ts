import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import logger from './logger';
import { assertEnvVars } from './env';
import router from './router';
import routerMisc from './router-misc';
import { pool, isDatabaseHealthy, initializeDatabase } from './database';
import * as http from "http";

assertEnvVars(
  'PORT',
  'NODE_ENV',
  'SERVICE_NAME',
  'LOKI_HOST',
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DB'
);

const app = express();

// Extend the Request interface to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

// Middleware to log all requests
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl}`, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id || 'anonymous',
      userAgent: req.get('User-Agent')
    });
  });
  next();
});

// Error logging middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error processing request`, {
    method: req.method,
    url: req.originalUrl,
    error: err.message,
    stack: err.stack
  });
  res.status(500).json({ error: 'Internal Server Error' });
});

app.get('/health', async (req: Request, res: Response) => {
  // Check database health
  let dbStatus = 'unhealthy';
  let dbLatency = null;
  
  try {
    const start = Date.now();
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    dbLatency = Date.now() - start;
    dbStatus = 'healthy';
  } catch (err: any) {
    logger.error('Health check - database connection failed', {
      error: err.message
    });
  }
  
  const isHealthy = dbStatus === 'healthy';
  const status = { 
    uptime: process.uptime(),
    status: isHealthy ? 'OK' : 'DEGRADED',
    timestamp: Date.now(),
    dependencies: {
      database: {
        status: dbStatus,
        latency: dbLatency ? `${dbLatency}ms` : null
      }
    }
  };
  
  logger.info(`Health check - ${status.status}`, { 
    status,
    dbHealthy: isDatabaseHealthy 
  });
  
  // Return 200 even if DB is down - the app is still running and can recover
  // If you want to return 503 when DB is down, uncomment below:
  // res.status(isHealthy ? 200 : 503).json(status);
  res.status(200).json(status);
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(router);
app.use(routerMisc);

const port = process.env.PORT;

// Start server only after database is initialized
let server: http.Server;

async function startServer() {
  try {
    // Wait for database initialization
    await initializeDatabase();
    
    // Start the server
    server = app.listen(port, () => {
      const formattedTime = new Date().toISOString();
      logger.info(`Winston/Loki-Based Products API running on http://localhost:${port} at ${formattedTime}`);
    });
  } catch (err: any) {
    logger.error('Failed to start server', { error: err.message });
    process.exit(1);
  }
}

startServer();

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  
  // Stop accepting new connections
  server.close(async () => {
    logger.info('HTTP server closed');
    
    // Close database connections
    try {
      await pool.end();
      logger.info('Database pool closed');
      process.exit(0);
    } catch (err: any) {
      logger.error('Error closing database pool', { error: err.message });
      process.exit(1);
    }
  });
  
  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught exception', { 
    error: err.message, 
    stack: err.stack 
  });
  // Don't exit immediately - let the app continue if possible
});

process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled promise rejection', { 
    reason: reason?.toString(),
    stack: reason?.stack 
  });
  // Don't exit immediately - let the app continue if possible
});
