import { pool } from '../database';
import logger from '../logger';

type Notification = {
  id: number;
  user_id: number;
  type: string;
  message: string;
  created_at: Date;
  is_read: boolean;
};

type GetNotificationsDbParams = {
  userId: number;
  limit: number;
  offset: number;
};

type GetNotificationsDbResult = {
  rows: Notification[];
  total: number;
};

export const getNotificationsByUserId = async (
  params: GetNotificationsDbParams
): Promise<GetNotificationsDbResult> => {
  try {
    const countResult = await pool.query<{ total: number }>(
      'SELECT COUNT(*)::int AS total FROM notifications WHERE user_id = $1',
      [params.userId]
    );
    const total = countResult.rows[0]?.total ?? 0;

    const dataResult = await pool.query<Notification>(
      `SELECT id, user_id, type, message, created_at, is_read
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [params.userId, params.limit, params.offset]
    );

    return { rows: dataResult.rows, total };
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Error fetching notifications', { error: err.message, user_id: params.userId });
    throw error;
  }
};
