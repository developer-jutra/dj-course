// 🔥🔥🔥 CRITICAL 🔥🔥🔥: This MUST be the first import and execution to ensure all other modules are instrumented.
import { initTelemetry, setHealthStatus } from "./otlp-instrumentation";
const { loggerProvider, tracerProvider } = initTelemetry();
setHealthStatus(true); // Initially set health to true

// 🔥🔥🔥 CRITICAL 🔥🔥🔥: OTLP SDK monkey-patches express and http. Disrupting the order of imports "breaks" instrumentation.
// Therefore, the 'otlp-instrumentation.ts' file is imported at the beginning, not where it is used.

const dotenv = require("dotenv");
dotenv.config();

// Assert env vars (assuming env.js does not import express)
const { assertEnvVars } = require("./env");
assertEnvVars(
  'NODE_ENV',
  'SERVICE_NAME',
  'LOKI_HOST',
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DB'
);

// Import types for Express. These are stripped out during compilation and don't load the module.
import type { Request, Response, NextFunction } from "express";

// 🔥🔥🔥 CRITICAL 🔥🔥🔥: Import express and other dependencies NOW.
// OpenTelemetry is already configured and will patch them upon load.

import bodyParser from "body-parser";
import { pool, isDatabaseHealthy, initializeDatabase } from "./database";
// const logger = loggerProvider.getLogger();
import logger from "./logger";

const express: typeof import("express") = require("express");
const router = require("./router").default;
const routerMisc = require("./router-misc").default;
// why not just `import express from "express"`?
// 🔥imports are hoisted to the top of the file... and require is not.

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware to log all requests
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl}`, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      userId: (req as any).user?.id || "anonymous",
      userAgent: req.get("User-Agent"),
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
    stack: err.stack,
  });
  res
    .status(500)
    .json({ error: "Internal Server Error", details: err.message });
});
app.use(bodyParser.json());


app.get("/health", async (req: Request, res: Response) => {
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
    status: isHealthy ? "OK" : "DEGRADED",
    timestamp: Date.now(),
    dependencies: {
      database: {
        status: dbStatus,
        latency: dbLatency ? `${dbLatency}ms` : null
      }
    }
  };

  // Update OTLP health status based on database health
  setHealthStatus(isHealthy);

  logger.info(`Health check - ${status.status}`, { 
    status,
    dbHealthy: isDatabaseHealthy 
  });
  
  // Return 200 even if DB is down - the app is still running and can recover
  res.status(200).json(status);
});

// Serve static files
app.use(express.static("public"));

app.use(router);
app.use(routerMisc);

// Re-export metrics from the OTLP exporter (to make prometheus config simpler, e.g. no need to scrape EITHER 3000 OR 9464)
app.get('/metrics', async (req: Request, res: Response) => {
  // forward request to 9464, forward response's content-type and body
  const response = await fetch('http://localhost:9464/metrics');
  const body = await response.text();
  res.setHeader('Content-Type', response.headers.get('content-type') as string);
  res.send(body);
});

let server: any;

async function startServer() {
  try {
    // Wait for database initialization
    await initializeDatabase();
    
    // Start the server
    server = app.listen(PORT, () => {
      logger.info(`OTLP-Instrumented Products API running on http://localhost:${PORT}`);
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
      
      // Shutdown telemetry
      await loggerProvider.shutdown();
      await tracerProvider.shutdown();
      logger.info('Telemetry shutdown complete');
      
      process.exit(0);
    } catch (err: any) {
      logger.error('Error during shutdown', { error: err.message });
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