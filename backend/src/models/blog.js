const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        slug: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },

        excerpt: {
            type: String,
            trim: true,
            default: ""
        },

        content: {
            type: String,
            required: true,
            trim: true
        },

        featuredImage: {
            type: String,
            trim: true,
            default: ""
        },

        category: {
            type: String,
            trim: true,
            default: ""
        },

        author: {
            type: String,
            trim: true,
            default: ""
        },

        authorRole: {
            type: String,
            trim: true,
            default: ""
        },

        tags: {
            type: [{ type: String, trim: true }],
            default: []
        },

        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft"
        },

        featured: {
            type: Boolean,
            default: false
        },

        readTime: {
            type: String,
            trim: true,
            default: ""
        },

        publishedAt: {
            type: Date,
            default: null
        },

        seo: {
            metaTitle: {
                type: String,
                trim: true,
                default: ""
            },
            metaDescription: {
                type: String,
                trim: true,
                default: ""
            },
            keywords: {
                type: [{ type: String, trim: true }],
                default: []
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Blog", blogSchema);
