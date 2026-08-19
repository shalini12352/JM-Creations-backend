const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
    createCareer,
    getCareers,
    getCareerById,
    updateCareer,
    deleteCareer
} = require("../controllers/careerController");

const router = express.Router();

// Create a new career opportunity (Protected)
// POST /api/careers
router.post("/", protect, createCareer);

// Get all career opportunities (supports ?status=, ?department=, ?employmentType=, ?featured= filters) (Public)
// GET /api/careers
router.get("/", getCareers);

// Get a single career opportunity by ID (Public)
// GET /api/careers/:id
router.get("/:id", getCareerById);

// Update a career opportunity (Protected)
// PUT /api/careers/:id
router.put("/:id", protect, updateCareer);

// Delete a career opportunity (Protected)
// DELETE /api/careers/:id
router.delete("/:id", protect, deleteCareer);

module.exports = router;

