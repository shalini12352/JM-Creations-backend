import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  Share2,
  Check,
} from 'lucide-react';
import blogService from '../services/blogService';
import Seo from '../components/common/Seo';
import ImageWithFallback from '../components/common/ImageWithFallback';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const DEFAULT_BLOG_POSTS = [
  {
    _id: 'blog-digital-marketing-2026',
    title: 'Unlocking Modern Meta & Google Ad Funnels for Maximum ROI',
    slug: 'modern-meta-google-ad-funnels-roi',
    category: 'DIGITAL MARKETING',
    author: 'JM Growth Team',
    readTime: '5 min read',
    publishedAt: '2026-08-10',
    featured: true,
    excerpt:
      'Discover how multi-channel ad targeting, retargeting funnels, and AI-driven ad copy generate qualified sales leads at lower acquisition costs.',
    content: `In today's digital landscape, relying on single-channel ad traffic is no longer sufficient. By combining precision Meta (Facebook & Instagram) audience lookalikes with high-intent Google Search campaigns, businesses build resilient conversion funnels.

Key Strategies Covered:
1. Intent Search Capture via Google Ads
2. Dynamic Social Retargeting via Meta Pixel & Conversions API
3. High-Converting Landing Page Architecture
4. Continuous Creative A/B Testing`,
    featuredImage:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  },
  {
    _id: 'blog-ecommerce-conversion',
    title: 'How Scalable Web Storefronts Boost Checkout Conversion Rates',
    slug: 'scalable-web-storefronts-conversion-rates',
    category: 'E-COMMERCE',
    author: 'Tech Engineering',
    readTime: '6 min read',
    publishedAt: '2026-08-05',
    featured: false,
    excerpt:
      'Streamlined checkout UX, mobile performance optimization, and instant payment gateways transform window shoppers into repeat buyers.',
    content: `E-commerce performance dictates customer retention. A friction-free checkout flow, zero latency page rendering, and localized payment options dramatically elevate conversion metrics.`,
    featuredImage:
      'https://images.unsplash.com/photo-1556742049-0a67daf40955?auto=format&fit=crop&w=800&q=80',
  },
  {
    _id: 'blog-website-development-react',
    title: 'Why Custom React Architectures Outperform Legacy CMS Templates',
    slug: 'custom-react-architectures-vs-legacy-cms',
    category: 'WEBSITE DEVELOPMENT',
    author: 'Lead Web Engineer',
    readTime: '4 min read',
    publishedAt: '2026-07-28',
    featured: false,
    excerpt:
      'Speed, security, and tailored component design give modern businesses a decisive competitive edge over monolithic website builders.',
    content: `Speed and custom experience define modern web authority. React single-page applications deliver instant navigation and seamless user journeys.`,
    featuredImage:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
  },
];

const BlogPostDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await blogService.getBlogBySlug(slug);
      const data = res?.data || res || null;
      if (data) {
        setBlog(data);
      } else {
        const matched = DEFAULT_BLOG_POSTS.find((b) => b.slug === slug);
        setBlog(matched || DEFAULT_BLOG_POSTS[0]);
      }
    } catch (err) {
      console.warn('Backend unavailable, falling back to default article:', err);
      const matched = DEFAULT_BLOG_POSTS.find((b) => b.slug === slug);
      setBlog(matched || DEFAULT_BLOG_POSTS[0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchBlogDetail();
    }
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20">
        <LoadingSpinner message="Loading article content..." />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen py-20 px-4">
        <ErrorMessage
          title="Article Not Found"
          message={error || 'The requested blog post could not be found.'}
        />
        <div className="text-center mt-6">
          <Link
            to="/blog"
            className="btn-gold inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs uppercase font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Blogs</span>
          </Link>
        </div>
      </div>
    );
  }

  const seoTitle = blog.seo?.metaTitle || blog.title;
  const seoDesc = blog.seo?.metaDescription || blog.excerpt || blog.title;
  const seoKeywords = blog.seo?.keywords || blog.tags || [];

  return (
    <>
      <Seo title={seoTitle} description={seoDesc} keywords={seoKeywords} />

      <article className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>

        {/* Article Header */}
        <header className="space-y-6 mb-10">
          <div className="flex flex-wrap items-center gap-3">
            {blog.category && (
              <span className="px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
                {blog.category}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            {blog.title}
          </h1>

          {/* Meta bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-white/10 text-xs text-gray-400">
            <div className="flex flex-wrap items-center gap-6">
              {blog.author && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-white font-semibold block">{blog.author}</span>
                    {blog.authorRole && (
                      <span className="text-gray-400 text-[10px] block">{blog.authorRole}</span>
                    )}
                  </div>
                </div>
              )}

              {blog.publishedAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                </div>
              )}

              {blog.readTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>{blog.readTime}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Article</span>
                </>
              )}
            </button>
          </div>
        </header>

        <div className="mb-12 rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 h-64 sm:h-96">
          <ImageWithFallback
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-full object-cover"
            fallbackText={blog.category || 'Article Image'}
          />
        </div>

        {/* Body Content */}
        <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-base sm:text-lg space-y-6">
          {blog.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="whitespace-pre-line leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mr-2">
              Tags:
            </span>
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-md bg-white/5 text-gray-300 text-xs font-medium border border-white/5"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Author Box */}
        {blog.author && (
          <div className="mt-12 bg-[#1b1b1b] border border-white/10 rounded-2xl p-6 flex items-start gap-4 glass-card">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-base shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">{blog.author}</h4>
              {blog.authorRole && (
                <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  {blog.authorRole}
                </p>
              )}
              <p className="text-gray-400 text-xs sm:text-sm">
                Industry specialist at JM Creations providing data-driven insights and enterprise strategy recommendations.
              </p>
            </div>
          </div>
        )}

        {/* Next CTA */}
        <div className="mt-16 text-center pt-8 border-t border-white/10 space-y-4">
          <h3 className="text-2xl font-bold text-white">Ready to Put Strategy into Action?</h3>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Contact our consulting team for a personalized growth roadmap tailored for your business.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="btn-gold inline-flex items-center gap-2 px-8 py-3 rounded-lg text-xs uppercase font-bold tracking-wider"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogPostDetail;
