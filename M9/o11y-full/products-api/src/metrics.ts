import { metrics, ValueType } from '@opentelemetry/api';

// Get service name from environment variables
const SERVICE_NAME = process.env.SERVICE_NAME!;
const SERVICE_VERSION = '1.0.0';

// OTel metrics
const meter = metrics.getMeter(SERVICE_NAME, SERVICE_VERSION);

// 🥲 metrics OTEL API
// meter.createCounter
// meter.createGauge
// meter.createHistogram
// meter.createUpDownCounter
// meter.createObservableCounter
// meter.createObservableGauge
// meter.createObservableUpDownCounter
// meter.addBatchObservableCallback
// meter.removeBatchObservableCallback

// Health status gauge
export const healthStatus = meter.createObservableGauge('health_status', {
  description: 'Service health status (1 = healthy, 0 = unhealthy)',
  unit: '1',
  valueType: ValueType.INT,
});
// BTW - for GAUGE metrics with unit:1, Open Telemetry adds "_ratio", so the metric becomes "health_status_ratio" 😂

// callback-based observation
healthStatus.addCallback(result => result.observe(1)); // 1 = healthy

// Uptime gauge
export const uptimeGauge = meter.createObservableGauge('process_uptime_seconds', {
  description: 'Application uptime in seconds',
  unit: 's',
  valueType: ValueType.DOUBLE,
});
// callback-based observation
uptimeGauge.addCallback(result => result.observe(process.uptime()));

// HTTP request counter
export const HTTPRequestTotalCounter = meter.createCounter('http_requests_total', {
  description: 'Total number of HTTP requests',
  valueType: ValueType.INT,
});
// imperatively add a metric value
// USAGE: HTTPRequestTotalCounter.add(1, { method: 'GET', path: '/products', status: 200 });

// Web Vitals histograms
export const lcpHistogram = meter.createHistogram('web_vitals_lcp', {
  description: 'Largest Contentful Paint in miliseconds',
  unit: 'ms',
  valueType: ValueType.DOUBLE,
});

export const inpHistogram = meter.createHistogram('web_vitals_inp', {
  description: 'Interaction to Next Paint in miliseconds',
  unit: 'ms',
  valueType: ValueType.DOUBLE,
});

export const clsHistogram = meter.createHistogram('web_vitals_cls', {
  description: 'Cumulative Layout Shift score',
  valueType: ValueType.DOUBLE,
});
