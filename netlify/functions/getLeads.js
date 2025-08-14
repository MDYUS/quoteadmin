// netlify/functions/get-leads.js
const { Client } = require('pg');

exports.handler = async () => {
  const client = new Client({
    connectionString: process.env.psql 'postgresql://neondb_owner:npg_AXtDk2IVai9c@ep-solitary-thunder-ae2n8tmz-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const res = await client.query('SELECT * FROM leads');
    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify(res.rows)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
