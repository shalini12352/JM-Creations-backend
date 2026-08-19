const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
    getAllPortfolio,
    getPortfolioById,
    createPortfolio,
    updatePortfolio,
    deletePortfolio
} = require("../controllers/portfolioController");

const router = express.Router();

// Get all portfolio projects (Public)
// GET /api/portfolio
router.get("/", getAllPortfolio);

// Get single portfolio project by ID (Public)
// GET /api/portfolio/:id
router.get("/:id", getPortfolioById);

// Create a new portfolio project (Protected)
// POST /api/portfolio
router.post("/", protect, createPortfolio);

// Update a portfolio project (Protected)
// PUT /api/portfolio/:id
router.put("/:id", protect, updatePortfolio);

// Delete a portfolio project (Protected)
// DELETE /api/portfolio/:id
router.delete("/:id", protect, deletePortfolio);

module.exports = router;

