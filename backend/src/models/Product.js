const mongoose = require('mongoose');

// Embedded subdocument schema for traceability steps
const TraceabilityStepSchema = new mongoose.Schema({
  stepType: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  certification: { type: String },
  metadata: { type: Object, default: {} },
  timestamp: { type: Date, default: Date.now }
}, { _id: true });

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  qrCode: { type: String, required: true, unique: true, trim: true },
  scanCount: { type: Number, default: 0 },
  steps: [TraceabilityStepSchema]
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
