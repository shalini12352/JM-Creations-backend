const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");

const Testimonial = require("../models/testimonial");
const Portfolio = require("../models/Portfolio");
const Service = require("../models/service");
const Enquiry = require("../models/enquiry");

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

const runTestimonialsTestSuite = async () => {
    console.log("==================================================");
    console.log("STARTING JM CREATIONS PHASE 4 — TESTIMONIALS TEST SUITE");
    console.log("==================================================\n");

    let isAtlasConnected = false;
    const testimonialMemoryStore = new Map();
    const portfolioMemoryStore = new Map();
    const serviceMemoryStore = new Map();
    const enquiryMemoryStore = new Map();

    try {
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
        isAtlasConnected = true;
        console.log("MongoDB Atlas connected successfully for testing.\n");
    } catch (err) {
        console.log("MongoDB Atlas connection unavailable (IP Whitelist check required for remote Atlas DB).");
        console.log("Using in-memory data layer fallback for local test suite execution.\n");

        // Mock Testimonial model for fallback testing if Atlas IP is restricted
        Testimonial.create = async function (data) {
            const id = new mongoose.Types.ObjectId().toString();
            const doc = {
                _id: id,
                company: "",
                designation: "",
                image: "",
                status: "active",
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            testimonialMemoryStore.set(id, doc);
            return doc;
        };

        Testimonial.find = function () {
            return {
                sort: function () {
                    return Array.from(testimonialMemoryStore.values()).sort((a, b) => b.createdAt - a.createdAt);
                }
            };
        };

        Testimonial.findById = async function (id) {
            return testimonialMemoryStore.get(id?.toString()) || null;
        };

        Testimonial.findByIdAndUpdate = async function (id, updateData, options) {
            const existing = testimonialMemoryStore.get(id?.toString());
            if (!existing) return null;
            const updated = {
                ...existing,
                ...updateData,
                updatedAt: new Date()
            };
            testimonialMemoryStore.set(id?.toString(), updated);
            return updated;
        };

        Testimonial.findByIdAndDelete = async function (id) {
            const existing = testimonialMemoryStore.get(id?.toString());
            if (!existing) return null;
            testimonialMemoryStore.delete(id?.toString());
            return existing;
        };

        // Fallbacks for regression checks
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

    let createdTestimonialId = null;

    try {
        // --------------------------------------------------
        // TEST 1: Create Testimonial (POST /api/testimonials)
        // --------------------------------------------------
        const payload1 = {
            clientName: "Test Client",
            company: "Test Company",
            designation: "Business Owner",
            review: "Excellent service and professional support.",
            rating: 5,
            image: "https://example.com/client.jpg",
            status: "active"
        };
        const res1 = await makeRequest("/api/testimonials", "POST", payload1);
        const pass1 = res1.status === 201 && res1.body?.success === true && res1.body?.data?._id;
        if (pass1) createdTestimonialId = res1.body.data._id;
        recordResult("1. Create Testimonial (POST /api/testimonials)", pass1, `Status ${res1.status}, ID: ${createdTestimonialId}`);

        // --------------------------------------------------
        // TEST 2: Get All Testimonials (GET /api/testimonials)
        // --------------------------------------------------
        const res2 = await makeRequest("/api/testimonials");
        const pass2 = res2.status === 200 && res2.body?.success === true && Array.isArray(res2.body?.data) && res2.body?.count >= 1;
        recordResult("2. Get All Testimonials (GET /api/testimonials)", pass2, `Status ${res2.status}, Count: ${res2.body?.count}`);

        // --------------------------------------------------
        // TEST 3: Get Single Testimonial (GET /api/testimonials/:id)
        // --------------------------------------------------
        const res3 = await makeRequest(`/api/testimonials/${createdTestimonialId}`);
        const pass3 = res3.status === 200 && res3.body?.success === true && res3.body?.data?._id === createdTestimonialId;
        recordResult("3. Get One Testimonial (GET /api/testimonials/:id)", pass3, `Status ${res3.status}`);

        // --------------------------------------------------
        // TEST 4: Update Testimonial (PUT /api/testimonials/:id)
        // --------------------------------------------------
        const res4 = await makeRequest(`/api/testimonials/${createdTestimonialId}`, "PUT", {
            review: "Outstanding quality, highly recommended!",
            rating: 5,
            status: "active"
        });
        const pass4 = res4.status === 200 && res4.body?.success === true && res4.body?.data?.review === "Outstanding quality, highly recommended!";
        recordResult("4. Update Testimonial (PUT /api/testimonials/:id)", pass4, `Status ${res4.status}, Updated Review: "${res4.body?.data?.review}"`);

        // --------------------------------------------------
        // TEST 5: Delete Testimonial (DELETE /api/testimonials/:id)
        // --------------------------------------------------
        const res5 = await makeRequest(`/api/testimonials/${createdTestimonialId}`, "DELETE");
        const pass5 = res5.status === 200 && res5.body?.success === true;
        recordResult("5. Delete Testimonial (DELETE /api/testimonials/:id)", pass5, `Status ${res5.status}`);

        // --------------------------------------------------
        // TEST 6: Missing Required Field Validation (POST /api/testimonials)
        // --------------------------------------------------
        const res6 = await makeRequest("/api/testimonials", "POST", {
            company: "Test Company",
            rating: 4
            // Missing clientName and review
        });
        const pass6 = res6.status === 400 && res6.body?.success === false;
        recordResult("6. Missing Required Field Validation (POST /api/testimonials)", pass6, `Status ${res6.status}, Message: ${res6.body?.message}`);

        // --------------------------------------------------
        // TEST 7: Invalid Rating Validation (POST /api/testimonials)
        // --------------------------------------------------
        const res7 = await makeRequest("/api/testimonials", "POST", {
            clientName: "Jane Doe",
            review: "Great work!",
            rating: 10 // invalid rating > 5
        });
        const pass7 = res7.status === 400 && res7.body?.success === false;
        recordResult("7. Invalid Rating Validation (POST /api/testimonials)", pass7, `Status ${res7.status}, Message: ${res7.body?.message}`);

        // --------------------------------------------------
        // TEST 8: Invalid MongoDB ObjectId Validation (GET /api/testimonials/:id)
        // --------------------------------------------------
        const res8 = await makeRequest("/api/testimonials/invalid-object-id");
        const pass8 = res8.status === 400 && res8.body?.success === false;
        recordResult("8. Invalid MongoDB ObjectId (GET /api/testimonials/:id)", pass8, `Status ${res8.status}, Message: ${res8.body?.message}`);

        // --------------------------------------------------
        // TEST 9: Non-existing Testimonial Handling (GET /api/testimonials/:id)
        // --------------------------------------------------
        const fakeId = new mongoose.Types.ObjectId().toString();
        const res9 = await makeRequest(`/api/testimonials/${fakeId}`);
        const pass9 = res9.status === 404 && res9.body?.success === false;
        recordResult("9. Non-existing Testimonial Handling (GET /api/testimonials/:id)", pass9, `Status ${res9.status}, Message: ${res9.body?.message}`);

        // --------------------------------------------------
        // TEST 10: Verify Deleted Testimonial Returns 404 (GET /api/testimonials/:id)
        // --------------------------------------------------
        const res10 = await makeRequest(`/api/testimonials/${createdTestimonialId}`);
        const pass10 = res10.status === 404 && res10.body?.success === false;
        recordResult("10. Verify Deleted Testimonial Returns 404", pass10, `Status ${res10.status}`);

        console.log("\n--------------------------------------------------");
        console.log("REGRESSION VERIFICATION FOR EXISTING MODULES");
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

        console.log("\n==================================================");
        console.log("FINAL TESTIMONIALS TEST RESULTS SUMMARY");
        console.log("==================================================");
        testResults.forEach(r => {
            console.log(`- ${r.name}: ${r.status}${r.details ? ` (${r.details})` : ""}`);
        });

    } catch (err) {
        console.error("Testimonials Test Suite Error:", err);
    } finally {
        server.close();
        if (isAtlasConnected) {
            await mongoose.disconnect();
        }
        console.log("\nTestimonials test suite execution completed.");
    }
};

runTestimonialsTestSuite();
