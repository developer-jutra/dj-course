import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import logger from './logger';
import { assertEnvVars } from './env';
import router from './router';
import routerMisc from './router-misc';

assertEnvVars(
  'NODE_ENV',
  'SERVICE_NAME',
  'LOKI_HOST',
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DB'
);

const app = express();

// Extend the Request interface to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

// Middleware to log all requests
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl}`, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id || 'anonymous',
      userAgent: req.get('User-Agent')
    });
  });
  next();
});

// Error logging middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error processing request`, {
    method: req.method,
    url: req.originalUrl,
    error: err.message,
    stack: err.stack
  });
  res.status(500).json({ error: 'Internal Server Error' });
});

app.get('/health', (req: Request, res: Response) => {
  const status = { 
    uptime: process.uptime(),
    status: 'OK',
    timestamp: Date.now()
  };
  logger.info('Health check - INFO', { status });
  res.status(200).json(status);
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(router);
app.use(routerMisc);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Winston/Loki-Based Products API running on http://localhost:${PORT}`);
});
