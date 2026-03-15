import { Request, Response } from 'express';
import express from 'express';

import { getNotificationsByUserId } from './notifications.queries';
import logger from '../logger';
import { parsePositiveInt } from '../shared/query-parsers';
import { ErrorResponse } from '../types/data-contracts';
import { Notifications } from '../types/NotificationsRoute';
import { queryParams } from '../zod/contract';

const router = express.Router();

router.get(
  '/',
  async (
    req: Request<
      Notifications.GetNotificationsByUserId.RequestParams,
      Notifications.GetNotificationsByUserId.ResponseBody | ErrorResponse,
      Notifications.GetNotificationsByUserId.RequestBody,
      Notifications.GetNotificationsByUserId.RequestQuery
    >,
    res: Response<Notifications.GetNotificationsByUserId.ResponseBody | ErrorResponse>,
  ) => {
  const queryValidation = queryParams.getNotificationsByUserId.safeParse(req.query);
  if (!queryValidation.success) {
    return res.status(400).json({ error: queryValidation.error.issues.map(i => i.message).join(', ') });
  }

  const userId = parsePositiveInt(req.query.userId, 0);

  if (userId === 0) {
    return res.status(400).json({ error: 'Missing or invalid required query param: userId' });
  }

  try {
    const page = parsePositiveInt(req.query.page, 1);
    const requestedLimit = parsePositiveInt(req.query.limit, 20);
    const limit = Math.min(requestedLimit, 100);
    const offset = (page - 1) * limit;

    const { rows, total } = await getNotificationsByUserId({ userId, limit, offset });

    const totalPages = Math.ceil(total / limit);

    const response: Notifications.GetNotificationsByUserId.ResponseBody = {
      data: rows.map(({ created_at, ...rest }) => ({
        ...rest,
        created_at: created_at.toISOString(),
      })),
      pagination: { page, limit, total, totalPages },
    };

    logger.debug('Notifications fetched', { user_id: userId, count: rows.length, total });
    res.json(response);
  } catch (err: unknown) {
    const error = err as Error;
    logger.error('Failed to fetch notifications', { error: error.message, user_id: userId });
    res.status(500).json({ error: error.message });
  }
});

router.all('/', (_req, res) => res.status(405).set('Allow', 'GET').json({ error: 'Method Not Allowed' }));

export default router;
