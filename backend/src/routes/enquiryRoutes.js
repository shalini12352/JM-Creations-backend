const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
    createEnquiry,
    getEnquiries,
    getEnquiryById,
    updateEnquiry,
    deleteEnquiry
} = require("../controllers/enquiryController");

const router = express.Router();

// Create a new enquiry (Public for website contact form)
// POST /api/enquiries
router.post("/", createEnquiry);

// Get all enquiries (Protected - Admin only)
// GET /api/enquiries
router.get("/", protect, getEnquiries);

// Get a single enquiry (Protected - Admin only)
// GET /api/enquiries/:id
router.get("/:id", protect, getEnquiryById);

// Update an enquiry (Protected - Admin only)
// PUT /api/enquiries/:id
router.put("/:id", protect, updateEnquiry);

// Delete an enquiry (Protected - Admin only)
// DELETE /api/enquiries/:id
router.delete("/:id", protect, deleteEnquiry);

module.exports = router;