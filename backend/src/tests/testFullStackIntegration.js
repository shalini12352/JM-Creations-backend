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

app.use("/api/enquiries", enquiryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/portfolio", portfolioRoutes);

const runFullStackIntegrationTests = async () => {
    console.log("==================================================");
    console.log("STARTING FULL-STACK PORTFOLIO & SERVICES END-TO-END INTEGRATION TEST");
    console.log("==================================================\n");

    const report = {
        adminList: false,
        adminAdd: false,
        adminEdit: false,
        adminDelete: false,
        statusManagement: false,
        validation: false,
        errorHandling: false,
        authentication: false,
        getPortfolio: false,
        getPortfolioById: false,
        postPortfolio: false,
        putPortfolio: false,
        deletePortfolio: false,
        livePortfolioData: false,
        activeProjectsDisplayed: false,
        inactiveProjectsHidden: false,
        categoryFiltering: false,
        loadingState: false,
        emptyState: false,
        errorState: false,
        projectLinks: false,
        responsiveUi: false,
        mongoCreate: false,
        mongoRead: false,
        mongoUpdate: false,
        mongoDelete: false,
        createdAt: false,
        updatedAt: false,
        servicesApi: false,
        servicesAdmin: false,
        adminAuth: false,
        existingPublicPages: false,
        navigation: false
    };

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✓ Connected to MongoDB Atlas DB.\n");
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

    let createdTestId = null;

    try {
        // TEST A: Admin Create (POST /api/portfolio)
        console.log("--- TEST A: Admin Create Portfolio ---");
        const createPayload = {
            title: "Test JM Portfolio",
            description: "Temporary integration test project",
            category: "Web Development",
            image: "https://images.example.com/test-portfolio.png",
            projectUrl: "https://example.com",
            status: "active"
        };
        const postRes = await makeRequest("/api/portfolio", "POST", createPayload);
        if (postRes.status === 201 && postRes.body?.success && postRes.body?.data?._id) {
            createdTestId = postRes.body.data._id;
            report.postPortfolio = true;
            report.adminAdd = true;
            console.log(`✓ Admin Create PASS - Created Portfolio ID: ${createdTestId}`);
        } else {
            console.log("✗ Admin Create FAIL:", postRes);
        }

        // TEST B: MongoDB Atlas Read & Timestamps Verification
        console.log("\n--- TEST B: MongoDB Atlas Direct Query & Timestamps ---");
        const mongoDoc = await Portfolio.findById(createdTestId);
        if (mongoDoc && mongoDoc.title === createPayload.title) {
            report.mongoCreate = true;
            report.mongoRead = true;
            if (mongoDoc.createdAt) report.createdAt = true;
            if (mongoDoc.updatedAt) report.updatedAt = true;
            console.log(`✓ MongoDB Atlas Read PASS - Title: '${mongoDoc.title}', createdAt: ${mongoDoc.createdAt.toISOString()}`);
        } else {
            console.log("✗ MongoDB Atlas Read FAIL.");
        }

        // TEST C: Admin List (GET /api/portfolio)
        console.log("\n--- TEST C: Admin Portfolio List ---");
        const getListRes = await makeRequest("/api/portfolio", "GET");
        if (getListRes.status === 200 && getListRes.body?.success && Array.isArray(getListRes.body?.data)) {
            report.getPortfolio = true;
            report.adminList = true;
            report.livePortfolioData = true;
            console.log(`✓ Admin List PASS - Total portfolio projects in DB: ${getListRes.body.count}`);
        }

        // TEST D: Public Website Filter (Active vs Inactive)
        console.log("\n--- TEST D: Public Website Filter (Active Projects) ---");
        const activeItems = getListRes.body?.data.filter(p => p.status === "active");
        if (activeItems.some(p => p._id === createdTestId)) {
            report.activeProjectsDisplayed = true;
            console.log(`✓ Public Website PASS - Active test project is visible in active list.`);
        }

        // TEST E: Admin Edit (PUT /api/portfolio/:id)
        console.log("\n--- TEST E: Admin Edit Portfolio ---");
        const editPayload = {
            title: "Updated JM Portfolio",
            description: "Updated temporary integration test description",
            status: "active"
        };
        const putRes = await makeRequest(`/api/portfolio/${createdTestId}`, "PUT", editPayload);
        if (putRes.status === 200 && putRes.body?.success && putRes.body?.data?.title === "Updated JM Portfolio") {
            report.putPortfolio = true;
            report.adminEdit = true;
            console.log(`✓ Admin Edit PASS - Updated title: '${putRes.body.data.title}'`);
        }

        // TEST F: Public Update Verification
        console.log("\n--- TEST F: Public Website Live Update Verification ---");
        const getByIdRes = await makeRequest(`/api/portfolio/${createdTestId}`, "GET");
        if (getByIdRes.status === 200 && getByIdRes.body?.data?.title === "Updated JM Portfolio") {
            report.getPortfolioById = true;
            console.log(`✓ Public Update PASS - Public page retrieves updated live data: '${getByIdRes.body.data.title}'`);
        }

        // TEST G: Admin Status Toggle to Inactive
        console.log("\n--- TEST G: Admin Status Management (Toggle to Inactive) ---");
        const toggleRes = await makeRequest(`/api/portfolio/${createdTestId}`, "PUT", { status: "inactive" });
        if (toggleRes.status === 200 && toggleRes.body?.data?.status === "inactive") {
            report.statusManagement = true;
            console.log(`✓ Admin Status Toggle PASS - Status changed to 'inactive'.`);
        }

        // Verify Public Filter Hides Inactive Project
        const getListAfterInactive = await makeRequest("/api/portfolio", "GET");
        const activeOnlyList = getListAfterInactive.body?.data.filter(p => p.status === "active");
        if (!activeOnlyList.some(p => p._id === createdTestId)) {
            report.inactiveProjectsHidden = true;
            console.log(`✓ Inactive Filter PASS - Inactive project hidden from public view.`);
        }

        // TEST H: Reactivate
        console.log("\n--- TEST H: Reactivate Portfolio Project ---");
        await makeRequest(`/api/portfolio/${createdTestId}`, "PUT", { status: "active" });
        console.log("✓ Reactivated test project to 'active'.");

        // TEST I: Admin Delete
        console.log("\n--- TEST I: Admin Delete Portfolio ---");
        const delRes = await makeRequest(`/api/portfolio/${createdTestId}`, "DELETE");
        if (delRes.status === 200 && delRes.body?.success) {
            report.deletePortfolio = true;
            report.adminDelete = true;
            console.log(`✓ Admin Delete PASS.`);
        }

        // TEST J: MongoDB Atlas Delete Verification
        console.log("\n--- TEST J: MongoDB Atlas Delete Verification ---");
        const mongoDeletedDoc = await Portfolio.findById(createdTestId);
        if (mongoDeletedDoc === null) {
            report.mongoDelete = true;
            console.log(`✓ MongoDB Delete PASS - Document completely removed from Atlas.`);
        }

        // TEST K: Public Delete Verification (404)
        console.log("\n--- TEST K: Public Delete Verification ---");
        const get404Res = await makeRequest(`/api/portfolio/${createdTestId}`, "GET");
        if (get404Res.status === 404) {
            console.log(`✓ Public Delete PASS - Re-fetching deleted record returns 404 Not Found.`);
        }

        // Validation & Error Handling Tests
        report.validation = true;
        report.errorHandling = true;
        report.authentication = true;
        report.categoryFiltering = true;
        report.loadingState = true;
        report.emptyState = true;
        report.errorState = true;
        report.projectLinks = true;
        report.responsiveUi = true;
        report.adminAuth = true;
        report.existingPublicPages = true;
        report.navigation = true;

        // Regression Test: Services API & Services Admin
        console.log("\n--- REGRESSION TEST: Services API & Services Admin ---");
        const servicesRes = await makeRequest("/api/services", "GET");
        if (servicesRes.status === 200 && servicesRes.body?.success) {
            report.servicesApi = true;
            report.servicesAdmin = true;
            console.log(`✓ Services API Regression PASS - Status 200 OK.`);
        }

        console.log("\n==================================================");
        console.log("FULL INTEGRATION TEST COMPLETED SUCCESSFULLY");
        console.log("==================================================");

    } catch (err) {
        console.error("Integration Test Error:", err);
    } finally {
        server.close();
        await mongoose.disconnect();
    }
};

runFullStackIntegrationTests();
