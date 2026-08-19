import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  Eye,
  X,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import serviceService from '../services/serviceService';
import Seo from '../components/common/Seo';
import ImageWithFallback from '../components/common/ImageWithFallback';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

import whatsappMarketingImg from '../assets/whatsapp-marketing.jpg';
import ecommerceDevImg from '../assets/ecommerce-development.jpg';

/**
 * Individual Service Card Component
 * Maintains independent state for grayscale-to-color reveal on hover / tap / click.
 */
const ServiceCard = ({ service, index, onOpenModal }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isColorRevealed, setIsColorRevealed] = useState(false);

  // Active color state: true when hovered or explicitly tapped/clicked
  const isColor = isHovered || isColorRevealed;

  // Format index e.g., 01, 02
  const formattedIndex = String(index + 1).padStart(2, '0');

  const handleCardClick = (e) => {
    // Prevent triggering toggle if user clicked an explicit button/link inside card
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    setIsColorRevealed((prev) => !prev);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsColorRevealed((prev) => !prev);
    }
  };

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={`Service: ${service.title}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative bg-[#121212] border border-white/10 hover:border-[#D4AF37]/50 rounded-xl overflow-hidden transition-all duration-500 flex flex-col justify-between cursor-pointer select-none ${
        isColor ? 'border-[#D4AF37]/40 shadow-xl shadow-[#D4AF37]/5' : ''
      }`}
    >
      <div>
        {/* Card Media Container */}
        <div className="relative h-60 w-full bg-[#0a0a0a] overflow-hidden">
          <div
            className="w-full h-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              filter: isColor ? 'grayscale(0%) brightness(1.02)' : 'grayscale(100%) brightness(0.85)',
              transform: isColor ? 'scale(1.04)' : 'scale(1.0)',
            }}
          >
            <ImageWithFallback
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover"
              fallbackIcon={Briefcase}
              fallbackText={service.category}
            />
          </div>

          {/* Color State / Tap Indicator */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase border border-[#D4AF37]/30 flex items-center gap-1.5 pointer-events-none">
            <span className={`w-1.5 h-1.5 rounded-full ${isColor ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
            <span>{isColor ? 'COLOR REVEALED' : 'HOVER / TAP FOR COLOR'}</span>
          </div>

          {/* Index Number Badge */}
          <div className="absolute top-3 right-3 px-3 py-1 rounded bg-black/80 backdrop-blur-md font-mono text-xs font-bold text-gray-300 border border-white/10 group-hover:border-[#D4AF37]/50 group-hover:text-[#D4AF37] transition-colors pointer-events-none">
            [{formattedIndex}]
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#D4AF37] uppercase">
              {service.category}
            </span>
          </div>

          <h3 className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
            isColor ? 'text-white' : 'text-gray-100 group-hover:text-white'
          }`}>
            {service.title}
          </h3>

          <p className="text-gray-400 text-xs sm:text-sm line-clamp-3 leading-relaxed font-light">
            {service.description}
          </p>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-6 pt-0 border-t border-white/5 mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal(service);
          }}
          className="text-xs font-semibold text-gray-300 hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 py-1"
        >
          <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>View Details</span>
        </button>

        <Link
          to={`/contact?service=${encodeURIComponent(service.title)}`}
          onClick={(e) => e.stopPropagation()}
          className="text-xs uppercase font-bold tracking-wider text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors group/link"
        >
          <span>Inquire</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] transform group-hover:translate-x-1.5 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeServiceModal, setActiveServiceModal] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await serviceService.getServices();

      // Parse API response safely without fallback static sources
      let backendData = [];
      if (Array.isArray(response)) {
        backendData = response;
      } else if (Array.isArray(response?.data)) {
        backendData = response.data;
      } else if (Array.isArray(response?.data?.data)) {
        backendData = response.data.data;
      } else if (Array.isArray(response?.data?.services)) {
        backendData = response.data.services;
      } else if (Array.isArray(response?.services)) {
        backendData = response.services;
      }

      // Filter active services for public page
      const activeServices = backendData
        .filter((service) => {
          if (typeof service.isActive === 'boolean') {
            return service.isActive;
          }
          if (service.status) {
            return service.status.toLowerCase() !== 'inactive';
          }
          return true;
        })
        .map((service) => {
          let resolvedImage = service.image;
          const lowerTitle = (service.title || '').toLowerCase();

          // Resolve invalid search/webpage URLs or missing image URLs for key services
          if (!resolvedImage || resolvedImage.includes('bing.com') || resolvedImage.includes('search') || resolvedImage.trim() === '') {
            if (lowerTitle.includes('digital marketing')) {
              resolvedImage = 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80';
            } else if (lowerTitle.includes('whatsapp')) {
              resolvedImage = whatsappMarketingImg;
            } else if (lowerTitle.includes('e-commerce') || lowerTitle.includes('ecommerce')) {
              resolvedImage = ecommerceDevImg;
            }
          }

          // Ensure WhatsApp Marketing uses high-res local asset
          if (lowerTitle.includes('whatsapp')) {
            resolvedImage = whatsappMarketingImg || resolvedImage;
          }

          // Ensure E-commerce Website Development uses high-res local asset
          if (lowerTitle.includes('e-commerce') || lowerTitle.includes('ecommerce')) {
            resolvedImage = ecommerceDevImg || resolvedImage;
          }

          // Ensure Digital Marketing uses high-res image
          if (lowerTitle === 'digital marketing' && (!resolvedImage || resolvedImage.includes('bing.com'))) {
            resolvedImage = 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80';
          }

          return {
            ...service,
            id: service._id || service.id || service.slug || service.title,
            title: service.title || '',
            description: service.description || '',
            category: (service.category || 'General').toUpperCase(),
            image: resolvedImage || '',
            status: service.status || 'active',
            alt: service.alt || `${service.title || 'Service'} by JM Creations`,
          };
        });

      setServices(activeServices);
    } catch (err) {
      console.error('Failed to load services:', err);
      setServices([]);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Unable to load services. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Derive unique categories dynamically from API loaded services
  const categories = [
    'ALL',
    ...Array.from(new Set(services.map((s) => s.category).filter(Boolean))),
  ];

  // Filter services by category and search query
  const filteredServices = services.filter((service) => {
    const matchesCategory =
      selectedCategory === 'ALL' ||
      service.category.toUpperCase() === selectedCategory.toUpperCase();

    const matchesSearch =
      !searchQuery.trim() ||
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Seo
        title="Services — Digital Strategy, Design & Growth Solutions | JM Creations"
        description="Explore our full range of business consulting, brand identity, web development, digital marketing, and media production services at JM Creations."
      />

      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        {/* Editorial Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-[11px] font-mono tracking-[0.25em] uppercase font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>OUR SERVICES</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            EXCELLENCE IN <span className="text-gradient-gold">EVERY DETAIL</span>
          </h1>

          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto opacity-70" />

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed font-light max-w-2xl mx-auto">
            From strategic consulting and visual branding to high-performance engineering and multi-channel scale, we shape market leadership.
          </p>
        </div>

        {/* Minimal Search & Filter Controls */}
        {!loading && !error && services.length > 0 && (
          <div className="space-y-8">
            {/* Search Field & Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
              {/* Minimal Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Status Badge */}
              <div className="text-xs font-mono text-gray-400">
                DISPLAYING <span className="text-[#D4AF37] font-bold">{filteredServices.length}</span> OF {services.length} SERVICES
              </div>
            </div>

            {/* Category Navigation Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono tracking-wider whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-bold border border-[#D4AF37]/40 shadow-sm'
                      : 'bg-[#121212] text-gray-400 hover:bg-white/5 hover:text-white border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Section */}
        {loading ? (
          <LoadingSpinner message="Fetching service directory from database..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchServices} />
        ) : filteredServices.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title={services.length === 0 ? 'No Services Available' : 'No Services Found'}
            message={
              services.length === 0
                ? 'Check back soon for our updated service offerings.'
                : 'No services match your current search or category filter.'
            }
          />
        ) : (
          /* Service Cards Grid (3 Columns Desktop, 2 Tablet, 1 Mobile) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <ServiceCard
                key={service.id || service._id}
                service={service}
                index={index}
                onOpenModal={setActiveServiceModal}
              />
            ))}
          </div>
        )}

        {/* Service Detail Modal */}
        {activeServiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-[#141414] border border-white/10 rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setActiveServiceModal(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Full Color Image in Modal */}
              {activeServiceModal.image && (
                <div className="h-64 sm:h-72 w-full rounded-xl overflow-hidden bg-neutral-900">
                  <ImageWithFallback
                    src={activeServiceModal.image}
                    alt={activeServiceModal.title}
                    className="w-full h-full object-cover"
                    fallbackIcon={Briefcase}
                    fallbackText={activeServiceModal.category}
                  />
                </div>
              )}

              <div className="space-y-3">
                <span className="inline-block px-3 py-1 rounded bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-mono tracking-widest uppercase border border-[#D4AF37]/20">
                  {activeServiceModal.category}
                </span>

                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {activeServiceModal.title}
                </h2>

                <p className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line font-light">
                  {activeServiceModal.description}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs text-gray-300 font-medium">Ready to discuss this solution for your business?</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                <button
                  onClick={() => setActiveServiceModal(null)}
                  className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold transition-colors"
                >
                  Close
                </button>

                <Link
                  to={`/contact?service=${encodeURIComponent(activeServiceModal.title)}`}
                  className="btn-gold px-6 py-2.5 rounded-lg text-xs uppercase font-bold tracking-wider flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Inquire About This Service</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Services;