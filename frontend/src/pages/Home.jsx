import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { portfolioService } from '../services/portfolioService';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { ArrowRight, Layers, CheckCircle2, Shield, Sparkles } from 'lucide-react';

export function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);

  useEffect(() => {
    portfolioService.getAll()
      .then((res) => {
        if (res && res.success && Array.isArray(res.data)) {
          setFeaturedProjects(res.data.filter(p => p.status === 'active').slice(0, 3));
        }
      })
      .catch((err) => console.error('Error loading featured portfolio:', err));
  }, []);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      {/* Hero Section */}
      <section className="hero" style={{ padding: '4rem 0' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-light)', padding: '0.4rem 1rem', borderRadius: '9999px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          <Sparkles size={16} />
          <span>JM Creations Digital Agency</span>
        </div>

        <h1 className="hero-title" style={{ fontSize: '3.25rem', lineHeight: 1.2 }}>
          We Build High-Performance Digital Experiences
        </h1>

        <p className="hero-subtitle">
          Full-stack web application development, custom software solutions, and brand design powered by modern architecture and MongoDB Atlas.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/portfolio" className="btn btn-primary" style={{ padding: '0.8rem 1.75rem', borderRadius: '9999px' }}>
            <span>Explore Portfolio</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/services" className="btn btn-secondary" style={{ padding: '0.8rem 1.75rem', borderRadius: '9999px' }}>
            View Our Services
          </Link>
        </div>
      </section>

      {/* Featured Projects Preview */}
      {featuredProjects.length > 0 && (
        <section style={{ marginTop: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Featured Projects</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>A selection of recent active work from our portfolio</p>
            </div>
            <Link to="/portfolio" className="btn btn-secondary btn-sm">
              View All →
            </Link>
          </div>

          <div className="cards-grid">
            {featuredProjects.map((project) => (
              <div key={project._id} className="portfolio-card">
                <div className="card-img-wrapper">
                  <ImageWithFallback src={project.image} alt={project.title} className="card-img" />
                </div>
                <div className="card-body">
                  <span className="card-category">{project.category}</span>
                  <h3 className="card-title">{project.title}</h3>
                  <p className="card-desc">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
