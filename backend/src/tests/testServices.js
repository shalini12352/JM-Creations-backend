const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");

const Service = require("../models/service");
const serviceRoutes = require("../routes/serviceRoutes");
const authRoutes = require("../routes/authRoutes");
const { seedInitialAdmin } = require("../controllers/authController");

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

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);

const runServicesTestSuite = async () => {
    console.log("==================================================");
    console.log("STARTING JM CREATIONS SERVICES COMPLETE FLOW VERIFICATION");
    console.log("==================================================\n");

    let isMongoConnected = false;

    try {
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        isMongoConnected = true;
        console.log("MongoDB Atlas connected successfully for verification.\n");
        await seedInitialAdmin();
    } catch (err) {
        console.error("MongoDB Atlas connection error:", err.message);
        process.exit(1);
    }

    // Start server on ephemeral port
    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    const baseUrl = `http://127.0.0.1:${port}`;

    const makeRequest = (path, method = "GET", body = null, token = null) => {
        return new Promise((resolve, reject) => {
            const url = new URL(path, baseUrl);
            const headers = { "Content-Type": "application/json" };
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const options = {
                hostname: url.hostname,
                port: url.port,
                path: url.pathname + url.search,
                method: method,
                headers: headers
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

    let authToken = null;
    let createdServiceId = null;

    try {
        // --------------------------------------------------
        // TEST 1: Admin Login & JWT Acquisition
        // --------------------------------------------------
        const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || process.env.ADMIN_EMAIL || "admin@jmcreations.com";
        const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || process.env.ADMIN_INITIAL_PASSWORD || "Admin@12345";

        const loginRes = await makeRequest("/auth/login", "POST", {
            email: adminEmail,
            password: adminPassword
        });

        const pass1 = loginRes.status === 200 && loginRes.body?.success === true && !!loginRes.body?.token;
        if (pass1) authToken = loginRes.body.token;
        recordResult("1. Admin Login & JWT Acquisition", pass1, `Status ${loginRes.status}`);

        // --------------------------------------------------
        // TEST 2: Unauthenticated POST Rejection (HTTP 401)
        // --------------------------------------------------
        const unauthRes = await makeRequest("/api/services", "POST", {
            title: "Unauthorized Service",
            description: "Test",
            category: "Test"
        });
        const pass2 = unauthRes.status === 401;
        recordResult("2. Unauthenticated POST Rejection (401 Check)", pass2, `Status ${unauthRes.status}`);

        // --------------------------------------------------
        // TEST 3: Admin Create Service (POST /api/services)
        // --------------------------------------------------
        const createPayload = {
            title: "JM Test Service",
            category: "DIGITAL MARKETING",
            description: "Temporary service created to verify the full-stack Services flow.",
            image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80",
            status: "active"
        };

        const createRes = await makeRequest("/api/services", "POST", createPayload, authToken);
        const pass3 = createRes.status === 201 && createRes.body?.success === true && !!createRes.body?.data?._id;
        if (pass3) createdServiceId = createRes.body.data._id;
        recordResult("3. Admin Create Service (POST /api/services)", pass3, `Status ${createRes.status}, ID: ${createdServiceId}`);

        // --------------------------------------------------
        // TEST 4: MongoDB Direct Verification
        // --------------------------------------------------
        const dbDoc = await Service.findById(createdServiceId);
        const pass4 = !!dbDoc && dbDoc.title === "JM Test Service";
        recordResult("4. MongoDB Direct Verification", pass4, `Found in DB: ${dbDoc?.title}`);

        // --------------------------------------------------
        // TEST 5: GET /api/services returns created service
        // --------------------------------------------------
        const getRes = await makeRequest("/api/services");
        const pass5 = getRes.status === 200 && getRes.body?.success === true && Array.isArray(getRes.body?.data) && getRes.body.data.some(s => s._id === createdServiceId);
        recordResult("5. GET /api/services Public Availability", pass5, `Total Services: ${getRes.body?.data?.length}`);

        // --------------------------------------------------
        // TEST 6: Edit Service (PUT /api/services/:id)
        // --------------------------------------------------
        const updateRes = await makeRequest(`/api/services/${createdServiceId}`, "PUT", {
            description: "Updated JM Test Service"
        }, authToken);

        const pass6 = updateRes.status === 200 && updateRes.body?.data?.description === "Updated JM Test Service";
        recordResult("6. Admin Edit Service (PUT /api/services/:id)", pass6, `Updated desc: ${updateRes.body?.data?.description}`);

        // --------------------------------------------------
        // TEST 7: Public Website Updated Content Verification
        // --------------------------------------------------
        const getUpdatedRes = await makeRequest(`/api/services/${createdServiceId}`);
        const pass7 = getUpdatedRes.status === 200 && getUpdatedRes.body?.data?.description === "Updated JM Test Service";
        recordResult("7. Public Service Updated Content Check", pass7, `Verified Updated Content: ${getUpdatedRes.body?.data?.description}`);

        // --------------------------------------------------
        // TEST 8: Deactivate Service (Status -> inactive)
        // --------------------------------------------------
        const deactRes = await makeRequest(`/api/services/${createdServiceId}`, "PUT", {
            status: "inactive"
        }, authToken);
        const pass8 = deactRes.status === 200 && deactRes.body?.data?.status === "inactive";
        recordResult("8. Admin Deactivate Service", pass8, `Status: ${deactRes.body?.data?.status}`);

        // --------------------------------------------------
        // TEST 9: Active-Only Filter Verification (Public side)
        // --------------------------------------------------
        const getActiveRes = await makeRequest("/api/services");
        const activeOnly = getActiveRes.body?.data?.filter(s => s.status !== "inactive") || [];
        const pass9 = !activeOnly.some(s => s._id === createdServiceId);
        recordResult("9. Active-Only Public Visibility Filtering", pass9, `Inactive service hidden from active filter: ${pass9}`);

        // --------------------------------------------------
        // TEST 10: Reactivate Service (Status -> active)
        // --------------------------------------------------
        const reactRes = await makeRequest(`/api/services/${createdServiceId}`, "PUT", {
            status: "active"
        }, authToken);
        const pass10 = reactRes.status === 200 && reactRes.body?.data?.status === "active";
        recordResult("10. Admin Reactivate Service", pass10, `Status: ${reactRes.body?.data?.status}`);

        // --------------------------------------------------
        // TEST 11: Delete Service (DELETE /api/services/:id)
        // --------------------------------------------------
        const deleteRes = await makeRequest(`/api/services/${createdServiceId}`, "DELETE", null, authToken);
        const pass11 = deleteRes.status === 200 && deleteRes.body?.success === true;
        recordResult("11. Admin Delete Service", pass11, `Status ${deleteRes.status}`);

        // --------------------------------------------------
        // TEST 12: Verify Removal from MongoDB
        // --------------------------------------------------
        const deletedDbDoc = await Service.findById(createdServiceId);
        const pass12 = deletedDbDoc === null;
        recordResult("12. Deleted Service Removal Check", pass12, `MongoDB Record Removed: ${pass12}`);

        console.log("\n==================================================");
        console.log("FINAL FULL-STACK SERVICES TEST RESULTS");
        console.log("==================================================");
        let allPass = true;
        testResults.forEach(r => {
            if (r.status !== "PASS") allPass = false;
            console.log(`- ${r.name}: ${r.status}${r.details ? ` (${r.details})` : ""}`);
        });

        if (allPass) {
            console.log("\n>>> ALL 12 SERVICES FLOW TESTS PASSED SUCCESSFULLY! <<<");
        } else {
            console.log("\n>>> SOME TESTS FAILED. CHECK DETAILS ABOVE. <<<");
        }

    } catch (err) {
        console.error("Test execution error:", err);
    } finally {
        server.close();
        if (isMongoConnected) {
            await mongoose.disconnect();
        }
        console.log("\nFull-stack Services test suite finished.");
    }
};

runServicesTestSuite();
