const express = require("express");

const {
    createBlog,
    getBlogs,
    getBlogBySlug,
    getBlogById,
    updateBlog,
    deleteBlog
} = require("../controllers/blogController");

const router = express.Router();

// Create a new blog post
// POST /api/blogs
router.post("/", createBlog);

// Get all blogs (supports ?status=, ?category=, ?featured= filters)
// GET /api/blogs
router.get("/", getBlogs);

// Get blog by slug (registered BEFORE /:id to prevent routing conflict)
// GET /api/blogs/slug/:slug
router.get("/slug/:slug", getBlogBySlug);

// Get a single blog by ID
// GET /api/blogs/:id
router.get("/:id", getBlogById);

// Update a blog
// PUT /api/blogs/:id
router.put("/:id", updateBlog);

// Delete a blog
// DELETE /api/blogs/:id
router.delete("/:id", deleteBlog);

module.exports = router;
