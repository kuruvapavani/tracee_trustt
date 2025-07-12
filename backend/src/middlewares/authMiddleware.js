const jwt = require('jsonwebtoken');
const User = require('../models/User');
const jwtConfig = require('../config/jwt');

// Middleware to protect routes (ensure user is logged in)
const protect = async (req, res, next) => {
  let token;

  // Check for authorization header andBearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (format: "Bearer TOKEN")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, jwtConfig.secret);

      // Find user by ID from token payload and attach to request object (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to authorize users by role
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if user is authenticated and if their role is included in the allowed roles
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role '${req.user.role}' is not authorized to access this route` });
    }
    next(); // Proceed if authorized
  };
};

module.exports = { protect, authorizeRoles };