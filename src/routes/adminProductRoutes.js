const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protectAdmin } = require('../middleware/authMiddleware');
const { productValidation } = require('../validators');
const upload = require('../middleware/uploadMiddleware');

// Admin routes mounted at /api/admin/products
router.use(protectAdmin);

router.post('/', productValidation, productController.createProduct);
router.put('/:id', productValidation, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

router.post('/:id/images', upload.array('images', 4), productController.uploadProductImages);
router.delete('/images/:image_id', productController.deleteProductImage);

module.exports = router;
