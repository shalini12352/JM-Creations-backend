const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
    getSiteContent,
    createSiteContent,
    updateSiteContent
} = require("../controllers/siteContentController");

const router = express.Router();

// Get site content (Public)
// GET /api/site-content
router.get("/", getSiteContent);

// Create site content (single-document enforcement) (Protected)
// POST /api/site-content
router.post("/", protect, createSiteContent);

// Update site content (single-document update without ID in URL) (Protected)
// PUT /api/site-content
router.put("/", protect, updateSiteContent);

module.exports = router;

