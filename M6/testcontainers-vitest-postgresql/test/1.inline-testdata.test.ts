import { expect, test, beforeAll, afterAll } from 'vitest';
import pg, { Client } from 'pg';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';

interface Person {
  id: number;
  name: string;
  age: number;
}

let client: typeof Client;
let container: StartedPostgreSqlContainer;

const MOCK_DATA: Person[] = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 24 },
  { id: 3, name: 'Charlie', age: 28 },
  { id: 4, name: 'Diana', age: 35 },
  { id: 5, name: 'Eve', age: 22 },
  { id: 6, name: 'Frank', age: 33 },
  { id: 7, name: 'Grace', age: 27 },
  { id: 8, name: 'Hank', age: 31 },
  { id: 9, name: 'Ivy', age: 29 },
  { id: 10, name: 'Jack', age: 26 },
];

async function createTable() {
  await client.query(`
    CREATE TABLE persons (
      id INT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      age INT NOT NULL
    );
  `);
}

async function insertMockData(data: Person[]) {
  const queryText = 'INSERT INTO persons(id, name, age) VALUES ($1, $2, $3)';
  for (const person of data) {
    await client.query(queryText, [person.id, person.name, person.age]);
  }
}

beforeAll(async () => {
  container = await new PostgreSqlContainer('postgres:15-alpine').start();

  client = new Client({
    host: container.getHost(),
    port: container.getPort(),
    user: container.getUsername(),
    password: container.getPassword(),
    database: container.getDatabase(),
  });
  await client.connect();

  await createTable();
  await insertMockData(MOCK_DATA);
});

afterAll(async () => {
  await client.end();
  await container.stop();
});

test('should fetch all mock persons from database', async () => {
  const res = await client.query('SELECT * FROM persons ORDER BY id');
  expect(res.rowCount).toBe(MOCK_DATA.length);
  expect(res.rows).toEqual(MOCK_DATA);
});

test('should fetch persons older than 30', async () => {
  const res = await client.query('SELECT * FROM persons WHERE age > $1 ORDER BY id', [30]);
  const expected = MOCK_DATA.filter(p => p.age > 30);
  expect(res.rows).toEqual(expected);
});
