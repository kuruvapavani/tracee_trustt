const Product = require('../models/Product');

// @desc    Get product details by QR code
// @route   GET /api/products/:qrCode
// @access  Public
const getProductByQR = async (req, res, next) => {
  try {
    const product = await Product.findOne({ qrCode: req.params.qrCode });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Increment product scan count
// @route   POST /api/products/:qrCode/scan
// @access  Public (typically, as consumers scan)
const updateScanCount = async (req, res, next) => {
  try {
    // Find product by QR code and increment scanCount
    const product = await Product.findOneAndUpdate(
      { qrCode: req.params.qrCode },
      { $inc: { scanCount: 1 } }, // Increment scanCount by 1
      { new: true } // Return the updated document
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new traceability step to a product
// @route   POST /api/products/:productId/steps
// @access  Private (Admin only) - uses protect and authorizeRoles middleware
const addTraceabilityStep = async (req, res, next) => {
  try {
    // Extract step details from request body
    const { stepType, description, location, certification, metadata } = req.body;

    // Basic validation for required step fields
    if (!stepType || !description || !location) {
      return res.status(400).json({ message: 'Please provide stepType, description, and location for the step.' });
    }

    // Find the product by its ID
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Create the new step object
    const newStep = {
      stepType,
      description,
      location,
      certification,
      metadata: metadata || {}, // Ensure metadata is an object, even if empty
      timestamp: new Date() // Set timestamp on the server side
    };

    // Add the new step to the product's 'steps' array
    product.steps.push(newStep);
    await product.save(); // Save the updated product document

    // Return the newly added step to the frontend, or the updated product
    res.status(201).json(product.steps[product.steps.length - 1]);

  } catch (error) {
    next(error);
  }
};

// @desc    Get all products (for Admin Dashboard)
// @route   GET /api/products
// @access  Private (Admin only)
const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find({}); // Fetch all products
        res.json(products);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Admin only)
const createProduct = async (req, res, next) => {
    try {
        const { name, description, qrCode } = req.body;

        // Validate required fields
        if (!name || !qrCode) {
            return res.status(400).json({ message: 'Product name and QR code are required.' });
        }

        // Check if a product with this QR code already exists
        const productExists = await Product.findOne({ qrCode });
        if (productExists) {
            return res.status(400).json({ message: 'Product with this QR code already exists.' });
        }

        const product = await Product.create({ name, description, qrCode });
        res.status(201).json(product); // Respond with the newly created product

    } catch (error) {
        next(error);
    }
};


module.exports = {
  getProductByQR,
  updateScanCount,
  addTraceabilityStep,
  getAllProducts,
  createProduct
};