const express = require('express');
const { protectAdmin } = require('../middleware/authMiddleware');
const { streamOrders } = require('../sockets/adminSSE');

const router = express.Router();

router.get('/stream', protectAdmin, streamOrders);

module.exports = router;
