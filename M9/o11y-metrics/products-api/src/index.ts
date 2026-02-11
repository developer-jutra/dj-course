import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import promClient from 'prom-client';
import promBundle from 'express-prom-bundle';
import logger from './logger';
import { assertEnvVars, getPkg } from './env';
import { pool } from './database';
import router from './router';
import routerMisc from './router-misc';
import dotenv from 'dotenv';
import os from 'node:os';
import { isBlacklistedPath } from './url-blacklist';

dotenv.config();

assertEnvVars(
  'PORT',
  'NODE_ENV',
  'SERVICE_NAME',
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME'
);

const pkg = getPkg();
const port = process.env.PORT;

promClient.register.setDefaultLabels({
  app: pkg.name,
  version: pkg.version,
  hostname: os.hostname(),
  environment: process.env.NODE_ENV
});

// Health check metrics
const healthStatus = new promClient.Gauge({
  name: 'health_status',
  help: 'Service health status (1 = healthy, 0 = unhealthy)',
  // labelNames: [], // no additional labels defined 🔥
  // uncomment following:
  // labelNames: ['weather'], // search for the other monkeys 🙉🙈🙊
});

const uptimeGauge = new promClient.Gauge({
  name: 'process_uptime_seconds',
  help: 'Application uptime in seconds',
  // labelNames: [], // no additional labels defined 🔥
});

const HTTPRequestTotalCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status'], // watch out for cardinality! 🔥
  // labelNames: ['method', 'path', 'status', 'userId'], // this would be a disastrous idea 🔥
});

// Initialize metrics at startup
healthStatus.set(1); // 1 = healthy
// healthStatus.set({ weather: 'sunny' }, 1); // search for the other monkeys 🙉🙈🙊

setInterval(() => {
  const uptime = process.uptime();
  uptimeGauge.set(uptime);
}, 1000);

// Collect default metrics (CPU, memory, etc.)
promClient.collectDefaultMetrics({
  // prefix: `${pkg.name}_`, // Optional naming convention
  gcDurationBuckets: [0.1, 0.5, 1, 2], // Optional GC metrics config
  labels: { app: pkg.name, version: pkg.version, hostname: os.hostname() },
});

const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  normalizePath: [
    ['^/products/\\d+', '/products/#id'], // Handle numeric IDs
    // ['^/user/[a-z0-9-]+', '/user/#id']    // Sample UUID pattern
  ],
  bypass: (req) => isBlacklistedPath(req.path),
  customLabels: { 
    route: '', // 🔥 Custom label for route, otherwise error thrown (histogram has to specify labels upfront)
    app: pkg.name,
    version: pkg.version,
    hostname: os.hostname(),
    environment: process.env.NODE_ENV
  },
  transformLabels: (labels: promClient.LabelValues<string>, req: Request) => {
    labels.route = labels.path; // Create route alias
    delete labels.path; // Remove original path label
    return labels;
  }
});

const app = express();
app.use(metricsMiddleware);
// more or less equivalent to:
// app.get('/metrics', async (req, res) => {
//   try {
//     res.set('Content-Type', promClient.register.contentType);

//     healthStatus.set(1);
//     uptimeGauge.set(process.uptime());

//     res.send(await promClient.register.metrics()); // Critical await
//   } catch (err) {
//     res.status(500).end('Metrics generation failed');
//   }
// });

// Middleware to log all requests
app.use((req: Request, res: Response, next: NextFunction) => {
  if (isBlacklistedPath(req.path)) return next();
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl}`, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      userId: (req as any).user?.id || 'anonymous',
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
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});
app.use(bodyParser.json())

// HTTP request counter middleware gets executed after all routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
    if (isBlacklistedPath(req.path)) return;
    HTTPRequestTotalCounter.inc({
      method: req.method,
      path: req.path,
      status: res.statusCode
    });
  });
  next();
});

const lcpHistogram = new promClient.Histogram({
  name: 'web_vitals_lcp',
  help: 'Largest Contentful Paint in milliseconds',
  labelNames: ['page_path', 'device_type', 'connection_type', 'user_agent'],
  buckets: [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 8000, 10000] // Based on LCP thresholds
});

const inpHistogram = new promClient.Histogram({
  name: 'web_vitals_inp',
  help: 'Interaction to Next Paint in milliseconds',
  labelNames: ['page_path', 'device_type', 'connection_type', 'user_agent'],
  buckets: [50, 100, 150, 200, 300, 400, 500, 750, 1000] // Based on INP thresholds
});

const clsHistogram = new promClient.Histogram({
  name: 'web_vitals_cls',
  help: 'Cumulative Layout Shift score',
  labelNames: ['page_path', 'device_type', 'connection_type', 'user_agent'],
  buckets: [0.01, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.5, 1] // Based on CLS thresholds
});

// Metrics proxy endpoint
app.post('/client_metrics', async (req: Request, res: Response) => {
  logger.debug('Client metrics received', { body: req.body });
  const { name, value, page_path, device_type, connection_type, user_agent } = req.body;
  const labels = { 
    page_path: page_path || '/', 
    device_type: device_type || 'unknown', 
    connection_type: connection_type || 'unknown',
    user_agent: user_agent || 'unknown'
  };
  logger.warn('is this a good idea to set user_agent as a label? Why?', { user_agent });

  if (name === 'LCP') {
    lcpHistogram.observe(labels, value);
  } else if (name === 'INP') {
    inpHistogram.observe(labels, value);
  } else if (name === 'CLS') {
    clsHistogram.observe(labels, value);
  }
  
  res.sendStatus(204);
});

app.get('/health', (req: Request, res: Response) => {
  const status = { 
    uptime: process.uptime(),
    status: 'OK',
    timestamp: Date.now()
  };
  logger.debug('Health check', { status });

  res.status(200).json(status);
});

// Serve static files
app.use(express.static('public'));

app.use(router);
app.use(routerMisc);

app.listen(port, () => {
  const formattedTime = new Date().toISOString();
  logger.info(`Prometheus-Instrumented Products API running on http://localhost:${port} at ${formattedTime}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  
  try {
    await pool.end();
    logger.info('Database connection pool closed');
    process.exit(0);
  } catch (err: any) {
    logger.error('Error closing database connection pool', { error: err.message });
    process.exit(1);
  }
});
