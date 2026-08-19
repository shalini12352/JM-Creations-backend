const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
    trackEvent,
    getStats
} = require("../controllers/analyticsController");

const router = express.Router();

// Record website analytics event (Public for website tracking)
// POST /api/analytics/track
router.post("/track", trackEvent);

// Fetch aggregated analytics statistics (Protected - Admin only)
// GET /api/analytics/stats
router.get("/stats", protect, getStats);

module.exports = router;

