const mongoose = require("mongoose");
const Service = require("../models/service");

// ==========================================
// CREATE NEW SERVICE
// POST /api/services
// ==========================================
const createService = async (req, res) => {
    try {
        const { title, description, category, image, status } = req.body || {};

        // Trim string inputs
        const trimmedTitle = typeof title === "string" ? title.trim() : "";
        const trimmedDescription = typeof description === "string" ? description.trim() : "";
        const trimmedCategory = typeof category === "string" ? category.trim() : "";
        const trimmedImage = typeof image === "string" ? image.trim() : "";
        const trimmedStatus = typeof status === "string" ? status.trim() : "active";

        // Validate required fields
        if (!trimmedTitle || !trimmedDescription || !trimmedCategory) {
            return res.status(400).json({
                success: false,
                message: "All required fields (title, description, category) must be provided"
            });
        }

        // Validate status enum if provided
        if (trimmedStatus && !["active", "inactive"].includes(trimmedStatus)) {
            return res.status(400).json({
                success: false,
                message: "Status must be either 'active' or 'inactive'"
            });
        }

        // Create service in DB
        const service = await Service.create({
            title: trimmedTitle,
            description: trimmedDescription,
            category: trimmedCategory,
            image: trimmedImage,
            status: trimmedStatus
        });

        return res.status(201).json({
            success: true,
            message: "Service created successfully",
            data: service
        });
    } catch (error) {
        console.error("Error creating service:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create service"
        });
    }
};

// ==========================================
// GET ALL SERVICES
// GET /api/services
// ==========================================
const getServices = async (req, res) => {
    try {
        const services = await Service.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        console.error("Error fetching services:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch services"
        });
    }
};

// ==========================================
// GET SINGLE SERVICE BY ID
// GET /api/services/:id
// ==========================================
const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID format"
            });
        }

        const service = await Service.findById(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: service
        });
    } catch (error) {
        console.error("Error fetching service by ID:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch service"
        });
    }
};

// ==========================================
// UPDATE SERVICE
// PUT /api/services/:id
// ==========================================
const updateService = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID format"
            });
        }

        const updateData = { ...req.body };
        if (typeof updateData.title === "string") updateData.title = updateData.title.trim();
        if (typeof updateData.description === "string") updateData.description = updateData.description.trim();
        if (typeof updateData.category === "string") updateData.category = updateData.category.trim();
        if (typeof updateData.image === "string") updateData.image = updateData.image.trim();
        if (typeof updateData.status === "string") updateData.status = updateData.status.trim();

        const service = await Service.findByIdAndUpdate(
            id,
            updateData,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Service updated successfully",
            data: service
        });
    } catch (error) {
        console.error("Error updating service:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update service"
        });
    }
};

// ==========================================
// DELETE SERVICE
// DELETE /api/services/:id
// ==========================================
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID format"
            });
        }

        const service = await Service.findByIdAndDelete(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Service deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting service:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete service"
        });
    }
};

module.exports = {
    createService,
    getServices,
    getServiceById,
    updateService,
    deleteService
};
