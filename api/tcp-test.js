const net = require('node:net');

module.exports = async function handler(req, res) {
  const host = 'aws-0-eu-west-2.pooler.supabase.com';
  const port = 6543;
  const started = Date.now();

  const socket = net.createConnection({ host, port });

  const timer = setTimeout(() => {
    socket.destroy();
    res.status(504).json({
      ok: false,
      result: 'TIMEOUT',
      host,
      port,
      elapsed_ms: Date.now() - started
    });
  }, 8000);

  socket.on('connect', () => {
    clearTimeout(timer);
    socket.destroy();
    res.status(200).json({
      ok: true,
      result: 'TCP CONNECTED',
      host,
      port,
      elapsed_ms: Date.now() - started
    });
  });

  socket.on('error', (err) => {
    clearTimeout(timer);
    res.status(500).json({
      ok: false,
      result: 'TCP ERROR',
      code: err.code,
      message: err.message
    });
  });
};
