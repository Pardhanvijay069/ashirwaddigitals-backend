const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { placeOrderValidation } = require('../validators');
const upload = require('../middleware/uploadMiddleware');

// Public order routes
router.post('/orders', upload.single('design_file'), placeOrderValidation, orderController.placeOrder);
router.get('/track/:token', orderController.trackOrder);
router.get('/customer/orders', orderController.getCustomerOrders);

module.exports = router;
