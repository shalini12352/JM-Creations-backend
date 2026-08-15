const express = require("express");

const {
    getSiteContent,
    createSiteContent,
    updateSiteContent
} = require("../controllers/siteContentController");

const router = express.Router();

// Get site content
// GET /api/site-content
router.get("/", getSiteContent);

// Create site content (single-document enforcement)
// POST /api/site-content
router.post("/", createSiteContent);

// Update site content (single-document update without ID in URL)
// PUT /api/site-content
router.put("/", updateSiteContent);

module.exports = router;
