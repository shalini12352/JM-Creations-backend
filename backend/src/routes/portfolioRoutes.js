const express = require("express");

const {
    getAllPortfolio,
    getPortfolioById,
    createPortfolio,
    updatePortfolio,
    deletePortfolio
} = require("../controllers/portfolioController");

const router = express.Router();

// Get all portfolio projects
// GET /api/portfolio
router.get("/", getAllPortfolio);

// Get single portfolio project by ID
// GET /api/portfolio/:id
router.get("/:id", getPortfolioById);

// Create a new portfolio project
// POST /api/portfolio
router.post("/", createPortfolio);

// Update a portfolio project
// PUT /api/portfolio/:id
router.put("/:id", updatePortfolio);

// Delete a portfolio project
// DELETE /api/portfolio/:id
router.delete("/:id", deletePortfolio);

module.exports = router;
