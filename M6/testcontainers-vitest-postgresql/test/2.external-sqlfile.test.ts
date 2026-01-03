import { expect, test, beforeAll, afterAll } from 'vitest';
import pg, { Client } from 'pg';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import path from 'path';

let client: typeof Client;
let container: StartedPostgreSqlContainer;

beforeAll(async () => {
  const sqlFileHostPath = path.resolve(__dirname, 'data.sql');
  const sqlFileContainerPath = '/docker-entrypoint-initdb.d/01-init.sql';

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
