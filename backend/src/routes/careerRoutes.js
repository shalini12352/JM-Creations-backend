const express = require("express");

const {
    createCareer,
    getCareers,
    getCareerById,
    updateCareer,
    deleteCareer
} = require("../controllers/careerController");

const router = express.Router();

// Create a new career opportunity
// POST /api/careers
router.post("/", createCareer);

// Get all career opportunities (supports ?status=, ?department=, ?employmentType=, ?featured= filters)
// GET /api/careers
router.get("/", getCareers);

// Get a single career opportunity by ID
// GET /api/careers/:id
router.get("/:id", getCareerById);

// Update a career opportunity
// PUT /api/careers/:id
router.put("/:id", updateCareer);

// Delete a career opportunity
// DELETE /api/careers/:id
router.delete("/:id", deleteCareer);

module.exports = router;
