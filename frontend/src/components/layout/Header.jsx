import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, PhoneCall, ArrowRight } from 'lucide-react';
import siteContentService from '../../services/siteContentService';
import officialLogo from '../../assets/jm-creations-official-logo.png';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [siteContent, setSiteContent] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Blog', path: '/blog' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' },
  ];

  const rawPhone = siteContent?.whatsapp || siteContent?.phone;
  const whatsappPhone = (rawPhone && !rawPhone.includes('555')) ? rawPhone : '+91 90429 86355';
  const cleanPhone = whatsappPhone.replace(/[^0-9]/g, '') || '919042986355';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B0B0B]/95 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl'
          : 'bg-[#0B0B0B]/80 backdrop-blur-sm border-b border-white/5 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand Title - Title MUST remain 100% White */}
          <Link to="/" className="flex items-center gap-3.5 group shrink-0">
            <div className="p-1.5 sm:p-2 bg-[#EAB308] rounded-xl shadow-lg shadow-[#EAB308]/20 transition-transform group-hover:scale-105">
              <img
                src={officialLogo}
                alt="JM Creations - End-to-End Business Solutions"
                className="h-10 sm:h-12 w-auto object-contain rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Outfit',sans-serif] leading-none">
                JMCreations
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#FFD165] tracking-widest uppercase font-extrabold mt-1">
                End-to-End Business Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative ${
                    isActive
                      ? 'text-[#FFD165] bg-[#EAB308]/10 font-semibold'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#EAB308] rounded-full shadow-[0_0_8px_#EAB308]"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 text-gray-300 hover:text-[#FFD165] hover:bg-[#EAB308]/10 rounded-lg transition-colors border border-transparent hover:border-[#EAB308]/20"
              title="Chat on WhatsApp (+91 90429 86355)"
            >
              <PhoneCall className="w-4 h-4 text-[#EAB308]" />
            </a>

            <Link
              to="/contact"
              className="btn-gold px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase font-bold flex items-center gap-2"
            >
              <span>ENQUIRE NOW</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 text-gray-300 hover:text-white rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#EAB308]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#111111] border-b border-white/10 px-4 pt-4 pb-6 mt-3 space-y-2 animate-fade-in">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-3 text-base font-medium rounded-lg transition-colors flex items-center justify-between ${
                    isActive
                      ? 'text-[#FFD165] bg-[#EAB308]/10 font-semibold border border-[#EAB308]/20'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#EAB308]"></span>}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-lg bg-[#151515] text-[#FFD165] border border-[#EAB308]/30 text-sm font-semibold hover:bg-[#1A1A1A] transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-[#EAB308]" />
              <span>WhatsApp +91 90429 86355</span>
            </a>

            <Link
              to="/contact"
              className="btn-gold py-3 rounded-lg text-center text-xs tracking-wider uppercase font-bold"
            >
              ENQUIRE NOW
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

