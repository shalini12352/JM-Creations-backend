import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2, CheckCircle2, Clock, Mail, Phone, User } from 'lucide-react';
import enquiryService from '../../services/enquiryService';
import Seo from '../../components/common/Seo';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await enquiryService.getEnquiries();
      const data = res?.data || res || [];
      setEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load enquiries:', err);
      setError(err?.message || 'Failed to load enquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await enquiryService.updateEnquiry(id, { status: newStatus });
      setEnquiries((prev) =>
        prev.map((e) => (e._id === id ? { ...e, status: newStatus } : e))
      );
    } catch (err) {
      alert('Failed to update enquiry status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await enquiryService.deleteEnquiry(id);
      setEnquiries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert('Failed to delete enquiry: ' + err.message);
    }
  };

  const filteredEnquiries =
    statusFilter === 'all'
      ? enquiries
      : enquiries.filter((e) => e.status === statusFilter);

  return (
    <>
      <Seo title="Admin — Manage Enquiries" />

      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Customer Enquiries</h1>
            <p className="text-xs text-gray-400 mt-1">
              Review and update status of client consultation requests.
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {['all', 'new', 'contacted', 'in-progress', 'closed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-[#131313] text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching enquiries..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchEnquiries} />
        ) : filteredEnquiries.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No Enquiries Found"
            message={statusFilter === 'all' ? 'No client submissions in backend.' : `No enquiries with status '${statusFilter}'.`}
          />
        ) : (
          <div className="space-y-4">
            {filteredEnquiries.map((enq) => (
              <div
                key={enq._id}
                className="bg-[#131313] border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-white">{enq.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider">
                        {enq.service}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-amber-500" />
                        <a href={`mailto:${enq.email}`} className="hover:text-amber-400">
                          {enq.email}
                        </a>
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-amber-500" />
                        <a href={`tel:${enq.phone}`} className="hover:text-amber-400">
                          {enq.phone}
                        </a>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={enq.status || 'new'}
                      onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                      className="bg-[#1b1b1b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="in-progress">In-Progress</option>
                      <option value="closed">Closed</option>
                    </select>

                    <button
                      onClick={() => handleDelete(enq._id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-colors"
                      title="Delete Enquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-sm text-gray-300 bg-[#1b1b1b] p-4 rounded-xl border border-white/5 whitespace-pre-line leading-relaxed">
                  {enq.message}
                </div>

                <div className="text-[11px] text-gray-500 text-right">
                  Received: {new Date(enq.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminEnquiries;
