const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protectAdmin } = require('../middleware/authMiddleware');
const { updateOrderStatusValidation } = require('../validators');

// Admin order routes mounted at /api/admin/orders
router.use(protectAdmin);

router.get('/', orderController.getAdminOrders);
router.get('/unread-count', orderController.getUnreadCount);
router.get('/:id', orderController.getAdminOrderById);
router.put('/:id/status', updateOrderStatusValidation, orderController.updateOrderStatus);
router.put('/:id/read', orderController.markOrderRead);

module.exports = router;
