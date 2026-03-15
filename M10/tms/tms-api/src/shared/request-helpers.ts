import { Request } from 'express';

export const buildBaseUrl = (req: Request): string =>
  `${req.protocol}://${req.get('host')}`;
