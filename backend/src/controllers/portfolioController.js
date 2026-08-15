const mongoose = require("mongoose");
const Portfolio = require("../models/Portfolio");

// ==========================================
// GET ALL PORTFOLIO PROJECTS
// GET /api/portfolio
// ==========================================
const getAllPortfolio = async (req, res) => {
    try {
        const projects = await Portfolio.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        console.error("Error fetching portfolio projects:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch portfolio projects"
        });
    }
};

// ==========================================
// GET SINGLE PORTFOLIO PROJECT BY ID
// GET /api/portfolio/:id
// ==========================================
const getPortfolioById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid portfolio ID format"
            });
        }

        const project = await Portfolio.findById(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Portfolio project not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: project
        });
    } catch (error) {
        console.error("Error fetching portfolio project by ID:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch portfolio project"
        });
    }
};

// ==========================================
// CREATE NEW PORTFOLIO PROJECT
// POST /api/portfolio
// ==========================================
const createPortfolio = async (req, res) => {
    try {
        const { title, description, category, image, projectUrl, status } = req.body || {};

        // Trim string inputs
        const trimmedTitle = typeof title === "string" ? title.trim() : "";
        const trimmedDescription = typeof description === "string" ? description.trim() : "";
        const trimmedCategory = typeof category === "string" ? category.trim() : "";
        const trimmedImage = typeof image === "string" ? image.trim() : "";
        const trimmedProjectUrl = typeof projectUrl === "string" ? projectUrl.trim() : "";
        const trimmedStatus = typeof status === "string" ? status.trim() : "active";

        // Validate required fields
        if (!trimmedTitle || !trimmedDescription || !trimmedCategory || !trimmedImage) {
            return res.status(400).json({
                success: false,
                message: "All required fields (title, description, category, image) must be provided"
            });
        }

        // Validate status enum if provided
        if (trimmedStatus && !["active", "inactive"].includes(trimmedStatus)) {
            return res.status(400).json({
                success: false,
                message: "Status must be either 'active' or 'inactive'"
            });
        }

        // Create portfolio project in DB
        const project = await Portfolio.create({
            title: trimmedTitle,
            description: trimmedDescription,
            category: trimmedCategory,
            image: trimmedImage,
            projectUrl: trimmedProjectUrl,
            status: trimmedStatus
        });

        return res.status(201).json({
            success: true,
            message: "Portfolio project created successfully",
            data: project
        });
    } catch (error) {
        console.error("Error creating portfolio project:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create portfolio project"
        });
    }
};

// ==========================================
// UPDATE PORTFOLIO PROJECT
// PUT /api/portfolio/:id
// ==========================================
const updatePortfolio = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid portfolio ID format"
            });
        }

        const updateData = { ...req.body };
        if (typeof updateData.title === "string") updateData.title = updateData.title.trim();
        if (typeof updateData.description === "string") updateData.description = updateData.description.trim();
        if (typeof updateData.category === "string") updateData.category = updateData.category.trim();
        if (typeof updateData.image === "string") updateData.image = updateData.image.trim();
        if (typeof updateData.projectUrl === "string") updateData.projectUrl = updateData.projectUrl.trim();
        if (typeof updateData.status === "string") updateData.status = updateData.status.trim();

        // Validate status if being updated
        if (updateData.status && !["active", "inactive"].includes(updateData.status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be either 'active' or 'inactive'"
            });
        }

        const project = await Portfolio.findByIdAndUpdate(
            id,
            updateData,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Portfolio project not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Portfolio project updated successfully",
            data: project
        });
    } catch (error) {
        console.error("Error updating portfolio project:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update portfolio project"
        });
    }
};

// ==========================================
// DELETE PORTFOLIO PROJECT
// DELETE /api/portfolio/:id
// ==========================================
const deletePortfolio = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid portfolio ID format"
            });
        }

        const project = await Portfolio.findByIdAndDelete(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Portfolio project not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Portfolio project deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting portfolio project:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete portfolio project"
        });
    }
};

module.exports = {
    getAllPortfolio,
    getPortfolioById,
    createPortfolio,
    updatePortfolio,
    deletePortfolio
};
