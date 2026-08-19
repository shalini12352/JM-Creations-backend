import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Quote, Sparkles, Building2, User } from 'lucide-react';
import testimonialService from '../services/testimonialService';
import Seo from '../components/common/Seo';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await testimonialService.getTestimonials();
      const data = res?.data || res || [];
      const activeItems = Array.isArray(data)
        ? data.filter((t) => t.status !== 'inactive')
        : [];
      setTestimonials(activeItems);
    } catch (err) {
      console.error('Failed to load testimonials:', err);
      setError(err?.message || 'Unable to fetch client testimonials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <>
      <Seo
        title="Testimonials — Client Reviews & Success Stories"
        description="See what founders, directors, and managers say about their experience working with JM Creations."
      />

      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Testimonials Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Trusted Partnerships</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            What Our Clients <span className="text-gradient-gold">Say About Us</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            Real feedback from business owners, executives, and brand leaders who have transformed their digital footprint with JM Creations.
          </p>
        </div>

        {/* Content Render */}
        {loading ? (
          <LoadingSpinner message="Fetching client testimonials from backend..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchTestimonials} />
        ) : testimonials.length === 0 ? (
          <EmptyState
            icon={Quote}
            title="No Testimonials Available"
            message="Client reviews will appear here once loaded into the backend."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t._id || t.clientName}
                className="bg-[#1b1b1b] border border-white/10 rounded-2xl p-8 glass-card-hover flex flex-col justify-between relative group"
              >
                <Quote className="w-10 h-10 text-amber-500/20 absolute top-6 right-6 group-hover:text-amber-500/30 transition-colors" />

                <div className="space-y-4">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`w-4 h-4 ${
                          index < (t.rating || 5)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-300 text-sm sm:text-base italic leading-relaxed">
                    "{t.review}"
                  </p>
                </div>

                {/* Client Metadata */}
                <div className="pt-6 mt-6 border-t border-white/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center font-bold text-base overflow-hidden shrink-0 shadow-lg">
                    {t.image ? (
                      <img
                        src={t.image}
                        alt={t.clientName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <User className="w-6 h-6 text-black" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      {t.clientName}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {t.designation || 'Client'}
                      {t.company ? ` at ${t.company}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-20 bg-[#1b1b1b] border border-white/10 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden glass-card">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-white">
              Ready to Join Our Success Stories?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Let us elevate your brand identity, engineer your web platform, and accelerate your customer acquisition.
            </p>
            <div className="pt-2">
              <Link
                to="/contact"
                className="btn-gold inline-flex items-center gap-2 px-8 py-3 rounded-lg text-xs uppercase font-bold tracking-wider"
              >
                <span>Partner With Us</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Testimonials;
