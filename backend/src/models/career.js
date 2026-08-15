const mongoose = require("mongoose");

const careerSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        department: {
            type: String,
            trim: true,
            default: ""
        },

        location: {
            type: String,
            trim: true,
            default: ""
        },

        employmentType: {
            type: String,
            enum: ["full-time", "part-time", "internship", "contract", "freelance"],
            default: "full-time"
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        responsibilities: {
            type: [{ type: String, trim: true }],
            default: []
        },

        requirements: {
            type: [{ type: String, trim: true }],
            default: []
        },

        skills: {
            type: [{ type: String, trim: true }],
            default: []
        },

        experience: {
            type: String,
            trim: true,
            default: ""
        },

        salary: {
            type: String,
            trim: true,
            default: ""
        },

        status: {
            type: String,
            enum: ["open", "closed"],
            default: "open"
        },

        featured: {
            type: Boolean,
            default: false
        },

        applicationEmail: {
            type: String,
            trim: true,
            default: ""
        },

        displayOrder: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Career", careerSchema);
