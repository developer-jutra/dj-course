import { Request, Response } from 'express';
import express from 'express';

import logger from '../logger';
import { ErrorResponse } from '../types/data-contracts';
import { Health } from '../types/HealthRoute';

const router = express.Router();
const serverStartTime = new Date();

router.get('/', (_req: Request, res: Response) => {
  const uptimeMs = Date.now() - serverStartTime.getTime();
  const seconds = Math.floor(uptimeMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const d = days;
  const h = hours % 24;
  const m = minutes % 60;
  const s = seconds % 60;
  const uptimeStr = `${d}d ${h}h ${m}m ${s}s`;
  const startStr = serverStartTime.toISOString().replace('T', ' ').replace('Z', ' UTC');
  res.type('text/plain').send(
    `Server up and running since ${startStr}. Uptime: ${uptimeStr}`,
  );
});

router.get(
  '/health',
  (
    _req: Request<
      Health.GetHealth.RequestParams,
      Health.GetHealth.ResponseBody | ErrorResponse,
      Health.GetHealth.RequestBody,
      Health.GetHealth.RequestQuery
    >,
    res: Response<Health.GetHealth.ResponseBody | ErrorResponse>,
  ) => {
    logger.debug('Health check requested');
    res.json({ status: 'ok', service: process.env.SERVICE_NAME || 'tms-api' });
  },
);

router.all('/', (_req, res) => res.status(405).set('Allow', 'GET').json({ error: 'Method Not Allowed' }));
router.all('/health', (_req, res) => res.status(405).set('Allow', 'GET').json({ error: 'Method Not Allowed' }));

export default router;
