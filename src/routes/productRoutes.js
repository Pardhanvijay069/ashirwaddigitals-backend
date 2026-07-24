const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protectAdmin } = require('../middleware/authMiddleware');
const { productValidation } = require('../validators');
const upload = require('../middleware/uploadMiddleware');

// Public routes mounted at /api/products
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

module.exports = router;
