const mongoose = require("mongoose");
const Blog = require("../models/blog");

// ==========================================
// CREATE NEW BLOG
// POST /api/blogs
// ==========================================
const createBlog = async (req, res) => {
    try {
        const {
            title,
            slug,
            excerpt,
            content,
            featuredImage,
            category,
            author,
            authorRole,
            tags,
            status,
            featured,
            readTime,
            publishedAt,
            seo
        } = req.body || {};

        // Trim string inputs
        const trimmedTitle = typeof title === "string" ? title.trim() : "";
        const trimmedSlug = typeof slug === "string" ? slug.trim() : "";
        const trimmedContent = typeof content === "string" ? content.trim() : "";
        const trimmedExcerpt = typeof excerpt === "string" ? excerpt.trim() : "";
        const trimmedFeaturedImage = typeof featuredImage === "string" ? featuredImage.trim() : "";
        const trimmedCategory = typeof category === "string" ? category.trim() : "";
        const trimmedAuthor = typeof author === "string" ? author.trim() : "";
        const trimmedAuthorRole = typeof authorRole === "string" ? authorRole.trim() : "";
        const trimmedReadTime = typeof readTime === "string" ? readTime.trim() : "";
        const trimmedStatus = typeof status === "string" ? status.trim() : "draft";

        // Validate required fields
        if (!trimmedTitle || !trimmedSlug || !trimmedContent) {
            return res.status(400).json({
                success: false,
                message: "Required fields (title, slug, content) must be provided"
            });
        }

        // Validate status enum
        if (!["draft", "published"].includes(trimmedStatus)) {
            return res.status(400).json({
                success: false,
                message: "Status must be either 'draft' or 'published'"
            });
        }

        // Validate tags array format
        let processedTags = [];
        if (tags !== undefined && tags !== null) {
            if (!Array.isArray(tags)) {
                return res.status(400).json({
                    success: false,
                    message: "Tags must be an array of strings"
                });
            }
            processedTags = tags
                .map((t) => (typeof t === "string" ? t.trim() : ""))
                .filter((t) => t.length > 0);
        }

        // Validate SEO keywords array format
        let processedSeo = {
            metaTitle: "",
            metaDescription: "",
            keywords: []
        };
        if (seo && typeof seo === "object") {
            const metaTitle = typeof seo.metaTitle === "string" ? seo.metaTitle.trim() : "";
            const metaDescription = typeof seo.metaDescription === "string" ? seo.metaDescription.trim() : "";
            let keywordsArr = [];
            if (seo.keywords !== undefined && seo.keywords !== null) {
                if (!Array.isArray(seo.keywords)) {
                    return res.status(400).json({
                        success: false,
                        message: "SEO keywords must be an array of strings"
                    });
                }
                keywordsArr = seo.keywords
                    .map((k) => (typeof k === "string" ? k.trim() : ""))
                    .filter((k) => k.length > 0);
            }
            processedSeo = {
                metaTitle,
                metaDescription,
                keywords: keywordsArr
            };
        }

        // Check for duplicate slug
        const existingBlog = await Blog.findOne({ slug: trimmedSlug });
        if (existingBlog) {
            return res.status(400).json({
                success: false,
                message: "A blog with this slug already exists"
            });
        }

        // Handle publishedAt date logic
        let finalPublishedAt = null;
        if (trimmedStatus === "published") {
            if (publishedAt) {
                finalPublishedAt = new Date(publishedAt);
            } else {
                finalPublishedAt = new Date();
            }
        } else if (publishedAt) {
            finalPublishedAt = new Date(publishedAt);
        }

        // Create blog document
        const blog = await Blog.create({
            title: trimmedTitle,
            slug: trimmedSlug,
            excerpt: trimmedExcerpt,
            content: trimmedContent,
            featuredImage: trimmedFeaturedImage,
            category: trimmedCategory,
            author: trimmedAuthor,
            authorRole: trimmedAuthorRole,
            tags: processedTags,
            status: trimmedStatus,
            featured: Boolean(featured),
            readTime: trimmedReadTime,
            publishedAt: finalPublishedAt,
            seo: processedSeo
        });

        return res.status(201).json({
            success: true,
            message: "Blog created successfully",
            data: blog
        });
    } catch (error) {
        console.error("Error creating blog:", error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "A blog with this slug already exists"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Failed to create blog"
        });
    }
};

// ==========================================
// GET ALL BLOGS (WITH OPTIONAL FILTERS)
// GET /api/blogs
// ==========================================
const getBlogs = async (req, res) => {
    try {
        const { status, category, featured } = req.query;
        const filter = {};

        if (status !== undefined) {
            const trimmedStatus = typeof status === "string" ? status.trim() : "";
            if (!["draft", "published"].includes(trimmedStatus)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status filter. Must be 'draft' or 'published'"
                });
            }
            filter.status = trimmedStatus;
        }

        if (category !== undefined) {
            const trimmedCategory = typeof category === "string" ? category.trim() : "";
            filter.category = trimmedCategory;
        }

        if (featured !== undefined) {
            if (featured === "true" || featured === true) {
                filter.featured = true;
            } else if (featured === "false" || featured === false) {
                filter.featured = false;
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid featured filter. Must be boolean 'true' or 'false'"
                });
            }
        }

        const blogs = await Blog.find(filter).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: blogs.length,
            data: blogs
        });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch blogs"
        });
    }
};

// ==========================================
// GET BLOG BY SLUG
// GET /api/blogs/slug/:slug
// ==========================================
const getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const trimmedSlug = typeof slug === "string" ? slug.trim() : "";

        if (!trimmedSlug) {
            return res.status(400).json({
                success: false,
                message: "Slug parameter is required"
            });
        }

        const blog = await Blog.findOne({ slug: trimmedSlug });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: blog
        });
    } catch (error) {
        console.error("Error fetching blog by slug:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch blog"
        });
    }
};

// ==========================================
// GET SINGLE BLOG BY ID
// GET /api/blogs/:id
// ==========================================
const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID format"
            });
        }

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: blog
        });
    } catch (error) {
        console.error("Error fetching blog by ID:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch blog"
        });
    }
};

// ==========================================
// UPDATE BLOG
// PUT /api/blogs/:id
// ==========================================
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID format"
            });
        }

        const existingBlog = await Blog.findById(id);
        if (!existingBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        const updateData = { ...req.body };

        // Validate title if updated
        if (updateData.title !== undefined) {
            if (typeof updateData.title === "string") {
                updateData.title = updateData.title.trim();
            }
            if (!updateData.title) {
                return res.status(400).json({
                    success: false,
                    message: "title cannot be empty"
                });
            }
        }

        // Validate content if updated
        if (updateData.content !== undefined) {
            if (typeof updateData.content === "string") {
                updateData.content = updateData.content.trim();
            }
            if (!updateData.content) {
                return res.status(400).json({
                    success: false,
                    message: "content cannot be empty"
                });
            }
        }

        // Validate slug if updated
        if (updateData.slug !== undefined) {
            if (typeof updateData.slug === "string") {
                updateData.slug = updateData.slug.trim();
            }
            if (!updateData.slug) {
                return res.status(400).json({
                    success: false,
                    message: "slug cannot be empty"
                });
            }

            if (updateData.slug !== existingBlog.slug) {
                const duplicate = await Blog.findOne({
                    slug: updateData.slug,
                    _id: { $ne: id }
                });
                if (duplicate) {
                    return res.status(400).json({
                        success: false,
                        message: "A blog with this slug already exists"
                    });
                }
            }
        }

        // Validate status if updated
        if (updateData.status !== undefined) {
            if (typeof updateData.status === "string") {
                updateData.status = updateData.status.trim();
            }
            if (!["draft", "published"].includes(updateData.status)) {
                return res.status(400).json({
                    success: false,
                    message: "Status must be either 'draft' or 'published'"
                });
            }

            // Draft -> Published transition auto-sets publishedAt if empty
            if (updateData.status === "published") {
                if (!existingBlog.publishedAt && !updateData.publishedAt) {
                    updateData.publishedAt = new Date();
                }
            }
        }

        // Trim optional string fields
        if (typeof updateData.excerpt === "string") updateData.excerpt = updateData.excerpt.trim();
        if (typeof updateData.featuredImage === "string") updateData.featuredImage = updateData.featuredImage.trim();
        if (typeof updateData.category === "string") updateData.category = updateData.category.trim();
        if (typeof updateData.author === "string") updateData.author = updateData.author.trim();
        if (typeof updateData.authorRole === "string") updateData.authorRole = updateData.authorRole.trim();
        if (typeof updateData.readTime === "string") updateData.readTime = updateData.readTime.trim();

        // Validate tags if updated
        if (updateData.tags !== undefined && updateData.tags !== null) {
            if (!Array.isArray(updateData.tags)) {
                return res.status(400).json({
                    success: false,
                    message: "Tags must be an array of strings"
                });
            }
            updateData.tags = updateData.tags
                .map((t) => (typeof t === "string" ? t.trim() : ""))
                .filter((t) => t.length > 0);
        }

        // Validate SEO object if updated
        if (updateData.seo !== undefined && updateData.seo !== null) {
            if (typeof updateData.seo === "object") {
                const existingSeo = existingBlog.seo || {};
                const metaTitle = typeof updateData.seo.metaTitle === "string"
                    ? updateData.seo.metaTitle.trim()
                    : existingSeo.metaTitle || "";
                const metaDescription = typeof updateData.seo.metaDescription === "string"
                    ? updateData.seo.metaDescription.trim()
                    : existingSeo.metaDescription || "";
                let keywordsArr = existingSeo.keywords || [];

                if (updateData.seo.keywords !== undefined && updateData.seo.keywords !== null) {
                    if (!Array.isArray(updateData.seo.keywords)) {
                        return res.status(400).json({
                            success: false,
                            message: "SEO keywords must be an array of strings"
                        });
                    }
                    keywordsArr = updateData.seo.keywords
                        .map((k) => (typeof k === "string" ? k.trim() : ""))
                        .filter((k) => k.length > 0);
                }

                updateData.seo = {
                    metaTitle,
                    metaDescription,
                    keywords: keywordsArr
                };
            }
        }

        const blog = await Blog.findByIdAndUpdate(
            id,
            updateData,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: blog
        });
    } catch (error) {
        console.error("Error updating blog:", error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "A blog with this slug already exists"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Failed to update blog"
        });
    }
};

// ==========================================
// DELETE BLOG
// DELETE /api/blogs/:id
// ==========================================
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID format"
            });
        }

        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting blog:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete blog"
        });
    }
};

module.exports = {
    createBlog,
    getBlogs,
    getBlogBySlug,
    getBlogById,
    updateBlog,
    deleteBlog
};
