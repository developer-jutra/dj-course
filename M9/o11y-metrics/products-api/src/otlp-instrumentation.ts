// OTLP and Metrics Imports
import { MeterProvider } from "@opentelemetry/sdk-metrics";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
  ATTR_TELEMETRY_SDK_LANGUAGE,
  ATTR_TELEMETRY_SDK_NAME,
  TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS,
} from "@opentelemetry/semantic-conventions";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { ValueType } from "@opentelemetry/api";

import os from 'node:os';
import { getPkg } from "./env";

let health = 1; // 1 for healthy, 0 for unhealthy

const pkg = getPkg();

export const setHealthStatus = (isHealthy: boolean) => {
  health = isHealthy ? 1 : 0;
};

export const initMetrics = () => {
  const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: pkg.name,
    [ATTR_SERVICE_VERSION]: pkg.version,
    [ATTR_TELEMETRY_SDK_LANGUAGE]: TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS,
    [ATTR_TELEMETRY_SDK_NAME]: 'opentelemetry',
    ["deployment.environment.name"]: process.env.NODE_ENV,
    ["host.name"]: os.hostname(),
  });

  const exporter = new PrometheusExporter(
    {
      port: 9464,
      endpoint: "/metrics",
    },
    (error) => {
      if (error) {
        console.log("Error starting Prometheus Exporter:", error);
      } else {
        console.log(`Prometheus metrics available on http://localhost:9464/metrics`);
      }
    }
  );

  const meterProvider = new MeterProvider({
    readers: [exporter],
    resource: resource,
  });

  const provider = new NodeTracerProvider();
  provider.register();

  registerInstrumentations({
    instrumentations: [
      new HttpInstrumentation({
        ignoreIncomingRequestHook(req) {
          return req.url === '/favicon.ico';
        }
      }), 
      new ExpressInstrumentation()
    ],
    meterProvider: meterProvider,
  });

  const meter = meterProvider.getMeter("products-api-meter");

  const healthStatusGauge = meter.createObservableGauge("health_status", {
    description: "Service health status (1 = healthy, 0 = unhealthy)",
    unit: "1",
    valueType: ValueType.INT,
  });
  healthStatusGauge.addCallback((result) => {
    result.observe(health);
  });

  const uptimeGauge = meter.createObservableGauge("process_uptime_seconds", {
    description: "Application uptime in seconds",
    unit: "s",
    valueType: ValueType.DOUBLE,
  });
  uptimeGauge.addCallback((result) => {
    result.observe(process.uptime());
  });

  const lcpHistogram = meter.createHistogram("web_vitals_lcp", {
    description: "Largest Contentful Paint in milliseconds",
    unit: "ms",
    valueType: ValueType.DOUBLE,
    advice: {
      explicitBucketBoundaries: [
        500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 8000, 10000,
      ],
    },
  });

  const inpHistogram = meter.createHistogram("web_vitals_inp", {
    description: "Interaction to Next Paint in milliseconds",
    unit: "ms",
    valueType: ValueType.DOUBLE,
    advice: {
      explicitBucketBoundaries: [50, 100, 150, 200, 300, 400, 500, 750, 1000],
    },
  });

  const clsHistogram = meter.createHistogram("web_vitals_cls", {
    description: "Cumulative Layout Shift score",
    unit: "1",
    valueType: ValueType.DOUBLE,
    advice: {
      explicitBucketBoundaries: [0.01, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.5, 1],
    },
  });

  return { lcpHistogram, inpHistogram, clsHistogram };
};
