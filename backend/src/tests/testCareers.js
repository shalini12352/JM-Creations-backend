const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");

const Career = require("../models/career");
const Blog = require("../models/blog");
const Testimonial = require("../models/testimonial");
const Portfolio = require("../models/Portfolio");
const Service = require("../models/service");
const Enquiry = require("../models/enquiry");

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

const runCareersTestSuite = async () => {
    console.log("==================================================");
    console.log("STARTING JM CREATIONS PHASE 6 — CAREERS TEST SUITE");
    console.log("==================================================\n");

    let isAtlasConnected = false;
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

        // Mock Career model for fallback testing if Atlas IP is restricted
        Career.create = async function (data) {
            const id = new mongoose.Types.ObjectId().toString();
            const doc = {
                _id: id,
                department: "",
                location: "",
                employmentType: "full-time",
                responsibilities: [],
                requirements: [],
                skills: [],
                experience: "",
                salary: "",
                status: "open",
                featured: false,
                applicationEmail: "",
                displayOrder: 0,
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            careerMemoryStore.set(id, doc);
            return doc;
        };

        Career.find = function (filter = {}) {
            return {
                sort: function () {
                    let list = Array.from(careerMemoryStore.values());
                    if (filter.status !== undefined) {
                        list = list.filter(c => c.status === filter.status);
                    }
                    if (filter.department !== undefined) {
                        list = list.filter(c => c.department === filter.department);
                    }
                    if (filter.employmentType !== undefined) {
                        list = list.filter(c => c.employmentType === filter.employmentType);
                    }
                    if (filter.featured !== undefined) {
                        list = list.filter(c => c.featured === filter.featured);
                    }
                    return list.sort((a, b) => {
                        if (a.displayOrder !== b.displayOrder) {
                            return a.displayOrder - b.displayOrder;
                        }
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    });
                }
            };
        };

        Career.findById = async function (id) {
            return careerMemoryStore.get(id?.toString()) || null;
        };

        Career.findByIdAndUpdate = async function (id, updateData, options) {
            const existing = careerMemoryStore.get(id?.toString());
            if (!existing) return null;
            const updated = {
                ...existing,
                ...updateData,
                updatedAt: new Date()
            };
            careerMemoryStore.set(id?.toString(), updated);
            return updated;
        };

        Career.findByIdAndDelete = async function (id) {
            const existing = careerMemoryStore.get(id?.toString());
            if (!existing) return null;
            careerMemoryStore.delete(id?.toString());
            return existing;
        };

        // Fallbacks for regression checks
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

    let createdCareerId1 = null;
    let createdCareerId2 = null;

    try {
        // --------------------------------------------------
        // TEST 1: Create Career Opportunity (POST /api/careers)
        // --------------------------------------------------
        const careerPayload1 = {
            title: "Senior Full Stack Engineer",
            department: "Engineering",
            location: "Remote / Hybrid",
            employmentType: "full-time",
            description: "Lead full stack development initiatives for client web projects.",
            responsibilities: [
                "Architect scalable React and Node.js microservices",
                "Mentor junior developers and perform code reviews"
            ],
            requirements: [
                "5+ years experience with React, Node.js, and MongoDB",
                "Strong understanding of RESTful APIs and UI design"
            ],
            skills: ["React", "Node.js", "Express", "MongoDB"],
            experience: "5+ years",
            salary: "$90,000 - $120,000 / year",
            status: "open",
            featured: true,
            applicationEmail: "careers@jmcreations.com",
            displayOrder: 1
        };
        const res1 = await makeRequest("/api/careers", "POST", careerPayload1);
        const pass1 = res1.status === 201 && res1.body?.success === true && res1.body?.data?._id;
        if (pass1) createdCareerId1 = res1.body.data._id;
        recordResult("1. Create Career Opportunity (POST /api/careers)", pass1, `Status ${res1.status}, ID: ${createdCareerId1}`);

        // --------------------------------------------------
        // TEST 2: Create Second Career (Intership, displayOrder 2)
        // --------------------------------------------------
        const careerPayload2 = {
            title: "UI/UX Design Intern",
            department: "Design",
            location: "On-site",
            employmentType: "internship",
            description: "Assist design team with wireframing and interactive prototypes.",
            responsibilities: ["Design component libraries in Figma"],
            requirements: ["Portfolio showing UI projects"],
            skills: ["Figma", "UI Design"],
            experience: "0-1 years",
            salary: "Stipend Provided",
            status: "open",
            featured: false,
            applicationEmail: "design-careers@jmcreations.com",
            displayOrder: 2
        };
        const res2 = await makeRequest("/api/careers", "POST", careerPayload2);
        const pass2 = res2.status === 201 && res2.body?.success === true && res2.body?.data?._id;
        if (pass2) createdCareerId2 = res2.body.data._id;
        recordResult("2. Create Second Career Opportunity (POST /api/careers)", pass2, `Status ${res2.status}, ID: ${createdCareerId2}`);

        // --------------------------------------------------
        // TEST 3: Get All Careers (GET /api/careers)
        // --------------------------------------------------
        const res3 = await makeRequest("/api/careers");
        const pass3 = res3.status === 200 && res3.body?.success === true && Array.isArray(res3.body?.data) && res3.body?.count >= 2;
        recordResult("3. Get All Careers (GET /api/careers)", pass3, `Status ${res3.status}, Count: ${res3.body?.count}`);

        // --------------------------------------------------
        // TEST 4: Get Career by ID (GET /api/careers/:id)
        // --------------------------------------------------
        const res4 = await makeRequest(`/api/careers/${createdCareerId1}`);
        const pass4 = res4.status === 200 && res4.body?.success === true && res4.body?.data?._id === createdCareerId1;
        recordResult("4. Get Career by ID (GET /api/careers/:id)", pass4, `Status ${res4.status}, Title: "${res4.body?.data?.title}"`);

        // --------------------------------------------------
        // TEST 5: Update Career (PUT /api/careers/:id)
        // --------------------------------------------------
        const res5 = await makeRequest(`/api/careers/${createdCareerId1}`, "PUT", {
            title: "Lead Full Stack Engineer",
            status: "open"
        });
        const pass5 = res5.status === 200 && res5.body?.success === true && res5.body?.data?.title === "Lead Full Stack Engineer";
        recordResult("5. Update Career (PUT /api/careers/:id)", pass5, `Status ${res5.status}, Updated Title: "${res5.body?.data?.title}"`);

        // --------------------------------------------------
        // TEST 6: Delete Career (DELETE /api/careers/:id)
        // --------------------------------------------------
        const res6 = await makeRequest(`/api/careers/${createdCareerId2}`, "DELETE");
        const pass6 = res6.status === 200 && res6.body?.success === true;
        recordResult("6. Delete Career (DELETE /api/careers/:id)", pass6, `Status ${res6.status}`);

        // --------------------------------------------------
        // TEST 7: Missing Required Fields Validation (POST /api/careers)
        // --------------------------------------------------
        const res7 = await makeRequest("/api/careers", "POST", {
            department: "Engineering"
            // Missing title & description
        });
        const pass7 = res7.status === 400 && res7.body?.success === false;
        recordResult("7. Missing Required Fields Validation (POST /api/careers)", pass7, `Status ${res7.status}, Message: ${res7.body?.message}`);

        // --------------------------------------------------
        // TEST 8: Invalid employmentType Validation (POST /api/careers)
        // --------------------------------------------------
        const res8 = await makeRequest("/api/careers", "POST", {
            title: "Test Career",
            description: "Test description",
            employmentType: "volunteer" // invalid enum
        });
        const pass8 = res8.status === 400 && res8.body?.success === false;
        recordResult("8. Invalid employmentType Enum Validation (POST /api/careers)", pass8, `Status ${res8.status}, Message: ${res8.body?.message}`);

        // --------------------------------------------------
        // TEST 9: Invalid Status Validation (POST /api/careers)
        // --------------------------------------------------
        const res9 = await makeRequest("/api/careers", "POST", {
            title: "Test Career",
            description: "Test description",
            status: "pending" // invalid enum
        });
        const pass9 = res9.status === 400 && res9.body?.success === false;
        recordResult("9. Invalid Status Enum Validation (POST /api/careers)", pass9, `Status ${res9.status}, Message: ${res9.body?.message}`);

        // --------------------------------------------------
        // TEST 10: Invalid MongoDB ObjectId (GET /api/careers/:id)
        // --------------------------------------------------
        const res10 = await makeRequest("/api/careers/invalid-object-id");
        const pass10 = res10.status === 400 && res10.body?.success === false;
        recordResult("10. Invalid MongoDB ObjectId (GET /api/careers/:id)", pass10, `Status ${res10.status}, Message: ${res10.body?.message}`);

        // --------------------------------------------------
        // TEST 11: Non-existing Career Handling (GET /api/careers/:id)
        // --------------------------------------------------
        const fakeId = new mongoose.Types.ObjectId().toString();
        const res11 = await makeRequest(`/api/careers/${fakeId}`);
        const pass11 = res11.status === 404 && res11.body?.success === false;
        recordResult("11. Non-existing Career Handling (GET /api/careers/:id)", pass11, `Status ${res11.status}, Message: ${res11.body?.message}`);

        // --------------------------------------------------
        // TEST 12: Filter by Status (GET /api/careers?status=open)
        // --------------------------------------------------
        const res12 = await makeRequest("/api/careers?status=open");
        const pass12 = res12.status === 200 && res12.body?.success === true && res12.body?.data.every(c => c.status === "open");
        recordResult("12. Filter by Status (GET /api/careers?status=open)", pass12, `Status ${res12.status}, Count: ${res12.body?.count}`);

        // --------------------------------------------------
        // TEST 13: Filter by Department (GET /api/careers?department=Engineering)
        // --------------------------------------------------
        const res13 = await makeRequest("/api/careers?department=Engineering");
        const pass13 = res13.status === 200 && res13.body?.success === true && res13.body?.data.every(c => c.department === "Engineering");
        recordResult("13. Filter by Department (GET /api/careers?department=Engineering)", pass13, `Status ${res13.status}, Count: ${res13.body?.count}`);

        // --------------------------------------------------
        // TEST 14: Filter by employmentType (GET /api/careers?employmentType=full-time)
        // --------------------------------------------------
        const res14 = await makeRequest("/api/careers?employmentType=full-time");
        const pass14 = res14.status === 200 && res14.body?.success === true && res14.body?.data.every(c => c.employmentType === "full-time");
        recordResult("14. Filter by employmentType (GET /api/careers?employmentType=full-time)", pass14, `Status ${res14.status}, Count: ${res14.body?.count}`);

        // --------------------------------------------------
        // TEST 15: Filter by Featured (GET /api/careers?featured=true)
        // --------------------------------------------------
        const res15 = await makeRequest("/api/careers?featured=true");
        const pass15 = res15.status === 200 && res15.body?.success === true && res15.body?.data.every(c => c.featured === true);
        recordResult("15. Filter by Featured (GET /api/careers?featured=true)", pass15, `Status ${res15.status}, Count: ${res15.body?.count}`);

        // --------------------------------------------------
        // TEST 16: Invalid Array Format Validation (POST /api/careers)
        // --------------------------------------------------
        const res16 = await makeRequest("/api/careers", "POST", {
            title: "Test Career",
            description: "Test description",
            responsibilities: "not-an-array" // invalid array format
        });
        const pass16 = res16.status === 400 && res16.body?.success === false;
        recordResult("16. Invalid Array Format Validation (POST /api/careers)", pass16, `Status ${res16.status}, Message: ${res16.body?.message}`);

        // --------------------------------------------------
        // TEST 17: Valid Responsibilities/Requirements/Skills Processing
        // --------------------------------------------------
        const res17 = await makeRequest(`/api/careers/${createdCareerId1}`);
        const pass17 = res17.status === 200 && Array.isArray(res17.body?.data?.responsibilities) && Array.isArray(res17.body?.data?.skills);
        recordResult("17. Valid Responsibilities/Requirements/Skills Processing", pass17, `Status ${res17.status}, Skills count: ${res17.body?.data?.skills.length}`);

        // --------------------------------------------------
        // TEST 18: Invalid Application Email Validation (POST /api/careers)
        // --------------------------------------------------
        const res18 = await makeRequest("/api/careers", "POST", {
            title: "Test Career Email",
            description: "Test description",
            applicationEmail: "invalid-email-string" // invalid email format
        });
        const pass18 = res18.status === 400 && res18.body?.success === false;
        recordResult("18. Invalid Application Email Format (POST /api/careers)", pass18, `Status ${res18.status}, Message: ${res18.body?.message}`);

        // --------------------------------------------------
        // TEST 19: Verify displayOrder Sorting
        // --------------------------------------------------
        const res19 = await makeRequest("/api/careers");
        let pass19 = res19.status === 200 && Array.isArray(res19.body?.data);
        if (pass19 && res19.body.data.length > 1) {
            for (let i = 0; i < res19.body.data.length - 1; i++) {
                if (res19.body.data[i].displayOrder > res19.body.data[i + 1].displayOrder) {
                    pass19 = false;
                    break;
                }
            }
        }
        recordResult("19. Verify displayOrder Ascending Sorting", pass19, `Status ${res19.status}`);

        // --------------------------------------------------
        // TEST 20: Confirm Deleted Career Returns 404
        // --------------------------------------------------
        const res20 = await makeRequest(`/api/careers/${createdCareerId2}`);
        const pass20 = res20.status === 404 && res20.body?.success === false;
        recordResult("20. Confirm Deleted Career Returns 404", pass20, `Status ${res20.status}`);

        // --------------------------------------------------
        // TEST 21: Verify Mongoose Timestamps (createdAt, updatedAt)
        // --------------------------------------------------
        const res21 = await makeRequest(`/api/careers/${createdCareerId1}`);
        const pass21 = res21.status === 200 && res21.body?.data?.createdAt && res21.body?.data?.updatedAt;
        recordResult("21. Verify Mongoose Timestamps (createdAt, updatedAt)", pass21, `Status ${res21.status}, createdAt: ${res21.body?.data?.createdAt}`);

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

        console.log("\n==================================================");
        console.log("FINAL CAREERS TEST RESULTS SUMMARY");
        console.log("==================================================");
        testResults.forEach(r => {
            console.log(`- ${r.name}: ${r.status}${r.details ? ` (${r.details})` : ""}`);
        });

    } catch (err) {
        console.error("Careers Test Suite Error:", err);
    } finally {
        server.close();
        if (isAtlasConnected) {
            await mongoose.disconnect();
        }
        console.log("\nCareers test suite execution completed.");
    }
};

runCareersTestSuite();
