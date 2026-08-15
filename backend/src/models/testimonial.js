const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
    {
        clientName: {
            type: String,
            required: true,
            trim: true
        },

        company: {
            type: String,
            trim: true,
            default: ""
        },

        designation: {
            type: String,
            trim: true,
            default: ""
        },

        review: {
            type: String,
            required: true,
            trim: true
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        image: {
            type: String,
            trim: true,
            default: ""
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
