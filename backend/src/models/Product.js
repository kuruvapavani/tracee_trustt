const mongoose = require("mongoose");

// Subdocument schema for traceability steps
const TraceabilityStepSchema = new mongoose.Schema(
  {
    stepType: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    certification: { type: String }, // Optional field for certifications
    metadata: { type: Object, default: {} }, // For any additional, flexible data
    timestamp: { type: Date, default: Date.now },
    // Blockchain-related fields
    blockchainTxHash: { type: String }, // Hash of the blockchain transaction
    blockNumber: { type: Number }, // Block number where the transaction was recorded
    gasUsed: { type: Number }, // Gas used for the transaction
    network: { type: String }, // Which blockchain network (e.g., "Ethereum Mainnet", "Polygon Testnet")
  },
  { _id: true } // Ensures each subdocument gets an _id
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    category: { type: String }, // Added for frontend consistency
    manufacturer: { type: String }, // Added for frontend consistency
    batchNumber: { type: String }, // Added for frontend consistency
    qrCode: { type: String, required: true, unique: true, trim: true },
    scannedCount: { type: Number, default: 0 }, // Renamed from scanCount to match frontend
    steps: [TraceabilityStepSchema], // Array of traceability steps
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true, // Product must be associated with a creator
    },
    status: {
      type: String,
      enum: ["active", "completed", "recalled"],
      default: "active",
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

module.exports = mongoose.model("Product", ProductSchema);