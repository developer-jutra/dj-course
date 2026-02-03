import { resourceFromAttributes } from "@opentelemetry/resources";
import { 
  LoggerProvider, 
  SimpleLogRecordProcessor, 
  BatchLogRecordProcessor,
  ConsoleLogRecordExporter 
} from "@opentelemetry/sdk-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
  ATTR_TELEMETRY_SDK_LANGUAGE,
  TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS,
  ATTR_TELEMETRY_SDK_NAME
} from "@opentelemetry/semantic-conventions";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { logs } from "@opentelemetry/api-logs";
import os from 'node:os';
import { getPkg } from "./env";

let health = 1; // 1 for healthy, 0 for unhealthy

const pkg = getPkg();

export const setHealthStatus = (isHealthy: boolean) => {
  health = isHealthy ? 1 : 0;
};

export const initTelemetry = () => {
  const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: pkg.name,
    [ATTR_SERVICE_VERSION]: pkg.version,
    [ATTR_TELEMETRY_SDK_LANGUAGE]: TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS,
    [ATTR_TELEMETRY_SDK_NAME]: 'opentelemetry',
    ["deployment.environment.name"]: process.env.NODE_ENV || "development",
    ["host.name"]: os.hostname(),
  });

  // --- 1. Setup Tracing ---
  const tracerProvider = new NodeTracerProvider({ resource });
  tracerProvider.register();

  // --- 2. Setup Logging ---
  const loggerProvider = new LoggerProvider({
    resource,
    processors: [
      new SimpleLogRecordProcessor(new ConsoleLogRecordExporter()),
      new BatchLogRecordProcessor(new OTLPLogExporter({
        url: process.env.OTEL_EXPORTER_OTLP_LOGS_ENDPOINT || "http://localhost:4318/v1/logs",
      }))
    ]
  });

  // Set the global logger provider
  logs.setGlobalLoggerProvider(loggerProvider);

  // --- 3. Instrumentations ---
  registerInstrumentations({
    instrumentations: [
      new HttpInstrumentation({
        ignoreIncomingRequestHook(req) {
          return req.url === '/favicon.ico';
        }
      }), 
      new ExpressInstrumentation()
    ],
  });

  return { loggerProvider, tracerProvider };
};