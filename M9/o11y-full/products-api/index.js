// index.js
// Initialize tracing before importing any other modules
const setupTracing = require('./tracing');
const sdk = setupTracing();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const promClient = require('prom-client');
const promBundle = require('express-prom-bundle');
const { pool, getProducts } = require('./database');
const logger = require('./logger');
const { assertEnvVars } = require('./env');

assertEnvVars(
  'NODE_ENV',
  'SERVICE_NAME',
  'LOKI_HOST',
  'DATABASE_URL',
  'OTEL_EXPORTER_OTLP_ENDPOINT',
  'OTEL_SERVICE_NAME'
);

const port = process.env.PORT || 3000;

// Health check metrics
const healthStatus = new promClient.Gauge({
  name: 'health_status',
  help: 'Service health status (1 = healthy, 0 = unhealthy)',
});
const uptimeGauge = new promClient.Gauge({
  name: 'process_uptime_seconds',
  help: 'Application uptime in seconds',
});
const HTTPRequestTotalCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status'],
});

// Initialize metrics at startup
healthStatus.set(1); // 1 = healthy
uptimeGauge.set(process.uptime());

// Collect default metrics (CPU, memory, etc.)
promClient.collectDefaultMetrics({
  prefix: 'nodejs_', // Optional naming convention
  gcDurationBuckets: [0.1, 0.5, 1, 2], // Optional GC metrics config
  // labels: { NODE_APP_INSTANCE: process.env.NODE_APP_INSTANCE },
});

// Prometheus metrics middleware
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  normalizePath: [
    ['^/products/\\d+', '/products/#id'], // Handle numeric IDs
    // ['^/user/[a-z0-9-]+', '/user/#id']    // Sample UUID pattern
  ],
  customLabels: { 
    route: '', // Custom label for route, otherwise error thrown (histogram has to specify labels upfront)
  //   component: 'api-server',
  //   version: process.env.APP_VERSION
  },
  promClient: {
    collectDefaultMetrics: {
      timeout: 5000,
    },
  },
  transformLabels: (labels, req) => {
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
app.use((req, res, next) => {
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
app.use((err, req, res, next) => {
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
app.use((req, res, next) => {
  res.on('finish', () => {
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
  help: 'Largest Contentful Paint in miliseconds',
  labelNames: ['page_path', 'device_type', 'connection_type'],
  buckets: [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 8000, 10000] // Based on LCP thresholds
});

const inpHistogram = new promClient.Histogram({
  name: 'web_vitals_inp',
  help: 'Interaction to Next Paint in miliseconds',
  labelNames: ['page_path', 'device_type', 'connection_type'],
  buckets: [50, 100, 150, 200, 300, 400, 500, 750, 1000] // Based on INP thresholds
});

const clsHistogram = new promClient.Histogram({
  name: 'web_vitals_cls',
  help: 'Cumulative Layout Shift score',
  labelNames: ['page_path', 'device_type', 'connection_type'],
  buckets: [0.01, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.5, 1] // Based on CLS thresholds
});

// Add global storage for memory leak simulation
const leakStorage = [];

app.get('/inject-leak', async (req, res) => {
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

app.get('/inject-error', async (req, res) => {
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
app.post('/client_metrics', async (req, res) => {
  console.log(req.body)
  const { name, value, page_path, device_type, connection_type } = req.body;
  const labels = { 
    page_path: page_path || '/', 
    device_type: device_type || 'unknown', 
    connection_type: connection_type || 'unknown' 
  };

  if (name === 'LCP') {
    lcpHistogram.observe(labels, value);
  } else if (name === 'INP') {
    inpHistogram.observe(labels, value);
  } else if (name === 'CLS') {
    clsHistogram.observe(labels, value);
  }
  
  res.sendStatus(204);
});

app.get('/health', (req, res) => {
  const status = { 
    uptime: process.uptime(),
    status: 'OK',
    timestamp: Date.now()
  };

  res.status(200).json(status);
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/error', (req, res, next) => {
  logger.debug('Generating sample error');
  next(new Error('Sample error'));
  res.status(500).json({ error: 'This is a failing endpoint' });
});

// Route to get all products
app.get('/products', async (req, res) => {
  try {
    logger.info('Fetching all products');
    const products = await getProducts();
    logger.info(`Retrieved ${products.length} products`);
    res.json(products);
  } catch (error) {
    logger.error('Error fetching products', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch products' });
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
  } catch (err) {
    logger.error('Error closing database connection pool', { error: err.message });
  }
  
  sdk.shutdown()
    .then(() => logger.info('Tracing terminated'))
    .catch((error) => logger.error('Error terminating tracing', { error: error.message }))
    .finally(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
});
