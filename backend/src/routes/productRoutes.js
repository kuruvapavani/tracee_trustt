const express = require('express');
const router = express.Router();
const {
  getProductByQR,
  updateScanCount,
  addTraceabilityStep,
  getAllProducts,
  createProduct,
  verifyProduct
} = require('../controllers/productController');

// Public
router.get('/verify/:qrCode', verifyProduct);
router.get('/:qrCode', getProductByQR);
router.post('/:qrCode/scan', updateScanCount);

// Private/Admin
router.get('/', getAllProducts);
router.post('/', createProduct);
router.post('/:qrCode/steps', addTraceabilityStep);

module.exports = router;
