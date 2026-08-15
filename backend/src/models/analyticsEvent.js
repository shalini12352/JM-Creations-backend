const mongoose = require("mongoose");

const analyticsEventSchema = new mongoose.Schema(
    {
        eventType: {
            type: String,
            enum: ["page_view", "visit"],
            default: "page_view",
            trim: true
        },

        page: {
            type: String,
            required: true,
            trim: true
        },

        visitorId: {
            type: String,
            trim: true,
            default: ""
        },

        sessionId: {
            type: String,
            trim: true,
            default: ""
        },

        referrer: {
            type: String,
            trim: true,
            default: ""
        },

        deviceType: {
            type: String,
            enum: ["desktop", "mobile", "tablet", "unknown"],
            default: "unknown",
            trim: true
        },

        browser: {
            type: String,
            trim: true,
            default: "unknown"
        },

        operatingSystem: {
            type: String,
            trim: true,
            default: "unknown"
        },

        country: {
            type: String,
            trim: true,
            default: "unknown"
        },

        userAgent: {
            type: String,
            trim: true,
            default: ""
        },

        timestamp: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

// Indexes for common query patterns
analyticsEventSchema.index({ timestamp: -1 });
analyticsEventSchema.index({ eventType: 1 });
analyticsEventSchema.index({ page: 1 });
analyticsEventSchema.index({ visitorId: 1 });
analyticsEventSchema.index({ sessionId: 1 });

module.exports = mongoose.model("AnalyticsEvent", analyticsEventSchema);
