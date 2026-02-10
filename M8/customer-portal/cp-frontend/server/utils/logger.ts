/**
 * Logger utility for server-side logging
 * Uses winston through nuxt3-winston-log module
 * 
 * nuxt3-winston-log automatically creates winston logger instance
 * Logs are written to files in logs/ directory and console
 */

// Try to get winston logger from nuxt3-winston-log
function getWinstonLogger() {
  try {
    // nuxt3-winston-log exposes logger through useLogger() or global
    if (typeof useLogger !== 'undefined') {
      return useLogger()
    }
    // Alternative: check if logger is available globally
    if ((globalThis as any).winstonLogger) {
      return (globalThis as any).winstonLogger
    }
  } catch (e) {
    // Logger not available, will use fallback
  }
  return null
}

export const logger = {
  info: (message: string, meta?: Record<string, any>) => {
    const winstonLogger = getWinstonLogger()
    if (winstonLogger) {
      winstonLogger.info(message, meta || {})
      return
    }
    // Fallback to structured console logging
    if (meta) {
      console.log(`[INFO] ${message}`, meta)
    } else {
      console.log(`[INFO] ${message}`)
    }
  },

  error: (message: string, error?: Error | any, meta?: Record<string, any>) => {
    const winstonLogger = getWinstonLogger()
    if (winstonLogger) {
      winstonLogger.error(message, { error: error?.message || error, stack: error?.stack, ...meta })
      return
    }
    // Fallback to structured console logging
    if (error) {
      console.error(`[ERROR] ${message}`, error, meta || '')
    } else {
      console.error(`[ERROR] ${message}`, meta || '')
    }
  },

  warn: (message: string, meta?: Record<string, any>) => {
    const winstonLogger = getWinstonLogger()
    if (winstonLogger) {
      winstonLogger.warn(message, meta || {})
      return
    }
    // Fallback to structured console logging
    if (meta) {
      console.warn(`[WARN] ${message}`, meta)
    } else {
      console.warn(`[WARN] ${message}`)
    }
  },

  debug: (message: string, meta?: Record<string, any>) => {
    const winstonLogger = getWinstonLogger()
    if (winstonLogger) {
      winstonLogger.debug(message, meta || {})
      return
    }
    // Fallback to structured console logging (only in development)
    if (process.env.NODE_ENV === 'development') {
      if (meta) {
        console.debug(`[DEBUG] ${message}`, meta)
      } else {
        console.debug(`[DEBUG] ${message}`)
      }
    }
  }
}

/**
 * Create a scoped logger with a prefix
 */
export function createScopedLogger(scope: string) {
  return {
    info: (message: string, meta?: Record<string, any>) => {
      logger.info(`[${scope}] ${message}`, meta)
    },
    error: (message: string, error?: Error | any, meta?: Record<string, any>) => {
      logger.error(`[${scope}] ${message}`, error, meta)
    },
    warn: (message: string, meta?: Record<string, any>) => {
      logger.warn(`[${scope}] ${message}`, meta)
    },
    debug: (message: string, meta?: Record<string, any>) => {
      logger.debug(`[${scope}] ${message}`, meta)
    }
  }
}
