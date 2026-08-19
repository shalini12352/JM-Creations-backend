const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
    createService,
    getServices,
    getServiceById,
    updateService,
    deleteService
} = require("../controllers/serviceController");

const router = express.Router();

// Create a new service (Protected)
// POST /api/services
router.post("/", protect, createService);

// Get all services (Public)
// GET /api/services
router.get("/", getServices);

// Get a single service by ID (Public)
// GET /api/services/:id
router.get("/:id", getServiceById);

// Update a service (Protected)
// PUT /api/services/:id
router.put("/:id", protect, updateService);

// Delete a service (Protected)
// DELETE /api/services/:id
router.delete("/:id", protect, deleteService);

module.exports = router;

