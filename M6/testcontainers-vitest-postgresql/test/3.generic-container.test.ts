import { expect, test, beforeAll, afterAll } from 'vitest';
import pg, { Client } from 'pg';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import path from 'path';

let client: typeof Client;
let container: StartedTestContainer;

beforeAll(async () => {
	const sqlFileHostPath = path.resolve(__dirname, 'data.sql');
	const sqlFileContainerPath = '/docker-entrypoint-initdb.d/01-init.sql';

	// Use GenericContainer to start Postgres image, expose port 5432, wait for log line, copy init SQL
		container = await new GenericContainer('postgres:15-alpine')
		.withEnvironment({
			POSTGRES_PASSWORD: 'testpwd',
			POSTGRES_USER: 'testuser',
			POSTGRES_DB: 'testdb'
		})
		.withExposedPorts(5432)
		.withCopyFilesToContainer([
			{ source: sqlFileHostPath, target: sqlFileContainerPath }
		])
			.withWaitStrategy(Wait.forLogMessage('database system is ready to accept connections'))
		.start();

	const host = container.getHost();
	const port = container.getMappedPort(5432);
		// Retry loop to handle race where init scripts not yet fully applied
		for (let attempt = 1; attempt <= 5; attempt++) {
			try {
				client = new Client({
					host,
					port,
					user: 'testuser',
					password: 'testpwd',
					database: 'testdb'
				});
				await client.connect();
				// simple probe
				await client.query('SELECT 1');
				break;
			} catch (e) {
				if (attempt === 5) throw e;
				await new Promise(r => setTimeout(r, 500 * attempt));
			}
		}
});

afterAll(async () => {
	await client.end();
	await container.stop();
});

test('generic container: all persons', async () => {
	const res = await client.query('SELECT * FROM persons ORDER BY id');
	expect(res.rowCount).toBe(10);
	expect(res.rows.map(r => r.name)).toEqual(['Alice','Bob','Charlie','Diana','Eve','Frank','Grace','Hank','Ivy','Jack']);
});

test('generic container: age > 30', async () => {
	const res = await client.query('SELECT * FROM persons WHERE age > $1 ORDER BY id', [30]);
	expect(res.rows.map(r => r.id)).toEqual([4,6,8]);
});
