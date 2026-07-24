const logger = require('../logger');

// Connections belong to this running Node.js instance. For multi-instance
// deployments, pair this with a shared pub/sub provider so every instance can
// receive order-created events.
const adminConnections = new Map();

function writeEvent(res, event, data) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function streamOrders(req, res) {
  const connectionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  let closed = false;

  res.status(200);
  res.set({
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();

  adminConnections.set(connectionId, res);
  writeEvent(res, 'connected', { connectionId });

  const heartbeat = setInterval(() => {
    if (!closed) res.write(': heartbeat\n\n');
  }, 30_000);

  const close = () => {
    if (closed) return;
    closed = true;
    clearInterval(heartbeat);
    adminConnections.delete(connectionId);
    logger.info(`Admin SSE disconnected: ${connectionId}`);
  };

  req.on('close', close);
  res.on('error', close);
  logger.info(`Admin SSE connected: ${connectionId}`);
}

function broadcastNewOrder(orderData) {
  for (const [connectionId, res] of adminConnections) {
    try {
      writeEvent(res, 'new-order-alert', orderData);
    } catch (error) {
      adminConnections.delete(connectionId);
      logger.warn(`Failed to send order alert to ${connectionId}: ${error.message}`);
    }
  }
}

module.exports = { streamOrders, broadcastNewOrder };
