const mongoose = require("mongoose");
const AnalyticsEvent = require("../models/analyticsEvent");

const VALID_EVENT_TYPES = ["page_view", "visit"];
const VALID_DEVICE_TYPES = ["desktop", "mobile", "tablet", "unknown"];
const MAX_STRING_LENGTH = 256;

// Helper to validate and trim strings
const cleanString = (val, defaultVal = "") => {
    if (val === undefined || val === null) return defaultVal;
    if (typeof val !== "string") return null;
    return val.trim().slice(0, MAX_STRING_LENGTH);
};

// ==========================================
// TRACK ANALYTICS EVENT
// POST /api/analytics/track
// ==========================================
const trackEvent = async (req, res) => {
    try {
        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request payload"
            });
        }

        const {
            eventType,
            page,
            visitorId,
            sessionId,
            referrer,
            deviceType,
            browser,
            operatingSystem,
            country,
            userAgent
        } = req.body;

        // Validate page (required string)
        const cleanedPage = cleanString(page);
        if (cleanedPage === null || cleanedPage.length === 0) {
            return res.status(400).json({
                success: false,
                message: "page parameter is required and must be a string"
            });
        }

        // Validate eventType
        const cleanedEventType = eventType !== undefined ? cleanString(eventType) : "page_view";
        if (cleanedEventType === null || !VALID_EVENT_TYPES.includes(cleanedEventType)) {
            return res.status(400).json({
                success: false,
                message: "eventType must be 'page_view' or 'visit'"
            });
        }

        // Validate deviceType
        const cleanedDeviceType = deviceType !== undefined ? cleanString(deviceType) : "unknown";
        if (cleanedDeviceType === null || !VALID_DEVICE_TYPES.includes(cleanedDeviceType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid deviceType"
            });
        }

        // Validate metadata string fields
        const cleanedVisitorId = cleanString(visitorId, "");
        const cleanedSessionId = cleanString(sessionId, "");
        const cleanedReferrer = cleanString(referrer, "");
        const cleanedBrowser = cleanString(browser, "unknown");
        const cleanedOS = cleanString(operatingSystem, "unknown");
        const cleanedCountry = cleanString(country, "unknown");
        const cleanedUserAgent = cleanString(userAgent, "");

        if ([cleanedVisitorId, cleanedSessionId, cleanedReferrer, cleanedBrowser, cleanedOS, cleanedCountry, cleanedUserAgent].includes(null)) {
            return res.status(400).json({
                success: false,
                message: "Metadata fields must be strings"
            });
        }

        // Save event in DB with server-side timestamp
        const event = await AnalyticsEvent.create({
            eventType: cleanedEventType,
            page: cleanedPage,
            visitorId: cleanedVisitorId,
            sessionId: cleanedSessionId,
            referrer: cleanedReferrer,
            deviceType: cleanedDeviceType,
            browser: cleanedBrowser,
            operatingSystem: cleanedOS,
            country: cleanedCountry,
            userAgent: cleanedUserAgent,
            timestamp: new Date()
        });

        return res.status(201).json({
            success: true,
            message: "Analytics event recorded"
        });
    } catch (error) {
        console.error("Error recording analytics event:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to record analytics event"
        });
    }
};

// ==========================================
// GET ANALYTICS STATISTICS
// GET /api/analytics/stats
// ==========================================
const getStats = async (req, res) => {
    try {
        const { period = "30d" } = req.query;
        const trimmedPeriod = typeof period === "string" ? period.trim() : "";

        if (!["7d", "30d", "90d", "all"].includes(trimmedPeriod)) {
            return res.status(400).json({
                success: false,
                message: "Invalid period filter. Must be '7d', '30d', '90d', or 'all'"
            });
        }

        const now = new Date();
        let startDate = null;
        if (trimmedPeriod === "7d") {
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (trimmedPeriod === "30d") {
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        } else if (trimmedPeriod === "90d") {
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        }

        const matchQuery = startDate ? { timestamp: { $gte: startDate } } : {};

        // 1. Total Page Views
        const totalPageViews = await AnalyticsEvent.countDocuments({
            ...matchQuery,
            eventType: "page_view"
        });

        // 2. Total Visits
        const totalVisits = await AnalyticsEvent.countDocuments({
            ...matchQuery,
            eventType: "visit"
        });

        // 3. Unique Visitors
        const uniqueVisitorsList = await AnalyticsEvent.distinct("visitorId", {
            ...matchQuery,
            visitorId: { $ne: "" }
        });
        const uniqueVisitors = uniqueVisitorsList.length;

        // 4. Unique Sessions
        const uniqueSessionsList = await AnalyticsEvent.distinct("sessionId", {
            ...matchQuery,
            sessionId: { $ne: "" }
        });
        const uniqueSessions = uniqueSessionsList.length;

        // 5. Top Pages
        const topPages = await AnalyticsEvent.aggregate([
            { $match: { ...matchQuery, eventType: "page_view" } },
            { $group: { _id: "$page", views: { $sum: 1 } } },
            { $sort: { views: -1 } },
            { $limit: 10 },
            { $project: { _id: 0, page: "$_id", views: 1 } }
        ]);

        // 6. Daily Views
        const dailyViews = await AnalyticsEvent.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    views: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $project: { _id: 0, date: "$_id", views: 1 } }
        ]);

        // 7. Device Breakdown
        const devices = await AnalyticsEvent.aggregate([
            { $match: matchQuery },
            { $group: { _id: "$deviceType", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { _id: 0, device: "$_id", count: 1 } }
        ]);

        // 8. Browser Breakdown
        const browsers = await AnalyticsEvent.aggregate([
            { $match: matchQuery },
            { $group: { _id: "$browser", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { _id: 0, browser: "$_id", count: 1 } }
        ]);

        // 9. Operating System Breakdown
        const operatingSystems = await AnalyticsEvent.aggregate([
            { $match: matchQuery },
            { $group: { _id: "$operatingSystem", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { _id: 0, operatingSystem: "$_id", count: 1 } }
        ]);

        // 10. Referrer Breakdown
        const referrers = await AnalyticsEvent.aggregate([
            { $match: matchQuery },
            {
                $project: {
                    ref: {
                        $cond: [
                            { $or: [{ $eq: ["$referrer", ""] }, { $eq: ["$referrer", null] }] },
                            "direct",
                            "$referrer"
                        ]
                    }
                }
            },
            { $group: { _id: "$ref", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { _id: 0, referrer: "$_id", count: 1 } }
        ]);

        return res.status(200).json({
            success: true,
            period: trimmedPeriod,
            data: {
                totalPageViews,
                totalVisits,
                uniqueVisitors,
                uniqueSessions,
                topPages,
                dailyViews,
                devices,
                browsers,
                operatingSystems,
                referrers
            }
        });
    } catch (error) {
        console.error("Error fetching analytics statistics:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch analytics statistics"
        });
    }
};

module.exports = {
    trackEvent,
    getStats
};
