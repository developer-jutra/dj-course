// database.ts
import { Pool } from 'pg';

// Parse DATABASE_URL to extract connection parameters
export const parseConnectionString = (url: string) => {
  const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) {
    throw new Error('Invalid DATABASE_URL format');
  }
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4], 10),
    database: match[5],
  };
};

const dbConfig = parseConnectionString(process.env.DATABASE_URL!);

export const pool = new Pool(dbConfig);
