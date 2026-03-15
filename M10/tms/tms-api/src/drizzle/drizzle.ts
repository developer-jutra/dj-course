import { drizzle } from 'drizzle-orm/node-postgres';
import { pool } from '../database.js';
import * as schema from './schema.js';

export const db = drizzle(pool, { schema });
