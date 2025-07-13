const Product = require("../models/Product");

const getAdminStats = async (req, res) => {
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
    const totalScans = await Product.aggregate([
      { $match: { createdBy: userId } }, // Add a $match stage to filter by user
      { $group: { _id: null, totalScans: { $sum: "$scanCount" } } },
    ]);

    res.json({
      totalProducts,
      totalScans: totalScans[0]?.totalScans || 0,
    });
  } catch (err) {
    console.error("❌ Fetch admin stats failed:", err); // Added more specific error logging
    res
      .status(500)
      .json({ message: "Server error while fetching admin stats" }); // More specific error message
  }
};

module.exports = { getAdminStats };
