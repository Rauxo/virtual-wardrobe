const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            message: 'Token expired. Please login again.'
          });
        } else {
          return res.status(401).json({
            success: false,
            message: 'Invalid token. Please login again.'
          });
        }
      } else {
        if (decoded.exp <= Date.now() / 1000) {
          return res.status(401).json({
            success: false,
            message: 'Token expired'
          });
        }
        req.userId = decoded.userId;
        next();
      }
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