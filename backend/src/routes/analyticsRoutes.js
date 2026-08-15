const express = require("express");

const {
    trackEvent,
    getStats
} = require("../controllers/analyticsController");

const router = express.Router();

// Record website analytics event
// POST /api/analytics/track
router.post("/track", trackEvent);

// Fetch aggregated analytics statistics
// GET /api/analytics/stats
router.get("/stats", getStats);

module.exports = router;
