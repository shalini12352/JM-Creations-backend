const mongoose = require("mongoose");
const Testimonial = require("../models/testimonial");

// ==========================================
// CREATE NEW TESTIMONIAL
// POST /api/testimonials
// ==========================================
const createTestimonial = async (req, res) => {
    try {
        const { clientName, company, designation, review, rating, image, status } = req.body || {};

        // Trim string inputs
        const trimmedClientName = typeof clientName === "string" ? clientName.trim() : "";
        const trimmedCompany = typeof company === "string" ? company.trim() : "";
        const trimmedDesignation = typeof designation === "string" ? designation.trim() : "";
        const trimmedReview = typeof review === "string" ? review.trim() : "";
        const trimmedImage = typeof image === "string" ? image.trim() : "";
        const trimmedStatus = typeof status === "string" ? status.trim() : "active";

        // Validate required fields
        if (!trimmedClientName || !trimmedReview || rating === undefined || rating === null || rating === "") {
            return res.status(400).json({
                success: false,
                message: "Required fields (clientName, review, rating) must be provided"
            });
        }

        // Validate rating number range 1 to 5
        const parsedRating = Number(rating);
        if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be a number between 1 and 5"
            });
        }

        // Validate status enum if provided
        if (trimmedStatus && !["active", "inactive"].includes(trimmedStatus)) {
            return res.status(400).json({
                success: false,
                message: "Status must be either 'active' or 'inactive'"
            });
        }

        // Create testimonial in DB
        const testimonial = await Testimonial.create({
            clientName: trimmedClientName,
            company: trimmedCompany,
            designation: trimmedDesignation,
            review: trimmedReview,
            rating: parsedRating,
            image: trimmedImage,
            status: trimmedStatus
        });

        return res.status(201).json({
            success: true,
            message: "Testimonial created successfully",
            data: testimonial
        });
    } catch (error) {
        console.error("Error creating testimonial:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create testimonial"
        });
    }
};

// ==========================================
// GET ALL TESTIMONIALS
// GET /api/testimonials
// ==========================================
const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: testimonials.length,
            data: testimonials
        });
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch testimonials"
        });
    }
};

// ==========================================
// GET SINGLE TESTIMONIAL BY ID
// GET /api/testimonials/:id
// ==========================================
const getTestimonialById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid testimonial ID format"
            });
        }

        const testimonial = await Testimonial.findById(id);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: testimonial
        });
    } catch (error) {
        console.error("Error fetching testimonial by ID:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch testimonial"
        });
    }
};

// ==========================================
// UPDATE TESTIMONIAL
// PUT /api/testimonials/:id
// ==========================================
const updateTestimonial = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid testimonial ID format"
            });
        }

        const updateData = { ...req.body };

        if (typeof updateData.clientName === "string") {
            updateData.clientName = updateData.clientName.trim();
            if (!updateData.clientName) {
                return res.status(400).json({
                    success: false,
                    message: "clientName cannot be empty"
                });
            }
        }

        if (typeof updateData.review === "string") {
            updateData.review = updateData.review.trim();
            if (!updateData.review) {
                return res.status(400).json({
                    success: false,
                    message: "review cannot be empty"
                });
            }
        }

        if (typeof updateData.company === "string") {
            updateData.company = updateData.company.trim();
        }

        if (typeof updateData.designation === "string") {
            updateData.designation = updateData.designation.trim();
        }

        if (typeof updateData.image === "string") {
            updateData.image = updateData.image.trim();
        }

        if (updateData.rating !== undefined && updateData.rating !== null) {
            const parsedRating = Number(updateData.rating);
            if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
                return res.status(400).json({
                    success: false,
                    message: "Rating must be a number between 1 and 5"
                });
            }
            updateData.rating = parsedRating;
        }

        if (typeof updateData.status === "string") {
            updateData.status = updateData.status.trim();
            if (!["active", "inactive"].includes(updateData.status)) {
                return res.status(400).json({
                    success: false,
                    message: "Status must be either 'active' or 'inactive'"
                });
            }
        }

        const testimonial = await Testimonial.findByIdAndUpdate(
            id,
            updateData,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Testimonial updated successfully",
            data: testimonial
        });
    } catch (error) {
        console.error("Error updating testimonial:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update testimonial"
        });
    }
};

// ==========================================
// DELETE TESTIMONIAL
// DELETE /api/testimonials/:id
// ==========================================
const deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid testimonial ID format"
            });
        }

        const testimonial = await Testimonial.findByIdAndDelete(id);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Testimonial deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting testimonial:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete testimonial"
        });
    }
};

module.exports = {
    createTestimonial,
    getTestimonials,
    getTestimonialById,
    updateTestimonial,
    deleteTestimonial
};
