const mongoose = require('mongoose');

// Define TraceabilityStep Schema as a sub-document
const TraceabilityStepSchema = new mongoose.Schema({
  stepType: { type: String, required: true }, // e.g., "Harvest", "Processing", "Packaging"
  description: { type: String, required: true },
  location: { type: String, required: true },
  certification: { type: String }, // Optional, e.g., "Organic", "Fair Trade"
  metadata: { // Flexible object for additional, custom data for each step
    type: Object,
    default: {}
    // Example fields you might add here:
    // temperature: { type: String },
    // humidity: { type: String },
    // quality_score: { type: Number },
    // inspector: { type: String },
  },
  timestamp: { type: Date, default: Date.now }, // Timestamp for when the step was recorded
}, { _id: true }); // Mongoose automatically creates _id for sub-documents

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  qrCode: { type: String, required: true, unique: true, trim: true }, // Unique identifier for the product
  scanCount: { type: Number, default: 0 }, // How many times it has been scanned
  steps: [TraceabilityStepSchema], // Array of traceability steps (embedded documents)
}, { timestamps: true }); // Adds createdAt and updatedAt for the product itself

module.exports = mongoose.model('Product', ProductSchema);