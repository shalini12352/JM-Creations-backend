import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Tag,
  ArrowRight,
  FileText,
  Sparkles,
} from 'lucide-react';
import blogService from '../services/blogService';
import Seo from '../components/common/Seo';
import ImageWithFallback from '../components/common/ImageWithFallback';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

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
  {
    _id: 'blog-branding-identity',
    title: 'Building a Luxe Industrial Brand That Commands Market Authority',
    slug: 'luxe-industrial-brand-market-authority',
    category: 'BRANDING',
    author: 'Creative Director',
    readTime: '7 min read',
    publishedAt: '2026-07-15',
    featured: false,
    excerpt:
      'Typography, contrast, dark aesthetic guidelines, and consistent visual positioning establish premium market credibility.',
    content: `Visual brand identity communicates quality before a word of copy is read. Luxe industrial typography and gold accents embody authority and precision.`,
    featuredImage:
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
  },
  {
    _id: 'blog-technical-seo',
    title: 'The 2026 Blueprint for Ranking #1 on Search Engine Results',
    slug: '2026-blueprint-ranking-1-search-engines',
    category: 'SEO',
    author: 'SEO Strategist',
    readTime: '5 min read',
    publishedAt: '2026-07-02',
    featured: false,
    excerpt:
      'Technical site health, schema markup, semantic content structure, and authority link acquisition drive sustainable organic growth.',
    content: `Search engines prioritize speed, mobile ergonomics, and comprehensive topic coverage. Learn how technical SEO audits boost keyword dominance.`,
    featuredImage:
      'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?auto=format&fit=crop&w=800&q=80',
  },
  {
    _id: 'blog-social-media-management',
    title: 'Driving Authentic Social Engagement & Viral Brand Awareness',
    slug: 'driving-authentic-social-engagement-viral-awareness',
    category: 'SOCIAL MEDIA',
    author: 'Social Media Lead',
    readTime: '4 min read',
    publishedAt: '2026-06-20',
    featured: false,
    excerpt:
      'Short-form video reels, active community management, and influencer collaborations spark authentic organic engagement.',
    content: `Organic social reach thrives on consistent value-first video content and community interactions across Instagram, LinkedIn, and YouTube.`,
    featuredImage:
      'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=800&q=80',
  },
];

const Blog = () => {
  const [blogs, setBlogs] = useState(DEFAULT_BLOG_POSTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await blogService.getBlogs({ status: 'published' });
      const data = res?.data || res || [];
      if (Array.isArray(data) && data.length > 0) {
        setBlogs(data);
      } else {
        setBlogs(DEFAULT_BLOG_POSTS);
      }
    } catch (err) {
      console.warn('Backend blog service offline, using primary articles:', err);
      setBlogs(DEFAULT_BLOG_POSTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const categories = [
    'All',
    ...Array.from(new Set(blogs.map((b) => b.category).filter(Boolean))),
  ];

  const filteredBlogs =
    selectedCategory === 'All'
      ? blogs
      : blogs.filter((b) => b.category === selectedCategory);

  const featuredBlog = blogs.find((b) => b.featured) || blogs[0];

  return (
    <>
      <Seo
        title="Blog & Insights — Growth Strategies & Tech Trends"
        description="Read articles, marketing tutorials, and industry insights written by JM Creations specialists."
      />

      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Blog Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Knowledge Base & Articles</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Insights & <span className="text-gradient-gold">Strategic Knowledge</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            Stay ahead of digital trends with expert articles on website engineering, growth marketing, branding, and business strategy.
          </p>
        </div>

        {/* Content Render */}
        {loading ? (
          <LoadingSpinner message="Loading published articles..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchBlogs} />
        ) : blogs.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No Published Articles Yet"
            message="Check back soon for new articles and business insights."
          />
        ) : (
          <div className="space-y-16">
            {/* Featured Article Card */}
            {featuredBlog && selectedCategory === 'All' && (
              <div className="bg-[#1b1b1b] border border-white/10 rounded-2xl overflow-hidden glass-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8">
                <div className="lg:col-span-6 h-64 sm:h-80 w-full rounded-xl overflow-hidden bg-neutral-900">
                  <ImageWithFallback
                    src={featuredBlog.featuredImage}
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    fallbackIcon={FileText}
                    fallbackText={featuredBlog.category || 'Featured Insights'}
                  />
                </div>

                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-amber-500 text-black text-xs font-bold uppercase tracking-wide">
                      Featured Post
                    </span>
                    {featuredBlog.category && (
                      <span className="text-xs text-gray-400">{featuredBlog.category}</span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-white hover:text-amber-400 transition-colors">
                    <Link to={`/blog/${featuredBlog.slug}`}>
                      {featuredBlog.title}
                    </Link>
                  </h2>

                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {featuredBlog.excerpt || featuredBlog.content?.substring(0, 160) + '...'}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-2 border-t border-white/10">
                    {featuredBlog.author && (
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-amber-500" />
                        <span>{featuredBlog.author}</span>
                      </div>
                    )}
                    {featuredBlog.readTime && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span>{featuredBlog.readTime}</span>
                      </div>
                    )}
                    {featuredBlog.publishedAt && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-amber-500" />
                        <span>{new Date(featuredBlog.publishedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <Link
                      to={`/blog/${featuredBlog.slug}`}
                      className="btn-gold inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs uppercase font-bold"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Pills */}
            {categories.length > 1 && (
              <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-amber-500 text-black font-bold'
                        : 'bg-[#1b1b1b] text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog._id || blog.slug}
                  className="bg-[#1b1b1b] border border-white/10 rounded-xl overflow-hidden glass-card-hover flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-48 w-full bg-neutral-900 overflow-hidden">
                      <ImageWithFallback
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        fallbackIcon={FileText}
                        fallbackText={blog.category || 'Article'}
                      />
                      {blog.category && (
                        <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-amber-400 text-xs font-semibold border border-amber-500/20">
                          {blog.category}
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                        {blog.readTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            {blog.readTime}
                          </span>
                        )}
                        {blog.publishedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-amber-500" />
                            {new Date(blog.publishedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
                        <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                      </h3>

                      <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                        {blog.excerpt || blog.content?.substring(0, 120) + '...'}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {blog.author ? `By ${blog.author}` : 'JM Team'}
                    </span>

                    <Link
                      to={`/blog/${blog.slug}`}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Blog;
