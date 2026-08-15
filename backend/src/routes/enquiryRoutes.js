const express = require("express");

const {
    createEnquiry,
    getEnquiries,
    getEnquiryById,
    updateEnquiry,
    deleteEnquiry
} = require("../controllers/enquiryController");

const router = express.Router();

// Create a new enquiry
// POST /api/enquiries
router.post("/", createEnquiry);

// Get all enquiries
// GET /api/enquiries
router.get("/", getEnquiries);

// Get a single enquiry
// GET /api/enquiries/:id
router.get("/:id", getEnquiryById);

// Update an enquiry
// PUT /api/enquiries/:id
router.put("/:id", updateEnquiry);

// Delete an enquiry
// DELETE /api/enquiries/:id
router.delete("/:id", deleteEnquiry);

module.exports = router;