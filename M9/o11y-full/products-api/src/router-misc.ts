import express, { Request, Response, NextFunction } from 'express';
import logger from './logger';
import { lcpHistogram, inpHistogram, clsHistogram } from './metrics';
import { context, SpanStatusCode, SpanKind, trace } from '@opentelemetry/api';
import { tracer } from './tracer';

const router = express.Router();

// Error generation endpoint with manual span and error tracking
router.get('/error', (req: Request, res: Response, next: NextFunction) => {
  // Pattern 1: Simple manual child span with error recording
  // Creates a child span within the existing Express request handler span
  const span = tracer.startSpan('error_generation', {
    kind: SpanKind.INTERNAL,
    attributes: {
      'http.method': req.method,
      'http.route': '/error',
      'error.type': 'intentional',
      'operation': 'generate_sample_error',
    }
  });

  try {
    span.addEvent('error_generation_started');
    logger.debug('Generating sample error');
    
    const error = new Error('Sample error');
    
    // Record exception in span
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR, message: 'Sample error generated' });
    span.addEvent('error_recorded');
    
    span.end();
    next(error);
  } catch (err: any) {
    span.recordException(err);
    span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
    span.end();
    throw err;
  }
  
  res.status(500).json({ error: 'This is a failing endpoint' });
});

// Add global storage for memory leak simulation
const leakStorage: any[] = [];

// Memory leak injection endpoint with child spans and events
router.get('/inject-leak', async (req: Request, res: Response) => {
  // Pattern 2: Multiple child spans showing operation breakdown with events
  // This demonstrates hierarchical span relationships and event logging
  
  try {
    // Child span 1: Memory allocation phase
    const allocationSpan = tracer.startSpan('memory.allocation', {
      kind: SpanKind.INTERNAL,
      attributes: {
        'operation.type': 'memory_allocation',
        'allocation.size_mb': 4,
        'operation.phase': 'allocate',
      }
    });

    allocationSpan.addEvent('allocation_started', {
      'target_size_bytes': 4 * 1024 * 1024,
    });

    // Allocate 4 MB of data and store to simulate memory leak
    const size = 4 * 1024 * 1024; // 4 MB
    const array = new Array(size).fill(0);
    
    // Add event to show progress
    allocationSpan.addEvent('memory_allocated', {
      'bytes': size,
      'array_length': array.length,
    });
    
    allocationSpan.setStatus({ code: SpanStatusCode.OK });
    allocationSpan.end();

    // Child span 2: Storage phase
    const storageSpan = tracer.startSpan('memory.store', {
      kind: SpanKind.INTERNAL,
      attributes: {
        'operation.type': 'memory_storage',
        'storage.previous_count': leakStorage.length,
        'operation.phase': 'store',
      }
    });

    storageSpan.addEvent('storage_started', {
      'current_leak_count': leakStorage.length,
    });

    leakStorage.push(array);
    
    storageSpan.addEvent('memory_stored', {
      'new_storage_count': leakStorage.length,
    });
    
    storageSpan.setAttributes({
      'storage.new_count': leakStorage.length,
      'storage.total_bytes': size * leakStorage.length,
    });
    
    storageSpan.setStatus({ code: SpanStatusCode.OK });
    storageSpan.end();

    res.status(200).json({
      status: 'leaked',
      leakedBytes: size,
      totalLeaks: leakStorage.length
    });
  } catch (error: any) {
    // Error handling with span recording
    const errorSpan = tracer.startSpan('memory.leak_error', {
      kind: SpanKind.INTERNAL,
      attributes: {
        'error.type': 'memory_leak_failure',
      }
    });
    
    errorSpan.recordException(error);
    errorSpan.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    errorSpan.end();
    throw error;
  }
});

// Helper function to demonstrate context propagation
async function selectRandomErrorCode(): Promise<number> {
  // Pattern 3: Context propagation - child span automatically inherits active context
  const span = tracer.startSpan('select_random_error_code', {
    kind: SpanKind.INTERNAL,
    attributes: {
      'operation': 'error_code_selection',
    }
  });
  
  span.addEvent('selection_started');
  
  const statusCodes = [400, 401, 403, 404, 500, 503];
  const randomStatus = statusCodes[Math.floor(Math.random() * statusCodes.length)];
  
  span.setAttributes({
    'error.code': randomStatus,
    'error.codes_pool_size': statusCodes.length,
    'error.is_client_error': randomStatus < 500,
    'error.is_server_error': randomStatus >= 500,
  });
  
  span.addEvent('selection_completed', {
    'selected_code': randomStatus,
  });
  
  span.setStatus({ code: SpanStatusCode.OK });
  span.end();
  return randomStatus;
}

// Error injection endpoint with context propagation
router.get('/inject-error', async (req: Request, res: Response) => {
  // Pattern 3: Context propagation between functions
  // Child functions automatically inherit the active span context
  const operationSpan = tracer.startSpan('error_injection_operation', {
    kind: SpanKind.INTERNAL,
    attributes: {
      'http.method': req.method,
      'http.route': '/inject-error',
      'error.injection_type': 'random_status',
    }
  });

  try {
    // Make span active for context propagation
    await context.with(trace.setSpan(context.active(), operationSpan), async () => {
      operationSpan.addEvent('operation_started');
      
      // Call helper function - it will create a child span automatically
      const randomStatus = await selectRandomErrorCode();
      
      operationSpan.setAttributes({
        'http.status_code': randomStatus,
        'error.intentional': true,
      });

      operationSpan.addEvent('error_response_prepared', {
        'status_code': randomStatus,
        'error_category': randomStatus >= 500 ? 'server_error' : 'client_error',
      });

      // Set span status as ERROR for error codes
      if (randomStatus >= 400) {
        operationSpan.setStatus({ 
          code: SpanStatusCode.ERROR, 
          message: `HTTP ${randomStatus} error injected` 
        });
      } else {
        operationSpan.setStatus({ code: SpanStatusCode.OK });
      }
      
      operationSpan.addEvent('operation_completed');
      operationSpan.end();

      // Return the randomized error
      res.status(randomStatus).json({
        error: 'This is a failing endpoint',
        status: randomStatus
      });
    });
  } catch (error: any) {
    operationSpan.recordException(error);
    operationSpan.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    operationSpan.end();
    throw error;
  }
});

// Health check endpoint with detailed span attributes and events
router.get('/health', (req: Request, res: Response) => {
  // Pattern 4: Detailed span with multiple attributes and timing events
  const span = tracer.startSpan('health_check_operation', {
    kind: SpanKind.INTERNAL,
    attributes: {
      'http.method': req.method,
      'http.route': '/health',
      'health_check.type': 'basic',
      'operation': 'health_status_collection',
    }
  });

  try {
    span.addEvent('health_check_started');
    
    const uptime = process.uptime();
    const timestamp = Date.now();
    const memUsage = process.memoryUsage();
    
    const status = { 
      uptime,
      status: 'OK',
      timestamp
    };

    // Add detailed attributes about system state
    span.setAttributes({
      'process.uptime_seconds': uptime,
      'health.status': 'OK',
      'health.timestamp': timestamp,
      'process.memory.heap_used': memUsage.heapUsed,
      'process.memory.heap_total': memUsage.heapTotal,
      'process.memory.rss': memUsage.rss,
      'process.memory.external': memUsage.external,
    });

    span.addEvent('health_data_collected', {
      'uptime': uptime,
      'memory_heap_mb': Math.round(memUsage.heapUsed / 1024 / 1024),
      'memory_rss_mb': Math.round(memUsage.rss / 1024 / 1024),
    });

    span.addEvent('health_check_completed', {
      'duration_ms': Date.now() - timestamp,
      'status': 'healthy',
    });

    span.setStatus({ code: SpanStatusCode.OK });
    span.end();

    res.status(200).json(status);
  } catch (error: any) {
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    span.end();
    throw error;
  }
});

// Helper functions to demonstrate multi-level context propagation
async function recordMetric(name: string, value: number, labels: any): Promise<void> {
  // Pattern 5: Grandchild span in multi-level hierarchy
  const span = tracer.startSpan('record_metric', {
    kind: SpanKind.INTERNAL,
    attributes: {
      'metric.name': name,
      'metric.value': value,
      'operation': 'metric_recording',
      'level': 'grandchild',
    }
  });

  span.addEvent('metric_recording_started', { 
    name,
    value,
  });

  try {
    if (name === 'LCP') {
      lcpHistogram.record(value, labels);
      span.setAttribute('metric.type', 'lcp');
      span.setAttribute('metric.category', 'web_vitals');
    } else if (name === 'INP') {
      inpHistogram.record(value, labels);
      span.setAttribute('metric.type', 'inp');
      span.setAttribute('metric.category', 'web_vitals');
    } else if (name === 'CLS') {
      clsHistogram.record(value, labels);
      span.setAttribute('metric.type', 'cls');
      span.setAttribute('metric.category', 'web_vitals');
    }

    span.addEvent('metric_recorded', { 
      name, 
      value,
      success: true,
      labels_count: Object.keys(labels).length,
    });
    
    span.setStatus({ code: SpanStatusCode.OK });
    span.end();
  } catch (error: any) {
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    span.end();
    throw error;
  }
}

async function parseClientMetrics(body: any): Promise<{name: string, value: number, labels: any}> {
  // Pattern 5: Child span in multi-level hierarchy
  const span = tracer.startSpan('parse_client_metrics', {
    kind: SpanKind.INTERNAL,
    attributes: {
      'operation': 'parse',
      'level': 'child',
    }
  });

  span.addEvent('parsing_started');

  try {
    const { name, value, page_path, device_type, connection_type } = body;
    const labels = { 
      page_path: page_path || '/', 
      device_type: device_type || 'unknown', 
      connection_type: connection_type || 'unknown' 
    };

    span.setAttributes({
      'metric.name': name,
      'metric.value': value,
      'metric.page_path': labels.page_path,
      'metric.device_type': labels.device_type,
      'metric.connection_type': labels.connection_type,
    });

    span.addEvent('parsing_completed', {
      has_name: !!name,
      has_value: !!value,
      labels_complete: !!(page_path && device_type && connection_type),
    });

    span.setStatus({ code: SpanStatusCode.OK });
    span.end();
    return { name, value, labels };
  } catch (error: any) {
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    span.end();
    throw error;
  }
}

// Client metrics proxy endpoint with multi-level context propagation
router.post('/client_metrics', async (req: Request, res: Response) => {
  // Pattern 5: Multi-level context propagation (root -> parse -> record)
  // Demonstrates 3-level span hierarchy with automatic context propagation
  const rootSpan = tracer.startSpan('client_metrics_processing', {
    kind: SpanKind.INTERNAL,
    attributes: {
      'http.method': req.method,
      'http.route': '/client_metrics',
      'client_metrics.type': 'web_vitals',
      'operation': 'process_client_metrics',
      'level': 'root',
    }
  });

  try {
    await context.with(trace.setSpan(context.active(), rootSpan), async () => {
      rootSpan.addEvent('request_received', {
        body_present: !!req.body,
      });
      
      console.log(req.body);

      // Level 1: Parse metrics (creates child span)
      const { name, value, labels } = await parseClientMetrics(req.body);

      rootSpan.addEvent('metrics_parsed', {
        metric_name: name,
        metric_value: value,
      });

      // Level 2: Record metric (creates grandchild span)
      await recordMetric(name, value, labels);

      rootSpan.addEvent('metrics_processed', {
        metric_name: name,
        processing_complete: true,
      });

      rootSpan.setStatus({ code: SpanStatusCode.OK });
      rootSpan.end();
      
      res.sendStatus(204);
    });
  } catch (error: any) {
    rootSpan.recordException(error);
    rootSpan.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    rootSpan.addEvent('processing_failed', {
      error_message: error.message,
    });
    rootSpan.end();
    throw error;
  }
});

export default router;
