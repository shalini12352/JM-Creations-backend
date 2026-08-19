const mongoose = require("mongoose");
const Enquiry = require("../models/enquiry");
const { sendEmailNotification } = require("../services/emailService");
const { sendWhatsAppNotification } = require("../services/whatsappService");

// Helper regex for basic email format validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ==========================================
// CREATE NEW ENQUIRY
// POST /api/enquiries
// ==========================================
const createEnquiry = async (req, res) => {
    try {
        const { name, email, phone, service, message } = req.body || {};

        // Trim all incoming string inputs
        const trimmedName = typeof name === "string" ? name.trim() : "";
        const trimmedEmail = typeof email === "string" ? email.trim() : "";
        const trimmedPhone = typeof phone === "string" ? phone.trim() : "";
        const trimmedService = typeof service === "string" ? service.trim() : "";
        const trimmedMessage = typeof message === "string" ? message.trim() : "";

        // Check for missing or empty required fields
        if (!trimmedName || !trimmedEmail || !trimmedPhone || !trimmedService || !trimmedMessage) {
            return res.status(400).json({
                success: false,
                message: "All fields (name, email, phone, service, message) are required"
            });
        }

        // Validate email format
        if (!EMAIL_REGEX.test(trimmedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
        }

        // Create enquiry in DB
        const enquiry = await Enquiry.create({
            name: trimmedName,
            email: trimmedEmail.toLowerCase(),
            phone: trimmedPhone,
            service: trimmedService,
            message: trimmedMessage
        });

        // Trigger notification services safely after MongoDB save
        try {
            const results = await Promise.allSettled([
                sendEmailNotification(enquiry),
                sendWhatsAppNotification(enquiry)
            ]);

            const emailResult = results[0];
            if (emailResult.status === 'fulfilled') {
                if (emailResult.value?.success) {
                    console.log(`[ENQUIRY CONTROLLER] Email notification SENT for enquiry ID: ${enquiry._id}`);
                } else {
                    console.warn(`[ENQUIRY CONTROLLER] Email notification NOT sent for enquiry ID: ${enquiry._id} — Reason: ${emailResult.value?.message || emailResult.value?.error}`);
                }
            } else {
                console.error(`[ENQUIRY CONTROLLER] Email notification failed for enquiry ID: ${enquiry._id} — Error:`, emailResult.reason);
            }
        } catch (notifError) {
            console.error("Error invoking notification services:", notifError.message || notifError);
        }

        return res.status(201).json({
            success: true,
            message: "Enquiry submitted successfully",
            data: enquiry
        });
    } catch (error) {
        console.error("Error creating enquiry:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to submit enquiry"
        });
    }
};

// ==========================================
// GET ALL ENQUIRIES
// GET /api/enquiries
// ==========================================
const getEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: enquiries.length,
            data: enquiries
        });
    } catch (error) {
        console.error("Error fetching enquiries:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch enquiries"
        });
    }
};

// ==========================================
// GET SINGLE ENQUIRY BY ID
// GET /api/enquiries/:id
// ==========================================
const getEnquiryById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid enquiry ID format"
            });
        }

        const enquiry = await Enquiry.findById(id);

        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: "Enquiry not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: enquiry
        });
    } catch (error) {
        console.error("Error fetching enquiry by ID:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch enquiry"
        });
    }
};

// ==========================================
// UPDATE ENQUIRY STATUS / DETAILS
// PUT /api/enquiries/:id
// ==========================================
const updateEnquiry = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid enquiry ID format"
            });
        }

        const enquiry = await Enquiry.findByIdAndUpdate(
            id,
            req.body,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: "Enquiry not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Enquiry updated successfully",
            data: enquiry
        });
    } catch (error) {
        console.error("Error updating enquiry:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update enquiry"
        });
    }
};

// ==========================================
// DELETE ENQUIRY
// DELETE /api/enquiries/:id
// ==========================================
const deleteEnquiry = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid enquiry ID format"
            });
        }

        const enquiry = await Enquiry.findByIdAndDelete(id);

        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: "Enquiry not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Enquiry deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting enquiry:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete enquiry"
        });
    }
};

module.exports = {
    createEnquiry,
    getEnquiries,
    getEnquiryById,
    updateEnquiry,
    deleteEnquiry
};
