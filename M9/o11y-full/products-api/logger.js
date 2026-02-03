const winston = require('winston');
const LokiTransport = require('winston-loki');

const HOSTNAME = require('os').hostname();

// Environment variables with fallbacks
const SERVICE_NAME = process.env.SERVICE_NAME;
const NODE_ENV = process.env.NODE_ENV;
const LOKI_HOST = process.env.LOKI_HOST

const logger = winston.createLogger({
  level: NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: {
    service: SERVICE_NAME,
    host: HOSTNAME
  },
  transports: [
    // File transports for production
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),

    // Console transport for local development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),

    // Loki transport for log aggregation
    new LokiTransport({
      host: LOKI_HOST,
      labels: {
        host: HOSTNAME,
        job: SERVICE_NAME,
        service: SERVICE_NAME,
        environment: NODE_ENV
      },
      format: winston.format.json(),
      json: true,
      batching: true,
      interval: 5,
      replaceTimestamp: true,
      clearOnError: false,
      onConnectionError: (err) => console.error('Loki connection error:', err)

    }),
  ],
});

module.exports = logger;
