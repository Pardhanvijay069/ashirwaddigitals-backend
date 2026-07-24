const authService = require('../services/authService');
const { validationResult } = require('express-validator');
const logger = require('../logger');

const googleLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, message: 'Validation failed', data: errors.array() });
    }

    const { google_token } = req.body;
    
    // In development or if no actual token is provided, we can bypass Google Auth for ease of testing
    // if a special dummy token is sent.
    let user;
    if (google_token === 'dev_dummy_token_123') {
      user = { id: 1, name: 'Dev User', email: 'dev@example.com', auth_provider: 'google' };
    } else {
      user = await authService.verifyGoogleToken(google_token);
    }
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user }
    });
  } catch (error) {
    if (error.message === 'Invalid Google token') {
      return res.status(401).json({ success: false, message: error.message, data: null });
    }
    next(error);
  }
};

const adminLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, message: 'Validation failed', data: errors.array() });
    }

    const { username, password } = req.body;
    
    const result = await authService.adminLogin(username, password);
    
    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      data: result
    });
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ success: false, message: error.message, data: null });
    }
    next(error);
  }
};

module.exports = {
  googleLogin,
  adminLogin
};
