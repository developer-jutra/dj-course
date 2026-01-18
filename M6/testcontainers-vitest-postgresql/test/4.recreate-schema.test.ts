import { expect, test, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import pg, { Client } from 'pg';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import path from 'path';
import fs from 'fs/promises';

let client: typeof Client;
let container: StartedPostgreSqlContainer;
let schemaName: string;
let seedSql: string;

beforeAll(async () => {
  const sqlFileHostPath = path.resolve(__dirname, 'data.sql');
  const sqlFileContainerPath = '/docker-entrypoint-initdb.d/01-init.sql';

  // Read seed SQL so we can apply it to each per-test schema (minus DROP TABLE to allow isolation in schema)
  seedSql = await fs.readFile(sqlFileHostPath, 'utf-8');

  container = await new PostgreSqlContainer('postgres:15-alpine')
    .withCopyFilesToContainer([
      { source: sqlFileHostPath, target: sqlFileContainerPath }
    ])
    .start();

  client = new Client({
    host: container.getHost(),
    port: container.getPort(),
    user: container.getUsername(),
    password: container.getPassword(),
    database: container.getDatabase(),
  });
  await client.connect();
});

afterAll(async () => {
  await client.end();
  await container.stop();
});

beforeEach(async () => {
  schemaName = `test_schema_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
  await client.query(`CREATE SCHEMA ${schemaName}`);
  await client.query(`SET search_path TO ${schemaName}`);
  // Transform seed SQL so objects are created inside the schema without cross-test conflicts.
  // We'll prefix table creation with schema qualification and remove any DROP TABLE to keep it simple.
  const statements = seedSql
    .replace(/DROP TABLE IF EXISTS persons;?/i, '')
    .replace(/CREATE TABLE persons/gi, `CREATE TABLE ${schemaName}.persons`)
    .replace(/INSERT INTO persons/gi, `INSERT INTO ${schemaName}.persons`)
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(Boolean);
  for (const stmt of statements) {
    await client.query(stmt);
  }
});

afterEach(async () => {
  await client.query(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`);
});

// Test 1: insert a person whose name starts with K and assert total count increases to 11
test('should insert new person and have 11 total (external SQL file)', async () => {
  const insertRes = await client.query('INSERT INTO persons (id, name, age) VALUES ($1, $2, $3) RETURNING *', [11, 'Kate', 32]);
  expect(insertRes.rowCount).toBe(1);
  expect(insertRes.rows[0].name).toBe('Kate');

  const countRes = await client.query('SELECT COUNT(*) AS cnt FROM persons');
  expect(Number(countRes.rows[0].cnt)).toBe(11);
});

// Test 2: fetch all original mock persons
test('should fetch all mock persons from database (external SQL file)', async () => {
  const res = await client.query('SELECT * FROM persons ORDER BY id');
  expect(res.rowCount).toBe(10);
  const names = res.rows.map(r => r.name);
  expect(names).toEqual(['Alice','Bob','Charlie','Diana','Eve','Frank','Grace','Hank','Ivy','Jack']);
});

// Test 3: filter persons older than 30
test('should fetch persons older than 30 (external SQL file)', async () => {
  const res = await client.query('SELECT * FROM persons WHERE age > $1 ORDER BY id', [30]);
  const expectedIds = [4,6,8];
  expect(res.rows.map(r => r.id)).toEqual(expectedIds);
});
