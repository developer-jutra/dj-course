import dotenv from 'dotenv';
dotenv.config();

// Initialize tracing first
import { initTelemetry } from './instrumentation';
initTelemetry();

import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { getProducts, getProductById, createProduct, Product } from './database';
import { trace } from '@opentelemetry/api';
import axios from 'axios';
import logger from './logger';
import { assertEnvVars } from './env';

assertEnvVars(
  'PORT',
  'NODE_ENV',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DB',
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'LOG_LEVEL',
  'OTEL_SERVICE_NAME',
  'OTEL_EXPORTER_OTLP_ENDPOINT',
  'CONSOLE_TRACE_EXPORTER',
  'AVAILABILITY_API_URL'
);

const app = express();
const port = process.env.PORT;
const availabilityApiUrl = `${process.env.AVAILABILITY_API_URL}/availability`;

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Add request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  
  // Log response when finished
  res.on('finish', () => {
    logger.info(`Response sent: ${res.statusCode}`);
  });
  
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  logger.debug('Health check requested');
  res.status(200).send('OK');
});

app.get('/products', async (req, res) => {
  try {
    logger.info('Fetching all products');
    const products = await getProducts();

    // Extract IDs
    const ids = products.map(product => product.id).join(',');

    // Fetch availability from Python API
    try {
      const availabilityResp = await axios.get(`${availabilityApiUrl}?ids=${ids}`);
      const availabilityData = availabilityResp.data; // e.g. { "1": true, "5": false }

      // Merge products with availability
      const merged = products.map(product => ({
        ...product,
        available: !!availabilityData[product.id] // or `availabilityData[String(product.id)]`
      }));
  
      res.json(merged);
    } catch (e) {
      const error = e instanceof Error ? e : new Error('Unknown error');
      logger.error('Error fetching availability:', { error: error.message, stack: error.stack });
      res.status(500).json({ error: 'Failed to fetch availability' });
    }
  } catch (e) {
    const error = e instanceof Error ? e : new Error('Unknown error');
    logger.error('Error fetching products:', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to fetch products from database' });
  }
});

// Get product by ID
app.get('/products/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info(`Fetching product with ID: ${req.params.id}`);
    const id = Number(req.params.id);
    if (isNaN(id)) {
      logger.warn('Invalid product ID', { id: req.params.id });
      res.status(400).json({ error: 'Invalid product ID' });
      return;
    }
    const product = await getProductById(id);
    if (!product) {
      logger.warn(`Product not found: ${req.params.id}`);
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error: any) {
    logger.error(`Error fetching product ${req.params.id}:`, { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.post('/products', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, price } = req.body;
    if (!name || price === undefined) {
      logger.warn('Product creation failed: missing required fields', { body: req.body });
      res.status(400).json({ error: 'Product name and price are required' });
      return;
    }
    logger.info('Creating new product', req.body);
    // Create product using the existing createProduct function
    const newProduct = await createProduct({ name, price: Number(price) });
    logger.info('Product created successfully', { productId: newProduct.id });
    // Return success with the created product
    res.status(201).json(newProduct);
  } catch (error: any) {
    logger.error('Error creating product:', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to create product' });
  }
});

const myFunction = (): void => {
    for (let i = 0; i < 1000000; i++) {}
}

// Add a manual span example
app.get('/manual-trace', (req: Request, res: Response) => {
  const tracer = trace.getTracer('products-service');
  
  tracer.startActiveSpan('manual.operation', (span) => {
    try {
      // Simulate work
      myFunction();
      
      span.setAttribute('operation.value', 'success');
      span.setAttribute
      res.json({ message: 'Manual trace created' });
    } catch (error: any) {
      span.recordException(error);
      res.status(500).json({ error: 'Operation failed' });
    } finally {
      span.end();
    }
  });
});

app.listen(port, () => {
  const formattedTime = new Date().toISOString();
  logger.info(`Server running on http://localhost:${port} at ${formattedTime}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught exception:', { error: error.message, stack: error.stack });
  // Give logger time to flush before exiting
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});
