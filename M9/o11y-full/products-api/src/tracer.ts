import { trace } from '@opentelemetry/api';

// Get service name from environment variables
const SERVICE_NAME = process.env.SERVICE_NAME!;
const SERVICE_VERSION = '1.0.0';

// Get tracer instance for manual instrumentation
export const tracer = trace.getTracer(SERVICE_NAME!, SERVICE_VERSION);
