import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { HostMetrics } from '@opentelemetry/host-metrics';
import { metrics } from '@opentelemetry/api';

// Initialize OpenTelemetry SDK with unified signal handling
export function initTelemetry() {
  console.log('[OTEL DEBUG] Setting up OpenTelemetry...');
  
  // Define service metadata from environment variables
  const serviceName = process.env.SERVICE_NAME!;
  const serviceVersion = '1.0.0';
  const deploymentEnvironment = process.env.NODE_ENV!;
  
  // 🔥 metadata about the unit generating telemetry 🔥 which allows for unambiguous identification of the source data (e.g. service name, version, environment) in the entire distributed system.
  const resource = resourceFromAttributes({
    'service.name': serviceName,
    'service.version': serviceVersion,
    'deployment.environment': deploymentEnvironment,
  });
  
  console.log('[OTEL DEBUG] Resource created:', {
    'service.name': serviceName,
    'service.version': serviceVersion,
    'deployment.environment': deploymentEnvironment,
  });

  const sdk = new NodeSDK({
    resource,
    // 🥲 metrics
    // 🥲 const meter = metrics.getMeter('products-api');
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT!,
      }),
      exportIntervalMillis: 15000,
    }),
    // 🥲 logs
    // 🥲 loggerProvider.getLogger('products-api', '1.0.0');
    logRecordProcessor: new BatchLogRecordProcessor(
      new OTLPLogExporter({
        url: process.env.OTEL_EXPORTER_OTLP_LOGS_ENDPOINT!,
      })
    ),
    // 🥲 traces
    // 🥲 trace.getTracer('products-api-misc', '1.0.0');
    traceExporter: new OTLPTraceExporter({
      url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT!,
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
        // Winston instrumentation disabled - using pure OTEL Logs API instead
        '@opentelemetry/instrumentation-winston': {
          enabled: false,
        },
      }),
    ],
  });

  // Start the SDK to initialize all providers
  sdk.start();
  console.log('[OTEL DEBUG] NodeSDK started');

  // Enable Node.js runtime metrics collection
  const hostMetrics = new HostMetrics({ 
    meterProvider: metrics.getMeterProvider(),
    name: 'nodejs'
  });
  hostMetrics.start();

  // Unified shutdown handler for all telemetry signals
  process.on('SIGTERM', () => {
    sdk.shutdown()
      .then(() => console.log('OpenTelemetry SDK terminated'))
      .catch((error) => console.log('Error terminating OpenTelemetry SDK', error))
      .finally(() => process.exit(0));
  });

  return sdk;
}
