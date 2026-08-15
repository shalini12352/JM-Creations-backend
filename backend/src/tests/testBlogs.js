const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");

const Blog = require("../models/blog");
const Testimonial = require("../models/testimonial");
const Portfolio = require("../models/Portfolio");
const Service = require("../models/service");
const Enquiry = require("../models/enquiry");

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

const runBlogsTestSuite = async () => {
    console.log("==================================================");
    console.log("STARTING JM CREATIONS PHASE 5 — BLOG TEST SUITE");
    console.log("==================================================\n");

    let isAtlasConnected = false;
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

        // Mock Blog model for fallback testing if Atlas IP is restricted
        Blog.create = async function (data) {
            const existing = Array.from(blogMemoryStore.values()).find(b => b.slug === data.slug);
            if (existing) {
                const err = new Error("E11000 duplicate key error collection: test.blogs index: slug_1 dup key");
                err.code = 11000;
                throw err;
            }

            const id = new mongoose.Types.ObjectId().toString();
            const doc = {
                _id: id,
                excerpt: "",
                featuredImage: "",
                category: "",
                author: "",
                authorRole: "",
                tags: [],
                status: "draft",
                featured: false,
                readTime: "",
                publishedAt: null,
                seo: { metaTitle: "", metaDescription: "", keywords: [] },
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            blogMemoryStore.set(id, doc);
            return doc;
        };

        Blog.find = function (filter = {}) {
            return {
                sort: function () {
                    let list = Array.from(blogMemoryStore.values());
                    if (filter.status !== undefined) {
                        list = list.filter(b => b.status === filter.status);
                    }
                    if (filter.category !== undefined) {
                        list = list.filter(b => b.category === filter.category);
                    }
                    if (filter.featured !== undefined) {
                        list = list.filter(b => b.featured === filter.featured);
                    }
                    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                }
            };
        };

        Blog.findOne = async function (query) {
            const list = Array.from(blogMemoryStore.values());
            if (query.slug) {
                if (query._id && query._id.$ne) {
                    return list.find(b => b.slug === query.slug && b._id.toString() !== query._id.$ne.toString()) || null;
                }
                return list.find(b => b.slug === query.slug) || null;
            }
            if (query._id) {
                return list.find(b => b._id.toString() === query._id.toString()) || null;
            }
            return null;
        };

        Blog.findById = async function (id) {
            return blogMemoryStore.get(id?.toString()) || null;
        };

        Blog.findByIdAndUpdate = async function (id, updateData, options) {
            const existing = blogMemoryStore.get(id?.toString());
            if (!existing) return null;

            if (updateData.slug && updateData.slug !== existing.slug) {
                const duplicate = Array.from(blogMemoryStore.values()).find(b => b.slug === updateData.slug && b._id.toString() !== id.toString());
                if (duplicate) {
                    const err = new Error("E11000 duplicate key error");
                    err.code = 11000;
                    throw err;
                }
            }

            const updated = {
                ...existing,
                ...updateData,
                updatedAt: new Date()
            };
            blogMemoryStore.set(id?.toString(), updated);
            return updated;
        };

        Blog.findByIdAndDelete = async function (id) {
            const existing = blogMemoryStore.get(id?.toString());
            if (!existing) return null;
            blogMemoryStore.delete(id?.toString());
            return existing;
        };

        // Fallbacks for regression checks
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

    let createdDraftBlogId = null;
    let createdPublishedBlogId = null;

    try {
        // --------------------------------------------------
        // TEST 1: Create Draft Blog (POST /api/blogs)
        // --------------------------------------------------
        const draftPayload = {
            title: "Getting Started with Web Development in 2026",
            slug: "getting-started-web-dev-2026",
            excerpt: "A beginner's guide to modern web development frameworks and tools.",
            content: "Full guide content discussing HTML, CSS, JavaScript, Node.js and Express.",
            featuredImage: "https://example.com/images/webdev.jpg",
            category: "Web Development",
            author: "John Doe",
            authorRole: "Senior Developer",
            tags: ["Web Development", "JavaScript", "Beginner"],
            status: "draft",
            featured: false,
            readTime: "5 min read",
            seo: {
                metaTitle: "Web Dev Guide 2026",
                metaDescription: "Learn web development from scratch in 2026.",
                keywords: ["web dev", "coding", "tutorial"]
            }
        };
        const res1 = await makeRequest("/api/blogs", "POST", draftPayload);
        const pass1 = res1.status === 201 && res1.body?.success === true && res1.body?.data?._id && res1.body?.data?.status === "draft";
        if (pass1) createdDraftBlogId = res1.body.data._id;
        recordResult("1. Create Draft Blog (POST /api/blogs)", pass1, `Status ${res1.status}, ID: ${createdDraftBlogId}`);

        // --------------------------------------------------
        // TEST 2: Create Published Blog (POST /api/blogs)
        // --------------------------------------------------
        const publishedPayload = {
            title: "Top Digital Marketing Trends for Businesses",
            slug: "top-digital-marketing-trends",
            excerpt: "Discover effective strategies to grow your online business presence.",
            content: "Detailed insights into SEO, content strategy, and social media advertising.",
            featuredImage: "https://example.com/images/marketing.jpg",
            category: "Digital Marketing",
            author: "Jane Smith",
            authorRole: "Marketing Specialist",
            tags: ["Digital Marketing", "SEO", "Growth"],
            status: "published",
            featured: true,
            readTime: "7 min read",
            seo: {
                metaTitle: "Digital Marketing Trends 2026",
                metaDescription: "Essential digital marketing strategies.",
                keywords: ["marketing", "seo", "business"]
            }
        };
        const res2 = await makeRequest("/api/blogs", "POST", publishedPayload);
        const pass2 = res2.status === 201 && res2.body?.success === true && res2.body?.data?.publishedAt !== null;
        if (pass2) createdPublishedBlogId = res2.body.data._id;
        recordResult("2. Create Published Blog (POST /api/blogs)", pass2, `Status ${res2.status}, publishedAt: ${res2.body?.data?.publishedAt}`);

        // --------------------------------------------------
        // TEST 3: Get All Blogs (GET /api/blogs)
        // --------------------------------------------------
        const res3 = await makeRequest("/api/blogs");
        const pass3 = res3.status === 200 && res3.body?.success === true && Array.isArray(res3.body?.data) && res3.body?.count >= 2;
        recordResult("3. Get All Blogs (GET /api/blogs)", pass3, `Status ${res3.status}, Count: ${res3.body?.count}`);

        // --------------------------------------------------
        // TEST 4: Filter Blogs by Status (GET /api/blogs?status=published)
        // --------------------------------------------------
        const res4 = await makeRequest("/api/blogs?status=published");
        const pass4 = res4.status === 200 && res4.body?.success === true && res4.body?.data.every(b => b.status === "published");
        recordResult("4. Get Published Blogs Filter (GET /api/blogs?status=published)", pass4, `Status ${res4.status}, Count: ${res4.body?.count}`);

        // --------------------------------------------------
        // TEST 5: Filter Blogs by Category (GET /api/blogs?category=Digital%20Marketing)
        // --------------------------------------------------
        const res5 = await makeRequest("/api/blogs?category=Digital%20Marketing");
        const pass5 = res5.status === 200 && res5.body?.success === true && res5.body?.data.every(b => b.category === "Digital Marketing");
        recordResult("5. Get Blogs by Category Filter (GET /api/blogs?category=Digital%20Marketing)", pass5, `Status ${res5.status}, Count: ${res5.body?.count}`);

        // --------------------------------------------------
        // TEST 6: Filter Featured Blogs (GET /api/blogs?featured=true)
        // --------------------------------------------------
        const res6 = await makeRequest("/api/blogs?featured=true");
        const pass6 = res6.status === 200 && res6.body?.success === true && res6.body?.data.every(b => b.featured === true);
        recordResult("6. Get Featured Blogs Filter (GET /api/blogs?featured=true)", pass6, `Status ${res6.status}, Count: ${res6.body?.count}`);

        // --------------------------------------------------
        // TEST 7: Get Blog by ID (GET /api/blogs/:id)
        // --------------------------------------------------
        const res7 = await makeRequest(`/api/blogs/${createdDraftBlogId}`);
        const pass7 = res7.status === 200 && res7.body?.success === true && res7.body?.data?._id === createdDraftBlogId;
        recordResult("7. Get Blog by ID (GET /api/blogs/:id)", pass7, `Status ${res7.status}`);

        // --------------------------------------------------
        // TEST 8: Get Blog by Slug (GET /api/blogs/slug/:slug)
        // --------------------------------------------------
        const res8 = await makeRequest("/api/blogs/slug/top-digital-marketing-trends");
        const pass8 = res8.status === 200 && res8.body?.success === true && res8.body?.data?.slug === "top-digital-marketing-trends";
        recordResult("8. Get Blog by Slug (GET /api/blogs/slug/:slug)", pass8, `Status ${res8.status}, Title: "${res8.body?.data?.title}"`);

        // --------------------------------------------------
        // TEST 9: Update Blog (PUT /api/blogs/:id)
        // --------------------------------------------------
        const res9 = await makeRequest(`/api/blogs/${createdDraftBlogId}`, "PUT", {
            title: "Getting Started with Web Development in 2026 — Updated Guide",
            readTime: "6 min read"
        });
        const pass9 = res9.status === 200 && res9.body?.success === true && res9.body?.data?.title.includes("Updated Guide");
        recordResult("9. Update Blog (PUT /api/blogs/:id)", pass9, `Status ${res9.status}, Updated Title: "${res9.body?.data?.title}"`);

        // --------------------------------------------------
        // TEST 10: Change Status Draft -> Published (PUT /api/blogs/:id)
        // --------------------------------------------------
        const res10 = await makeRequest(`/api/blogs/${createdDraftBlogId}`, "PUT", {
            status: "published"
        });
        const pass10 = res10.status === 200 && res10.body?.success === true && res10.body?.data?.status === "published" && res10.body?.data?.publishedAt !== null;
        recordResult("10. Change Status Draft -> Published", pass10, `Status ${res10.status}, publishedAt auto-set: ${res10.body?.data?.publishedAt}`);

        // --------------------------------------------------
        // TEST 11: Change Status Published -> Draft (PUT /api/blogs/:id)
        // --------------------------------------------------
        const res11 = await makeRequest(`/api/blogs/${createdDraftBlogId}`, "PUT", {
            status: "draft"
        });
        const pass11 = res11.status === 200 && res11.body?.success === true && res11.body?.data?.status === "draft";
        recordResult("11. Change Status Published -> Draft", pass11, `Status ${res11.status}, Status: ${res11.body?.data?.status}`);

        // --------------------------------------------------
        // TEST 12: Delete Blog (DELETE /api/blogs/:id)
        // --------------------------------------------------
        const res12 = await makeRequest(`/api/blogs/${createdDraftBlogId}`, "DELETE");
        const pass12 = res12.status === 200 && res12.body?.success === true;
        recordResult("12. Delete Blog (DELETE /api/blogs/:id)", pass12, `Status ${res12.status}`);

        // --------------------------------------------------
        // TEST 13: Missing Required Fields Validation (POST /api/blogs)
        // --------------------------------------------------
        const res13 = await makeRequest("/api/blogs", "POST", {
            title: "Incomplete Post"
            // Missing slug and content
        });
        const pass13 = res13.status === 400 && res13.body?.success === false;
        recordResult("13. Missing Required Fields Validation (POST /api/blogs)", pass13, `Status ${res13.status}, Message: ${res13.body?.message}`);

        // --------------------------------------------------
        // TEST 14: Invalid Status Validation (POST /api/blogs)
        // --------------------------------------------------
        const res14 = await makeRequest("/api/blogs", "POST", {
            title: "Invalid Status Post",
            slug: "invalid-status-post",
            content: "Some content",
            status: "archived" // invalid enum value
        });
        const pass14 = res14.status === 400 && res14.body?.success === false;
        recordResult("14. Invalid Status Enum Validation (POST /api/blogs)", pass14, `Status ${res14.status}, Message: ${res14.body?.message}`);

        // --------------------------------------------------
        // TEST 15: Invalid MongoDB ObjectId (GET /api/blogs/:id)
        // --------------------------------------------------
        const res15 = await makeRequest("/api/blogs/invalid-object-id");
        const pass15 = res15.status === 400 && res15.body?.success === false;
        recordResult("15. Invalid MongoDB ObjectId (GET /api/blogs/:id)", pass15, `Status ${res15.status}, Message: ${res15.body?.message}`);

        // --------------------------------------------------
        // TEST 16: Non-existing Blog Handling (GET /api/blogs/:id)
        // --------------------------------------------------
        const fakeId = new mongoose.Types.ObjectId().toString();
        const res16 = await makeRequest(`/api/blogs/${fakeId}`);
        const pass16 = res16.status === 404 && res16.body?.success === false;
        recordResult("16. Non-existing Blog Handling (GET /api/blogs/:id)", pass16, `Status ${res16.status}, Message: ${res16.body?.message}`);

        // --------------------------------------------------
        // TEST 17: Duplicate Slug Validation (POST /api/blogs)
        // --------------------------------------------------
        const res17 = await makeRequest("/api/blogs", "POST", {
            title: "Duplicate Slug Post",
            slug: "top-digital-marketing-trends", // already exists
            content: "Content trying to use duplicate slug."
        });
        const pass17 = res17.status === 400 && res17.body?.success === false;
        recordResult("17. Duplicate Slug Validation (POST /api/blogs)", pass17, `Status ${res17.status}, Message: ${res17.body?.message}`);

        // --------------------------------------------------
        // TEST 18: Invalid Tags Format Validation (POST /api/blogs)
        // --------------------------------------------------
        const res18 = await makeRequest("/api/blogs", "POST", {
            title: "Invalid Tags Post",
            slug: "invalid-tags-post",
            content: "Content with invalid tags.",
            tags: "not-an-array" // invalid tags format
        });
        const pass18 = res18.status === 400 && res18.body?.success === false;
        recordResult("18. Invalid Tags Format Validation (POST /api/blogs)", pass18, `Status ${res18.status}, Message: ${res18.body?.message}`);

        // --------------------------------------------------
        // TEST 19: Confirm Deleted Blog Returns 404
        // --------------------------------------------------
        const res19 = await makeRequest(`/api/blogs/${createdDraftBlogId}`);
        const pass19 = res19.status === 404 && res19.body?.success === false;
        recordResult("19. Confirm Deleted Blog Returns 404", pass19, `Status ${res19.status}`);

        // --------------------------------------------------
        // TEST 20: Verify Timestamps Exist (createdAt, updatedAt)
        // --------------------------------------------------
        const res20 = await makeRequest(`/api/blogs/${createdPublishedBlogId}`);
        const pass20 = res20.status === 200 && res20.body?.data?.createdAt && res20.body?.data?.updatedAt;
        recordResult("20. Verify Mongoose Timestamps (createdAt, updatedAt)", pass20, `Status ${res20.status}, createdAt: ${res20.body?.data?.createdAt}`);

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

        console.log("\n==================================================");
        console.log("FINAL BLOGS TEST RESULTS SUMMARY");
        console.log("==================================================");
        testResults.forEach(r => {
            console.log(`- ${r.name}: ${r.status}${r.details ? ` (${r.details})` : ""}`);
        });

    } catch (err) {
        console.error("Blogs Test Suite Error:", err);
    } finally {
        server.close();
        if (isAtlasConnected) {
            await mongoose.disconnect();
        }
        console.log("\nBlogs test suite execution completed.");
    }
};

runBlogsTestSuite();
