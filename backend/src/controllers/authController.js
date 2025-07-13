const User = require('../models/User');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

// Helper function to generate a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};




// @desc    Register a new user (Optional: typically for initial setup or admin creation)
// @route   POST /api/auth/register
// @access  Public (or could be Admin-only via authorizeRoles middleware)
const registerUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ email, password, role });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Optional: Validate if the requested role matches the user's actual role
    // This adds an extra layer of security if frontend explicitly sends a role
    if (role && user.role !== role) {
      return res.status(403).json({ message: `Access denied for role '${role}'` });
    }

    res.json({
      user: { // Send essential user data to frontend
        _id: user._id,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged-in user profile
// @route   GET /api/auth/me
// @access  Private (requires JWT token)
const getMe = async (req, res) => {
  // req.user is populated by the 'protect' middleware
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { registerUser, loginUser, getMe };