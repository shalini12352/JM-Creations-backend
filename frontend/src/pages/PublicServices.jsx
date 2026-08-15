import React, { useState, useEffect } from 'react';
import { serviceService } from '../services/serviceService';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { Server, RefreshCw, AlertCircle } from 'lucide-react';

export function PublicServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      console.error('Error fetching public services:', err);
      setError(err.message || 'Unable to load services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const activeServices = services.filter((s) => s.status === 'active');

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div className="hero" style={{ padding: '1rem 0 2.5rem' }}>
        <h1 className="hero-title">Our Digital Services</h1>
        <p className="hero-subtitle">
          Comprehensive full-stack development, design, and branding solutions tailored to grow your business.
        </p>
      </div>

      {loading && (
        <div className="state-box">
          <div className="spinner" />
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Loading services...</p>
        </div>
      )}

      {!loading && error && (
        <div className="state-box">
          <AlertCircle size={40} style={{ color: 'var(--danger)', marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>Unable to load services</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
          <button className="btn btn-primary" onClick={fetchServices}>
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && activeServices.length === 0 && (
        <div className="state-box">
          <Server size={40} className="state-icon" />
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>No services available yet.</h3>
          <p style={{ color: 'var(--text-muted)' }}>Check back soon for our newly launched service offerings!</p>
        </div>
      )}

      {!loading && !error && activeServices.length > 0 && (
        <div className="cards-grid">
          {activeServices.map((service) => (
            <div key={service._id} className="portfolio-card">
              <div className="card-img-wrapper" style={{ height: '180px' }}>
                <ImageWithFallback
                  src={service.image}
                  alt={service.title}
                  className="card-img"
                />
              </div>

              <div className="card-body">
                <span className="card-category">{service.category}</span>
                <h3 className="card-title">{service.title}</h3>
                <p className="card-desc">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
