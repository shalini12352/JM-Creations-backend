import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit, Trash2, X, Check } from 'lucide-react';
import serviceService from '../../services/serviceService';
import Seo from '../../components/common/Seo';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: '',
    status: 'active',
  });

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await serviceService.getServices();
      let data = [];
      if (Array.isArray(res)) {
        data = res;
      } else if (Array.isArray(res?.data)) {
        data = res.data;
      } else if (Array.isArray(res?.data?.data)) {
        data = res.data.data;
      }
      setServices(data);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      image: '',
      status: 'active',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      description: service.description || '',
      category: service.category || '',
      image: service.image || '',
      status: service.status || 'active',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category) {
      alert('Title, Description, and Category are required.');
      return;
    }

    try {
      if (editingService) {
        await serviceService.updateService(editingService._id || editingService.id, formData);
      } else {
        await serviceService.createService(formData);
      }
      setShowModal(false);
      await fetchServices();
    } catch (err) {
      alert('Operation failed: ' + (err?.response?.data?.message || err?.message || 'Unknown error'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await serviceService.deleteService(id);
      await fetchServices();
    } catch (err) {
      alert('Delete failed: ' + (err?.response?.data?.message || err?.message || 'Unknown error'));
    }
  };

  return (
    <>
      <Seo title="Admin — Manage Services" />

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Services Directory</h1>
            <p className="text-xs text-gray-400 mt-1">Manage public services and active status.</p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="btn-gold px-4 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching services database..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchServices} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div
                key={s._id}
                className="bg-[#131313] border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase">
                      {s.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        s.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{s.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">{s.description}</p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(s)}
                    className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white hover:bg-white/10"
                    title="Edit Service"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    title="Delete Service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1b1b1b] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Digital Marketing, Web Development..."
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
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
                    Save Service
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

export default AdminServices;
