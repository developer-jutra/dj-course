// Load environment variables first
// use only for local development (outside of Docker; see .env.local file)
// require('dotenv').config();

// Initialize tracing before importing any other modules (!)
import setupTracing from './tracing';
const sdk = setupTracing();

import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

import { pool, getProducts, getProductById } from './database';
import logger from './logger';
import { assertEnvVars } from './env';
import { metrics, ValueType } from '@opentelemetry/api';

assertEnvVars(
  'NODE_ENV',
  'SERVICE_NAME',
  'LOKI_HOST',
  'DATABASE_URL',
  'OTEL_EXPORTER_OTLP_TRACES_ENDPOINT',
  'OTEL_EXPORTER_OTLP_METRICS_ENDPOINT',
  'OTEL_SERVICE_NAME'
);

const port = process.env.PORT || 3000;

// OTel metrics
const meter = metrics.getMeter('products-api');
const healthStatus = meter.createObservableGauge('health_status', {
  description: 'Service health status (1 = healthy, 0 = unhealthy)',
  unit: '1',
  valueType: ValueType.INT,
});
healthStatus.addCallback(result => result.observe(1)); // 1 = healthy

const uptimeGauge = meter.createObservableGauge('process_uptime_seconds', {
  description: 'Application uptime in seconds',
  unit: 's',
  valueType: ValueType.DOUBLE,
});
uptimeGauge.addCallback(result => result.observe(process.uptime()));

const HTTPRequestTotalCounter = meter.createCounter('http_requests_total', {
  description: 'Total number of HTTP requests',
  valueType: ValueType.INT,
});

const app = express();

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
    HTTPRequestTotalCounter.add(1, {
      method: req.method,
      path: req.path,
      status: res.statusCode
    });
  });
  next();
});

const lcpHistogram = meter.createHistogram('web_vitals_lcp', {
  description: 'Largest Contentful Paint in miliseconds',
  unit: 'ms',
  valueType: ValueType.DOUBLE,
});

const inpHistogram = meter.createHistogram('web_vitals_inp', {
  description: 'Interaction to Next Paint in miliseconds',
  unit: 'ms',
  valueType: ValueType.DOUBLE,
});

const clsHistogram = meter.createHistogram('web_vitals_cls', {
  description: 'Cumulative Layout Shift score',
  valueType: ValueType.DOUBLE,
});

// Add global storage for memory leak simulation
const leakStorage: any[] = [];

app.get('/inject-leak', async (req: Request, res: Response) => {
  // Allocate 10 MB of data and store to simulate memory leak
  const size = 4 * 1024 * 1024; // 10 MB
  const array = new Array(size).fill(0);
  leakStorage.push(array);
  res.status(200).json({
    status: 'leaked',
    leakedBytes: size,
    totalLeaks: leakStorage.length
  });
});

app.get('/inject-error', async (req: Request, res: Response) => {
  // Randomize error status code from a predefined set
  const statusCodes = [400, 401, 403, 404, 500, 503];
  const randomStatus = statusCodes[Math.floor(Math.random() * statusCodes.length)];

  // Return the randomized error
  res.status(randomStatus).json({
    error: 'This is a failing endpoint',
    status: randomStatus
  });
});

// Metrics proxy endpoint
// app.post('/client_metrics', express.text(), async (req, res) => { // text was passed to pushgateway
app.post('/client_metrics', async (req: Request, res: Response) => {
  console.log(req.body)
  const { name, value, page_path, device_type, connection_type } = req.body;
  const labels = { 
    page_path: page_path || '/', 
    device_type: device_type || 'unknown', 
    connection_type: connection_type || 'unknown' 
  };

  if (name === 'LCP') {
    lcpHistogram.record(value, labels);
  } else if (name === 'INP') {
    inpHistogram.record(value, labels);
  } else if (name === 'CLS') {
    clsHistogram.record(value, labels);
  }
  
  res.sendStatus(204);
});

app.get('/health', (req: Request, res: Response) => {
  const status = { 
    uptime: process.uptime(),
    status: 'OK',
    timestamp: Date.now()
  };

  res.status(200).json(status);
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/error', (req: Request, res: Response, next: NextFunction) => {
  logger.debug('Generating sample error');
  next(new Error('Sample error'));
  res.status(500).json({ error: 'This is a failing endpoint' });
});

// Route to get all products
app.get('/products', async (req: Request, res: Response) => {
  try {
    logger.info('Fetching all products');
    const products = await getProducts();
    logger.info(`Retrieved ${products.length} products`);
    res.json(products);
  } catch (error: any) {
    logger.error('Error fetching products', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/products/:id', async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    const product = await getProductById(String(req.params.id));
    logger.info(`Retrieved product ${product.product_id}`);
    res.json(product);
  } catch (error: any) {
    logger.error('Error fetching product by id', { error: error.message, id: req.params.id });
    res.status(500).json({ error: 'Failed to fetch product by id', id: req.params.id });
  }
});

// Start the server
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  
  try {
    await pool.end();
    logger.info('Database connection pool closed');
  } catch (err: any) {
    logger.error('Error closing database connection pool', { error: err.message });
  }
  
  sdk.shutdown()
    .then(() => logger.info('Tracing terminated'))
    .catch((error: any) => logger.error('Error terminating tracing', { error: error.message }))
    .finally(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
});
