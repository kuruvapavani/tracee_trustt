const express = require("express");
const router = express.Router();
const { getAdminStats } = require("../controllers/adminController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware"); // optional if you want to restrict

// Route: GET /api/admin/stats
router.get("/stats", protect, authorizeRoles("admin"), getAdminStats);

module.exports = router;
