'use strict';

import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor, ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
// import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';

const SERVICE_NAME = process.env.OTEL_SERVICE_NAME
const OTLP_ENDPOINT = process.env.OTEL_EXPORTER_OTLP_ENDPOINT

export const initializeTracing = (): void => {
  const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: SERVICE_NAME,
    [ATTR_SERVICE_VERSION]: '1.0.0'
  });

  const traceExporter = new OTLPTraceExporter({
    // url: `${OTLP_ENDPOINT}/v1/traces`
    url: OTLP_ENDPOINT
  });

  const consoleExporter = new ConsoleSpanExporter();

  // For debugging, you can also log to console
  const spanProcessors = process.env.CONSOLE_TRACE_EXPORTER === 'true' ? [
    new BatchSpanProcessor(traceExporter),        // For OTLP backend
    new SimpleSpanProcessor(consoleExporter)      // For console/debugging
  ] : [
    new BatchSpanProcessor(traceExporter)        // For OTLP backend
  ];

  const sdk = new NodeSDK({
    resource,
    spanProcessors,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();

  // Graceful shutdown
  process.on('SIGTERM', () => {
    sdk.shutdown()
      .then(() => console.log('Tracing terminated'))
      .catch((error) => console.error('Error terminating tracing', error))
      .finally(() => process.exit(0));
  });
};
