import { Client } from 'pg';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { name, email } = JSON.parse(event.body);
  if (!name || !email) {
    return { statusCode: 400, body: 'Missing name or email' };
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    await client.query('INSERT INTO leads(name, email) VALUES($1, $2)', [name, email]);
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Database error' };
  } finally {
    await client.end();
  }
}
