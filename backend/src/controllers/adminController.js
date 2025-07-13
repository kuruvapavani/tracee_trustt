const Product = require("../models/Product");

const getAdminStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalScans = await Product.aggregate([
      { $group: { _id: null, totalScans: { $sum: "$scanCount" } } }
    ]);
    
    res.json({
      totalProducts,
      totalScans: totalScans[0]?.totalScans || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAdminStats };
