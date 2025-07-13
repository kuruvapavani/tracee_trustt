const Product = require("../models/Product"); // Ensure Product model is imported
const contract = require("../config/blockchain");

// Create a new product
// POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const { name, description, qrCode, category, manufacturer, batchNumber } =
      req.body;

    // IMPORTANT: This assumes your authentication middleware populates req.user
    // with the authenticated user's details, including their MongoDB _id.
    // Example: req.user = { _id: 'someUserId123', email: 'user@example.com' }
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({
          message: "Unauthorized: User not authenticated or ID missing.",
        });
    }
    const createdBy = req.user._id;

    if (!name || !description || !qrCode) {
      return res
        .status(400)
        .json({ message: "Name, description, and QR code are required." });
    }

    const existing = await Product.findOne({ qrCode });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Product with this QR code already exists." });
    }

    // Save on blockchain
    const tx = await contract.createProduct(qrCode, name, description);
    await tx.wait();

    // Save in MongoDB
    const product = await Product.create({
      name,
      description,
      qrCode,
      category,
      manufacturer,
      batchNumber,
      createdBy: createdBy, // Assign the ID of the user who created this product
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("❌ Create product failed:", error);
    next(error);
  }
};

// Get all products (can be used for admin view or general public products)
// GET /api/products
const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// Get product by MongoDB ID
// GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("❌ Fetch product by ID failed:", err);
    next(err);
  }
};

// Get product by QR Code
// GET /api/products/qr/:qrCode
// GET /api/products/qr/:qrCode
const getProductByQR = async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate(
      { qrCode: req.params.qrCode },
      { $inc: { scannedCount: 1 } }, // increment scan count
      { new: true }
    );

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("❌ Failed to fetch and increment scan count:", err);
    next(err);
  }
};


// Update product status
// PATCH /api/products/:id/status
const updateProductStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    console.error("❌ Update product status failed:", err);
    next(err);
  }
};

// Increment scan count for a QR code
// PATCH /api/products/scan/:qrCode
const incrementScanCount = async (req, res, next) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { qrCode: req.params.qrCode },
      { $inc: { scanCount: 1 } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    console.error("❌ Increment scan count failed:", err);
    next(err);
  }
};

// Add a traceability step
// POST /api/products/:qrCode/steps
const addStepToProduct = async (req, res, next) => {
  try {
    const { stepType, description, location, certification, metadata } =
      req.body;
    const qrCode = req.params.qrCode;

    const product = await Product.findOne({ qrCode });
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Save to blockchain
    const tx = await contract.addStep(qrCode, stepType, description, location);
    const receipt = await tx.wait();

    const newStep = {
      stepType,
      description,
      location,
      certification: certification || "",
      metadata: metadata || {},
      timestamp: new Date(),
      blockchainTxHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      network: "Sepolia",
    };

    product.steps.push(newStep);
    await product.save();

    res.status(201).json(newStep);
  } catch (err) {
    console.error("❌ Add step failed:", err);
    next(err);
  }
};

// Verify product authenticity from blockchain
// GET /api/products/verify/:qrCode
const verifyProduct = async (req, res, next) => {
  try {
    const { qrCode } = req.params;
    const product = await Product.findOne({ qrCode });
    if (!product)
      return res.status(404).json({ message: "Product not found locally" });

    const blockchainProduct = await contract.products(qrCode);
    const isAuthentic = blockchainProduct.exists;

    res.json({ authentic: isAuthentic });
  } catch (error) {
    console.error("❌ Verify product error:", error);
    next(error);
  }
};

// Get products created by the authenticated user
// GET /api/products/my-products
const myProducts = async (req, res) => {
  try {
    // If 'protect' middleware is used, req.user will be available
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID missing from token." });
    }
    // Directly use the authenticated user's ID to filter products
    const userId = req.user._id;
    const products = await Product.find({ createdBy: userId }).sort({ createdAt: -1 });;
    res.json(products);
  } catch (error) {
    console.error("❌ Fetch my products failed:", error);
    res.status(500).json({ message: "Server error while fetching products" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getProductByQR,
  updateProductStatus,
  incrementScanCount,
  addStepToProduct,
  verifyProduct,
  myProducts,
};
