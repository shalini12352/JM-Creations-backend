import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Users,
  Award,
  Layers,
  Star,
  Calendar,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';
import siteContentService from '../services/siteContentService';
import serviceService from '../services/serviceService';
import portfolioService from '../services/portfolioService';
import blogService from '../services/blogService';
import testimonialService from '../services/testimonialService';
import Seo from '../components/common/Seo';

const Home = () => {
  const [siteContent, setSiteContent] = useState(null);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    // 1. Fetch Site Content
    siteContentService
      .getSiteContent()
      .then((res) => {
        if (res?.data) setSiteContent(res.data);
      })
      .catch(() => {});

    // 2. Fetch Services Preview
    serviceService
      .getServices()
      .then((res) => {
        const data = res?.data || res || [];
        if (Array.isArray(data)) {
          setServices(data.filter((s) => s.status !== 'inactive').slice(0, 6));
        }
      })
      .catch(() => {});

    // 3. Fetch Portfolio Preview
    portfolioService
      .getPortfolio()
      .then((res) => {
        const data = res?.data || res || [];
        if (Array.isArray(data)) {
          setPortfolio(data.filter((p) => p.status !== 'inactive').slice(0, 3));
        }
      })
      .catch(() => {});

    // 4. Fetch Blogs Preview
    blogService
      .getBlogs({ status: 'published' })
      .then((res) => {
        const data = res?.data || res || [];
        if (Array.isArray(data)) {
          setBlogs(data.slice(0, 3));
        }
      })
      .catch(() => {});

    // 5. Fetch Testimonials Preview
    testimonialService
      .getTestimonials()
      .then((res) => {
        const data = res?.data || res || [];
        if (Array.isArray(data)) {
          setTestimonials(data.filter((t) => t.status !== 'inactive').slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  const heroTitle = siteContent?.heroTitle || 'End-to-End Business & Digital Agency Solutions';
  const heroSubtitle = siteContent?.heroSubtitle || 'Innovate • Elevate • Accelerate';
  const heroDesc =
    siteContent?.heroDescription ||
    'JM Creations delivers complete business consulting, high-performance web engineering, result-driven digital ad marketing, and full-spectrum brand identity solutions.';
  const heroCtaText = siteContent?.heroButtonText || 'Explore Solutions';
  const heroCtaLink = siteContent?.heroButtonLink || '/services';

  return (
    <>
      <Seo
        title={siteContent?.companyTagline || 'JM Creations — Premier Corporate Business Agency'}
        description={siteContent?.companyDescription || heroDesc}
      />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider shadow-inner">
                <Sparkles className="w-4 h-4" />
                <span>{heroSubtitle}</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-none">
                <span className="block">{heroTitle.split(' ')[0]}</span>
                <span className="text-gradient-gold">
                  {heroTitle.split(' ').slice(1).join(' ')}
                </span>
              </h1>

              <p className="text-gray-300 text-base sm:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {heroDesc}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to={heroCtaLink}
                  className="btn-gold px-8 py-4 rounded-xl text-xs uppercase font-bold tracking-wider flex items-center gap-3 shadow-xl w-full sm:w-auto justify-center"
                >
                  <span>{heroCtaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/contact"
                  className="btn-outline-gold px-8 py-4 rounded-xl text-xs uppercase font-bold tracking-wider w-full sm:w-auto text-center"
                >
                  Request Consultation
                </Link>
              </div>

              {/* Trust Metrics */}
              <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <h4 className="text-2xl sm:text-3xl font-bold text-white font-['Hanken_Grotesk']">
                    20+
                  </h4>
                  <p className="text-xs text-gray-400 font-medium">Core Services</p>
                </div>
                <div>
                  <h4 className="text-2xl sm:text-3xl font-bold text-amber-400 font-['Hanken_Grotesk']">
                    100%
                  </h4>
                  <p className="text-xs text-gray-400 font-medium">Client Commitment</p>
                </div>
                <div>
                  <h4 className="text-2xl sm:text-3xl font-bold text-white font-['Hanken_Grotesk']">
                    End-to-End
                  </h4>
                  <p className="text-xs text-gray-400 font-medium">Execution Support</p>
                </div>
              </div>
            </div>

            {/* Right Visual Graphic Area */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Card Frame */}
                <div className="bg-[#1b1b1b] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl glass-card space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                        JM
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-sm">Strategic Excellence</h3>
                        <p className="text-xs text-amber-400">Enterprise Agency</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                      Verified
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    {[
                      'Strategic Startup & Business Consulting',
                      'High-Converting Web & E-commerce Engineering',
                      'Performance Digital Marketing & Meta/Google Ads',
                      'Brand Identity, Logo Design & Visual Media',
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                    <p className="text-xs text-amber-300 font-semibold mb-2">
                      Ready to propel your business growth?
                    </p>
                    <a
                      href="https://wa.me/919042986355"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 text-xs text-white font-bold hover:underline"
                    >
                      <MessageSquare className="w-4 h-4 text-amber-400" />
                      <span>Chat Directly on WhatsApp (+91 90429 86355)</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-20 bg-[#0e0e0e] border-y border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold text-amber-400 uppercase tracking-widest font-['Hanken_Grotesk']">
              Why Partner With Us
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-white">
              Built for Scale, Driven by <span className="text-gradient-gold">Measurable Results</span>
            </h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              We bridge strategy, creative design, engineering, and digital marketing under one unified execution banner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1b1b1b] border border-white/10 rounded-2xl p-8 space-y-4 glass-card-hover">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white">Growth Acceleration</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Data-backed SEO campaigns, meta advertisements, and lead generation funnels designed to deliver immediate ROI.
              </p>
            </div>

            <div className="bg-[#1b1b1b] border border-white/10 rounded-2xl p-8 space-y-4 glass-card-hover">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white">Enterprise Reliability</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Clean software architecture, bulletproof security standards, and responsive designs that look flawless across all devices.
              </p>
            </div>

            <div className="bg-[#1b1b1b] border border-white/10 rounded-2xl p-8 space-y-4 glass-card-hover">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white">End-to-End Lifecycle</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                From business registration and startup support to high-end video production, graphic design, and event branding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-xs font-bold text-amber-400 uppercase tracking-widest font-['Hanken_Grotesk'] mb-2">
              Solutions Directory
            </h2>
            <h3 className="text-3xl font-bold text-white">
              Specialized <span className="text-gradient-gold">Services</span>
            </h3>
          </div>
          <Link
            to="/services"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
          >
            <span>View All 20+ Services</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service._id || service.title}
                className="bg-[#1b1b1b] border border-white/10 rounded-xl p-6 glass-card-hover flex flex-col justify-between group"
              >
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-4 border border-amber-500/20">
                    {service.category || 'Service'}
                  </span>
                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {service.title}
                  </h4>
                  <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                  <Link
                    to="/services"
                    className="text-xs font-bold text-amber-400 flex items-center gap-1"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#1b1b1b] border border-white/10 rounded-xl p-8 text-center text-gray-400">
            <p>Connect backend API to populate services directory.</p>
          </div>
        )}
      </section>

      {/* PORTFOLIO PREVIEW */}
      {portfolio.length > 0 && (
        <section className="py-20 bg-[#0e0e0e] border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
              <div>
                <h2 className="text-xs font-bold text-amber-400 uppercase tracking-widest font-['Hanken_Grotesk'] mb-2">
                  Proven Case Studies
                </h2>
                <h3 className="text-3xl font-bold text-white">
                  Featured <span className="text-gradient-gold">Projects</span>
                </h3>
              </div>
              <Link
                to="/portfolio"
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
              >
                <span>Browse Full Portfolio</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {portfolio.map((proj) => (
                <div
                  key={proj._id || proj.title}
                  className="bg-[#1b1b1b] border border-white/10 rounded-xl overflow-hidden glass-card-hover group"
                >
                  <div className="h-48 bg-neutral-900 overflow-hidden">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs text-amber-400 font-semibold block mb-1">
                      {proj.category}
                    </span>
                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                      {proj.title}
                    </h4>
                    <p className="text-gray-400 text-xs line-clamp-2">{proj.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS PREVIEW */}
      {testimonials.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-amber-400 uppercase tracking-widest font-['Hanken_Grotesk'] mb-2">
              Client Feedback
            </h2>
            <h3 className="text-3xl font-bold text-white">
              Trusted By Industry Leaders
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t._id || t.clientName}
                className="bg-[#1b1b1b] border border-white/10 rounded-xl p-6 glass-card space-y-4"
              >
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (t.rating || 5) ? 'fill-amber-400' : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-300 text-xs italic leading-relaxed">
                  "{t.review}"
                </p>
                <div className="pt-2 border-t border-white/5">
                  <h5 className="text-sm font-bold text-white">{t.clientName}</h5>
                  <p className="text-[11px] text-gray-400">
                    {t.designation} {t.company ? `(${t.company})` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* BLOG PREVIEW */}
      {blogs.length > 0 && (
        <section className="py-20 bg-[#0e0e0e] border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
              <div>
                <h2 className="text-xs font-bold text-amber-400 uppercase tracking-widest font-['Hanken_Grotesk'] mb-2">
                  Knowledge Hub
                </h2>
                <h3 className="text-3xl font-bold text-white">
                  Latest <span className="text-gradient-gold">Insights</span>
                </h3>
              </div>
              <Link
                to="/blog"
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
              >
                <span>Read All Articles</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.map((b) => (
                <div
                  key={b._id || b.slug}
                  className="bg-[#1b1b1b] border border-white/10 rounded-xl overflow-hidden glass-card-hover flex flex-col justify-between"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-3">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span>
                        {b.publishedAt ? new Date(b.publishedAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2 hover:text-amber-400 transition-colors line-clamp-2">
                      <Link to={`/blog/${b.slug}`}>{b.title}</Link>
                    </h4>
                    <p className="text-gray-400 text-xs line-clamp-3 leading-relaxed">
                      {b.excerpt || b.content?.substring(0, 100)}
                    </p>
                  </div>
                  <div className="p-6 pt-0">
                    <Link
                      to={`/blog/${b.slug}`}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BOTTOM CONVERSION CTA */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500/10 via-[#1b1b1b] to-amber-500/10 border border-amber-500/20 rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden glass-card">
          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to Accelerate Your Enterprise Growth?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Schedule a strategy call with JM Creations today. Let’s create a tailored plan for your website, branding, and marketing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/contact"
                className="btn-gold px-8 py-3.5 rounded-xl text-xs uppercase font-bold tracking-wider w-full sm:w-auto"
              >
                Schedule Official Enquiry
              </Link>
              <a
                href="https://wa.me/919042986355"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold px-8 py-3.5 rounded-xl text-xs uppercase font-bold tracking-wider w-full sm:w-auto"
              >
                WhatsApp +91 90429 86355
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
