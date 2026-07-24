const jwt = require('jsonwebtoken');

const protectAdmin = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach admin info to request
      req.admin = decoded;

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
        data: null
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
      data: null
    });
  }
};

module.exports = { protectAdmin };
