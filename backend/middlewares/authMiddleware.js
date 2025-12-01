const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            message: 'Token expired. Please login again.'
          });
        }
        return res.status(401).json({
          success: false,
          message: 'Invalid token. Please login again.'
        });
      }

      // Extra manual expiration check
      if (decoded.exp && decoded.exp <= Date.now() / 1000) {
        return res.status(401).json({
          success: false,
          message: 'Token expired.'
        });
      }

      // Find user from decoded payload
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found.'
        });
      }

      req.user = user;       // attach whole user
      req.userId = user._id; // also attach userId if needed

      next();
    });

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = authMiddleware;
