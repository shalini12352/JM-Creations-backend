const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
    createBlog,
    getBlogs,
    getBlogBySlug,
    getBlogById,
    updateBlog,
    deleteBlog
} = require("../controllers/blogController");

const router = express.Router();

// Create a new blog post (Protected)
// POST /api/blogs
router.post("/", protect, createBlog);

// Get all blogs (supports ?status=, ?category=, ?featured= filters) (Public)
// GET /api/blogs
router.get("/", getBlogs);

// Get blog by slug (registered BEFORE /:id to prevent routing conflict) (Public)
// GET /api/blogs/slug/:slug
router.get("/slug/:slug", getBlogBySlug);

// Get a single blog by ID (Public)
// GET /api/blogs/:id
router.get("/:id", getBlogById);

// Update a blog (Protected)
// PUT /api/blogs/:id
router.put("/:id", protect, updateBlog);

// Delete a blog (Protected)
// DELETE /api/blogs/:id
router.delete("/:id", protect, deleteBlog);

module.exports = router;

