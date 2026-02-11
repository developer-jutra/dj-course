import winston, { Logform } from 'winston';
import LokiTransport from "winston-loki";
import os from 'os';

// Environment variables with fallbacks
const HOSTNAME = os.hostname();
const NODE_ENV = process.env.NODE_ENV;
const SERVICE_NAME = process.env.SERVICE_NAME;
const LOKI_HOST = process.env.LOKI_HOST!;

const logger = winston.createLogger({
  level: NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: {
    hostname: HOSTNAME,
    service: SERVICE_NAME,
    environment: NODE_ENV
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
        winston.format.timestamp(),
        winston.format.printf((info: Logform.TransformableInfo) => {
          const { timestamp, level, message, ...meta } = info;
          return `${timestamp} [${level}]: ${message} ${JSON.stringify(meta)}`;
        })
      ),
    }),
    
    // Loki transport for log aggregation
    new LokiTransport({
      host: LOKI_HOST,
      labels: {
        hostname: HOSTNAME,
        service: SERVICE_NAME,
        environment: NODE_ENV
      },
      json: true,
      format: winston.format.json(),
      batching: true,
      level: 'debug',
      interval: 5, // seconds
      replaceTimestamp: true,
      clearOnError: false,
      onConnectionError: (err: any) => console.error('Loki connection error:', err)
    })
  ]
});

export default logger;
