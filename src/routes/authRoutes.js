const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { googleLoginValidation, adminLoginValidation } = require('../validators');

router.post('/google', googleLoginValidation, authController.googleLogin);

module.exports = router;
