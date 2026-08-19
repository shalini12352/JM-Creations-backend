import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Eye,
  MessageSquare,
  Briefcase,
  FolderKanban,
  FileText,
  Quote,
  UserCheck,
  TrendingUp,
  Activity,
} from 'lucide-react';
import analyticsService from '../../services/analyticsService';
import enquiryService from '../../services/enquiryService';
import serviceService from '../../services/serviceService';
import portfolioService from '../../services/portfolioService';
import blogService from '../../services/blogService';
import Seo from '../../components/common/Seo';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [counts, setCounts] = useState({
    enquiries: 0,
    services: 0,
    portfolio: 0,
    blogs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, enqRes, srvRes, portRes, blogRes] = await Promise.allSettled([
          analyticsService.getStats(),
          enquiryService.getEnquiries(),
          serviceService.getServices(),
          portfolioService.getPortfolio(),
          blogService.getBlogs(),
        ]);

        if (statsRes.status === 'fulfilled') {
          setStats(statsRes.value?.data || statsRes.value || null);
        }

        setCounts({
          enquiries: enqRes.status === 'fulfilled' ? (enqRes.value?.data || enqRes.value || []).length : 0,
          services: srvRes.status === 'fulfilled' ? (srvRes.value?.data || srvRes.value || []).length : 0,
          portfolio: portRes.status === 'fulfilled' ? (portRes.value?.data || portRes.value || []).length : 0,
          blogs: blogRes.status === 'fulfilled' ? (blogRes.value?.data || blogRes.value || []).length : 0,
        });
      } catch (e) {
        console.error('Dashboard fetch error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Seo title="Admin Dashboard — Analytics & Overview" />

      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Real-time analytics and management stats for JM Creations website.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching dashboard analytics..." />
        ) : (
          <>
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#131313] border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-gray-400 font-['Hanken_Grotesk']">
                    Total Enquiries
                  </span>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white font-['Hanken_Grotesk']">
                  {counts.enquiries}
                </h3>
                <Link
                  to="/admin/enquiries"
                  className="text-xs text-amber-400 hover:underline block"
                >
                  Manage Enquiries →
                </Link>
              </div>

              <div className="bg-[#131313] border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-gray-400 font-['Hanken_Grotesk']">
                    Active Services
                  </span>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white font-['Hanken_Grotesk']">
                  {counts.services}
                </h3>
                <Link
                  to="/admin/services"
                  className="text-xs text-amber-400 hover:underline block"
                >
                  Manage Services →
                </Link>
              </div>

              <div className="bg-[#131313] border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-gray-400 font-['Hanken_Grotesk']">
                    Portfolio Projects
                  </span>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                    <FolderKanban className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white font-['Hanken_Grotesk']">
                  {counts.portfolio}
                </h3>
                <Link
                  to="/admin/portfolio"
                  className="text-xs text-amber-400 hover:underline block"
                >
                  Manage Portfolio →
                </Link>
              </div>

              <div className="bg-[#131313] border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-gray-400 font-['Hanken_Grotesk']">
                    Blog Posts
                  </span>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white font-['Hanken_Grotesk']">
                  {counts.blogs}
                </h3>
                <Link
                  to="/admin/blogs"
                  className="text-xs text-amber-400 hover:underline block"
                >
                  Manage Blogs →
                </Link>
              </div>
            </div>

            {/* Analytics Statistics Panel */}
            <div className="bg-[#131313] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-bold text-white">Visitor Statistics & Traffic</h3>
                </div>
                <span className="text-xs text-gray-400">Anonymous Aggregates</span>
              </div>

              {stats ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#1b1b1b] p-6 rounded-xl border border-white/5 space-y-2">
                    <span className="text-xs text-gray-400">Total Page Views</span>
                    <h4 className="text-2xl font-bold text-white">{stats.totalPageViews || stats.totalViews || 0}</h4>
                  </div>
                  <div className="bg-[#1b1b1b] p-6 rounded-xl border border-white/5 space-y-2">
                    <span className="text-xs text-gray-400">Unique Visitors</span>
                    <h4 className="text-2xl font-bold text-amber-400">{stats.uniqueVisitors || stats.visitors || 0}</h4>
                  </div>
                  <div className="bg-[#1b1b1b] p-6 rounded-xl border border-white/5 space-y-2">
                    <span className="text-xs text-gray-400">Unique Sessions</span>
                    <h4 className="text-2xl font-bold text-emerald-400">{stats.uniqueSessions || stats.sessions || 0}</h4>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Analytics tracking events recorded automatically on page navigation.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
