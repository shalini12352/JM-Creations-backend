import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  Eye,
  Award,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import siteContentService from '../services/siteContentService';
import Seo from '../components/common/Seo';

const About = () => {
  const [siteContent, setSiteContent] = useState(null);

  useEffect(() => {
    siteContentService
      .getSiteContent()
      .then((res) => {
        if (res?.data) setSiteContent(res.data);
      })
      .catch(() => {});
  }, []);

  const companyName = siteContent?.companyName || 'JM Creations';
  const tagline = siteContent?.companyTagline || 'End-to-End Corporate Solutions';
  const aboutTitle = siteContent?.aboutTitle || 'Transforming Ambition Into Market Leadership';
  const aboutDesc =
    siteContent?.aboutDescription ||
    siteContent?.companyDescription ||
    'JM Creations is an integrated business solutions agency committed to driving rapid, sustainable growth for startups and established enterprises. We bring together business strategy consulting, high-performance web engineering, branding, digital marketing, and event solutions under one cohesive banner.';

  const mission =
    siteContent?.mission ||
    'To empower businesses by engineering world-class web platforms, crafting compelling brand identities, and executing data-driven digital ad campaigns that maximize ROI and market influence.';

  const vision =
    siteContent?.vision ||
    'To be the preferred end-to-end partner for businesses globally, recognized for innovative solution architecture, technical excellence, and unyielding client commitment.';

  return (
    <>
      <Seo
        title="About Us — Corporate Overview & Vision"
        description={`Learn about ${companyName}' story, mission, and vision. We provide business consulting, website engineering, digital marketing, and visual branding.`}
      />

      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Corporate Overview</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            About <span className="text-gradient-gold">{companyName}</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            {tagline}
          </p>
        </div>

        {/* Story / About Block */}
        <div className="bg-[#1b1b1b] border border-white/10 rounded-3xl p-8 sm:p-12 glass-card grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-['Hanken_Grotesk']">
              Our Legacy & Purpose
            </span>
            <h2 className="text-3xl font-bold text-white leading-snug">
              {aboutTitle}
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {aboutDesc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-200">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <span>100% Quality-Driven Execution</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-200">
                <Building2 className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Full Startup Lifecycle Support</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="bg-[#131313] border border-white/10 rounded-2xl p-8 space-y-6 shadow-2xl text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-2xl mx-auto border border-amber-500/30">
                JM
              </div>
              <h3 className="text-xl font-bold text-white">Engineering Excellence</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Combining technical precision with creative flair to deliver tailored business outcomes.
              </p>
              <div className="pt-2">
                <Link
                  to="/contact"
                  className="btn-gold inline-block w-full py-3 rounded-xl text-xs uppercase font-bold tracking-wider"
                >
                  Work With Us
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="bg-[#1b1b1b] border border-white/10 rounded-2xl p-8 space-y-4 glass-card-hover relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Our Mission</h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {mission}
            </p>
          </div>

          {/* Vision */}
          <div className="bg-[#1b1b1b] border border-white/10 rounded-2xl p-8 space-y-4 glass-card-hover relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Our Vision</h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {vision}
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold text-amber-400 uppercase tracking-widest font-['Hanken_Grotesk']">
              Core Pillars
            </h2>
            <h3 className="text-3xl font-bold text-white">What Sets Us Apart</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Strategic Insight',
                desc: 'Tailored consulting for business registration, operations, and scaling.',
                icon: Award,
              },
              {
                title: 'Modern Tech Stack',
                desc: 'Performant web and e-commerce platforms engineered for conversion.',
                icon: ShieldCheck,
              },
              {
                title: 'Digital Reach',
                desc: 'Targeted Google & Meta ad campaigns with full conversion analytics.',
                icon: Users,
              },
              {
                title: 'End-to-End Media',
                desc: 'Graphic design, video editing, photo shoots, and event printing solutions.',
                icon: Sparkles,
              },
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#1b1b1b] border border-white/10 rounded-xl p-6 space-y-3 glass-card"
                >
                  <Icon className="w-8 h-8 text-amber-400" />
                  <h4 className="text-lg font-bold text-white">{pillar.title}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-amber-500/10 via-[#1b1b1b] to-amber-500/10 border border-amber-500/20 rounded-3xl p-8 sm:p-12 text-center glass-card">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-white">
              Ready to Work With JM Creations?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Reach out today to discuss your project requirements with our experts.
            </p>
            <div className="pt-2">
              <Link
                to="/contact"
                className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs uppercase font-bold tracking-wider"
              >
                <span>Contact Our Team</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
