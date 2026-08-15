const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");

const Service = require("../models/service");
const serviceRoutes = require("../routes/serviceRoutes");
const enquiryRoutes = require("../routes/enquiryRoutes");
const Enquiry = require("../models/enquiry");

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

const runServicesTestSuite = async () => {
    console.log("==================================================");
    console.log("STARTING JM CREATIONS PHASE 2 — SERVICES TEST SUITE");
    console.log("==================================================\n");

    let isAtlasConnected = false;
    const serviceMemoryStore = new Map();
    const enquiryMemoryStore = new Map();

    try {
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
        isAtlasConnected = true;
        console.log("MongoDB Atlas connected successfully for testing.\n");
    } catch (err) {
        console.log("MongoDB Atlas connection unavailable (IP Whitelist check required for remote Atlas DB).");
        console.log("Using in-memory data layer fallback for local test suite execution.\n");

        // Mock Service model for local fallback testing if Atlas IP is restricted
        Service.create = async function (data) {
            const id = new mongoose.Types.ObjectId().toString();
            const doc = {
                _id: id,
                ...data,
                image: data.image || "",
                status: data.status || "active",
                createdAt: new Date(),
                updatedAt: new Date()
            };
            serviceMemoryStore.set(id, doc);
            return doc;
        };

        Service.find = function () {
            return {
                sort: function () {
                    return Array.from(serviceMemoryStore.values());
                }
            };
        };

        Service.findById = async function (id) {
            return serviceMemoryStore.get(id?.toString()) || null;
        };

        Service.findByIdAndUpdate = async function (id, updateData, options) {
            const existing = serviceMemoryStore.get(id?.toString());
            if (!existing) return null;
            const updated = {
                ...existing,
                ...updateData,
                updatedAt: new Date()
            };
            serviceMemoryStore.set(id?.toString(), updated);
            return updated;
        };

        Service.findByIdAndDelete = async function (id) {
            const existing = serviceMemoryStore.get(id?.toString());
            if (!existing) return null;
            serviceMemoryStore.delete(id?.toString());
            return existing;
        };

        // Mock Enquiry model for fallback regression test
        Enquiry.create = async function (data) {
            const id = new mongoose.Types.ObjectId().toString();
            const doc = {
                _id: id,
                ...data,
                status: data.status || "new",
                createdAt: new Date(),
                updatedAt: new Date()
            };
            enquiryMemoryStore.set(id, doc);
            return doc;
        };

        Enquiry.find = function () {
            return {
                sort: function () {
                    return Array.from(enquiryMemoryStore.values());
                }
            };
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

    let createdServiceId = null;

    try {
        // --------------------------------------------------
        // TEST 1: Create service
        // --------------------------------------------------
        const payload1 = {
            title: "Web Development",
            description: "Custom full-stack web applications and responsive design.",
            category: "Development",
            image: "https://example.com/webdev.png",
            status: "active"
        };
        const res1 = await makeRequest("/api/services", "POST", payload1);
        const pass1 = res1.status === 201 && res1.body?.success === true && res1.body?.data?._id;
        if (pass1) createdServiceId = res1.body.data._id;
        recordResult("1. Create Service (POST /api/services)", pass1, `Status ${res1.status}, ID: ${createdServiceId}`);

        // --------------------------------------------------
        // TEST 2: Get all services
        // --------------------------------------------------
        const res2 = await makeRequest("/api/services");
        const pass2 = res2.status === 200 && res2.body?.success === true && Array.isArray(res2.body?.data) && res2.body?.count >= 1;
        recordResult("2. Get All Services (GET /api/services)", pass2, `Status ${res2.status}, Count: ${res2.body?.count}`);

        // --------------------------------------------------
        // TEST 3: Get one service
        // --------------------------------------------------
        const res3 = await makeRequest(`/api/services/${createdServiceId}`);
        const pass3 = res3.status === 200 && res3.body?.success === true && res3.body?.data?._id === createdServiceId;
        recordResult("3. Get One Service (GET /api/services/:id)", pass3, `Status ${res3.status}`);

        // --------------------------------------------------
        // TEST 4: Update service
        // --------------------------------------------------
        const res4 = await makeRequest(`/api/services/${createdServiceId}`, "PUT", {
            title: "Full Stack Web Development",
            status: "active"
        });
        const pass4 = res4.status === 200 && res4.body?.success === true && res4.body?.data?.title === "Full Stack Web Development";
        recordResult("4. Update Service (PUT /api/services/:id)", pass4, `Status ${res4.status}, Updated Title: ${res4.body?.data?.title}`);

        // --------------------------------------------------
        // TEST 5: Delete service
        // --------------------------------------------------
        const res5 = await makeRequest(`/api/services/${createdServiceId}`, "DELETE");
        const pass5 = res5.status === 200 && res5.body?.success === true;
        recordResult("5. Delete Service (DELETE /api/services/:id)", pass5, `Status ${res5.status}`);

        // --------------------------------------------------
        // TEST 6: Missing required field validation
        // --------------------------------------------------
        const res6 = await makeRequest("/api/services", "POST", {
            title: "Incomplete Service"
            // Missing description & category
        });
        const pass6 = res6.status === 400 && res6.body?.success === false;
        recordResult("6. Missing Required Field Validation (POST /api/services)", pass6, `Status ${res6.status}, Message: ${res6.body?.message}`);

        // --------------------------------------------------
        // TEST 7: Invalid MongoDB ObjectId
        // --------------------------------------------------
        const res7 = await makeRequest("/api/services/invalid-object-id");
        const pass7 = res7.status === 400 && res7.body?.success === false;
        recordResult("7. Invalid MongoDB ObjectId (GET /api/services/:id)", pass7, `Status ${res7.status}, Message: ${res7.body?.message}`);

        // --------------------------------------------------
        // TEST 8: Non-existing service handling
        // --------------------------------------------------
        const fakeId = new mongoose.Types.ObjectId().toString();
        const res8 = await makeRequest(`/api/services/${fakeId}`);
        const pass8 = res8.status === 404 && res8.body?.success === false;
        recordResult("8. Non-existing Service Handling (GET /api/services/:id)", pass8, `Status ${res8.status}, Message: ${res8.body?.message}`);

        console.log("\n--------------------------------------------------");
        console.log("PHASE 1 ENQUIRY REGRESSION VERIFICATION");
        console.log("--------------------------------------------------\n");

        // Regression check: Create enquiry
        const enquiryRes = await makeRequest("/api/enquiries", "POST", {
            name: "Phase 1 Check",
            email: "phase1.check@example.com",
            phone: "9998887770",
            service: "Web Development",
            message: "Regression test verifying Phase 1 enquiry flow."
        });
        const enquiryPass = enquiryRes.status === 201 && enquiryRes.body?.success === true;
        recordResult("Phase 1 Enquiry Integration Check", enquiryPass, `Status ${enquiryRes.status}`);

        console.log("\n==================================================");
        console.log("FINAL SERVICES TEST RESULTS SUMMARY");
        console.log("==================================================");
        testResults.forEach(r => {
            console.log(`- ${r.name}: ${r.status}${r.details ? ` (${r.details})` : ""}`);
        });

    } catch (err) {
        console.error("Services Test Suite Error:", err);
    } finally {
        server.close();
        if (isAtlasConnected) {
            await mongoose.disconnect();
        }
        console.log("\nServices test suite execution completed.");
    }
};

runServicesTestSuite();
