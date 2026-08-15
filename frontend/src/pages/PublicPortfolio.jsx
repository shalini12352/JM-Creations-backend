import React, { useState, useEffect } from 'react';
import { portfolioService } from '../services/portfolioService';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { ExternalLink, RefreshCw, Briefcase, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Web Development',
  'E-Commerce',
  'Branding',
  'Digital Marketing',
  'Graphic Design'
];

export function PublicPortfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

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
      console.error('Error fetching public portfolio:', err);
      setError(err.message || 'Unable to load portfolio projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  // PART 8: ONLY DISPLAY ACTIVE PROJECTS PUBLICLY
  const activeProjects = projects.filter((p) => p.status === 'active');

  // PART 10: CATEGORY FILTERING
  const filteredProjects = selectedCategory === 'All'
    ? activeProjects
    : activeProjects.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div className="hero" style={{ padding: '1rem 0 2.5rem' }}>
        <h1 className="hero-title">Our Portfolio Showcase</h1>
        <p className="hero-subtitle">
          Explore our latest digital creation work, full-stack applications, branding projects, and web development solutions.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="filter-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PART 11: LOADING STATE */}
      {loading && (
        <div className="state-box">
          <div className="spinner" />
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Loading portfolio projects...</p>
        </div>
      )}

      {/* PART 13: ERROR STATE */}
      {!loading && error && (
        <div className="state-box">
          <AlertCircle size={40} style={{ color: 'var(--danger)', marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>Unable to load portfolio projects</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
          <button className="btn btn-primary" onClick={fetchPortfolio}>
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      )}

      {/* PART 12: EMPTY STATE */}
      {!loading && !error && filteredProjects.length === 0 && (
        <div className="state-box">
          <Briefcase size={40} className="state-icon" />
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>No portfolio projects available yet.</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            {selectedCategory === 'All'
              ? 'Check back soon for newly published projects!'
              : `No active projects found under the "${selectedCategory}" category.`}
          </p>
        </div>
      )}

      {/* PART 9: PUBLIC PORTFOLIO GRID */}
      {!loading && !error && filteredProjects.length > 0 && (
        <div className="cards-grid">
          {filteredProjects.map((project) => (
            <div key={project._id} className="portfolio-card">
              <div className="card-img-wrapper">
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  className="card-img"
                />
              </div>

              <div className="card-body">
                <span className="card-category">{project.category}</span>
                <h3 className="card-title">{project.title}</h3>
                <p className="card-desc">{project.description}</p>

                <div className="card-footer">
                  {project.projectUrl && project.projectUrl.trim() !== '' ? (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-primary"
                      style={{ gap: '0.4rem' }}
                    >
                      <span>View Project</span>
                      <ExternalLink size={14} />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
