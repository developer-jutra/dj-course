// database.ts
import { Pool } from 'pg';
import { trace, context, SpanStatusCode } from '@opentelemetry/api';

// Parse DATABASE_URL to extract connection parameters
// This is required for proper OpenTelemetry instrumentation to set db_client_connection_pool_name
const parseConnectionString = (url: string) => {
  const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) {
    throw new Error('Invalid DATABASE_URL format');
  }
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4], 10),
    database: match[5],
  };
};

const dbConfig = parseConnectionString(process.env.DATABASE_URL!);

const pool = new Pool(dbConfig);

// Initialize a tracer for database operations
const tracer = trace.getTracer('database');

// Function to get all products
const getProducts = async () => {
  // Start a span for this database call
  const span = tracer.startSpan('getProducts', {
    attributes: {
      'db.system': 'postgresql',
      'db.statement': 'SELECT * FROM products',
    },
  });
  try {
    // Run the query within the span's context
    const { rows } = await context.with(trace.setSpan(context.active(), span), () =>
      pool.query('SELECT * FROM products')
    );
    span.setStatus({ code: SpanStatusCode.OK });
    return rows;
  } catch (error: any) {
    // Record exception and mark the span as errored
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    span.recordException(error);
    console.error('Error fetching products:', error);
    throw error;
  } finally {
    // End the span
    span.end();
  }
};

const getProductById = async (id: string) => {
  const span = tracer.startSpan('getProductById', {
    attributes: {
      'db.system': 'postgresql',
      'db.statement': 'SELECT * FROM products WHERE product_id = $1',
    },
  });
  try {
    const { rows } = await context.with(trace.setSpan(context.active(), span), () =>
      pool.query('SELECT * FROM products WHERE product_id = $1', [id])
    );
    span.setStatus({ code: SpanStatusCode.OK });
    return rows[0];
  } catch (error: any) {
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    span.recordException(error);
    console.error('Error fetching product by id:', error);
    throw error;
  } finally {
    span.end();
  }
};

export {
  pool,
  getProducts,
  getProductById,
};
