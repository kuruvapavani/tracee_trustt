const express = require('express');
const {
  getProductByQR,
  updateScanCount,
  addTraceabilityStep,
  getAllProducts,
  createProduct,
} = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes for consumer scanning and basic product info
router.get('/:qrCode', getProductByQR);
router.post('/:qrCode/scan', updateScanCount); // Assuming scan count update is public

// Admin routes (require authentication and authorization)
// Use 'protect' middleware to ensure user is logged in
// Use 'authorizeRoles('admin')' middleware to ensure only admin users can access
router.post('/', protect, authorizeRoles('admin'), createProduct);
router.get('/', protect, authorizeRoles('admin'), getAllProducts); // Get all products for admin dashboard
router.post('/:productId/steps', protect, authorizeRoles('admin'), addTraceabilityStep);

module.exports = router;