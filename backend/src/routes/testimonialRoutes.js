const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
    createTestimonial,
    getTestimonials,
    getTestimonialById,
    updateTestimonial,
    deleteTestimonial
} = require("../controllers/testimonialController");

const router = express.Router();

// Create a new testimonial (Protected)
// POST /api/testimonials
router.post("/", protect, createTestimonial);

// Get all testimonials (Public)
// GET /api/testimonials
router.get("/", getTestimonials);

// Get a single testimonial by ID (Public)
// GET /api/testimonials/:id
router.get("/:id", getTestimonialById);

// Update a testimonial (Protected)
// PUT /api/testimonials/:id
router.put("/:id", protect, updateTestimonial);

// Delete a testimonial (Protected)
// DELETE /api/testimonials/:id
router.delete("/:id", protect, deleteTestimonial);

module.exports = router;

