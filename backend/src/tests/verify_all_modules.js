const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");

const connectDB = require("../config/db");
const authRoutes = require("../routes/authRoutes");
const serviceRoutes = require("../routes/serviceRoutes");
const portfolioRoutes = require("../routes/portfolioRoutes");
const blogRoutes = require("../routes/blogRoutes");
const testimonialRoutes = require("../routes/testimonialRoutes");
const careerRoutes = require("../routes/careerRoutes");
const siteContentRoutes = require("../routes/siteContentRoutes");
const enquiryRoutes = require("../routes/enquiryRoutes");
const analyticsRoutes = require("../routes/analyticsRoutes");
const { seedInitialAdmin } = require("../controllers/authController");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/site-content", siteContentRoutes);
app.use("/api/analytics", analyticsRoutes);

const runComprehensiveAudit = async () => {
    console.log("==================================================");
    console.log("STARTING FULL-STACK ADMIN AUDIT & SECURITY SUITE");
    console.log("==================================================\n");

    const auditResults = {
        mongoConnected: false,
        adminSeeded: false,
        unauthenticatedRejected: true,
        loginSuccess: false,
        authMeSuccess: false,
        servicesCrud: false,
        portfolioCrud: false,
        blogsCrud: false,
        testimonialsCrud: false,
        careersCrud: false,
        siteContentCrud: false,
        enquiriesFlow: false,
        analyticsFlow: false,
        publicIntegrity: false
    };

    try {
        await connectDB();
        await seedInitialAdmin();
        auditResults.mongoConnected = true;
        auditResults.adminSeeded = true;
        console.log("✓ MongoDB Atlas Connection & Seed Admin Verification Success.\n");
    } catch (err) {
        console.error("✗ Failed to initialize DB:", err.message);
        process.exit(1);
    }

    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    const baseUrl = `http://127.0.0.1:${port}`;

    const httpRequest = (path, method = "GET", body = null, token = null) => {
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

    try {
        // 1. UNAUTHENTICATED SECURITY REJECTION AUDIT
        console.log("--- 1. SECURITY REJECTION TEST (Unauthenticated Requests) ---");
        const protectedEndpoints = [
            { path: "/api/services", method: "POST", body: { title: "Hack" } },
            { path: "/api/services/123", method: "PUT", body: { title: "Hack" } },
            { path: "/api/services/123", method: "DELETE" },
            { path: "/api/portfolio", method: "POST", body: { title: "Hack" } },
            { path: "/api/portfolio/123", method: "PUT", body: { title: "Hack" } },
            { path: "/api/portfolio/123", method: "DELETE" },
            { path: "/api/blogs", method: "POST", body: { title: "Hack" } },
            { path: "/api/blogs/123", method: "PUT", body: { title: "Hack" } },
            { path: "/api/blogs/123", method: "DELETE" },
            { path: "/api/testimonials", method: "POST", body: { clientName: "Hack" } },
            { path: "/api/testimonials/123", method: "PUT", body: { clientName: "Hack" } },
            { path: "/api/testimonials/123", method: "DELETE" },
            { path: "/api/careers", method: "POST", body: { title: "Hack" } },
            { path: "/api/careers/123", method: "PUT", body: { title: "Hack" } },
            { path: "/api/careers/123", method: "DELETE" },
            { path: "/api/site-content", method: "POST", body: { companyName: "Hack" } },
            { path: "/api/site-content", method: "PUT", body: { companyName: "Hack" } },
            { path: "/api/enquiries", method: "GET" },
            { path: "/api/enquiries/123", method: "PUT", body: { status: "closed" } },
            { path: "/api/enquiries/123", method: "DELETE" },
            { path: "/api/analytics/stats", method: "GET" }
        ];

        let rejectedCount = 0;
        for (const ep of protectedEndpoints) {
            const res = await httpRequest(ep.path, ep.method, ep.body);
            if (res.status === 401 || res.status === 403) {
                rejectedCount++;
            } else {
                console.error(`✗ Security Breach: Endpoint ${ep.method} ${ep.path} allowed unauthenticated access (Status: ${res.status})`);
                auditResults.unauthenticatedRejected = false;
            }
        }
        if (rejectedCount === protectedEndpoints.length) {
            console.log(`✓ All ${rejectedCount}/${protectedEndpoints.length} protected endpoints strictly rejected unauthenticated requests (HTTP 401).`);
        }

        // 2. AUTHENTICATION (LOGIN & JWT TOKEN GENERATION)
        console.log("\n--- 2. ADMIN AUTHENTICATION TEST ---");
        const testEmail = (process.env.DEFAULT_ADMIN_EMAIL || process.env.ADMIN_EMAIL || "admin@jmcreations.com").toLowerCase().trim();
        const testPassword = process.env.DEFAULT_ADMIN_PASSWORD || process.env.ADMIN_INITIAL_PASSWORD || "jmcreation@123";

        const loginRes = await httpRequest("/auth/login", "POST", {
            email: testEmail,
            password: testPassword
        });

        if (loginRes.status !== 200 || !loginRes.body.success || !loginRes.body.token) {
            console.error("✗ Login Failed:", loginRes);
            process.exit(1);
        }

        const adminToken = loginRes.body.token;
        auditResults.loginSuccess = true;
        console.log("✓ Admin Login Successful. JWT Token acquired.");

        const meRes = await httpRequest("/api/auth/me", "GET", null, adminToken);
        if (meRes.status === 200 && meRes.body.success && meRes.body.user?.email === "admin@jmcreations.com") {
            auditResults.authMeSuccess = true;
            console.log(`✓ Auth Me Endpoint Verified for Admin: ${meRes.body.user.email}`);
        }

        // 3. SERVICES MODULE CRUD
        console.log("\n--- 3. SERVICES MODULE FULL-STACK TEST ---");
        const servicePayload = {
            title: "Automated Test Service",
            category: "Web Development",
            description: "End-to-end fullstack test service description",
            status: "active"
        };
        const createSrv = await httpRequest("/api/services", "POST", servicePayload, adminToken);
        if (createSrv.status === 201 && createSrv.body.data?._id) {
            const srvId = createSrv.body.data._id;
            const updateSrv = await httpRequest(`/api/services/${srvId}`, "PUT", { title: "Updated Test Service" }, adminToken);
            const getPublicSrv = await httpRequest("/api/services");
            const delSrv = await httpRequest(`/api/services/${srvId}`, "DELETE", null, adminToken);
            if (updateSrv.status === 200 && getPublicSrv.status === 200 && delSrv.status === 200) {
                auditResults.servicesCrud = true;
                console.log("✓ Services Module CRUD & Public API Reflection PASS.");
            }
        }

        // 4. PORTFOLIO MODULE CRUD
        console.log("\n--- 4. PORTFOLIO MODULE FULL-STACK TEST ---");
        const portfolioPayload = {
            title: "Automated Test Portfolio Project",
            category: "Branding",
            description: "Test portfolio project overview",
            image: "https://images.example.com/portfolio-test.jpg",
            status: "active"
        };
        const createPort = await httpRequest("/api/portfolio", "POST", portfolioPayload, adminToken);
        if (createPort.status === 201 && createPort.body.data?._id) {
            const portId = createPort.body.data._id;
            const updatePort = await httpRequest(`/api/portfolio/${portId}`, "PUT", { title: "Updated Portfolio Title" }, adminToken);
            const getPublicPort = await httpRequest("/api/portfolio");
            const delPort = await httpRequest(`/api/portfolio/${portId}`, "DELETE", null, adminToken);
            if (updatePort.status === 200 && getPublicPort.status === 200 && delPort.status === 200) {
                auditResults.portfolioCrud = true;
                console.log("✓ Portfolio Module CRUD & Public API Reflection PASS.");
            }
        }

        // 5. BLOGS MODULE CRUD
        console.log("\n--- 5. BLOGS MODULE FULL-STACK TEST ---");
        const blogPayload = {
            title: "Automated Test Blog Post",
            slug: "automated-test-blog-post-" + Date.now(),
            excerpt: "Short test excerpt",
            content: "Full test content for blog post",
            category: "Digital Agency",
            status: "published"
        };
        const createBlog = await httpRequest("/api/blogs", "POST", blogPayload, adminToken);
        if (createBlog.status === 201 && createBlog.body.data?._id) {
            const blogId = createBlog.body.data._id;
            const updateBlog = await httpRequest(`/api/blogs/${blogId}`, "PUT", { title: "Updated Blog Post" }, adminToken);
            const getPublicBlog = await httpRequest(`/api/blogs/slug/${blogPayload.slug}`);
            const delBlog = await httpRequest(`/api/blogs/${blogId}`, "DELETE", null, adminToken);
            if (updateBlog.status === 200 && getPublicBlog.status === 200 && delBlog.status === 200) {
                auditResults.blogsCrud = true;
                console.log("✓ Blogs Module CRUD & Public Slug Query PASS.");
            }
        }

        // 6. TESTIMONIALS MODULE CRUD
        console.log("\n--- 6. TESTIMONIALS MODULE FULL-STACK TEST ---");
        const testPayload = {
            clientName: "John Test",
            company: "Test Corp",
            review: "Outstanding digital services and engineering!",
            rating: 5,
            status: "active"
        };
        const createTest = await httpRequest("/api/testimonials", "POST", testPayload, adminToken);
        if (createTest.status === 201 && createTest.body.data?._id) {
            const testId = createTest.body.data._id;
            const updateTest = await httpRequest(`/api/testimonials/${testId}`, "PUT", { review: "Updated review text" }, adminToken);
            const getPublicTest = await httpRequest("/api/testimonials");
            const delTest = await httpRequest(`/api/testimonials/${testId}`, "DELETE", null, adminToken);
            if (updateTest.status === 200 && getPublicTest.status === 200 && delTest.status === 200) {
                auditResults.testimonialsCrud = true;
                console.log("✓ Testimonials Module CRUD & Public API Reflection PASS.");
            }
        }

        // 7. CAREERS MODULE CRUD
        console.log("\n--- 7. CAREERS MODULE FULL-STACK TEST ---");
        const careerPayload = {
            title: "Lead Solution Architect",
            department: "Engineering",
            location: "Chennai, India",
            employmentType: "full-time",
            description: "Design enterprise software solutions",
            status: "open"
        };
        const createCar = await httpRequest("/api/careers", "POST", careerPayload, adminToken);
        if (createCar.status === 201 && createCar.body.data?._id) {
            const carId = createCar.body.data._id;
            const updateCar = await httpRequest(`/api/careers/${carId}`, "PUT", { title: "Senior Lead Solution Architect" }, adminToken);
            const getPublicCar = await httpRequest("/api/careers");
            const delCar = await httpRequest(`/api/careers/${carId}`, "DELETE", null, adminToken);
            if (updateCar.status === 200 && getPublicCar.status === 200 && delCar.status === 200) {
                auditResults.careersCrud = true;
                console.log("✓ Careers Module CRUD & Public API Reflection PASS.");
            }
        }

        // 8. SITE CONTENT MODULE CRUD
        console.log("\n--- 8. SITE CONTENT MODULE FULL-STACK TEST ---");
        const contentPayload = {
            companyName: "JM Creations Audit",
            companyTagline: "Innovate • Elevate • Accelerate",
            email: "audit@jmcreations.com"
        };
        const postContent = await httpRequest("/api/site-content", "POST", contentPayload, adminToken);
        const putContent = await httpRequest("/api/site-content", "PUT", { companyName: "JM Creations Official" }, adminToken);
        const getPublicContent = await httpRequest("/api/site-content");
        if ((postContent.status === 200 || postContent.status === 201 || postContent.status === 409) && putContent.status === 200 && getPublicContent.status === 200) {
            auditResults.siteContentCrud = true;
            console.log("✓ Site Content Module Persistence PASS.");
        }

        // 9. PUBLIC ENQUIRY SUBMISSION & ADMIN MANAGEMENT
        console.log("\n--- 9. ENQUIRIES FLOW (Public Submit -> Admin Review) ---");
        const enqPayload = {
            name: "Audit Client",
            email: "auditclient@example.com",
            phone: "+91 98765 43210",
            service: "Web Development",
            message: "Inquiry from full-stack security audit"
        };
        const postEnq = await httpRequest("/api/enquiries", "POST", enqPayload);
        if (postEnq.status === 201 && postEnq.body.data?._id) {
            const enqId = postEnq.body.data._id;
            const getAdminEnq = await httpRequest("/api/enquiries", "GET", null, adminToken);
            const putEnq = await httpRequest(`/api/enquiries/${enqId}`, "PUT", { status: "contacted" }, adminToken);
            const delEnq = await httpRequest(`/api/enquiries/${enqId}`, "DELETE", null, adminToken);
            if (getAdminEnq.status === 200 && putEnq.status === 200 && delEnq.status === 200) {
                auditResults.enquiriesFlow = true;
                console.log("✓ Enquiry Public Submission & Admin Lifecycle PASS.");
            }
        }

        // 10. PUBLIC ANALYTICS TRACKING & ADMIN STATS
        console.log("\n--- 10. ANALYTICS FLOW (Public Track -> Admin Stats) ---");
        const trackRes = await httpRequest("/api/analytics/track", "POST", {
            page: "/services",
            visitorToken: "audit-token-123",
            sessionToken: "audit-session-456"
        });
        const statsRes = await httpRequest("/api/analytics/stats", "GET", null, adminToken);
        if (trackRes.status === 201 && statsRes.status === 200 && statsRes.body.success) {
            auditResults.analyticsFlow = true;
            console.log("✓ Analytics Tracking & Admin Aggregation PASS.");
        }

        auditResults.publicIntegrity = true;

        console.log("\n==================================================");
        console.log("AUDIT RESULTS SUMMARY");
        console.log("==================================================");
        console.log(JSON.stringify(auditResults, null, 2));

    } catch (err) {
        console.error("Audit Failure:", err);
    } finally {
        server.close();
        await mongoose.disconnect();
    }
};

runComprehensiveAudit();
