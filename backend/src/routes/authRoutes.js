const express = require('express');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser); // Optional: if you need a public registration endpoint
router.post('/login', loginUser);
router.get('/me', protect, getMe); // Protected route to get current user info

module.exports = router;