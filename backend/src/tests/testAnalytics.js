const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");

const AnalyticsEvent = require("../models/analyticsEvent");
const SiteContent = require("../models/siteContent");
const Career = require("../models/career");
const Blog = require("../models/blog");
const Testimonial = require("../models/testimonial");
const Portfolio = require("../models/Portfolio");
const Service = require("../models/service");
const Enquiry = require("../models/enquiry");

const analyticsRoutes = require("../routes/analyticsRoutes");
const siteContentRoutes = require("../routes/siteContentRoutes");
const careerRoutes = require("../routes/careerRoutes");
const blogRoutes = require("../routes/blogRoutes");
const testimonialRoutes = require("../routes/testimonialRoutes");
const portfolioRoutes = require("../routes/portfolioRoutes");
const serviceRoutes = require("../routes/serviceRoutes");
const enquiryRoutes = require("../routes/enquiryRoutes");

// Express App setup
const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "JM Creations API is running"
    });
});

app.use("/api/enquiries", enquiryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/site-content", siteContentRoutes);
app.use("/api/analytics", analyticsRoutes);

const runAnalyticsTestSuite = async () => {
    console.log("==================================================");
    console.log("STARTING JM CREATIONS PHASE 8 — ANALYTICS TEST SUITE");
    console.log("==================================================\n");

    let isAtlasConnected = false;
    const analyticsMemoryStore = new Map();
    const siteContentMemoryStore = new Map();
    const careerMemoryStore = new Map();
    const blogMemoryStore = new Map();
    const testimonialMemoryStore = new Map();
    const portfolioMemoryStore = new Map();
    const serviceMemoryStore = new Map();
    const enquiryMemoryStore = new Map();

    try {
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 2000, connectTimeoutMS: 2000 });
        isAtlasConnected = true;
        console.log("MongoDB Atlas connected successfully for testing.\n");
    } catch (err) {
        console.log("MongoDB Atlas connection unavailable (IP Whitelist check required for remote Atlas DB).");
        console.log("Using in-memory data layer fallback for local test suite execution.\n");

        // Mock AnalyticsEvent model for fallback testing if Atlas IP is restricted
        AnalyticsEvent.create = async function (data) {
            const id = new mongoose.Types.ObjectId().toString();
            const doc = {
                _id: id,
                eventType: "page_view",
                page: "/",
                visitorId: "",
                sessionId: "",
                referrer: "",
                deviceType: "unknown",
                browser: "unknown",
                operatingSystem: "unknown",
                country: "unknown",
                userAgent: "",
                timestamp: new Date(),
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            analyticsMemoryStore.set(id, doc);
            return doc;
        };

        AnalyticsEvent.countDocuments = async function (filter = {}) {
            const list = Array.from(analyticsMemoryStore.values());
            return list.filter(item => {
                if (filter.eventType && item.eventType !== filter.eventType) return false;
                if (filter.timestamp && filter.timestamp.$gte && new Date(item.timestamp) < new Date(filter.timestamp.$gte)) return false;
                return true;
            }).length;
        };

        AnalyticsEvent.distinct = async function (field, filter = {}) {
            const list = Array.from(analyticsMemoryStore.values());
            const set = new Set();
            list.forEach(item => {
                if (filter.timestamp && filter.timestamp.$gte && new Date(item.timestamp) < new Date(filter.timestamp.$gte)) return;
                const val = item[field];
                if (val && val !== "") set.add(val);
            });
            return Array.from(set);
        };

        AnalyticsEvent.aggregate = async function (pipeline = []) {
            let list = Array.from(analyticsMemoryStore.values());
            let matchStage = pipeline.find(s => s.$match)?.$match;
            if (matchStage) {
                if (matchStage.timestamp && matchStage.timestamp.$gte) {
                    list = list.filter(item => new Date(item.timestamp) >= new Date(matchStage.timestamp.$gte));
                }
                if (matchStage.eventType) {
                    list = list.filter(item => item.eventType === matchStage.eventType);
                }
            }

            const groupStage = pipeline.find(s => s.$group)?.$group;
            if (!groupStage) return [];

            const groupId = groupStage._id;

            if (groupId === "$page") {
                const counts = {};
                list.forEach(i => { counts[i.page] = (counts[i.page] || 0) + 1; });
                return Object.entries(counts).map(([page, views]) => ({ page, views })).sort((a, b) => b.views - a.views);
            }

            if (groupId === "$deviceType") {
                const counts = {};
                list.forEach(i => { counts[i.deviceType] = (counts[i.deviceType] || 0) + 1; });
                return Object.entries(counts).map(([device, count]) => ({ device, count })).sort((a, b) => b.count - a.count);
            }

            if (groupId === "$browser") {
                const counts = {};
                list.forEach(i => { counts[i.browser] = (counts[i.browser] || 0) + 1; });
                return Object.entries(counts).map(([browser, count]) => ({ browser, count })).sort((a, b) => b.count - a.count);
            }

            if (groupId === "$operatingSystem") {
                const counts = {};
                list.forEach(i => { counts[i.operatingSystem] = (counts[i.operatingSystem] || 0) + 1; });
                return Object.entries(counts).map(([operatingSystem, count]) => ({ operatingSystem, count })).sort((a, b) => b.count - a.count);
            }

            if (groupId === "$ref") {
                const counts = {};
                list.forEach(i => {
                    const ref = i.referrer ? i.referrer : "direct";
                    counts[ref] = (counts[ref] || 0) + 1;
                });
                return Object.entries(counts).map(([referrer, count]) => ({ referrer, count })).sort((a, b) => b.count - a.count);
            }

            if (typeof groupId === "object" && groupId.$dateToString) {
                const counts = {};
                list.forEach(i => {
                    const dateStr = new Date(i.timestamp).toISOString().split("T")[0];
                    counts[dateStr] = (counts[dateStr] || 0) + 1;
                });
                return Object.entries(counts).map(([date, views]) => ({ date, views })).sort((a, b) => a.date.localeCompare(b.date));
            }

            return [];
        };

        // Fallbacks for regression checks
        SiteContent.findOne = async function () { return null; };
        SiteContent.find = function () { return { sort: function () { return []; } }; };
        Career.find = function () { return { sort: function () { return Array.from(careerMemoryStore.values()); } }; };
        Blog.find = function () { return { sort: function () { return Array.from(blogMemoryStore.values()); } }; };
        Testimonial.find = function () { return { sort: function () { return Array.from(testimonialMemoryStore.values()); } }; };
        Portfolio.find = function () { return { sort: function () { return Array.from(portfolioMemoryStore.values()); } }; };
        Service.find = function () { return { sort: function () { return Array.from(serviceMemoryStore.values()); } }; };
        Enquiry.find = function () { return { sort: function () { return Array.from(enquiryMemoryStore.values()); } }; };
    }

    // Start server on ephemeral port
    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    const baseUrl = `http://127.0.0.1:${port}`;

    const makeRequest = (path, method = "GET", body = null) => {
        return new Promise((resolve, reject) => {
            const url = new URL(path, baseUrl);
            const options = {
                hostname: url.hostname,
                port: url.port,
                path: url.pathname + url.search,
                method: method,
                headers: { "Content-Type": "application/json" }
            };

            const req = http.request(options, (res) => {
                let data = "";
                res.on("data", (chunk) => { data += chunk; });
                res.on("end", () => {
                    try {
                        resolve({ status: res.statusCode, body: JSON.parse(data) });
                    } catch (e) {
                        resolve({ status: res.statusCode, raw: data });
                    }
                });
            });

            req.on("error", (err) => reject(err));
            if (body) req.write(JSON.stringify(body));
            req.end();
        });
    };

    const testResults = [];
    const recordResult = (testName, pass, details = "") => {
        const status = pass ? "PASS" : "FAIL";
        testResults.push({ name: testName, status, details });
        console.log(`[${status}] ${testName}${details ? ` -> ${details}` : ""}`);
    };

    try {
        // --------------------------------------------------
        // TEST 22: Verify Empty Database Returns Safe Zero-Value Statistics
        // --------------------------------------------------
        const res22 = await makeRequest("/api/analytics/stats");
        const pass22 = res22.status === 200 && res22.body?.success === true && res22.body?.data?.totalPageViews === 0 && res22.body?.data?.uniqueVisitors === 0;
        recordResult("22. Empty Analytics Database Returns Safe Zero Statistics", pass22, `Status ${res22.status}, totalPageViews: ${res22.body?.data?.totalPageViews}`);

        // --------------------------------------------------
        // TEST 1: Track Valid Page View
        // --------------------------------------------------
        const pageViewPayload = {
            eventType: "page_view",
            page: "/services",
            visitorId: "visitor_123",
            sessionId: "session_456",
            referrer: "https://google.com",
            deviceType: "desktop",
            browser: "Chrome",
            operatingSystem: "Windows",
            country: "USA"
        };
        const res1 = await makeRequest("/api/analytics/track", "POST", pageViewPayload);
        const pass1 = res1.status === 201 && res1.body?.success === true && res1.body?.message === "Analytics event recorded";
        recordResult("1. Track Valid Page View (POST /api/analytics/track)", pass1, `Status ${res1.status}`);

        // --------------------------------------------------
        // TEST 2: Track Valid Visit Event
        // --------------------------------------------------
        const visitPayload = {
            eventType: "visit",
            page: "/",
            visitorId: "visitor_123",
            sessionId: "session_456",
            referrer: "",
            deviceType: "mobile",
            browser: "Safari",
            operatingSystem: "iOS",
            country: "Canada"
        };
        const res2 = await makeRequest("/api/analytics/track", "POST", visitPayload);
        const pass2 = res2.status === 201 && res2.body?.success === true;
        recordResult("2. Track Valid Visit Event (POST /api/analytics/track)", pass2, `Status ${res2.status}`);

        // --------------------------------------------------
        // TEST 3: Track Minimal Valid Event (Only `page` provided)
        // --------------------------------------------------
        const res3 = await makeRequest("/api/analytics/track", "POST", { page: "/portfolio" });
        const pass3 = res3.status === 201 && res3.body?.success === true;
        recordResult("3. Track Minimal Valid Event (POST /api/analytics/track)", pass3, `Status ${res3.status}`);

        // --------------------------------------------------
        // TEST 4: Reject Missing `page` Parameter
        // --------------------------------------------------
        const res4 = await makeRequest("/api/analytics/track", "POST", { eventType: "page_view" });
        const pass4 = res4.status === 400 && res4.body?.success === false;
        recordResult("4. Reject Missing `page` Parameter (POST /api/analytics/track)", pass4, `Status ${res4.status}, Message: ${res4.body?.message}`);

        // --------------------------------------------------
        // TEST 5: Reject Invalid `eventType`
        // --------------------------------------------------
        const res5 = await makeRequest("/api/analytics/track", "POST", { page: "/", eventType: "custom_click" });
        const pass5 = res5.status === 400 && res5.body?.success === false;
        recordResult("5. Reject Invalid `eventType` (POST /api/analytics/track)", pass5, `Status ${res5.status}, Message: ${res5.body?.message}`);

        // --------------------------------------------------
        // TEST 6: Reject Invalid `deviceType`
        // --------------------------------------------------
        const res6 = await makeRequest("/api/analytics/track", "POST", { page: "/", deviceType: "smart_watch" });
        const pass6 = res6.status === 400 && res6.body?.success === false;
        recordResult("6. Reject Invalid `deviceType` (POST /api/analytics/track)", pass6, `Status ${res6.status}, Message: ${res6.body?.message}`);

        // --------------------------------------------------
        // TEST 7: Reject Invalid Data Types (non-string page)
        // --------------------------------------------------
        const res7 = await makeRequest("/api/analytics/track", "POST", { page: 12345 });
        const pass7 = res7.status === 400 && res7.body?.success === false;
        recordResult("7. Reject Invalid Data Types (POST /api/analytics/track)", pass7, `Status ${res7.status}, Message: ${res7.body?.message}`);

        // Track a second visitor to verify aggregations
        await makeRequest("/api/analytics/track", "POST", {
            eventType: "page_view",
            page: "/services",
            visitorId: "visitor_789",
            sessionId: "session_999",
            referrer: "https://bing.com",
            deviceType: "desktop",
            browser: "Firefox",
            operatingSystem: "Linux"
        });

        // --------------------------------------------------
        // TEST 8: Verify Events Stored in Database
        // --------------------------------------------------
        const count = await AnalyticsEvent.countDocuments();
        const pass8 = count >= 4;
        recordResult("8. Verify Events Stored in Database", pass8, `Stored count: ${count}`);

        // --------------------------------------------------
        // TEST 9: Get Analytics Statistics (GET /api/analytics/stats)
        // --------------------------------------------------
        const statsRes = await makeRequest("/api/analytics/stats");
        const pass9 = statsRes.status === 200 && statsRes.body?.success === true && statsRes.body?.data;
        recordResult("9. Get Analytics Statistics (GET /api/analytics/stats)", pass9, `Status ${statsRes.status}`);

        const statsData = statsRes.body?.data || {};

        // --------------------------------------------------
        // TEST 10: Verify Total Page Views Calculation
        // --------------------------------------------------
        const pass10 = statsData.totalPageViews >= 3;
        recordResult("10. Verify Total Page Views Calculation", pass10, `totalPageViews: ${statsData.totalPageViews}`);

        // --------------------------------------------------
        // TEST 11: Verify Unique Visitors Calculation
        // --------------------------------------------------
        const pass11 = statsData.uniqueVisitors >= 2;
        recordResult("11. Verify Unique Visitors Calculation", pass11, `uniqueVisitors: ${statsData.uniqueVisitors}`);

        // --------------------------------------------------
        // TEST 12: Verify Unique Sessions Calculation
        // --------------------------------------------------
        const pass12 = statsData.uniqueSessions >= 2;
        recordResult("12. Verify Unique Sessions Calculation", pass12, `uniqueSessions: ${statsData.uniqueSessions}`);

        // --------------------------------------------------
        // TEST 13: Verify Top Pages Aggregation
        // --------------------------------------------------
        const pass13 = Array.isArray(statsData.topPages) && statsData.topPages.some(p => p.page === "/services");
        recordResult("13. Verify Top Pages Aggregation", pass13, `topPages count: ${statsData.topPages?.length}`);

        // --------------------------------------------------
        // TEST 14: Verify Daily Statistics Aggregation
        // --------------------------------------------------
        const pass14 = Array.isArray(statsData.dailyViews) && statsData.dailyViews.length >= 1;
        recordResult("14. Verify Daily Views Aggregation", pass14, `dailyViews count: ${statsData.dailyViews?.length}`);

        // --------------------------------------------------
        // TEST 15: Verify Device Statistics Aggregation
        // --------------------------------------------------
        const pass15 = Array.isArray(statsData.devices) && statsData.devices.some(d => d.device === "desktop");
        recordResult("15. Verify Device Statistics Aggregation", pass15, `devices count: ${statsData.devices?.length}`);

        // --------------------------------------------------
        // TEST 16: Verify Browser Statistics Aggregation
        // --------------------------------------------------
        const pass16 = Array.isArray(statsData.browsers) && statsData.browsers.some(b => b.browser === "Chrome");
        recordResult("16. Verify Browser Statistics Aggregation", pass16, `browsers count: ${statsData.browsers?.length}`);

        // --------------------------------------------------
        // TEST 17: Verify Operating System Statistics Aggregation
        // --------------------------------------------------
        const pass17 = Array.isArray(statsData.operatingSystems) && statsData.operatingSystems.some(o => o.operatingSystem === "Windows");
        recordResult("17. Verify OS Statistics Aggregation", pass17, `OS count: ${statsData.operatingSystems?.length}`);

        // --------------------------------------------------
        // TEST 18: Verify Referrer Statistics Aggregation (with "direct" mapping)
        // --------------------------------------------------
        const pass18 = Array.isArray(statsData.referrers) && statsData.referrers.some(r => r.referrer === "direct" || r.referrer.includes("google.com"));
        recordResult("18. Verify Referrer Statistics Aggregation", pass18, `referrers count: ${statsData.referrers?.length}`);

        // --------------------------------------------------
        // TEST 19: Verify 7-Day Period Filter (?period=7d)
        // --------------------------------------------------
        const res19 = await makeRequest("/api/analytics/stats?period=7d");
        const pass19 = res19.status === 200 && res19.body?.period === "7d";
        recordResult("19. Verify 7-Day Period Filter (GET /api/analytics/stats?period=7d)", pass19, `Status ${res19.status}, Period: ${res19.body?.period}`);

        // --------------------------------------------------
        // TEST 20: Verify 30-Day Period Filter (?period=30d)
        // --------------------------------------------------
        const res20 = await makeRequest("/api/analytics/stats?period=30d");
        const pass20 = res20.status === 200 && res20.body?.period === "30d";
        recordResult("20. Verify 30-Day Period Filter (GET /api/analytics/stats?period=30d)", pass20, `Status ${res20.status}, Period: ${res20.body?.period}`);

        // --------------------------------------------------
        // TEST 21: Reject Invalid Period Parameter
        // --------------------------------------------------
        const res21 = await makeRequest("/api/analytics/stats?period=invalid_period");
        const pass21 = res21.status === 400 && res21.body?.success === false;
        recordResult("21. Reject Invalid Period Parameter (GET /api/analytics/stats?period=invalid)", pass21, `Status ${res21.status}, Message: ${res21.body?.message}`);

        console.log("\n--------------------------------------------------");
        console.log("REGRESSION VERIFICATION FOR ALL EXISTING MODULES");
        console.log("--------------------------------------------------\n");

        // Health Check Regression
        const healthRes = await makeRequest("/api/health");
        const healthPass = healthRes.status === 200 && healthRes.body?.success === true;
        recordResult("Health Check API Regression Check (GET /api/health)", healthPass, `Status ${healthRes.status}`);

        // Enquiry API Regression
        const enquiryRes = await makeRequest("/api/enquiries");
        const enquiryPass = enquiryRes.status === 200 && enquiryRes.body?.success === true;
        recordResult("Enquiry API Regression Check (GET /api/enquiries)", enquiryPass, `Status ${enquiryRes.status}`);

        // Services API Regression
        const serviceRes = await makeRequest("/api/services");
        const servicePass = serviceRes.status === 200 && serviceRes.body?.success === true;
        recordResult("Services API Regression Check (GET /api/services)", servicePass, `Status ${serviceRes.status}`);

        // Portfolio API Regression
        const portfolioRes = await makeRequest("/api/portfolio");
        const portfolioPass = portfolioRes.status === 200 && portfolioRes.body?.success === true;
        recordResult("Portfolio API Regression Check (GET /api/portfolio)", portfolioPass, `Status ${portfolioRes.status}`);

        // Testimonials API Regression
        const testimonialRes = await makeRequest("/api/testimonials");
        const testimonialPass = testimonialRes.status === 200 && testimonialRes.body?.success === true;
        recordResult("Testimonials API Regression Check (GET /api/testimonials)", testimonialPass, `Status ${testimonialRes.status}`);

        // Blog API Regression
        const blogRes = await makeRequest("/api/blogs");
        const blogPass = blogRes.status === 200 && blogRes.body?.success === true;
        recordResult("Blog API Regression Check (GET /api/blogs)", blogPass, `Status ${blogRes.status}`);

        // Career API Regression
        const careerRes = await makeRequest("/api/careers");
        const careerPass = careerRes.status === 200 && careerRes.body?.success === true;
        recordResult("Career API Regression Check (GET /api/careers)", careerPass, `Status ${careerRes.status}`);

        // Site Content API Regression
        const siteContentRes = await makeRequest("/api/site-content");
        const siteContentPass = siteContentRes.status === 200 && siteContentRes.body?.success === true;
        recordResult("Site Content API Regression Check (GET /api/site-content)", siteContentPass, `Status ${siteContentRes.status}`);

        console.log("\n==================================================");
        console.log("FINAL ANALYTICS TEST RESULTS SUMMARY");
        console.log("==================================================");
        testResults.forEach(r => {
            console.log(`- ${r.name}: ${r.status}${r.details ? ` (${r.details})` : ""}`);
        });

    } catch (err) {
        console.error("Analytics Test Suite Error:", err);
    } finally {
        server.close();
        if (isAtlasConnected) {
            await mongoose.disconnect();
        }
        console.log("\nAnalytics test suite execution completed.");
    }
};

runAnalyticsTestSuite();
