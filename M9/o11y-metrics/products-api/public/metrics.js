// This is a client-side JS script only

// Import web-vitals library to measure Core Web Vitals
// import { onCLS, onINP, onLCP } from 'web-vitals';
import { onCLS, onINP, onLCP } from 'https://unpkg.com/web-vitals@4?module';

// Function to push metrics to Pushgateway
async function pushMetric(name, value, labels = {}) {
  const body = {
    name: name,
    value: value,
    page_path: window.location.pathname,
    device_type: getDeviceType(),
    connection_type: getConnectionType(),
    ...labels
  };

  try {
    const response = await fetch('/client_metrics', {
      method: 'POST',
      body: JSON.stringify(body),
      keepalive: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('Metric push failed:', await response.text());
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

function getDeviceType() {
  // Simple device detection logic
  return window.innerWidth < 768 ? 'mobile' : 'desktop';
}

function getConnectionType() {
  const connection = navigator.connection;
  return connection ? connection.effectiveType : 'unknown';
}

// Report Core Web Vitals
export const reportWebVitals = () => {
  // Measure Cumulative Layout Shift
  onCLS((metric) => {
    console.log('CLS metric', metric);
    pushMetric('CLS', metric.value, {
      name: metric.name,
      id: metric.id,
      navigationType: metric.navigationType || 'unknown',
      page_path: window.location.pathname,
      user_agent: navigator.userAgent, // 🔥 is this a good idea? 🤔
      device_type: getDeviceType(),
      connection_type: getConnectionType()
    });
  });
  
  // Measure Interaction to Next Paint
  onINP((metric) => {
    console.log('INP metric', metric);
    pushMetric('INP', metric.value, {
      name: metric.name,
      id: metric.id,
      navigationType: metric.navigationType || 'unknown',
      page_path: window.location.pathname,
      user_agent: navigator.userAgent, // 🔥 is this a good idea? 🤔
      device_type: getDeviceType(),
      connection_type: getConnectionType()
    });
  });
  
  // Measure Largest Contentful Paint
  onLCP((metric) => { 
    console.log('LCP metric', metric);
    pushMetric('LCP', metric.value, {
      name: metric.name,
      id: metric.id,
      navigationType: metric.navigationType || 'unknown',
      page_path: window.location.pathname,
      user_agent: navigator.userAgent, // 🔥 is this a good idea? 🤔
      device_type: getDeviceType(),
      connection_type: getConnectionType()
    });
  });
};
