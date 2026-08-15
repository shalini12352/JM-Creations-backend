import React, { useState, useEffect } from 'react';
import { serviceService } from '../../services/serviceService';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Toast } from '../../components/Toast';
import { ImageWithFallback } from '../../components/ImageWithFallback';
import { Plus, Edit2, Trash2, RefreshCw, X, AlertCircle } from 'lucide-react';

const INITIAL_FORM = {
  title: '',
  description: '',
  category: 'Web Development',
  image: '',
  status: 'active'
};

export function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await serviceService.getAll();
      if (res && res.success && Array.isArray(res.data)) {
        setServices(res.data);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error('Error fetching admin services:', err);
      setError(err.message || 'Unable to load services.');
      addToast(err.message || 'Unable to load services.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData(INITIAL_FORM);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service) => {
    setEditingId(service._id);
    setFormData({
      title: service.title || '',
      description: service.description || '',
      category: service.category || 'Web Development',
      image: service.image || '',
      status: service.status || 'active'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (formLoading) return;
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(INITIAL_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.category.trim()) {
      setFormError('Title, Description, and Category are required.');
      return;
    }

    setFormLoading(true);
    try {
      if (editingId) {
        const res = await serviceService.update(editingId, formData);
        if (res && res.success) {
          addToast('Service updated successfully!');
          setServices((prev) => prev.map((s) => (s._id === editingId ? res.data : s)));
          handleCloseModal();
        }
      } else {
        const res = await serviceService.create(formData);
        if (res && res.success) {
          addToast('Service created successfully!');
          setServices((prev) => [res.data, ...prev]);
          handleCloseModal();
        }
      }
    } catch (err) {
      console.error('Error saving service:', err);
      setFormError(err.message || 'Failed to save service.');
      addToast(err.message || 'Failed to save service.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const res = await serviceService.delete(deleteId);
      if (res && res.success) {
        addToast('Service deleted successfully!');
        setServices((prev) => prev.filter((s) => s._id !== deleteId));
        setDeleteId(null);
      }
    } catch (err) {
      console.error('Error deleting service:', err);
      addToast(err.message || 'Failed to delete service.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <Toast toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((item) => item.id !== id))} />

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Service"
        message="Are you sure you want to delete this service record?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleteLoading}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Services Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage digital services offerings</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <Plus size={18} />
          <span>+ Add Service</span>
        </button>
      </div>

      {loading && (
        <div className="state-box">
          <div className="spinner" />
          <p style={{ color: 'var(--text-muted)' }}>Loading services...</p>
        </div>
      )}

      {!loading && error && (
        <div className="state-box">
          <AlertCircle size={36} style={{ color: 'var(--danger)', marginBottom: '1rem' }} />
          <h3>Failed to Load Services</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{error}</p>
          <button className="btn btn-secondary btn-sm" onClick={fetchServices}>
            <RefreshCw size={14} /> Refresh List
          </button>
        </div>
      )}

      {!loading && !error && services.length === 0 && (
        <div className="state-box">
          <h3>No Services Found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Add your first service record.</p>
          <button className="btn btn-primary" onClick={handleOpenAddModal}>+ Add Service</button>
        </div>
      )}

      {!loading && !error && services.length > 0 && (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title & Category</th>
                <th>Description</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div style={{ width: '45px', height: '45px', borderRadius: '6px', overflow: 'hidden' }}>
                      <ImageWithFallback src={item.image} alt={item.title} className="table-thumbnail" />
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{item.title}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>{item.category}</span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.description}</td>
                  <td>
                    <span className={`badge ${item.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      <button className="btn-icon" onClick={() => handleOpenEditModal(item)}>
                        <Edit2 size={16} style={{ color: 'var(--primary)' }} />
                      </button>
                      <button className="btn-icon" onClick={() => setDeleteId(item._id)}>
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

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingId ? 'Edit Service' : 'Add New Service'}</h2>
              <button className="btn-icon" onClick={handleCloseModal}><X size={20} /></button>
            </div>

            {formError && (
              <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.65rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-control"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                  {formLoading ? 'Saving...' : editingId ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
