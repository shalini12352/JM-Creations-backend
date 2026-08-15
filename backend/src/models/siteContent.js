const mongoose = require("mongoose");

const siteContentSchema = new mongoose.Schema(
    {
        // 1. Company Information
        companyName: {
            type: String,
            trim: true,
            default: ""
        },
        companyTagline: {
            type: String,
            trim: true,
            default: ""
        },
        companyDescription: {
            type: String,
            trim: true,
            default: ""
        },
        logo: {
            type: String,
            trim: true,
            default: ""
        },
        favicon: {
            type: String,
            trim: true,
            default: ""
        },

        // 2. Contact Information
        email: {
            type: String,
            trim: true,
            default: ""
        },
        phone: {
            type: String,
            trim: true,
            default: ""
        },
        alternatePhone: {
            type: String,
            trim: true,
            default: ""
        },
        address: {
            type: String,
            trim: true,
            default: ""
        },

        // 3. Social Media
        facebook: {
            type: String,
            trim: true,
            default: ""
        },
        instagram: {
            type: String,
            trim: true,
            default: ""
        },
        linkedin: {
            type: String,
            trim: true,
            default: ""
        },
        youtube: {
            type: String,
            trim: true,
            default: ""
        },
        twitter: {
            type: String,
            trim: true,
            default: ""
        },
        whatsapp: {
            type: String,
            trim: true,
            default: ""
        },

        // 4. Business Information
        workingHours: {
            type: String,
            trim: true,
            default: ""
        },
        location: {
            type: String,
            trim: true,
            default: ""
        },
        mapUrl: {
            type: String,
            trim: true,
            default: ""
        },

        // 5. Home Page Content
        heroTitle: {
            type: String,
            trim: true,
            default: ""
        },
        heroSubtitle: {
            type: String,
            trim: true,
            default: ""
        },
        heroDescription: {
            type: String,
            trim: true,
            default: ""
        },
        heroButtonText: {
            type: String,
            trim: true,
            default: ""
        },
        heroButtonLink: {
            type: String,
            trim: true,
            default: ""
        },

        // 6. About Page Content
        aboutTitle: {
            type: String,
            trim: true,
            default: ""
        },
        aboutDescription: {
            type: String,
            trim: true,
            default: ""
        },
        mission: {
            type: String,
            trim: true,
            default: ""
        },
        vision: {
            type: String,
            trim: true,
            default: ""
        },

        // 7. Footer Content
        footerDescription: {
            type: String,
            trim: true,
            default: ""
        },
        copyrightText: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("SiteContent", siteContentSchema);
