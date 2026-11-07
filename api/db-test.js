const { Client } = require('pg');

module.exports = async function handler(req, res) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000
  });

  try {
    await client.connect();
    const result = await client.query('SELECT 1 AS ok');
    res.status(200).json({
      connected: true,
      result: result.rows
    });
  } catch (err) {
    res.status(500).json({
      connected: false,
      code: err.code || null,
      message: err.message
    });
  } finally {
    await client.end().catch(() => {});
  }
};
