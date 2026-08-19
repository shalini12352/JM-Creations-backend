import React, { useState, useEffect } from 'react';
import { FolderKanban, Plus, Edit, Trash2, X, ExternalLink } from 'lucide-react';
import portfolioService from '../../services/portfolioService';
import Seo from '../../components/common/Seo';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const AdminPortfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: '',
    projectUrl: '',
    status: 'active',
  });

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await portfolioService.getPortfolio();
      const data = res?.data || res || [];
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Failed to fetch portfolio.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      image: '',
      projectUrl: '',
      status: 'active',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      category: project.category || '',
      image: project.image || '',
      projectUrl: project.projectUrl || '',
      status: project.status || 'active',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category || !formData.image) {
      alert('Title, Description, Category, and Image URL are required.');
      return;
    }

    try {
      if (editingProject) {
        await portfolioService.updatePortfolio(editingProject._id, formData);
      } else {
        await portfolioService.createPortfolio(formData);
      }
      setShowModal(false);
      fetchPortfolio();
    } catch (err) {
      alert('Operation failed: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await portfolioService.deletePortfolio(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <>
      <Seo title="Admin — Manage Portfolio" />

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Portfolio Projects</h1>
            <p className="text-xs text-gray-400 mt-1">Manage project showcases and case studies.</p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="btn-gold px-4 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching portfolio database..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchPortfolio} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <div
                key={p._id}
                className="bg-[#131313] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="h-44 bg-neutral-900 overflow-hidden relative">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-amber-400 text-[10px] font-bold">
                      {p.category}
                    </span>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="text-lg font-bold text-white">{p.title}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2">{p.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-white/10 flex items-center justify-between mt-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      p.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {p.status}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
                  {editingProject ? 'Edit Project' : 'Add New Portfolio Project'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Project Title *
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
                    placeholder="Web Development, Branding..."
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Project URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.projectUrl}
                    onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                    Save Project
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

export default AdminPortfolio;
