const { Client } = require('pg');

exports.handler = async (event) => {
  try {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    const { name, email } = JSON.parse(event.body);

    await client.query(
      'INSERT INTO leads (name, email) VALUES ($1, $2)',
      [name, email]
    );

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Lead saved successfully!' })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
