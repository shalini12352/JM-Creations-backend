const express = require("express");

const {
    createTestimonial,
    getTestimonials,
    getTestimonialById,
    updateTestimonial,
    deleteTestimonial
} = require("../controllers/testimonialController");

const router = express.Router();

// Create a new testimonial
// POST /api/testimonials
router.post("/", createTestimonial);

// Get all testimonials
// GET /api/testimonials
router.get("/", getTestimonials);

// Get a single testimonial by ID
// GET /api/testimonials/:id
router.get("/:id", getTestimonialById);

// Update a testimonial
// PUT /api/testimonials/:id
router.put("/:id", updateTestimonial);

// Delete a testimonial
// DELETE /api/testimonials/:id
router.delete("/:id", deleteTestimonial);

module.exports = router;
