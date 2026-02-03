import { createLogger, format, transports, Logger } from 'winston';
const { combine, timestamp, printf, colorize } = format;

// Custom format for logs
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  const metaStr = Object.keys(metadata).length 
    ? JSON.stringify(metadata) 
    : '';
  
  return `${timestamp} [${level}]: ${message} ${metaStr}`;
});

// Create the logger
const logger: Logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    // File transports for production
    new transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

// If we're not in production, log to the console with colorized output
// This was originally adding a second console transport
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: combine(
      colorize(),
      timestamp(),
      logFormat
    )
  }));
}

export default logger;
