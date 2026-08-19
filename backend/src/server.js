const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const enquiryRoutes = require("./routes/enquiryRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const blogRoutes = require("./routes/blogRoutes");
const careerRoutes = require("./routes/careerRoutes");
const siteContentRoutes = require("./routes/siteContentRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const authRoutes = require("./routes/authRoutes");
const { seedInitialAdmin } = require("./controllers/authController");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "JM Creations API is running"
    });
});

// Auth routes
app.use("/api/auth", authRoutes);

// Enquiry routes
app.use("/api/enquiries", enquiryRoutes);

// Service routes
app.use("/api/services", serviceRoutes);

// Portfolio routes
app.use("/api/portfolio", portfolioRoutes);

// Testimonial routes
app.use("/api/testimonials", testimonialRoutes);

// Blog routes
app.use("/api/blogs", blogRoutes);

// Career routes
app.use("/api/careers", careerRoutes);

// Site Content routes
app.use("/api/site-content", siteContentRoutes);

// Analytics routes
app.use("/api/analytics", analyticsRoutes);

// Port
const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
    try {
        await connectDB();
        await seedInitialAdmin();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();