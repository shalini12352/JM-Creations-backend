import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ExternalLink,
  FolderKanban,
  Filter,
  Sparkles,
  Eye,
  X,
} from 'lucide-react';
import portfolioService from '../services/portfolioService';
import Seo from '../components/common/Seo';
import ImageWithFallback from '../components/common/ImageWithFallback';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeProject, setActiveProject] = useState(null);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await portfolioService.getPortfolio();
      const data = res?.data || res || [];
      const activeProjects = Array.isArray(data)
        ? data.filter((p) => p.status !== 'inactive')
        : [];
      setProjects(activeProjects);
    } catch (err) {
      console.error('Failed to load portfolio:', err);
      setError(err?.message || 'Unable to load portfolio projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const categories = [
    'All',
    ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean))),
  ];

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <>
      <Seo
        title="Portfolio — Proven Case Studies"
        description="Browse recent project showcases, digital marketing achievements, and website developments created by JM Creations."
      />

      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Case Studies</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Our Work Speaks <span className="text-gradient-gold">For Itself</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            Discover how we help ambitious startups and established businesses achieve digital transformation and measurable business growth.
          </p>
        </div>

        {/* Category Filters */}
        {!loading && !error && projects.length > 0 && (
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-12 no-scrollbar">
            <Filter className="w-4 h-4 text-amber-400 shrink-0 mr-1 hidden sm:block" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20'
                    : 'bg-[#1b1b1b] text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Content Render */}
        {loading ? (
          <LoadingSpinner message="Fetching portfolio showcase from backend..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchPortfolio} />
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title={projects.length === 0 ? 'No Portfolio Projects Found' : 'No Projects in Category'}
            message="Check back soon for new case studies and project highlights."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project._id || project.title}
                className="bg-[#1b1b1b] border border-white/10 rounded-xl overflow-hidden glass-card-hover group flex flex-col justify-between"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-56 w-full bg-neutral-900 overflow-hidden">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fallbackIcon={FolderKanban}
                      fallbackText={project.category || 'Portfolio Showcase'}
                    />

                    {/* Category Badge */}
                    {project.category && (
                      <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-amber-400 text-xs font-semibold border border-amber-500/20">
                        {project.category}
                      </span>
                    )}

                    {/* Hover Action Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
                      <button
                        onClick={() => setActiveProject(project)}
                        className="p-3 rounded-full bg-amber-500 text-black hover:bg-amber-400 font-bold transition-transform hover:scale-110"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-md transition-transform hover:scale-110"
                          title="Visit Project"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => setActiveProject(project)}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300"
                  >
                    View Project Case Study →
                  </button>
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                    >
                      <span>Live Site</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Project Detail Modal */}
        {activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1b1b1b] border border-white/10 rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              {activeProject.image && (
                <div className="h-64 sm:h-72 w-full rounded-xl overflow-hidden bg-neutral-900">
                  <img
                    src={activeProject.image}
                    alt={activeProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-3 border border-amber-500/20">
                  {activeProject.category || 'Project Showcase'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  {activeProject.title}
                </h2>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {activeProject.description}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setActiveProject(null)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold"
                >
                  Close
                </button>

                {activeProject.projectUrl ? (
                  <a
                    href={activeProject.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold px-6 py-2.5 rounded-lg text-xs uppercase font-bold flex items-center gap-2"
                  >
                    <span>Visit Live Website</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <Link
                    to="/contact"
                    className="btn-gold px-6 py-2.5 rounded-lg text-xs uppercase font-bold"
                  >
                    Build Similar Solution
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Portfolio;
