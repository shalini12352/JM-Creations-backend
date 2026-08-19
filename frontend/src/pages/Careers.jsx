import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Mail,
  CheckCircle2,
  Sparkles,
  X,
  UserCheck,
} from 'lucide-react';
import careerService from '../services/careerService';
import Seo from '../components/common/Seo';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

const Careers = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeJob, setActiveJob] = useState(null);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await careerService.getCareers({ status: 'open' });
      const data = res?.data || res || [];
      setCareers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load career listings:', err);
      setError(err?.message || 'Unable to fetch open positions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  return (
    <>
      <Seo
        title="Careers — Join Our Team"
        description="Explore open career opportunities at JM Creations. We are hiring web developers, digital marketers, designers, and business strategists."
      />

      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join Our Team</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Build Your Career With <span className="text-gradient-gold">JM Creations</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            Join an innovative, fast-paced team delivering cutting-edge business solutions and digital growth strategies.
          </p>
        </div>

        {/* Content Render */}
        {loading ? (
          <LoadingSpinner message="Fetching open job opportunities..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchCareers} />
        ) : careers.length === 0 ? (
          <EmptyState
            icon={UserCheck}
            title="No Open Positions Available"
            message="We currently do not have active job openings. Feel free to send your resume for future consideration."
            actionText="Send General Resume"
            onAction={() =>
              (window.location.href =
                'mailto:jmcreationinfo@gmail.com?subject=General Career Application')
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {careers.map((job) => (
              <div
                key={job._id || job.title}
                className="bg-[#1b1b1b] border border-white/10 rounded-2xl p-6 sm:p-8 glass-card-hover flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
                      {job.employmentType || 'Full-Time'}
                    </span>
                    {job.department && (
                      <span className="text-xs text-gray-400 font-medium">
                        {job.department}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">
                    {job.title}
                  </h3>

                  <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-2">
                    {job.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-amber-500" />
                        <span>{job.location}</span>
                      </div>
                    )}
                    {job.experience && (
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4 text-amber-500" />
                        <span>{job.experience} Exp</span>
                      </div>
                    )}
                    {job.salary && (
                      <div className="flex items-center gap-1 text-emerald-400 font-medium">
                        <DollarSign className="w-4 h-4" />
                        <span>{job.salary}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => setActiveJob(job)}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300"
                  >
                    View Job Details & Requirements →
                  </button>

                  <a
                    href={`mailto:${job.applicationEmail || 'jmcreationinfo@gmail.com'}?subject=Application for ${encodeURIComponent(job.title)}`}
                    className="btn-gold px-4 py-2 rounded-lg text-xs uppercase font-bold"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detailed Job Modal */}
        {activeJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1b1b1b] border border-white/10 rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setActiveJob(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2 border border-amber-500/20 uppercase tracking-wider">
                  {activeJob.department || 'Open Position'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {activeJob.title}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                  {activeJob.location && <span>📍 {activeJob.location}</span>}
                  <span>💼 {activeJob.employmentType || 'Full-Time'}</span>
                  {activeJob.salary && <span className="text-emerald-400">💰 {activeJob.salary}</span>}
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-300">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Role Overview
                </h4>
                <p className="leading-relaxed whitespace-pre-line">{activeJob.description}</p>

                {activeJob.responsibilities && activeJob.responsibilities.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Key Responsibilities
                    </h4>
                    <ul className="space-y-1.5 text-xs text-gray-300">
                      {activeJob.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeJob.requirements && activeJob.requirements.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Requirements & Qualifications
                    </h4>
                    <ul className="space-y-1.5 text-xs text-gray-300">
                      {activeJob.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeJob.skills && activeJob.skills.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeJob.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded bg-white/5 text-gray-300 text-xs font-medium border border-white/5"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setActiveJob(null)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold"
                >
                  Close
                </button>

                <a
                  href={`mailto:${activeJob.applicationEmail || 'jmcreationinfo@gmail.com'}?subject=Application for ${encodeURIComponent(activeJob.title)}`}
                  className="btn-gold px-6 py-2.5 rounded-lg text-xs uppercase font-bold flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Application Email</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Careers;
