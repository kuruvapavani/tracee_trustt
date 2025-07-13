const Product = require('../models/Product');
const contract = require('../config/blockchain');

// GET /api/products/:qrCode
const getProductByQR = async (req, res, next) => {
  try {
    const product = await Product.findOne({ qrCode: req.params.qrCode });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/products/scan/:qrCode
const updateScanCount = async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate(
      { qrCode: req.params.qrCode },
      { $inc: { scanCount: 1 } },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const { name, description, qrCode } = req.body;

    if (!name || !qrCode || !description) {
      return res.status(400).json({ message: 'Product name, description, and QR code are required.' });
    }

    const productExists = await Product.findOne({ qrCode });
    if (productExists) {
      return res.status(400).json({ message: 'Product with this QR code already exists.' });
    }

    // Save on blockchain
    const tx = await contract.createProduct(qrCode, name, description);
    await tx.wait();

    // Save to MongoDB
    const product = await Product.create({
      name,
      description,
      qrCode
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    next(error);
  }
};

// POST /api/products/:productId/steps
const addTraceabilityStep = async (req, res, next) => {
  try {
    const { stepType, description, location, certification, metadata } = req.body;
    const { qrCode } = req.params;

    if (!stepType || !description || !location) {
      return res.status(400).json({ message: 'Missing required step details.' });
    }

    const product = await Product.findOne({ qrCode });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const newStep = {
      stepType,
      description,
      location,
      certification,
      metadata: metadata || {},
      timestamp: new Date()
    };

    product.steps.push(newStep);
    await product.save();

    const tx = await contract.addStep(qrCode, stepType, description, location);
    await tx.wait();

    res.status(201).json(product.steps[product.steps.length - 1]);
  } catch (error) {
    console.error("Trace step error:", error);
    next(error);
  }
};


// GET /api/products
const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// GET /api/products/verify/:qrCode
const verifyProduct = async (req, res, next) => {
  try {
    const { qrCode } = req.params;
    const product = await Product.findOne({ qrCode });
    if (!product) return res.status(404).json({ message: 'Product not found locally' });

    const blockchainProduct = await contract.products(qrCode);
    const isAuthentic = blockchainProduct.exists;

    res.json({ authentic: isAuthentic });
  } catch (error) {
    console.error("Verify product error:", error);
    next(error);
  }
};

module.exports = {
  getProductByQR,
  updateScanCount,
  addTraceabilityStep,
  getAllProducts,
  createProduct,
  verifyProduct
};
