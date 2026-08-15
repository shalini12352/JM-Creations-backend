import React, { useState, useEffect } from 'react';
import { enquiryService } from '../../services/enquiryService';
import { Mail, RefreshCw, AlertCircle } from 'lucide-react';

export function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await enquiryService.getAll();
      if (res && res.success && Array.isArray(res.data)) {
        setEnquiries(res.data);
      } else {
        setEnquiries([]);
      }
    } catch (err) {
      console.error('Error fetching admin enquiries:', err);
      setError(err.message || 'Unable to load enquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Enquiries Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Customer requests submitted via website contact forms</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchEnquiries}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading && (
        <div className="state-box">
          <div className="spinner" />
          <p style={{ color: 'var(--text-muted)' }}>Loading enquiries...</p>
        </div>
      )}

      {!loading && error && (
        <div className="state-box">
          <AlertCircle size={36} style={{ color: 'var(--danger)', marginBottom: '1rem' }} />
          <h3>Failed to Load Enquiries</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{error}</p>
          <button className="btn btn-primary btn-sm" onClick={fetchEnquiries}>Try Again</button>
        </div>
      )}

      {!loading && !error && enquiries.length === 0 && (
        <div className="state-box">
          <Mail size={40} className="state-icon" />
          <h3>No Enquiries Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>New customer inquiries will appear here.</p>
        </div>
      )}

      {!loading && !error && enquiries.length > 0 && (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service Requested</th>
                <th>Message</th>
                <th>Status</th>
                <th>Submitted Date</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{item.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.email} | {item.phone}</div>
                  </td>
                  <td>
                    <span className="badge badge-active">{item.service || 'General'}</span>
                  </td>
                  <td style={{ maxWidth: '300px', fontSize: '0.85rem' }}>{item.message}</td>
                  <td>
                    <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                      {item.status || 'new'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
