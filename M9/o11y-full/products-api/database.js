// database.js
const { Pool } = require('pg');
const { trace, context, SpanStatusCode } = require('@opentelemetry/api');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

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
  } catch (error) {
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

module.exports = {
  pool,
  getProducts,
};
