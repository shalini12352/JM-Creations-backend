const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");

const Portfolio = require("../models/Portfolio");
const Service = require("../models/service");

const portfolioRoutes = require("../routes/portfolioRoutes");
const serviceRoutes = require("../routes/serviceRoutes");
const enquiryRoutes = require("../routes/enquiryRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "JM Creations API is running" });
});

app.use("/api/enquiries", enquiryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/portfolio", portfolioRoutes);

const runComprehensiveVerification = async () => {
    console.log("==================================================");
    console.log("STARTING FULL PORTFOLIO & SERVICES VERIFICATION");
    console.log("==================================================\n");

    const results = {
        getAllPortfolio: false,
        getPortfolioById: false,
        postPortfolio: false,
        putPortfolio: false,
        deletePortfolio: false,
        validation: false,
        invalidIdHandling: false,
        mongoDbVerification: false,
        servicesApiRegression: false
    };

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✓ Connected directly to MongoDB Atlas database.\n");
    } catch (err) {
        console.error("✗ Failed to connect to MongoDB Atlas:", err.message);
        process.exit(1);
    }

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

    let createdId = null;

    try {
        // ------------------------------------------------------------------
        // STEP 1: PORTFOLIO CRUD - POST
        // ------------------------------------------------------------------
        console.log("--- 1. POST /api/portfolio ---");
        const testPayload = {
            title: "Modern E-Commerce Platform",
            description: "Full-stack e-commerce web application with custom checkout.",
            category: "Web Development",
            image: "https://images.example.com/portfolio/ecommerce.png",
            projectUrl: "https://ecommerce-demo.example.com",
            status: "active"
        };
        const postRes = await makeRequest("/api/portfolio", "POST", testPayload);
        if (postRes.status === 201 && postRes.body?.success && postRes.body?.data?._id) {
            createdId = postRes.body.data._id;
            results.postPortfolio = true;
            console.log(`✓ POST /api/portfolio SUCCESS - Created ID: ${createdId}`);
        } else {
            console.log("✗ POST /api/portfolio FAILED:", postRes);
        }

        // ------------------------------------------------------------------
        // STEP 2: PORTFOLIO CRUD - GET ALL
        // ------------------------------------------------------------------
        console.log("\n--- 2. GET /api/portfolio ---");
        const getAllRes = await makeRequest("/api/portfolio", "GET");
        if (getAllRes.status === 200 && getAllRes.body?.success && Array.isArray(getAllRes.body?.data)) {
            const found = getAllRes.body.data.some(item => item._id === createdId);
            if (found) {
                results.getAllPortfolio = true;
                console.log(`✓ GET /api/portfolio SUCCESS - Found created document in array of ${getAllRes.body.count} items.`);
            } else {
                console.log("✗ GET /api/portfolio FAILED: Created ID not found in returned list.");
            }
        } else {
            console.log("✗ GET /api/portfolio FAILED:", getAllRes);
        }

        // ------------------------------------------------------------------
        // STEP 3: PORTFOLIO CRUD - GET BY ID
        // ------------------------------------------------------------------
        console.log("\n--- 3. GET /api/portfolio/:id ---");
        const getByIdRes = await makeRequest(`/api/portfolio/${createdId}`, "GET");
        if (getByIdRes.status === 200 && getByIdRes.body?.success && getByIdRes.body?.data?._id === createdId) {
            results.getPortfolioById = true;
            console.log(`✓ GET /api/portfolio/:id SUCCESS - Retrieved matching record: ${getByIdRes.body.data.title}`);
        } else {
            console.log("✗ GET /api/portfolio/:id FAILED:", getByIdRes);
        }

        // ------------------------------------------------------------------
        // STEP 4: MONGODB ATLAS DIRECT CREATION & TIMESTAMP VERIFICATION
        // ------------------------------------------------------------------
        console.log("\n--- 4. MONGODB ATLAS CREATION & TIMESTAMP CHECK ---");
        let mongoDbCreationVerified = false;
        let dbDocBeforeUpdate = await Portfolio.findById(createdId);
        if (dbDocBeforeUpdate && dbDocBeforeUpdate.title === testPayload.title) {
            console.log(`✓ MongoDB Direct Query: Document exists in Atlas collection.`);
            console.log(`✓ createdAt timestamp: ${dbDocBeforeUpdate.createdAt.toISOString()}`);
            console.log(`✓ updatedAt timestamp: ${dbDocBeforeUpdate.updatedAt.toISOString()}`);
            if (dbDocBeforeUpdate.createdAt && dbDocBeforeUpdate.updatedAt) {
                mongoDbCreationVerified = true;
            }
        } else {
            console.log("✗ MongoDB Direct Query: Document not found in Atlas collection.");
        }

        // Wait 1 second before updating to ensure updatedAt timestamp changes
        await new Promise(r => setTimeout(r, 1100));

        // ------------------------------------------------------------------
        // STEP 5: PORTFOLIO CRUD - PUT UPDATE
        // ------------------------------------------------------------------
        console.log("\n--- 5. PUT /api/portfolio/:id ---");
        const updatePayload = {
            title: "Updated Modern E-Commerce Platform V2",
            description: "Updated description for full-stack e-commerce project.",
            status: "active"
        };
        const putRes = await makeRequest(`/api/portfolio/${createdId}`, "PUT", updatePayload);
        if (putRes.status === 200 && putRes.body?.success && putRes.body?.data?.title === updatePayload.title) {
            results.putPortfolio = true;
            console.log(`✓ PUT /api/portfolio/:id SUCCESS - Updated title to: '${putRes.body.data.title}'`);
        } else {
            console.log("✗ PUT /api/portfolio/:id FAILED:", putRes);
        }

        // Verify GET after PUT confirms update
        const getAfterPutRes = await makeRequest(`/api/portfolio/${createdId}`, "GET");
        if (getAfterPutRes.status === 200 && getAfterPutRes.body?.data?.title === updatePayload.title) {
            console.log(`✓ GET after PUT confirmed update in API response.`);
        } else {
            console.log("✗ GET after PUT failed to reflect update.");
        }

        // Verify MongoDB Atlas updatedAt timestamp updated
        console.log("\n--- 6. MONGODB ATLAS UPDATE & TIMESTAMP CHECK ---");
        let mongoDbUpdateVerified = false;
        let dbDocAfterUpdate = await Portfolio.findById(createdId);
        if (dbDocAfterUpdate && dbDocAfterUpdate.title === updatePayload.title) {
            console.log(`✓ MongoDB Direct Query: Document title updated to '${dbDocAfterUpdate.title}'.`);
            console.log(`✓ Updated updatedAt timestamp: ${dbDocAfterUpdate.updatedAt.toISOString()}`);
            if (dbDocAfterUpdate.updatedAt.getTime() > dbDocBeforeUpdate.updatedAt.getTime()) {
                console.log(`✓ Verified updatedAt timestamp increased after update.`);
                mongoDbUpdateVerified = true;
            }
        }

        // ------------------------------------------------------------------
        // STEP 6: PORTFOLIO CRUD - DELETE
        // ------------------------------------------------------------------
        console.log("\n--- 7. DELETE /api/portfolio/:id ---");
        const deleteRes = await makeRequest(`/api/portfolio/${createdId}`, "DELETE");
        if (deleteRes.status === 200 && deleteRes.body?.success) {
            results.deletePortfolio = true;
            console.log(`✓ DELETE /api/portfolio/:id SUCCESS.`);
        } else {
            console.log("✗ DELETE /api/portfolio/:id FAILED:", deleteRes);
        }

        // Retrieve by ID after DELETE to confirm 404
        const getAfterDeleteRes = await makeRequest(`/api/portfolio/${createdId}`, "GET");
        if (getAfterDeleteRes.status === 404 && getAfterDeleteRes.body?.success === false) {
            console.log(`✓ GET after DELETE returned 404 Not Found as expected.`);
        } else {
            console.log("✗ GET after DELETE did not return 404:", getAfterDeleteRes);
        }

        // Verify MongoDB Atlas deletion
        console.log("\n--- 8. MONGODB ATLAS DELETION CHECK ---");
        let mongoDbDeletionVerified = false;
        let dbDocAfterDelete = await Portfolio.findById(createdId);
        if (dbDocAfterDelete === null) {
            console.log(`✓ MongoDB Direct Query: Document successfully removed from Atlas collection.`);
            mongoDbDeletionVerified = true;
        } else {
            console.log("✗ MongoDB Direct Query: Document still exists in Atlas collection after deletion!");
        }

        if (mongoDbCreationVerified && mongoDbUpdateVerified && mongoDbDeletionVerified) {
            results.mongoDbVerification = true;
        }

        // ------------------------------------------------------------------
        // STEP 7: NEGATIVE TESTING & VALIDATION
        // ------------------------------------------------------------------
        console.log("\n--- 9. NEGATIVE TESTING & VALIDATION ---");
        
        // Missing title
        const noTitleRes = await makeRequest("/api/portfolio", "POST", {
            description: "No title provided",
            category: "Web",
            image: "test.jpg"
        });
        const passNoTitle = noTitleRes.status === 400 && noTitleRes.body?.success === false;

        // Missing description
        const noDescRes = await makeRequest("/api/portfolio", "POST", {
            title: "Test Title",
            category: "Web",
            image: "test.jpg"
        });
        const passNoDesc = noDescRes.status === 400 && noDescRes.body?.success === false;

        // Missing category
        const noCatRes = await makeRequest("/api/portfolio", "POST", {
            title: "Test Title",
            description: "Test Desc",
            image: "test.jpg"
        });
        const passNoCat = noCatRes.status === 400 && noCatRes.body?.success === false;

        // Missing image
        const noImgRes = await makeRequest("/api/portfolio", "POST", {
            title: "Test Title",
            description: "Test Desc",
            category: "Web"
        });
        const passNoImg = noImgRes.status === 400 && noImgRes.body?.success === false;

        // Invalid status
        const invalidStatusRes = await makeRequest("/api/portfolio", "POST", {
            title: "Test Title",
            description: "Test Desc",
            category: "Web",
            image: "test.jpg",
            status: "unknown_status"
        });
        const passInvalidStatus = invalidStatusRes.status === 400 && invalidStatusRes.body?.success === false;

        if (passNoTitle && passNoDesc && passNoCat && passNoImg && passInvalidStatus) {
            results.validation = true;
            console.log("✓ All field & status validation tests PASSED with 400 status responses.");
        } else {
            console.log("✗ Validation tests failed:", { passNoTitle, passNoDesc, passNoCat, passNoImg, passInvalidStatus });
        }

        // Invalid ID handling
        console.log("\n--- 10. INVALID & NON-EXISTENT ID TESTING ---");
        const invalidIdRes = await makeRequest("/api/portfolio/invalid-mongoid-123", "GET");
        const passInvalidId = invalidIdRes.status === 400 && invalidIdRes.body?.success === false;

        const fakeMongoId = new mongoose.Types.ObjectId().toString();
        const nonExistentRes = await makeRequest(`/api/portfolio/${fakeMongoId}`, "GET");
        const passNonExistentId = nonExistentRes.status === 404 && nonExistentRes.body?.success === false;

        if (passInvalidId && passNonExistentId) {
            results.invalidIdHandling = true;
            console.log("✓ Invalid MongoDB ID (400) and Non-existent MongoDB ID (404) tests PASSED.");
        } else {
            console.log("✗ Invalid ID handling tests failed:", { passInvalidId, passNonExistentId });
        }

        // ------------------------------------------------------------------
        // STEP 8: SERVICES API REGRESSION TESTING
        // ------------------------------------------------------------------
        console.log("\n--- 11. SERVICES API REGRESSION TESTING ---");
        let serviceCreatedId = null;
        
        // Services - POST
        const createServiceRes = await makeRequest("/api/services", "POST", {
            title: "Temp Service For Regression Check",
            description: "Testing services API functionality",
            category: "Web Services",
            image: "https://example.com/service.png",
            status: "active"
        });
        const passServicePost = createServiceRes.status === 201 && createServiceRes.body?.success && createServiceRes.body?.data?._id;
        if (passServicePost) serviceCreatedId = createServiceRes.body.data._id;

        // Services - GET ALL
        const getServicesRes = await makeRequest("/api/services", "GET");
        const passServiceGetAll = getServicesRes.status === 200 && getServicesRes.body?.success && Array.isArray(getServicesRes.body?.data);

        // Services - GET BY ID
        const getServiceByIdRes = await makeRequest(`/api/services/${serviceCreatedId}`, "GET");
        const passServiceGetById = getServiceByIdRes.status === 200 && getServiceByIdRes.body?.success && getServiceByIdRes.body?.data?._id === serviceCreatedId;

        // Services - PUT
        const updateServiceRes = await makeRequest(`/api/services/${serviceCreatedId}`, "PUT", {
            title: "Updated Temp Service For Regression Check"
        });
        const passServicePut = updateServiceRes.status === 200 && updateServiceRes.body?.success && updateServiceRes.body?.data?.title === "Updated Temp Service For Regression Check";

        // Services - DELETE
        const deleteServiceRes = await makeRequest(`/api/services/${serviceCreatedId}`, "DELETE");
        const passServiceDelete = deleteServiceRes.status === 200 && deleteServiceRes.body?.success;

        // Services - GET BY ID AFTER DELETE (404)
        const getService404Res = await makeRequest(`/api/services/${serviceCreatedId}`, "GET");
        const passService404 = getService404Res.status === 404;

        if (passServicePost && passServiceGetAll && passServiceGetById && passServicePut && passServiceDelete && passService404) {
            results.servicesApiRegression = true;
            console.log("✓ Services API Full CRUD Regression Test PASSED.");
        } else {
            console.log("✗ Services API Regression Test FAILED:", {
                passServicePost,
                passServiceGetAll,
                passServiceGetById,
                passServicePut,
                passServiceDelete,
                passService404
            });
        }

        console.log("\n==================================================");
        console.log("SUMMARY RESULTS OBJECT");
        console.log("==================================================");
        console.log(JSON.stringify(results, null, 2));

    } catch (error) {
        console.error("Error during execution:", error);
    } finally {
        server.close();
        await mongoose.disconnect();
        console.log("\nTest run finished.");
    }
};

runComprehensiveVerification();
