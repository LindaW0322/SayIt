'use strict';

const { cleanupSessions } = require('../src/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.CRON_SECRET;

  if (!secret || req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await cleanupSessions();
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Scheduled session cleanup failed:', error);
    return res.status(500).json({ error: 'Cleanup failed' });
  }
};
