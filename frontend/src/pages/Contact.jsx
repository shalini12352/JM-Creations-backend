import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import enquiryService from '../services/enquiryService';
import siteContentService from '../services/siteContentService';
import Seo from '../components/common/Seo';

const Contact = () => {
  const [siteContent, setSiteContent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    if (!formData.service.trim()) errors.service = 'Please select a service';
    if (!formData.message.trim()) errors.message = 'Please enter your message';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitSuccess(false);
    setSubmitError('');

    if (!validate()) return;

    try {
      setSubmitting(true);
      await enquiryService.createEnquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        service: formData.service.trim(),
        message: formData.message.trim(),
      });

      setSubmitSuccess(true);
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      setFieldErrors({});
    } catch (err) {
      console.error('Enquiry submission failed:', err);
      setSubmitError(
        err?.message || 'Failed to submit enquiry. Please try again or contact us directly via WhatsApp.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const email = siteContent?.email || 'jmcreationinfo@gmail.com';
  const rawPhone = siteContent?.phone;
  const phone = (rawPhone && !rawPhone.includes('555')) ? rawPhone : '+91 90429 86355';
  const altPhone = siteContent?.alternatePhone || '';

  const serviceOptions = [
    'Business & Startup Consulting',
    'Website Design & Development',
    'E-commerce Website Development',
    'Digital Marketing & Meta Ads',
    'Google Ads & Search Engine Optimization (SEO)',
    'Brand Identity & Logo Design',
    'Graphic Design & Video Editing',
    'Product Photography',
    'WhatsApp & Email Marketing',
    'Lead Generation & Influencer Marketing',
    'Printing Solutions & Event Branding',
    'Business Registration & Startup Support',
    'Other Custom Solutions',
  ];

  return (
    <>
      <Seo
        title="Contact Us — Get in Touch"
        description="Connect with JM Creations for business consulting, web development, and digital marketing enquiries. Call +91 90429 86355 or email jmcreationinfo@gmail.com."
      />

      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto selection:bg-[#EAB308] selection:text-black">
        {/* Contact Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 pt-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAB308]/10 border border-[#EAB308]/20 text-[#FFD165] text-xs font-semibold uppercase tracking-wider font-['Outfit',sans-serif]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>High-Priority Consultation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-['Outfit',sans-serif]">
            Let’s Build Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD165] via-[#EAB308] to-[#D4AF37]">Extraordinary</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            Have a project in mind or need expert business guidance? Reach out to our strategy team today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-12">
          {/* Left Column: Direct Contact Channels (No Unknown Address) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1b1b1b] border border-white/10 rounded-2xl p-8 space-y-8 glass-card">
              <h2 className="text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">
                Direct Contact Channels
              </h2>

              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/20 text-[#FFD165] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase font-semibold text-gray-400 tracking-wider font-['Outfit',sans-serif]">
                      Call Us Directly
                    </h3>
                    <a
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                      className="text-base font-bold text-white hover:text-[#FFD165] block mt-1 transition-colors font-['Outfit',sans-serif]"
                    >
                      {phone}
                    </a>
                    {altPhone && (
                      <a
                        href={`tel:${altPhone.replace(/\s+/g, '')}`}
                        className="text-xs text-gray-400 hover:text-[#FFD165] block mt-0.5"
                      >
                        Alt: {altPhone}
                      </a>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/20 text-[#FFD165] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase font-semibold text-gray-400 tracking-wider font-['Outfit',sans-serif]">
                      Email Inquiries
                    </h3>
                    <a
                      href={`mailto:${email}`}
                      className="text-base font-bold text-white hover:text-[#FFD165] block mt-1 transition-colors break-all font-['Outfit',sans-serif]"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                {siteContent?.workingHours && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/20 text-[#FFD165] flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs uppercase font-semibold text-gray-400 tracking-wider font-['Outfit',sans-serif]">
                        Business Hours
                      </h3>
                      <p className="text-sm font-medium text-gray-300 mt-1">
                        {siteContent.workingHours}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Instant WhatsApp CTA */}
              <div className="pt-6 border-t border-white/10">
                <a
                  href={`https://wa.me/919042986355?text=${encodeURIComponent('Hello JM Creations, I would like to inquire about your services.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.02] font-['Outfit',sans-serif]"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Quick WhatsApp Inquiry (+91 90429 86355)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Enquiry Form */}
          <div className="lg:col-span-7 bg-[#1b1b1b] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl relative">
            <h2 className="text-2xl font-bold text-white mb-2 font-['Outfit',sans-serif]">Send Us a Message</h2>
            <p className="text-gray-400 text-sm mb-8">
              Fill out the details below and our solution architect will get back to you within 24 hours.
            </p>

            {submitSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-start gap-3 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Enquiry Submitted Successfully!</h4>
                  <p className="text-emerald-300 text-xs mt-1">
                    Thank you for reaching out. A representative from JM Creations will review your inquiry and contact you shortly.
                  </p>
                </div>
              </div>
            )}

            {submitError && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-2 tracking-wider font-['Outfit',sans-serif]">
                    Full Name <span className="text-[#EAB308]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full bg-[#131313] border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#EAB308] transition-colors ${
                      fieldErrors.name ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                  {fieldErrors.name && (
                    <span className="text-xs text-red-400 mt-1 block">{fieldErrors.name}</span>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-2 tracking-wider font-['Outfit',sans-serif]">
                    Email Address <span className="text-[#EAB308]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. rahul@example.com"
                    className={`w-full bg-[#131313] border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#EAB308] transition-colors ${
                      fieldErrors.email ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                  {fieldErrors.email && (
                    <span className="text-xs text-red-400 mt-1 block">{fieldErrors.email}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-2 tracking-wider font-['Outfit',sans-serif]">
                    Phone Number <span className="text-[#EAB308]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 90429 86355"
                    className={`w-full bg-[#131313] border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#EAB308] transition-colors ${
                      fieldErrors.phone ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                  {fieldErrors.phone && (
                    <span className="text-xs text-red-400 mt-1 block">{fieldErrors.phone}</span>
                  )}
                </div>

                {/* Service Dropdown */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-2 tracking-wider font-['Outfit',sans-serif]">
                    Required Service <span className="text-[#EAB308]">*</span>
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className={`w-full bg-[#131313] border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#EAB308] transition-colors ${
                      fieldErrors.service ? 'border-red-500' : 'border-white/10'
                    }`}
                  >
                    <option value="">-- Select a Service --</option>
                    {serviceOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#1b1b1b] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.service && (
                    <span className="text-xs text-red-400 mt-1 block">{fieldErrors.service}</span>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-300 mb-2 tracking-wider font-['Outfit',sans-serif]">
                  Project Details / Inquiry Message <span className="text-[#EAB308]">*</span>
                </label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your requirements, timeline, budget, or any specific goals..."
                  className={`w-full bg-[#131313] border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#EAB308] transition-colors resize-none ${
                    fieldErrors.message ? 'border-red-500' : 'border-white/10'
                  }`}
                ></textarea>
                {fieldErrors.message && (
                  <span className="text-xs text-red-400 mt-1 block">{fieldErrors.message}</span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-gold py-4 rounded-xl text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 font-['Outfit',sans-serif]"
              >
                {submitting ? (
                  <span>Submitting Inquiry...</span>
                ) : (
                  <>
                    <span>Submit Official Enquiry</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
