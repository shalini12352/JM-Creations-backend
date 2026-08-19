import React, { useState, useEffect } from 'react';
import { Globe, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import siteContentService from '../../services/siteContentService';
import Seo from '../../components/common/Seo';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const AdminSiteContent = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [existsInDb, setExistsInDb] = useState(false);

  const [formData, setFormData] = useState({
    companyName: 'JM Creations',
    companyTagline: 'End-to-End Business Solutions & Digital Agency',
    companyDescription: 'JM Creations provides full-spectrum business consulting, website design & engineering, performance marketing, and branding services.',
    logo: '',
    favicon: '',
    email: 'jmcreationinfo@gmail.com',
    phone: '+91 90429 86355',
    alternatePhone: '',
    address: 'Chennai, Tamil Nadu, India',
    facebook: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    twitter: '',
    whatsapp: '+91 90429 86355',
    workingHours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    location: 'Chennai, Tamil Nadu, India',
    mapUrl: '',
    heroTitle: 'End-to-End Business & Digital Agency Solutions',
    heroSubtitle: 'Innovate • Elevate • Accelerate',
    heroDescription: 'JM Creations delivers complete business consulting, high-performance web engineering, result-driven digital ad marketing, and full-spectrum brand identity solutions.',
    heroButtonText: 'Explore Solutions',
    heroButtonLink: '/services',
    aboutTitle: 'Transforming Ambition Into Market Leadership',
    aboutDescription: 'JM Creations is an integrated business solutions agency committed to driving rapid, sustainable growth for startups and established enterprises.',
    mission: 'To empower businesses by engineering world-class web platforms, crafting compelling brand identities, and executing data-driven digital ad campaigns.',
    vision: 'To be the preferred end-to-end partner for businesses globally, recognized for innovative solution architecture, technical excellence, and unyielding client commitment.',
    footerDescription: 'JM Creations is a premier end-to-end business solutions agency providing Website Development, Digital Marketing, Brand Strategy, and Business Consulting.',
    copyrightText: '© 2026 JM Creations. All rights reserved.',
  });

  const fetchSiteContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await siteContentService.getSiteContent();
      const data = res?.data || res || null;
      if (data && Object.keys(data).length > 0 && data._id) {
        setExistsInDb(true);
        setFormData((prev) => ({
          ...prev,
          ...data,
        }));
      } else {
        setExistsInDb(false);
      }
    } catch (err) {
      console.error('Fetch site content error:', err);
      setError(err?.message || 'Failed to fetch site content.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteContent();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setError(null);

    try {
      if (existsInDb) {
        await siteContentService.updateSiteContent(formData);
      } else {
        await siteContentService.createSiteContent(formData);
        setExistsInDb(true);
      }
      setSuccessMessage('Site content updated successfully!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Update failed:', err);
      setError(err?.message || 'Failed to update site content.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Fetching website content settings..." />;
  }

  return (
    <>
      <Seo title="Admin — Website Content Settings" />

      <div className="space-y-8 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Website Content Settings</h1>
          <p className="text-xs text-gray-400 mt-1">
            Update site-wide branding, contact info, hero headers, mission/vision copy, and social links.
          </p>
        </div>

        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Company Branding */}
          <div className="bg-[#131313] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-['Hanken_Grotesk']">
              1. Company Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full bg-[#1b1b1b] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Company Tagline</label>
                <input
                  type="text"
                  name="companyTagline"
                  value={formData.companyTagline}
                  onChange={handleChange}
                  className="w-full bg-[#1b1b1b] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Company Overview Description</label>
              <textarea
                rows={3}
                name="companyDescription"
                value={formData.companyDescription}
                onChange={handleChange}
                className="w-full bg-[#1b1b1b] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Logo URL (CC-001)</label>
                <input
                  type="url"
                  name="logo"
                  placeholder="https://..."
                  value={formData.logo}
                  onChange={handleChange}
                  className="w-full bg-[#1b1b1b] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Favicon URL</label>
                <input
                  type="url"
                  name="favicon"
                  placeholder="https://..."
                  value={formData.favicon}
                  onChange={handleChange}
                  className="w-full bg-[#1b1b1b] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                />
              </div>
            </div>
          </div>

          {/* 2. Contact Details */}
          <div className="bg-[#131313] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-['Hanken_Grotesk']">
              2. Official Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#1b1b1b] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Primary Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#1b1b1b] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Alternate Phone</label>
                <input
                  type="text"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleChange}
                  className="w-full bg-[#1b1b1b] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-[#1b1b1b] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Working Hours</label>
                <input
                  type="text"
                  name="workingHours"
                  value={formData.workingHours}
                  onChange={handleChange}
                  className="w-full bg-[#1b1b1b] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Google Maps Embed URL</label>
              <input
                type="url"
                name="mapUrl"
                placeholder="https://www.google.com/maps/embed?..."
                value={formData.mapUrl}
                onChange={handleChange}
                className="w-full bg-[#1b1b1b] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
              />
            </div>
          </div>

          {/* 3. Social Links */}
          <div className="bg-[#131313] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-['Hanken_Grotesk']">
              3. Social Media Accounts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">WhatsApp (+91...)</label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full bg-[#1b1b1b] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Instagram URL</label>
                <input
                  type="url"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="w-full bg-[#1b1b1b] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="w-full bg-[#1b1b1b] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Facebook URL</label>
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  className="w-full bg-[#1b1b1b] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">YouTube URL</label>
                <input
                  type="url"
                  name="youtube"
                  value={formData.youtube}
                  onChange={handleChange}
                  className="w-full bg-[#1b1b1b] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Twitter/X URL</label>
                <input
                  type="url"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  className="w-full bg-[#1b1b1b] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                />
              </div>
            </div>
          </div>

          {/* 4. Home & About Content */}
          <div className="bg-[#131313] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-['Hanken_Grotesk']">
              4. Homepage & About Section Copy
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Hero Title</label>
                <input
                  type="text"
                  name="heroTitle"
                  value={formData.heroTitle}
                  onChange={handleChange}
                  className="w-full bg-[#1b1b1b] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Hero Subtitle</label>
                <input
                  type="text"
                  name="heroSubtitle"
                  value={formData.heroSubtitle}
                  onChange={handleChange}
                  className="w-full bg-[#1b1b1b] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Hero Description</label>
              <textarea
                rows={2}
                name="heroDescription"
                value={formData.heroDescription}
                onChange={handleChange}
                className="w-full bg-[#1b1b1b] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Mission Statement</label>
                <textarea
                  rows={3}
                  name="mission"
                  value={formData.mission}
                  onChange={handleChange}
                  className="w-full bg-[#1b1b1b] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Vision Statement</label>
                <textarea
                  rows={3}
                  name="vision"
                  value={formData.vision}
                  onChange={handleChange}
                  className="w-full bg-[#1b1b1b] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-gold px-8 py-3.5 rounded-xl text-xs uppercase font-bold tracking-wider flex items-center gap-2 shadow-xl disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Content...' : 'Save Site Content'}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminSiteContent;
