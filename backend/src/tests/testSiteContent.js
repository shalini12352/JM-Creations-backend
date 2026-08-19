const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");

const SiteContent = require("../models/siteContent");
const Career = require("../models/career");
const Blog = require("../models/blog");
const Testimonial = require("../models/testimonial");
const Portfolio = require("../models/Portfolio");
const Service = require("../models/service");
const Enquiry = require("../models/enquiry");

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

const runSiteContentTestSuite = async () => {
    console.log("==================================================");
    console.log("STARTING JM CREATIONS PHASE 7 — SITE CONTENT TEST SUITE");
    console.log("==================================================\n");

    let isAtlasConnected = false;
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

        // Mock SiteContent model for fallback testing if Atlas IP is restricted
        SiteContent.findOne = async function () {
            const list = Array.from(siteContentMemoryStore.values());
            return list.length > 0 ? list[0] : null;
        };

        SiteContent.create = async function (data) {
            const id = new mongoose.Types.ObjectId().toString();
            const doc = {
                _id: id,
                companyName: "", companyTagline: "", companyDescription: "", logo: "", favicon: "",
                email: "", phone: "", alternatePhone: "", address: "",
                facebook: "", instagram: "", linkedin: "", youtube: "", twitter: "", whatsapp: "",
                workingHours: "", location: "", mapUrl: "",
                heroTitle: "", heroSubtitle: "", heroDescription: "", heroButtonText: "", heroButtonLink: "",
                aboutTitle: "", aboutDescription: "", mission: "", vision: "",
                footerDescription: "", copyrightText: "",
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            siteContentMemoryStore.set(id, doc);
            return doc;
        };

        SiteContent.findByIdAndUpdate = async function (id, updateData, options) {
            const existing = siteContentMemoryStore.get(id?.toString());
            if (!existing) return null;
            const updated = {
                ...existing,
                ...updateData,
                updatedAt: new Date()
            };
            siteContentMemoryStore.set(id?.toString(), updated);
            return updated;
        };

        // Fallbacks for regression checks
        Career.find = function () {
            return { sort: function () { return Array.from(careerMemoryStore.values()); } };
        };
        Blog.find = function () {
            return { sort: function () { return Array.from(blogMemoryStore.values()); } };
        };
        Testimonial.find = function () {
            return { sort: function () { return Array.from(testimonialMemoryStore.values()); } };
        };
        Portfolio.find = function () {
            return { sort: function () { return Array.from(portfolioMemoryStore.values()); } };
        };
        Service.find = function () {
            return { sort: function () { return Array.from(serviceMemoryStore.values()); } };
        };
        Enquiry.find = function () {
            return { sort: function () { return Array.from(enquiryMemoryStore.values()); } };
        };
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
        // TEST 1: GET Site Content When No Document Exists
        // --------------------------------------------------
        const res1 = await makeRequest("/api/site-content");
        const pass1 = res1.status === 200 && res1.body?.success === true && typeof res1.body?.data === "object" && Object.keys(res1.body.data).length === 0;
        recordResult("1. GET Site Content When Empty (GET /api/site-content)", pass1, `Status ${res1.status}, data: ${JSON.stringify(res1.body?.data)}`);

        // --------------------------------------------------
        // TEST 2: Create Site Content (POST /api/site-content)
        // --------------------------------------------------
        const createPayload = {
            companyName: "JM Creations",
            companyTagline: "Innovating Digital Experiences",
            companyDescription: "Full service digital web agency.",
            logo: "https://example.com/logo.png",
            favicon: "https://example.com/favicon.ico",
            email: "info@jmcreations.com",
            phone: "+91 90429 86355",
            alternatePhone: "+91 90429 86355",
            address: "123 Innovation Way, Tech Suite 400",
            facebook: "https://facebook.com/jmcreations",
            instagram: "https://instagram.com/jmcreations",
            linkedin: "https://linkedin.com/company/jmcreations",
            youtube: "https://youtube.com/@jmcreations",
            twitter: "https://twitter.com/jmcreations",
            whatsapp: "https://wa.me/919042986355",
            workingHours: "Mon-Fri 9AM - 6PM EST",
            location: "New York, USA",
            mapUrl: "https://maps.example.com/jmcreations",
            heroTitle: "Crafting Digital Success",
            heroSubtitle: "Web, Design & Marketing Solutions",
            heroDescription: "We build modern software products for growing businesses.",
            heroButtonText: "Explore Services",
            heroButtonLink: "/services",
            aboutTitle: "About JM Creations",
            aboutDescription: "Founded to bridge software excellence and client goals.",
            mission: "Deliver state of the art web applications.",
            vision: "To be a leading global tech agency.",
            footerDescription: "JM Creations © All rights reserved.",
            copyrightText: "© 2026 JM Creations"
        };
        const res2 = await makeRequest("/api/site-content", "POST", createPayload);
        const pass2 = res2.status === 201 && res2.body?.success === true && res2.body?.data?.companyName === "JM Creations";
        recordResult("2. Create Site Content (POST /api/site-content)", pass2, `Status ${res2.status}, companyName: "${res2.body?.data?.companyName}"`);

        // --------------------------------------------------
        // TEST 3: GET Created Site Content (GET /api/site-content)
        // --------------------------------------------------
        const res3 = await makeRequest("/api/site-content");
        const pass3 = res3.status === 200 && res3.body?.success === true && res3.body?.data?.companyName === "JM Creations";
        recordResult("3. GET Created Site Content (GET /api/site-content)", pass3, `Status ${res3.status}`);

        // --------------------------------------------------
        // TEST 4: Prevent Duplicate Site Content Creation (POST /api/site-content -> 409)
        // --------------------------------------------------
        const res4 = await makeRequest("/api/site-content", "POST", { companyName: "Duplicate Entity" });
        const pass4 = res4.status === 409 && res4.body?.success === false;
        recordResult("4. Prevent Duplicate Site Content Creation (POST /api/site-content)", pass4, `Status ${res4.status}, Message: ${res4.body?.message}`);

        // --------------------------------------------------
        // TEST 5: Update Site Content (PUT /api/site-content)
        // --------------------------------------------------
        const res5 = await makeRequest("/api/site-content", "PUT", {
            companyTagline: "Transforming Ideas into Digital Solutions",
            heroTitle: "Build Superior Digital Products"
        });
        const pass5 = res5.status === 200 && res5.body?.success === true && res5.body?.data?.heroTitle === "Build Superior Digital Products";
        recordResult("5. Update Site Content (PUT /api/site-content)", pass5, `Status ${res5.status}, Updated Title: "${res5.body?.data?.heroTitle}"`);

        // --------------------------------------------------
        // TEST 6: Verify Updated Values Return Correctly on GET
        // --------------------------------------------------
        const res6 = await makeRequest("/api/site-content");
        const pass6 = res6.status === 200 && res6.body?.data?.heroTitle === "Build Superior Digital Products" && res6.body?.data?.companyName === "JM Creations";
        recordResult("6. Verify Updated Values on GET", pass6, `Status ${res6.status}`);

        // --------------------------------------------------
        // TEST 7: Invalid Email Format Validation (PUT /api/site-content)
        // --------------------------------------------------
        const res7 = await makeRequest("/api/site-content", "PUT", {
            email: "invalid-email-address"
        });
        const pass7 = res7.status === 400 && res7.body?.success === false;
        recordResult("7. Invalid Email Format Validation (PUT /api/site-content)", pass7, `Status ${res7.status}, Message: ${res7.body?.message}`);

        // --------------------------------------------------
        // TEST 8: Invalid URL Format Validation (PUT /api/site-content)
        // --------------------------------------------------
        const res8 = await makeRequest("/api/site-content", "PUT", {
            facebook: "not-a-valid-url"
        });
        const pass8 = res8.status === 400 && res8.body?.success === false;
        recordResult("8. Invalid URL Format Validation (PUT /api/site-content)", pass8, `Status ${res8.status}, Message: ${res8.body?.message}`);

        // --------------------------------------------------
        // TEST 9: Invalid Field Type Validation (PUT /api/site-content)
        // --------------------------------------------------
        const res9 = await makeRequest("/api/site-content", "PUT", {
            companyName: 12345 // non-string type
        });
        const pass9 = res9.status === 400 && res9.body?.success === false;
        recordResult("9. Invalid Field Type Validation (PUT /api/site-content)", pass9, `Status ${res9.status}, Message: ${res9.body?.message}`);

        // --------------------------------------------------
        // TEST 10: Verify Unknown Fields Are Stripped / Ignored
        // --------------------------------------------------
        const res10 = await makeRequest("/api/site-content", "PUT", {
            unknownField: "Should Not Be Stored",
            companyName: "JM Creations"
        });
        const pass10 = res10.status === 200 && res10.body?.data?.unknownField === undefined;
        recordResult("10. Verify Unknown Fields Stripped", pass10, `Status ${res10.status}`);

        // --------------------------------------------------
        // TEST 11: Verify Mongoose Timestamps (createdAt, updatedAt)
        // --------------------------------------------------
        const res11 = await makeRequest("/api/site-content");
        const pass11 = res11.status === 200 && res11.body?.data?.createdAt && res11.body?.data?.updatedAt;
        recordResult("11. Verify Mongoose Timestamps (createdAt, updatedAt)", pass11, `Status ${res11.status}, createdAt: ${res11.body?.data?.createdAt}`);

        // --------------------------------------------------
        // TEST 12: Verify Single-Document Enforcement
        // --------------------------------------------------
        const res12 = await makeRequest("/api/site-content", "POST", { companyName: "Another Company" });
        const pass12 = res12.status === 409 && res12.body?.success === false;
        recordResult("12. Verify Single-Document Protection", pass12, `Status ${res12.status}, Message: ${res12.body?.message}`);

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

        console.log("\n==================================================");
        console.log("FINAL SITE CONTENT TEST RESULTS SUMMARY");
        console.log("==================================================");
        testResults.forEach(r => {
            console.log(`- ${r.name}: ${r.status}${r.details ? ` (${r.details})` : ""}`);
        });

    } catch (err) {
        console.error("SiteContent Test Suite Error:", err);
    } finally {
        server.close();
        if (isAtlasConnected) {
            await mongoose.disconnect();
        }
        console.log("\nSiteContent test suite execution completed.");
    }
};

runSiteContentTestSuite();
