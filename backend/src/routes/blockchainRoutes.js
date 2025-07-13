const express = require("express");
const router = express.Router();
const { getBlockchainStats } = require("../controllers/blockchainController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

// Route: GET /api/blockchain-stats (admin only)
router.get("/blockchain-stats", protect, authorizeRoles("admin"), getBlockchainStats);

module.exports = router;
