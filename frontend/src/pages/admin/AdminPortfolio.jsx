import React, { useState, useEffect } from 'react';
import { portfolioService } from '../../services/portfolioService';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Toast } from '../../components/Toast';
import { ImageWithFallback } from '../../components/ImageWithFallback';
import { Plus, Edit2, Trash2, ExternalLink, RefreshCw, X, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const INITIAL_FORM = {
  title: '',
  description: '',
  category: 'Web Development',
  image: '',
  projectUrl: '',
  status: 'active'
};

const CATEGORIES = [
  'Web Development',
  'E-Commerce',
  'Branding',
  'Digital Marketing',
  'Graphic Design'
];

export function AdminPortfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete Confirm Modal state
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch portfolio list
  const fetchPortfolio = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await portfolioService.getAll();
      if (res && res.success && Array.isArray(res.data)) {
        setProjects(res.data);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error('Error fetching admin portfolio:', err);
      setError(err.message || 'Unable to load portfolio projects.');
      addToast(err.message || 'Unable to load portfolio projects.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  // Open modal for Create
  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData(INITIAL_FORM);
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = async (project) => {
    setEditingId(project._id);
    setFormError('');
    setFormData({
      title: project.title || '',
      description: project.description || '',
      category: project.category || 'Web Development',
      image: project.image || '',
      projectUrl: project.projectUrl || '',
      status: project.status || 'active'
    });
    setIsModalOpen(true);

    // Also fetch single project via GET /api/portfolio/:id to ensure latest data
    try {
      const singleRes = await portfolioService.getById(project._id);
      if (singleRes && singleRes.success && singleRes.data) {
        const fresh = singleRes.data;
        setFormData({
          title: fresh.title || '',
          description: fresh.description || '',
          category: fresh.category || 'Web Development',
          image: fresh.image || '',
          projectUrl: fresh.projectUrl || '',
          status: fresh.status || 'active'
        });
      }
    } catch (err) {
      console.error('Error getting project details:', err);
    }
  };

  // Close form modal
  const handleCloseModal = () => {
    if (formLoading) return;
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(INITIAL_FORM);
    setFormError('');
  };

  // Form Submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Client validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.category.trim() || !formData.image.trim()) {
      setFormError('Title, Description, Category, and Image fields are required.');
      return;
    }

    setFormLoading(true);
    try {
      if (editingId) {
        // PUT /api/portfolio/:id
        const res = await portfolioService.update(editingId, formData);
        if (res && res.success) {
          addToast('Portfolio project updated successfully!', 'success');
          // Update in state
          setProjects((prev) =>
            prev.map((p) => (p._id === editingId ? res.data : p))
          );
          handleCloseModal();
        }
      } else {
        // POST /api/portfolio
        const res = await portfolioService.create(formData);
        if (res && res.success) {
          addToast('Portfolio project created successfully!', 'success');
          // Add to top of state list
          setProjects((prev) => [res.data, ...prev]);
          handleCloseModal();
        }
      }
    } catch (err) {
      console.error('Error saving portfolio project:', err);
      setFormError(err.message || 'Failed to save portfolio project.');
      addToast(err.message || 'Failed to save portfolio project.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // PART 6: Toggle Active/Inactive Status directly
  const handleToggleStatus = async (project) => {
    const newStatus = project.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await portfolioService.update(project._id, { status: newStatus });
      if (res && res.success) {
        addToast(`Status updated to ${newStatus}`, 'info');
        setProjects((prev) =>
          prev.map((p) => (p._id === project._id ? { ...p, status: newStatus } : p))
        );
      }
    } catch (err) {
      console.error('Error toggling status:', err);
      addToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Delete Handler
  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const res = await portfolioService.delete(deleteId);
      if (res && res.success) {
        addToast('Portfolio project deleted successfully!', 'success');
        setProjects((prev) => prev.filter((p) => p._id !== deleteId));
        setDeleteId(null);
      }
    } catch (err) {
      console.error('Error deleting portfolio project:', err);
      addToast(err.message || 'Failed to delete portfolio project.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <Toast toasts={toasts} onDismiss={removeToast} />

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Portfolio Project"
        message="Are you sure you want to delete this portfolio project? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleteLoading}
      />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Portfolio Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage public portfolio projects stored in MongoDB Atlas
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <Plus size={18} />
          <span>+ Add Portfolio</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="state-box">
          <div className="spinner" />
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Loading admin portfolio records...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="state-box">
          <AlertCircle size={36} style={{ color: 'var(--danger)', marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Failed to Load Portfolio</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{error}</p>
          <button className="btn btn-secondary btn-sm" onClick={fetchPortfolio}>
            <RefreshCw size={14} /> Refresh List
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && projects.length === 0 && (
        <div className="state-box">
          <h3>No Portfolio Records Found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Click below to create your first portfolio project record in MongoDB.
          </p>
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            <Plus size={16} /> Add First Project
          </button>
        </div>
      )}

      {/* Portfolio Table */}
      {!loading && !error && projects.length > 0 && (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title & Category</th>
                <th>Description</th>
                <th>URL</th>
                <th>Status</th>
                <th>Created</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div style={{ width: '50px', height: '50px', borderRadius: '6px', overflow: 'hidden' }}>
                      <ImageWithFallback src={item.image} alt={item.title} className="table-thumbnail" />
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.title}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>{item.category}</span>
                  </td>
                  <td style={{ maxWidth: '240px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {item.description}
                    </div>
                  </td>
                  <td>
                    {item.projectUrl ? (
                      <a href={item.projectUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <span>Link</span> <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>None</span>
                    )}
                  </td>
                  <td>
                    <button
                      className={`badge ${item.status === 'active' ? 'badge-active' : 'badge-inactive'}`}
                      onClick={() => handleToggleStatus(item)}
                      title="Click to toggle status"
                    >
                      {item.status === 'active' ? <Eye size={12} /> : <EyeOff size={12} />}
                      {item.status}
                    </button>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      <button className="btn-icon" title="Edit Portfolio" onClick={() => handleOpenEditModal(item)}>
                        <Edit2 size={16} style={{ color: 'var(--primary)' }} />
                      </button>
                      <button className="btn-icon" title="Delete Portfolio" onClick={() => setDeleteId(item._id)}>
                        <Trash2 size={16} style={{ color: 'var(--danger)' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingId ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}</h2>
              <button className="btn-icon" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.65rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Project Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. JM Creations Website"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-control"
                  placeholder="Professional business website developed for JM Creations..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL *</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.example.com/project.png"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Project URL (Optional)</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://example.com"
                  value={formData.projectUrl}
                  onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status *</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active (Visible publicly)</option>
                  <option value="inactive">Inactive (Hidden publicly)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal} disabled={formLoading}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                  {formLoading ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
