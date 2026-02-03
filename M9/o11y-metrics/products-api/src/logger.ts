import winston, { Logform } from 'winston';

// Environment variables with fallbacks
const SERVICE_NAME = process.env.SERVICE_NAME;
const NODE_ENV = process.env.NODE_ENV;

// Create the logger
const logger = winston.createLogger({
  level: NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: SERVICE_NAME },
  transports: [
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
  ]
});

export default logger;
