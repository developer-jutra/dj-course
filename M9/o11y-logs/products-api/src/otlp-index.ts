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
import { pool } from "./database";
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


app.get("/health", (req: Request, res: Response) => {
  // Here you could add logic to determine health and call setHealthStatus(false) if needed
  const status = {
    uptime: process.uptime(),
    status: "OK",
    timestamp: Date.now(),
  };

  logger.debug('Health check', { status });
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

app.listen(PORT, () => {
  logger.info(`OTLP-Instrumented Products API running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM signal received: closing HTTP server");

  try {
    await pool.end();
    logger.info("Database connection pool closed");
    process.exit(0);
  } catch (err: any) {
    logger.error("Error closing database connection pool", {
      error: err.message,
    });
    process.exit(1);
  }
});