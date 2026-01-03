const { Pool } = require('pg');
const fs = require('fs');

const dbPassword = fs.readFileSync(process.env.DB_PASSWORD_FILE, 'utf8').trim();

// Create and export the pool
const pool = new Pool({
  // connectionString: process.env.DATABASE_URL,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: dbPassword,
  port: process.env.DB_PORT,
});

module.exports = pool;
