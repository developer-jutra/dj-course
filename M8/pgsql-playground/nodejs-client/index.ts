import { Client } from 'pg';

const config = {
  user: 'admin',
  host: 'localhost',
  database: 'jsonbdb',
  password: 'strongpassword123',
  port: 5432,
};

async function runQuery(): Promise<void> {
  const client = new Client(config);

  try {
    await client.connect();
    
    // const query = "SELECT metadata -> 'tags' -> 0 AS first_tag FROM shipments;";
    const query = "SELECT metadata -> 'route' AS route, metadata ->> 'route' AS route_string FROM shipments";
    
    const res = await client.query(query);

    console.log('Result', res.rows);
    // res.rows.forEach((row) => {
    //   console.log(`- First tag: ${row.first_tag}`);
    // });

  } catch (err) {
    console.error('Error executing query:', err);
  } finally {
    await client.end();
  }
}

runQuery();
