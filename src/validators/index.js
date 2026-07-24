const { body } = require('express-validator');

// Auth validation
const adminLoginValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const googleLoginValidation = [
  body('google_token').notEmpty().withMessage('Google token is required')
];

// Product validation
const productValidation = [
  body('sku').notEmpty().withMessage('SKU is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('base_price').isFloat({ min: 0 }).withMessage('Base price must be a positive number'),
  body('stock_quantity').optional().isInt({ min: 0 }),
  body('min_stock_warning').optional().isInt({ min: 0 })
];

// Order validation
const placeOrderValidation = [
  body('customer_name').notEmpty().withMessage('Customer name is required'),
  body('customer_phone').notEmpty().withMessage('Customer phone is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('items').notEmpty().withMessage('Items JSON string is required')
];

const updateOrderStatusValidation = [
  body('status').isIn(['pending', 'design_review', 'printing', 'ready', 'delivered', 'cancelled']).withMessage('Invalid status')
];

module.exports = {
  adminLoginValidation,
  googleLoginValidation,
  productValidation,
  placeOrderValidation,
  updateOrderStatusValidation
};
