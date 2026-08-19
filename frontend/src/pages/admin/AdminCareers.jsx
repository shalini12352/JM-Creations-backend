import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Edit, Trash2, X } from 'lucide-react';
import careerService from '../../services/careerService';
import Seo from '../../components/common/Seo';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const AdminCareers = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    employmentType: 'full-time',
    description: '',
    experience: '',
    salary: '',
    status: 'open',
    applicationEmail: 'jmcreationinfo@gmail.com',
  });

  const fetchCareers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await careerService.getCareers();
      const data = res?.data || res || [];
      setCareers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Failed to fetch career listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const handleOpenCreate = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      department: '',
      location: 'Chennai, India',
      employmentType: 'full-time',
      description: '',
      experience: '2+ years',
      salary: 'Competitive',
      status: 'open',
      applicationEmail: 'jmcreationinfo@gmail.com',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title || '',
      department: job.department || '',
      location: job.location || '',
      employmentType: job.employmentType || 'full-time',
      description: job.description || '',
      experience: job.experience || '',
      salary: job.salary || '',
      status: job.status || 'open',
      applicationEmail: job.applicationEmail || 'jmcreationinfo@gmail.com',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert('Title and Description are required.');
      return;
    }

    try {
      if (editingJob) {
        await careerService.updateCareer(editingJob._id, formData);
      } else {
        await careerService.createCareer(formData);
      }
      setShowModal(false);
      fetchCareers();
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await careerService.deleteCareer(id);
      setCareers((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <>
      <Seo title="Admin — Manage Careers" />

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Career Listings</h1>
            <p className="text-xs text-gray-400 mt-1">Manage open job positions and applications.</p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="btn-gold px-4 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Job</span>
          </button>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching career database..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchCareers} />
        ) : (
          <div className="space-y-4">
            {careers.map((job) => (
              <div
                key={job._id}
                className="bg-[#131313] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white">{job.title}</h3>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        job.status === 'open' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {job.status}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase">
                      {job.employmentType}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Dept: {job.department || 'General'} • Location: {job.location} • Experience: {job.experience}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(job)}
                    className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(job._id)}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#1b1b1b] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl my-8">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">
                  {editingJob ? 'Edit Job Posting' : 'Post New Job Opportunity'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      placeholder="Engineering, Marketing..."
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                      Employment Type
                    </label>
                    <select
                      value={formData.employmentType}
                      onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                      className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white"
                    >
                      <option value="full-time">Full-Time</option>
                      <option value="part-time">Part-Time</option>
                      <option value="internship">Internship</option>
                      <option value="contract">Contract</option>
                      <option value="freelance">Freelance</option>
                    </select>
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
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Job Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                      Required Experience
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2-4 years"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                      Salary (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹5,00,000 - ₹8,00,000"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Application Email
                  </label>
                  <input
                    type="email"
                    value={formData.applicationEmail}
                    onChange={(e) => setFormData({ ...formData, applicationEmail: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white"
                  />
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
                    Save Job Posting
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

export default AdminCareers;
