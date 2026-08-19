import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  Clock,
  ArrowUp,
} from 'lucide-react';
import siteContentService from '../../services/siteContentService';
import officialLogo from '../../assets/jm-creations-official-logo.png';

const Footer = () => {
  const [siteContent, setSiteContent] = useState(null);

  useEffect(() => {
    siteContentService
      .getSiteContent()
      .then((res) => {
        if (res?.data) {
          setSiteContent(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const email = siteContent?.email || 'jmcreationinfo@gmail.com';
  const rawPhone = siteContent?.phone;
  const phone = (rawPhone && !rawPhone.includes('555')) ? rawPhone : '+91 90429 86355';
  const description =
    siteContent?.footerDescription ||
    siteContent?.companyDescription ||
    'JM Creations is a premier corporate agency providing Business Consulting, Branding, Website Development, and Performance Marketing.';

  const servicesList = [
    'Website Design & Development',
    'E-commerce Development',
    'Digital Marketing & Meta Ads',
    'Google Ads & Search Optimization',
    'Brand Identity & Graphic Design',
    'Business & Startup Consulting',
    'WhatsApp & Email Campaigns',
  ];

  return (
    <footer className="bg-[#0B0B0B] border-t border-white/10 text-gray-400 pt-16 pb-8 relative overflow-hidden">
      {/* Background glow element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#EAB308]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="p-2.5 bg-[#EAB308] rounded-2xl shadow-xl shadow-[#EAB308]/20 transition-transform group-hover:scale-105">
                <img
                  src={officialLogo}
                  alt="JM Creations - End-to-End Business Solutions"
                  className="h-16 sm:h-20 w-auto object-contain rounded-xl"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-tight font-['Outfit',sans-serif] group-hover:text-[#FFD165] transition-colors leading-none">
                  JMCreations
                </span>
                <span className="text-xs text-[#FFD165] tracking-widest uppercase font-extrabold mt-1">
                  End-to-End Business Solutions
                </span>
              </div>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed">{description}</p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {siteContent?.instagram && (
                <a
                  href={siteContent.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-lg bg-[#151515] hover:bg-[#EAB308]/20 text-[#FFD165] flex items-center justify-center transition-colors border border-white/10 hover:border-[#EAB308]/40"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              {siteContent?.facebook && (
                <a
                  href={siteContent.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-lg bg-[#151515] hover:bg-[#EAB308]/20 text-[#FFD165] flex items-center justify-center transition-colors border border-white/10 hover:border-[#EAB308]/40"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                  </svg>
                </a>
              )}
              {siteContent?.linkedin && (
                <a
                  href={siteContent.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-lg bg-[#151515] hover:bg-[#EAB308]/20 text-[#FFD165] flex items-center justify-center transition-colors border border-white/10 hover:border-[#EAB308]/40"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                  </svg>
                </a>
              )}
              {siteContent?.youtube && (
                <a
                  href={siteContent.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-lg bg-[#151515] hover:bg-[#EAB308]/20 text-[#FFD165] flex items-center justify-center transition-colors border border-white/10 hover:border-[#EAB308]/40"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-[#FFD165] font-semibold text-xs tracking-wider uppercase mb-4 font-['Outfit',sans-serif]">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Home', path: '/' },
                { label: 'About Us', path: '/about' },
                { label: 'Services', path: '/services' },
                { label: 'Portfolio', path: '/portfolio' },
                { label: 'Blogs & Insights', path: '/blog' },
                { label: 'Testimonials', path: '/testimonials' },
                { label: 'Careers', path: '/careers' },
                { label: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="hover:text-[#FFD165] transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-[#EAB308] text-xs">›</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services Directory */}
          <div>
            <h3 className="text-[#FFD165] font-semibold text-xs tracking-wider uppercase mb-4 font-['Outfit',sans-serif]">
              Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              {servicesList.map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="hover:text-[#FFD165] transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-[#EAB308] text-xs">›</span>
                    <span>{service}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info (No Unknown Address) */}
          <div>
            <h3 className="text-[#FFD165] font-semibold text-xs tracking-wider uppercase mb-4 font-['Outfit',sans-serif]">
              Contact Info
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#EAB308] shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-[#FFD165] transition-colors font-medium">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#EAB308] shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-[#FFD165] transition-colors break-all font-medium">
                  {email}
                </a>
              </li>
              {siteContent?.workingHours && (
                <li className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#EAB308] shrink-0 mt-1" />
                  <span>{siteContent.workingHours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-gray-500 text-center md:text-left">
            {siteContent?.copyrightText ||
              `© ${new Date().getFullYear()} JM Creations. All rights reserved. Corporate Excellence.`}
          </p>

          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-[#D4AF37] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/contact" className="hover:text-[#D4AF37] transition-colors">
              Terms of Service
            </Link>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-[#151515] hover:bg-[#D4AF37]/20 text-gray-300 hover:text-[#FFD165] transition-colors border border-white/10 flex items-center gap-1.5"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Back to Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

