const mongoose = require("mongoose");
const SiteContent = require("../models/siteContent");

const ALLOWED_FIELDS = [
    "companyName", "companyTagline", "companyDescription", "logo", "favicon",
    "email", "phone", "alternatePhone", "address",
    "facebook", "instagram", "linkedin", "youtube", "twitter", "whatsapp",
    "workingHours", "location", "mapUrl",
    "heroTitle", "heroSubtitle", "heroDescription", "heroButtonText", "heroButtonLink",
    "aboutTitle", "aboutDescription", "mission", "vision",
    "footerDescription", "copyrightText"
];

const URL_FIELDS = [
    "logo", "favicon", "facebook", "instagram", "linkedin",
    "youtube", "twitter", "whatsapp", "mapUrl", "heroButtonLink"
];

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PHONE_REGEX = /^[+0-9\s\-()]{7,20}$/;
const URL_REGEX = /^(https?:\/\/|\/)[^\s]+$/;

// Helper to validate and clean input fields
const validateAndCleanInput = (body) => {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return { valid: false, message: "Request body must be an object" };
    }

    const cleaned = {};

    for (const key of Object.keys(body)) {
        // Strip unknown fields
        if (!ALLOWED_FIELDS.includes(key)) {
            continue;
        }

        const value = body[key];

        // Type checking: all siteContent fields must be strings
        if (typeof value !== "string") {
            return { valid: false, message: `Field '${key}' must be a string` };
        }

        const trimmed = value.trim();

        // Validation for email
        if (key === "email" && trimmed) {
            if (!EMAIL_REGEX.test(trimmed)) {
                return { valid: false, message: "Invalid email format" };
            }
        }

        // Validation for phone and alternatePhone
        if ((key === "phone" || key === "alternatePhone") && trimmed) {
            if (!PHONE_REGEX.test(trimmed)) {
                return { valid: false, message: `Invalid phone format for '${key}'` };
            }
        }

        // Validation for URL fields
        if (URL_FIELDS.includes(key) && trimmed) {
            if (!URL_REGEX.test(trimmed)) {
                return { valid: false, message: `Invalid URL format for '${key}'` };
            }
        }

        cleaned[key] = trimmed;
    }

    return { valid: true, data: cleaned };
};

// ==========================================
// GET SITE CONTENT
// GET /api/site-content
// ==========================================
const getSiteContent = async (req, res) => {
    try {
        const content = await SiteContent.findOne();

        if (!content) {
            return res.status(200).json({
                success: true,
                data: {}
            });
        }

        return res.status(200).json({
            success: true,
            data: content
        });
    } catch (error) {
        console.error("Error fetching site content:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch site content"
        });
    }
};

// ==========================================
// CREATE SITE CONTENT
// POST /api/site-content
// ==========================================
const createSiteContent = async (req, res) => {
    try {
        const existing = await SiteContent.findOne();
        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Site content already exists"
            });
        }

        const validation = validateAndCleanInput(req.body);
        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message: validation.message
            });
        }

        const content = await SiteContent.create(validation.data);

        return res.status(201).json({
            success: true,
            message: "Site content created successfully",
            data: content
        });
    } catch (error) {
        console.error("Error creating site content:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create site content"
        });
    }
};

// ==========================================
// UPDATE SITE CONTENT
// PUT /api/site-content
// ==========================================
const updateSiteContent = async (req, res) => {
    try {
        const existing = await SiteContent.findOne();
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Site content not found. Create site content first."
            });
        }

        const validation = validateAndCleanInput(req.body);
        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message: validation.message
            });
        }

        const content = await SiteContent.findByIdAndUpdate(
            existing._id,
            validation.data,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Site content updated successfully",
            data: content
        });
    } catch (error) {
        console.error("Error updating site content:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update site content"
        });
    }
};

module.exports = {
    getSiteContent,
    createSiteContent,
    updateSiteContent
};
