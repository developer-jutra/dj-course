import { Pool, QueryResult } from 'pg';
import { trace, context, SpanStatusCode, Span } from '@opentelemetry/api';

// Create a pool connection to PostgreSQL
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT!, 10),
});

export interface Product {
  id: number;
  name: string;
  price: number;
}

// Function to get all products with OpenTelemetry tracing
export async function getProducts(): Promise<Product[]> {
  const tracer = trace.getTracer('products-service');
  return tracer.startActiveSpan('database.getProducts', async (span: Span) => {
    try {
      const result: QueryResult<Product> = await pool.query('SELECT * FROM products');
      span.setStatus({ code: SpanStatusCode.OK });
      // Add metadata to trace
      span.setAttribute('db.result_count', result.rows.length);
      return result.rows;
    } catch (error: any) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message
      });
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  });
}

// Function to get a single product by ID with OpenTelemetry tracing
export async function getProductById(id: number): Promise<Product | undefined> {
  const tracer = trace.getTracer('products-service');
  return tracer.startActiveSpan('database.getProductById', async (span: Span) => {
    try {
      span.setAttribute('db.product_id', id);
      const result: QueryResult<Product> = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
      span.setStatus({ code: SpanStatusCode.OK });
      return result.rows[0];
    } catch (error: any) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message
      });
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  });
}

// Function to create a new product with OpenTelemetry tracing
export async function createProduct({ name, price }: { name: string; price: number }): Promise<Product> {
  const tracer = trace.getTracer('products-service');
  return tracer.startActiveSpan('database.createProduct', async (span: Span) => {
    try {
      // Add attributes about the product being created
      span.setAttribute('db.product.name', name);
      span.setAttribute('db.product.price', price);
      const query = 'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *';
      const values = [name, price];
      const result: QueryResult<Product> = await pool.query(query, values);
      span.setStatus({ code: SpanStatusCode.OK });
      // Add metadata to trace about the created product
      span.setAttribute('db.product.id', result.rows[0].id);
      return result.rows[0];
    } catch (error: any) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message
      });
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  });
}
