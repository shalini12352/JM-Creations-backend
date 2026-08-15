const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");

const Portfolio = require("../models/Portfolio");
const Service = require("../models/service");
const Enquiry = require("../models/enquiry");

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

const runPortfolioTestSuite = async () => {
    console.log("==================================================");
    console.log("STARTING JM CREATIONS PORTFOLIO TEST SUITE");
    console.log("==================================================\n");

    let isAtlasConnected = false;
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

        // Mock Portfolio model for fallback testing if needed
        Portfolio.create = async function (data) {
            const id = new mongoose.Types.ObjectId().toString();
            const doc = {
                _id: id,
                ...data,
                projectUrl: data.projectUrl || "",
                status: data.status || "active",
                createdAt: new Date(),
                updatedAt: new Date()
            };
            portfolioMemoryStore.set(id, doc);
            return doc;
        };

        Portfolio.find = function () {
            return {
                sort: function () {
                    return Array.from(portfolioMemoryStore.values());
                }
            };
        };

        Portfolio.findById = async function (id) {
            return portfolioMemoryStore.get(id?.toString()) || null;
        };

        Portfolio.findByIdAndUpdate = async function (id, updateData, options) {
            const existing = portfolioMemoryStore.get(id?.toString());
            if (!existing) return null;
            const updated = {
                ...existing,
                ...updateData,
                updatedAt: new Date()
            };
            portfolioMemoryStore.set(id?.toString(), updated);
            return updated;
        };

        Portfolio.findByIdAndDelete = async function (id) {
            const existing = portfolioMemoryStore.get(id?.toString());
            if (!existing) return null;
            portfolioMemoryStore.delete(id?.toString());
            return existing;
        };

        // Fallbacks for regression checks
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

    let createdPortfolioId = null;

    try {
        // --------------------------------------------------
        // TEST 1: GET ALL PORTFOLIO (INITIAL)
        // --------------------------------------------------
        const res1 = await makeRequest("/api/portfolio");
        const pass1 = res1.status === 200 && res1.body?.success === true && Array.isArray(res1.body?.data);
        recordResult("1. GET All Portfolio (GET /api/portfolio)", pass1, `Status ${res1.status}, Count: ${res1.body?.count}`);

        // --------------------------------------------------
        // TEST 2: POST CREATE PORTFOLIO
        // --------------------------------------------------
        const payload2 = {
            title: "JM Creations Website",
            description: "Professional business website developed for JM Creations.",
            category: "Web Development",
            image: "https://example.com/jm-creations.jpg",
            projectUrl: "https://example.com",
            status: "active"
        };
        const res2 = await makeRequest("/api/portfolio", "POST", payload2);
        const pass2 = res2.status === 201 && res2.body?.success === true && res2.body?.data?._id;
        if (pass2) createdPortfolioId = res2.body.data._id;
        recordResult("2. Create Portfolio Project (POST /api/portfolio)", pass2, `Status ${res2.status}, ID: ${createdPortfolioId}`);

        // --------------------------------------------------
        // TEST 3: GET PORTFOLIO BY ID
        // --------------------------------------------------
        const res3 = await makeRequest(`/api/portfolio/${createdPortfolioId}`);
        const pass3 = res3.status === 200 && res3.body?.success === true && res3.body?.data?._id === createdPortfolioId;
        recordResult("3. Get Portfolio Project By ID (GET /api/portfolio/:id)", pass3, `Status ${res3.status}`);

        // --------------------------------------------------
        // TEST 4: PUT UPDATE PORTFOLIO
        // --------------------------------------------------
        const res4 = await makeRequest(`/api/portfolio/${createdPortfolioId}`, "PUT", {
            title: "JM Creations Official Website",
            status: "active"
        });
        const pass4 = res4.status === 200 && res4.body?.success === true && res4.body?.data?.title === "JM Creations Official Website";
        recordResult("4. Update Portfolio Project (PUT /api/portfolio/:id)", pass4, `Status ${res4.status}, Updated Title: ${res4.body?.data?.title}`);

        // --------------------------------------------------
        // TEST 5: DELETE PORTFOLIO
        // --------------------------------------------------
        const res5 = await makeRequest(`/api/portfolio/${createdPortfolioId}`, "DELETE");
        const pass5 = res5.status === 200 && res5.body?.success === true;
        recordResult("5. Delete Portfolio Project (DELETE /api/portfolio/:id)", pass5, `Status ${res5.status}`);

        // Verify GET after DELETE returns 404
        const res5Verify = await makeRequest(`/api/portfolio/${createdPortfolioId}`);
        const pass5Verify = res5Verify.status === 404 && res5Verify.body?.success === false;
        recordResult("5b. Verify Deleted Portfolio Returns 404", pass5Verify, `Status ${res5Verify.status}`);

        // --------------------------------------------------
        // NEGATIVE TEST 6: Missing required fields
        // --------------------------------------------------
        const res6 = await makeRequest("/api/portfolio", "POST", {
            description: "Test description without title",
            category: "Web Development",
            image: "test.jpg"
        });
        const pass6 = res6.status === 400 && res6.body?.success === false;
        recordResult("6. Missing Required Field Validation (POST /api/portfolio)", pass6, `Status ${res6.status}, Message: ${res6.body?.message}`);

        // --------------------------------------------------
        // NEGATIVE TEST 7: Invalid status value
        // --------------------------------------------------
        const res7 = await makeRequest("/api/portfolio", "POST", {
            title: "Test Project",
            description: "Test description",
            category: "Web Development",
            image: "test.jpg",
            status: "random"
        });
        const pass7 = res7.status === 400 && res7.body?.success === false;
        recordResult("7. Invalid Status Enum Validation (POST /api/portfolio)", pass7, `Status ${res7.status}, Message: ${res7.body?.message}`);

        // --------------------------------------------------
        // NEGATIVE TEST 8: Invalid MongoDB ObjectId
        // --------------------------------------------------
        const res8 = await makeRequest("/api/portfolio/invalid-id");
        const pass8 = res8.status === 400 && res8.body?.success === false;
        recordResult("8. Invalid MongoDB ObjectId Validation (GET /api/portfolio/:id)", pass8, `Status ${res8.status}, Message: ${res8.body?.message}`);

        // --------------------------------------------------
        // NEGATIVE TEST 9: Non-existent MongoDB ObjectId
        // --------------------------------------------------
        const fakeId = new mongoose.Types.ObjectId().toString();
        const res9 = await makeRequest(`/api/portfolio/${fakeId}`);
        const pass9 = res9.status === 404 && res9.body?.success === false;
        recordResult("9. Non-existent Portfolio Project Handling (GET /api/portfolio/:id)", pass9, `Status ${res9.status}, Message: ${res9.body?.message}`);

        console.log("\n--------------------------------------------------");
        console.log("SERVICES API REGRESSION VERIFICATION");
        console.log("--------------------------------------------------\n");

        const servicesRes = await makeRequest("/api/services");
        const servicesPass = servicesRes.status === 200 && servicesRes.body?.success === true;
        recordResult("Existing Services API Regression Check (GET /api/services)", servicesPass, `Status ${servicesRes.status}`);

        console.log("\n--------------------------------------------------");
        console.log("ENQUIRY API REGRESSION VERIFICATION");
        console.log("--------------------------------------------------\n");

        const enquiryRes = await makeRequest("/api/enquiries");
        const enquiryPass = enquiryRes.status === 200 && enquiryRes.body?.success === true;
        recordResult("Existing Enquiry API Regression Check (GET /api/enquiries)", enquiryPass, `Status ${enquiryRes.status}`);

        console.log("\n==================================================");
        console.log("FINAL PORTFOLIO TEST RESULTS SUMMARY");
        console.log("==================================================");
        testResults.forEach(r => {
            console.log(`- ${r.name}: ${r.status}${r.details ? ` (${r.details})` : ""}`);
        });

    } catch (err) {
        console.error("Portfolio Test Suite Error:", err);
    } finally {
        server.close();
        if (isAtlasConnected) {
            await mongoose.disconnect();
        }
        console.log("\nPortfolio test suite execution completed.");
    }
};

runPortfolioTestSuite();
