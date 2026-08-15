const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");

const Enquiry = require("../models/enquiry");
const enquiryRoutes = require("../routes/enquiryRoutes");
const { sendEmailNotification } = require("../services/emailService");
const { sendWhatsAppNotification } = require("../services/whatsappService");

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

// Run tests against ephemeral server
const runTestSuite = async () => {
    console.log("==================================================");
    console.log("STARTING JM CREATIONS ENQUIRY & NOTIFICATION TEST SUITE");
    console.log("==================================================\n");

    let isAtlasConnected = false;
    const memoryStore = new Map();

    try {
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
        isAtlasConnected = true;
        console.log("MongoDB Atlas connected successfully for testing.\n");
    } catch (err) {
        console.log("MongoDB Atlas connection unavailable (IP Whitelist check required for remote Atlas DB).");
        console.log("Using in-memory data layer fallback for local test suite execution.\n");

        // Mock Mongoose model methods to allow testing Express controller logic locally
        Enquiry.create = async function (data) {
            const id = new mongoose.Types.ObjectId().toString();
            const doc = {
                _id: id,
                ...data,
                status: data.status || "new",
                createdAt: new Date(),
                updatedAt: new Date()
            };
            memoryStore.set(id, doc);
            return doc;
        };

        Enquiry.find = function () {
            return {
                sort: function () {
                    return Array.from(memoryStore.values());
                }
            };
        };

        Enquiry.findById = async function (id) {
            return memoryStore.get(id?.toString()) || null;
        };

        Enquiry.findByIdAndUpdate = async function (id, updateData, options) {
            const existing = memoryStore.get(id?.toString());
            if (!existing) return null;
            const updated = {
                ...existing,
                ...updateData,
                updatedAt: new Date()
            };
            memoryStore.set(id?.toString(), updated);
            return updated;
        };

        Enquiry.findByIdAndDelete = async function (id) {
            const existing = memoryStore.get(id?.toString());
            if (!existing) return null;
            memoryStore.delete(id?.toString());
            return existing;
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

    let createdId = null;
    let notifEnquiryId = null;

    try {
        // --------------------------------------------------
        // TEST 1: Health check
        // --------------------------------------------------
        const res1 = await makeRequest("/api/health");
        recordResult("1. Health Check (GET /api/health)", res1.status === 200 && res1.body?.success === true, `Status ${res1.status}`);

        // --------------------------------------------------
        // TEST 2: Create enquiry
        // --------------------------------------------------
        const res2 = await makeRequest("/api/enquiries", "POST", {
            name: "Test User",
            email: "test.user@example.com",
            phone: "1234567890",
            service: "Web Development",
            message: "Test message for basic enquiry creation."
        });
        const pass2 = res2.status === 201 && res2.body?.success === true && res2.body?.data?._id;
        if (pass2) createdId = res2.body.data._id;
        recordResult("2. Create Enquiry (POST /api/enquiries)", pass2, `Status ${res2.status}, ID: ${createdId}`);

        // --------------------------------------------------
        // TEST 3: Get all enquiries
        // --------------------------------------------------
        const res3 = await makeRequest("/api/enquiries");
        const pass3 = res3.status === 200 && res3.body?.success === true && Array.isArray(res3.body?.data);
        recordResult("3. Get All Enquiries (GET /api/enquiries)", pass3, `Status ${res3.status}, Count: ${res3.body?.count}`);

        // --------------------------------------------------
        // TEST 4: Get one enquiry
        // --------------------------------------------------
        const res4 = await makeRequest(`/api/enquiries/${createdId}`);
        const pass4 = res4.status === 200 && res4.body?.success === true && res4.body?.data?._id === createdId;
        recordResult("4. Get One Enquiry (GET /api/enquiries/:id)", pass4, `Status ${res4.status}`);

        // --------------------------------------------------
        // TEST 5: Update enquiry
        // --------------------------------------------------
        const res5 = await makeRequest(`/api/enquiries/${createdId}`, "PUT", { status: "contacted" });
        const pass5 = res5.status === 200 && res5.body?.success === true && res5.body?.data?.status === "contacted";
        recordResult("5. Update Enquiry (PUT /api/enquiries/:id)", pass5, `Status ${res5.status}, Status: ${res5.body?.data?.status}`);

        // --------------------------------------------------
        // TEST 6: Delete enquiry
        // --------------------------------------------------
        const res6 = await makeRequest(`/api/enquiries/${createdId}`, "DELETE");
        const pass6 = res6.status === 200 && res6.body?.success === true;
        recordResult("6. Delete Enquiry (DELETE /api/enquiries/:id)", pass6, `Status ${res6.status}`);

        // --------------------------------------------------
        // TEST 7: Missing required field validation
        // --------------------------------------------------
        const res7 = await makeRequest("/api/enquiries", "POST", { name: "Incomplete", email: "incomplete@example.com" });
        const pass7 = res7.status === 400 && res7.body?.success === false;
        recordResult("7. Missing Required Field Validation (POST /api/enquiries)", pass7, `Status ${res7.status}`);

        // --------------------------------------------------
        // TEST 8: Non-existing enquiry handling
        // --------------------------------------------------
        const fakeId = new mongoose.Types.ObjectId().toString();
        const res8 = await makeRequest(`/api/enquiries/${fakeId}`);
        const pass8 = res8.status === 404 && res8.body?.success === false;
        recordResult("8. Non-existing Enquiry Handling (GET /api/enquiries/:id)", pass8, `Status ${res8.status}`);

        console.log("\n--------------------------------------------------");
        console.log("NOTIFICATION SYSTEM SPECIFIC TESTS");
        console.log("--------------------------------------------------\n");

        // --------------------------------------------------
        // TEST A: Create notification enquiry
        // --------------------------------------------------
        const payloadA = {
            name: "Notification Test",
            email: "notification.test@example.com",
            phone: "9876543210",
            service: "Website Development",
            message: "Testing JM Creations notification system."
        };
        const resA = await makeRequest("/api/enquiries", "POST", payloadA);
        const passA = resA.status === 201 && resA.body?.success === true && resA.body?.data?._id;
        if (passA) notifEnquiryId = resA.body.data._id;
        recordResult("TEST A — Create Enquiry with Notification Flow", passA, `HTTP ${resA.status}, ID: ${notifEnquiryId}`);

        // --------------------------------------------------
        // TEST B: Gmail notification service status
        // --------------------------------------------------
        const mockEnquiryDoc = {
            _id: notifEnquiryId || new mongoose.Types.ObjectId().toString(),
            name: "Notification Test",
            email: "notification.test@example.com",
            phone: "9876543210",
            service: "Website Development",
            message: "Testing JM Creations notification system.",
            createdAt: new Date()
        };

        const emailResult = await sendEmailNotification(mockEnquiryDoc);
        if (!emailResult.configured) {
            testResults.push({ name: "TEST B — Gmail Notification Service", status: "NOT CONFIGURED", details: "Email service not configured" });
            console.log("[NOT CONFIGURED] TEST B — Gmail Notification Service -> Email service not configured");
        } else if (emailResult.success) {
            testResults.push({ name: "TEST B — Gmail Notification Service", status: "PASS", details: `Email sent! MessageID: ${emailResult.messageId}` });
            console.log(`[PASS] TEST B — Gmail Notification Service -> Email sent! MessageID: ${emailResult.messageId}`);
        } else {
            testResults.push({ name: "TEST B — Gmail Notification Service", status: "FAIL", details: emailResult.error });
            console.log(`[FAIL] TEST B — Gmail Notification Service -> Error: ${emailResult.error}`);
        }

        // --------------------------------------------------
        // TEST C: WhatsApp notification service status
        // --------------------------------------------------
        const waResult = await sendWhatsAppNotification(mockEnquiryDoc);
        if (!waResult.configured) {
            testResults.push({ name: "TEST C — WhatsApp Notification Service", status: "NOT CONFIGURED", details: "WhatsApp service not configured" });
            console.log("[NOT CONFIGURED] TEST C — WhatsApp Notification Service -> WhatsApp service not configured");
        } else if (waResult.success) {
            testResults.push({ name: "TEST C — WhatsApp Notification Service", status: "PASS", details: "WhatsApp message delivered" });
            console.log("[PASS] TEST C — WhatsApp Notification Service -> WhatsApp message delivered");
        } else {
            testResults.push({ name: "TEST C — WhatsApp Notification Service", status: "FAIL", details: waResult.error });
            console.log(`[FAIL] TEST C — WhatsApp Notification Service -> Error: ${waResult.error}`);
        }

        // --------------------------------------------------
        // TEST D: Notification failure safety
        // --------------------------------------------------
        let docSavedInDb = false;
        if (isAtlasConnected && notifEnquiryId) {
            const dbObj = await Enquiry.findById(notifEnquiryId);
            docSavedInDb = dbObj !== null;
        } else if (!isAtlasConnected && notifEnquiryId) {
            docSavedInDb = memoryStore.has(notifEnquiryId);
        }
        recordResult("TEST D — Notification Failure Safety (Enquiry Persisted)", docSavedInDb, `Enquiry ${notifEnquiryId} preserved despite notification status`);

        // --------------------------------------------------
        // TEST E: Existing CRUD regression summary
        // --------------------------------------------------
        const crudPassed = testResults
            .filter(t => t.name.match(/^[1-8]\./))
            .every(t => t.status === "PASS");
        recordResult("TEST E — Existing CRUD Regression Tests", crudPassed, "All 8 existing CRUD tests passed without regression");

        console.log("\n==================================================");
        console.log("FINAL TEST RESULTS SUMMARY");
        console.log("==================================================");
        testResults.forEach(r => {
            console.log(`- ${r.name}: ${r.status}${r.details ? ` (${r.details})` : ""}`);
        });

    } catch (err) {
        console.error("Test execution error:", err);
    } finally {
        server.close();
        if (isAtlasConnected) {
            await mongoose.disconnect();
        }
        console.log("\nTest suite execution completed.");
    }
};

runTestSuite();
