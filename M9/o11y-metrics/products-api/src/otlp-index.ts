// 🔥🔥🔥 CRITICAL 🔥🔥🔥: This MUST be the first import and execution to ensure all other modules are instrumented.
import { initMetrics, setHealthStatus } from "./otlp-instrumentation";
const { lcpHistogram, inpHistogram, clsHistogram } = initMetrics();
setHealthStatus(true); // Initially set health to true

// 🔥🔥🔥 CRITICAL 🔥🔥🔥: OTLP SDK monkey-patches express and http. Disrupting the order of imports "breaks" instrumentation.
// Therefore, the 'otlp-instrumentation.ts' file is imported at the beginning, not where it is used.

const dotenv = require("dotenv");
dotenv.config();

// Assert env vars (assuming env.js does not import express)
const { assertEnvVars } = require("./env.js");
assertEnvVars(
  "NODE_ENV",
  "SERVICE_NAME",
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME"
);

// Import types for Express. These are stripped out during compilation and don't load the module.
import type { Request, Response, NextFunction } from "express";

// 🔥🔥🔥 CRITICAL 🔥🔥🔥: Import express and other dependencies NOW.
// OpenTelemetry is already configured and will patch them upon load.

import bodyParser from "body-parser";
import { pool } from "./database";
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

// Metrics proxy endpoint
app.post("/client_metrics", async (req: Request, res: Response) => {
  logger.debug('Client metrics received', { body: req.body });
  const { name, value, page_path, device_type, connection_type, user_agent } = req.body;
  const attributes = {
    page_path: page_path || "/",
    device_type: device_type || "unknown",
    connection_type: connection_type || "unknown",
    user_agent: user_agent || "unknown",
  };

  logger.warn('is this a good idea to set user_agent as a label? Why?', { user_agent });

  if (name === "LCP") {
    lcpHistogram.record(value, attributes);
  } else if (name === "INP") {
    inpHistogram.record(value, attributes);
  } else if (name === "CLS") {
    clsHistogram.record(value, attributes);
  }

  res.sendStatus(204);
});

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