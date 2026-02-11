import { logs, SeverityNumber } from '@opentelemetry/api-logs';
import { trace, context } from '@opentelemetry/api';
import os from 'os';

// 🥸 possible to combine winston + OTEL logs (with @opentelemetry/instrumentation-winston, @opentelemetry/winston-transport)
// 🥸 winston pushes to console.output + OTEL monkey patches this 🙃 OBVIOUSLY 🙃 and hence captures logs output

const HOSTNAME = os.hostname();
const NODE_ENV = process.env.NODE_ENV;

// Get service name from environment variables
const SERVICE_NAME = process.env.SERVICE_NAME!;
const SERVICE_VERSION = '1.0.0';

// Get the logger from global LoggerProvider (initialized by NodeSDK in instrumentation.ts)
// We use a function to get the logger lazily after NodeSDK has been initialized
function getLogger() {
  const loggerProvider = logs.getLoggerProvider();
  return loggerProvider.getLogger(SERVICE_NAME, SERVICE_VERSION);
}

// Severity mapping
const severityMap: Record<string, SeverityNumber> = {
  debug: SeverityNumber.DEBUG,
  info: SeverityNumber.INFO,
  warn: SeverityNumber.WARN,
  error: SeverityNumber.ERROR,
};

interface LogAttributes {
  [key: string]: any;
}

// Helper function to emit OTEL log records
function emitLog(
  severityText: string,
  severityNumber: SeverityNumber,
  message: string,
  attributes: LogAttributes = {}
) {
  // Get logger lazily
  const otelLogger = getLogger();
  
  // Get current span context for trace correlation
  const span = trace.getSpan(context.active());
  const spanContext = span?.spanContext();

  // Flatten nested objects for better querying in Loki/Grafana
  const flattenedAttributes: Record<string, any> = {
    host: HOSTNAME,
    env: NODE_ENV,
    ...attributes,
  };

  // Add trace context if available
  if (spanContext) {
    flattenedAttributes['trace_id'] = spanContext.traceId;
    flattenedAttributes['span_id'] = spanContext.spanId;
    flattenedAttributes['trace_flags'] = spanContext.traceFlags;
  }

  // Emit log record
  otelLogger.emit({
    severityNumber,
    severityText,
    body: message,
    attributes: flattenedAttributes,
  });

  // Also log to console for local debugging
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: severityText,
    message,
    ...flattenedAttributes,
  };
  console.log(JSON.stringify(logEntry));
}

// Export logger interface compatible with Winston API
const logger = {
  debug(message: string, attributes?: LogAttributes) {
    emitLog('debug', severityMap.debug, message, attributes);
  },
  info(message: string, attributes?: LogAttributes) {
    emitLog('info', severityMap.info, message, attributes);
  },
  warn(message: string, attributes?: LogAttributes) {
    emitLog('warn', severityMap.warn, message, attributes);
  },
  error(message: string, attributes?: LogAttributes) {
    emitLog('error', severityMap.error, message, attributes);
  },
};

export default logger;
