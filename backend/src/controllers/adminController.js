// controllers/adminController.js
// This file contains the logic for admin-specific API endpoints.
const Product = require("../models/Product"); // Ensure Product model is imported

const getAdminStats = async (req, res, next) => { // Added 'next' for consistency
  try {
    // Ensure user is authenticated and ID is available from the 'protect' middleware
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID missing from token." });
    }

    const userId = req.user._id; // Get the ID of the authenticated user

    // Filter total products by the current user
    const totalProducts = await Product.countDocuments({ createdBy: userId });

    // Filter total scans for products created by the current user
    const totalScansResult = await Product.aggregate([
      { $match: { createdBy: userId } }, // Add a $match stage to filter by user
      { $group: { _id: null, totalScans: { $sum: "$scannedCount" } } },
    ]);
    const totalScans = totalScansResult.length > 0 ? totalScansResult[0].totalScans : 0;

    // Calculate total traceability steps for products created by the current user
    const totalStepsResult = await Product.aggregate([
      { $match: { createdBy: userId } },
      {
        $project: {
          _id: 0,
          numSteps: { $size: "$steps" }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$numSteps" }
        }
      }
    ]);
    const totalSteps = totalStepsResult.length > 0 ? totalStepsResult[0].total : 0;

    // Get active products count for products created by the current user
    const activeProducts = await Product.countDocuments({ createdBy: userId, status: 'active' });

    // Fetch recent activity (e.g., last 10 product creations or step additions)
    // This is a simplified approach. For a robust solution, a dedicated 'Activity' log would be better.
    const recentProducts = await Product.find({ createdBy: userId }) // Filter by createdBy
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name createdAt steps.stepType steps.timestamp'); // Select steps for activity

    let recentActivity = [];
    for (const product of recentProducts) {
      recentActivity.push({
        action: 'CREATE_PRODUCT',
        details: `New product "${product.name}" created.`,
        timestamp: product.createdAt,
      });
      // Also add recent steps for this product (last 2 steps per product for example)
      const recentSteps = product.steps.slice(-2).reverse(); // Get last 2 steps
      for (const step of recentSteps) {
        recentActivity.push({
          action: 'ADD_STEP',
          details: `Step "${step.stepType}" added to product "${product.name}".`,
          timestamp: step.timestamp,
        });
      }
    }

    // Sort all activities by timestamp in descending order
    recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    recentActivity = recentActivity.slice(0, 10); // Limit to top 10 activities

    res.json({
      totalProducts,
      totalSteps,
      totalScans,
      activeProducts,
      recentActivity,
    });
  } catch (err) {
    console.error("❌ Fetch admin stats failed:", err); // Added more specific error logging
    res
      .status(500)
      .json({ message: "Server error while fetching admin stats" }); // More specific error message
  }
};

module.exports = { getAdminStats };