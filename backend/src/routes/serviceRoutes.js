const express = require("express");

const {
    createService,
    getServices,
    getServiceById,
    updateService,
    deleteService
} = require("../controllers/serviceController");

const router = express.Router();

// Create a new service
// POST /api/services
router.post("/", createService);

// Get all services
// GET /api/services
router.get("/", getServices);

// Get a single service by ID
// GET /api/services/:id
router.get("/:id", getServiceById);

// Update a service
// PUT /api/services/:id
router.put("/:id", updateService);

// Delete a service
// DELETE /api/services/:id
router.delete("/:id", deleteService);

module.exports = router;
