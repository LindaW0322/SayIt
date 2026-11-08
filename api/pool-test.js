const { Pool } = require('pg');

module.exports = async function handler(req, res) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 1,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
    application_name: 'pes-to'
  });

  try {
    const result = await pool.query('SELECT 1 AS ok');
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
    await pool.end().catch(() => {});
  }
};
