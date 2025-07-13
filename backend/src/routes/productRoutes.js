const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware'); // Import your middleware

// --- Routes requiring authentication ---

// Create a new product: Requires user to be logged in
// You might also want to add authorizeRoles('admin', 'manufacturer') here if only certain roles can create products
router.post('/', protect, productController.createProduct);

// Get products created by the authenticated user: Requires user to be logged in
// This route should come before '/:id' to avoid "CastError"
router.get('/my-products', protect, productController.myProducts);


// --- Public/General Routes (or routes that might have specific middleware) ---

router.get('/', productController.getAllProducts); // Might be public or require specific roles

// Specific routes should come before general dynamic ID routes
router.get('/qr/:qrCode', productController.getProductByQR);
router.get('/verify/:qrCode', productController.verifyProduct);


// --- Routes with dynamic IDs (should come after more specific fixed paths) ---

router.get('/:id', productController.getProductById);
router.patch('/:id/status', protect, productController.updateProductStatus); // Assuming status updates require auth
router.patch('/scan/:qrCode', productController.incrementScanCount); // Scan count might be public or require auth
router.post('/:qrCode/steps', protect, productController.addStepToProduct); // Adding steps usually requires auth

module.exports = router;