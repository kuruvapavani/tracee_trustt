const jwt = require("jsonwebtoken");
const User = require("../models/User");
const jwtConfig = require("../config/jwt");

// Middleware to protect routes (ensure user is logged in)
const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, jwtConfig.secret);
      req.user = await User.findById(decoded.id).select("-password");
      return next();
    } catch (error) {
      console.error("❌ Token verification error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token" });
};



// Middleware to authorize users by role
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if user is authenticated and if their role is included in the allowed roles
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          message: `User role '${req.user.role}' is not authorized to access this route`,
        });
    }
    next(); // Proceed if authorized
  };
};

module.exports = { protect, authorizeRoles };
