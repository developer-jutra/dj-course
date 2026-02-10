// tracing.ts

import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { HostMetrics } from '@opentelemetry/host-metrics';
import { metrics } from '@opentelemetry/api';

// Configure the OpenTelemetry SDK
function setupTracing() {
  const sdk = new NodeSDK({
    serviceName: process.env.OTEL_SERVICE_NAME || 'products-api',
    traceExporter: new OTLPTraceExporter({
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4317',
    }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4317',
      }),
      exportIntervalMillis: 10000,
    }),
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-pg': { 
          enabled: true 
        },
        '@opentelemetry/instrumentation-express': { 
          enabled: true 
        },
        '@opentelemetry/instrumentation-http': { 
          enabled: true 
        },
        '@opentelemetry/instrumentation-fs': { 
          enabled: false 
        },
      }),
    ],
  });

  // Initialize the SDK first
  sdk.start();

  // Enable Node.js runtime metrics after SDK is initialized
  const hostMetrics = new HostMetrics({ 
    meterProvider: metrics.getMeterProvider(),
    name: 'nodejs'
  });
  hostMetrics.start();

  // Gracefully shut down the SDK on process exit
  process.on('SIGTERM', () => {
    sdk.shutdown()
      .then(() => console.log('Tracing terminated'))
      .catch((error) => console.log('Error terminating tracing', error))
      .finally(() => process.exit(0));
  });

  return sdk;
}

export default setupTracing;
