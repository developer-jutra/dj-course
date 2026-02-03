import express, { Request, Response, NextFunction } from 'express';
import logger from "./logger";

const router = express.Router();

router.get('/error', (req: Request, res: Response, next: NextFunction) => {
  logger.debug('Generating sample error');
  next(new Error('Sample error'));
  res.status(500).json({ error: 'This is a failing endpoint' });
});

// Add global storage for memory leak simulation
const leakStorage: any[] = [];

router.get('/inject-leak', async (req: Request, res: Response) => {
  // Allocate 10 MB of data and store to simulate memory leak
  const size = 4 * 1024 * 1024; // 10 MB
  const array = new Array(size).fill(0);
  leakStorage.push(array);
  res.status(200).json({
    status: 'leaked',
    leakedBytes: size,
    totalLeaks: leakStorage.length
  });
});

router.get('/inject-error', async (req: Request, res: Response) => {
  // Randomize error status code from a predefined set
  const statusCodes = [400, 401, 403, 404, 500, 503];
  const randomStatus = statusCodes[Math.floor(Math.random() * statusCodes.length)];

  // Return the randomized error
  res.status(randomStatus).json({
    error: 'This is a failing endpoint',
    status: randomStatus
  });
});

export default router;
