import React, { useState, useEffect } from 'react';
import { Quote, Plus, Edit, Trash2, X, Star } from 'lucide-react';
import testimonialService from '../../services/testimonialService';
import Seo from '../../components/common/Seo';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    company: '',
    designation: '',
    review: '',
    rating: 5,
    image: '',
    status: 'active',
  });

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await testimonialService.getTestimonials();
      const data = res?.data || res || [];
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Failed to fetch testimonials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      clientName: '',
      company: '',
      designation: '',
      review: '',
      rating: 5,
      image: '',
      status: 'active',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      clientName: item.clientName || '',
      company: item.company || '',
      designation: item.designation || '',
      review: item.review || '',
      rating: item.rating || 5,
      image: item.image || '',
      status: item.status || 'active',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clientName || !formData.review) {
      alert('Client Name and Review text are required.');
      return;
    }

    try {
      if (editingItem) {
        await testimonialService.updateTestimonial(editingItem._id, formData);
      } else {
        await testimonialService.createTestimonial(formData);
      }
      setShowModal(false);
      fetchTestimonials();
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await testimonialService.deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <>
      <Seo title="Admin — Manage Testimonials" />

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Client Testimonials</h1>
            <p className="text-xs text-gray-400 mt-1">Manage public client reviews and ratings.</p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="btn-gold px-4 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
          </button>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching testimonials database..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchTestimonials} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t._id}
                className="bg-[#131313] border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < (t.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        t.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 italic">"{t.review}"</p>

                  <div className="pt-2">
                    <h4 className="text-sm font-bold text-white">{t.clientName}</h4>
                    <p className="text-[11px] text-gray-400">
                      {t.designation} {t.company ? `at ${t.company}` : ''}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1b1b1b] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">
                  {editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Star Rating (1-5) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Review / Testimonial Text *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.review}
                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg bg-white/5 text-gray-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-gold px-6 py-2 rounded-lg text-xs uppercase font-bold">
                    Save Testimonial
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminTestimonials;
