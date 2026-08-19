import React, { useState, useEffect } from 'react';
import {
  Activity,
  Eye,
  Users,
  Clock,
  Compass,
  Monitor,
  Globe,
  RefreshCw,
  TrendingUp,
  Filter,
} from 'lucide-react';
import analyticsService from '../../services/analyticsService';
import Seo from '../../components/common/Seo';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';

const AdminAnalytics = () => {
  const [period, setPeriod] = useState('30d');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async (selectedPeriod = period) => {
    try {
      setLoading(true);
      setError(null);
      const res = await analyticsService.getStats({ period: selectedPeriod });
      const data = res?.data || res || null;
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError(err?.message || 'Unable to load analytics data from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(period);
  }, [period]);

  const totalViews = stats?.totalPageViews || 0;

  return (
    <>
      <Seo title="Admin — Visitor Analytics & Traffic Insights" />

      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header & Period Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Visitor Statistics & Analytics
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Privacy-conscious traffic metrics and user technology breakdown.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-amber-500 shrink-0 mr-1" />
            {[
              { label: '7 Days', value: '7d' },
              { label: '30 Days', value: '30d' },
              { label: '90 Days', value: '90d' },
              { label: 'All Time', value: 'all' },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  period === p.value
                    ? 'bg-amber-500 text-black font-bold shadow-md'
                    : 'bg-[#131313] text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                {p.label}
              </button>
            ))}

            <button
              onClick={() => fetchStats(period)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors ml-2"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Aggregating website traffic statistics..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => fetchStats(period)} />
        ) : !stats || (stats.totalPageViews === 0 && stats.totalVisits === 0) ? (
          <EmptyState
            icon={Activity}
            title="No Traffic Recorded Yet"
            message={`No analytics events recorded for the period '${period}'. Visit the public pages to generate page view events.`}
          />
        ) : (
          <div className="space-y-8">
            {/* Top Level Key Performance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#131313] border border-white/10 rounded-2xl p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-gray-400 font-['Hanken_Grotesk']">
                    Total Page Views
                  </span>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white font-['Hanken_Grotesk']">
                  {stats.totalPageViews?.toLocaleString() || 0}
                </h3>
                <p className="text-[11px] text-gray-400">Recorded page events</p>
              </div>

              <div className="bg-[#131313] border border-white/10 rounded-2xl p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-gray-400 font-['Hanken_Grotesk']">
                    Total Visits
                  </span>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white font-['Hanken_Grotesk']">
                  {stats.totalVisits?.toLocaleString() || 0}
                </h3>
                <p className="text-[11px] text-gray-400">Total visit events</p>
              </div>

              <div className="bg-[#131313] border border-white/10 rounded-2xl p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-gray-400 font-['Hanken_Grotesk']">
                    Unique Visitors
                  </span>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-amber-400 font-['Hanken_Grotesk']">
                  {stats.uniqueVisitors?.toLocaleString() || 0}
                </h3>
                <p className="text-[11px] text-gray-400">Distinct browser tokens</p>
              </div>

              <div className="bg-[#131313] border border-white/10 rounded-2xl p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-gray-400 font-['Hanken_Grotesk']">
                    Unique Sessions
                  </span>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-emerald-400 font-['Hanken_Grotesk']">
                  {stats.uniqueSessions?.toLocaleString() || 0}
                </h3>
                <p className="text-[11px] text-gray-400">Distinct tab sessions</p>
              </div>
            </div>

            {/* Top Pages & Referrers Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Top Pages */}
              <div className="lg:col-span-7 bg-[#131313] border border-white/10 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-amber-500" />
                    <h3 className="text-lg font-bold text-white">Most Visited Pages</h3>
                  </div>
                  <span className="text-xs text-gray-400">Top 10 Routes</span>
                </div>

                {stats.topPages && stats.topPages.length > 0 ? (
                  <div className="space-y-4">
                    {stats.topPages.map((item, idx) => {
                      const percentage = totalViews > 0 ? Math.round((item.views / totalViews) * 100) : 0;
                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-white font-mono">{item.page}</span>
                            <span className="text-gray-400 font-medium">
                              {item.views} views ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-[#1b1b1b] h-2.5 rounded-full overflow-hidden">
                            <div
                              className="bg-amber-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(percentage, 5)}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 text-center py-6">No page views recorded for this filter.</p>
                )}
              </div>

              {/* Traffic Sources / Referrers */}
              <div className="lg:col-span-5 bg-[#131313] border border-white/10 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-amber-500" />
                    <h3 className="text-lg font-bold text-white">Traffic Sources</h3>
                  </div>
                  <span className="text-xs text-gray-400">Referrers</span>
                </div>

                {stats.referrers && stats.referrers.length > 0 ? (
                  <div className="space-y-3">
                    {stats.referrers.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#1b1b1b] border border-white/5 text-xs"
                      >
                        <span className="font-medium text-gray-200 truncate max-w-[200px]">
                          {item.referrer === 'direct' ? 'Direct / Bookmark' : item.referrer}
                        </span>
                        <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                          {item.count} hits
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 text-center py-6">No referrer data available.</p>
                )}
              </div>
            </div>

            {/* Devices, Browsers & OS Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Device Types */}
              <div className="bg-[#131313] border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                  <Monitor className="w-4 h-4 text-amber-500" />
                  <h4 className="text-sm font-bold text-white">Device Breakdown</h4>
                </div>
                <div className="space-y-3">
                  {stats.devices && stats.devices.length > 0 ? (
                    stats.devices.map((d, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="capitalize text-gray-300">{d.device}</span>
                        <span className="font-bold text-amber-400">{d.count}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">No device data</p>
                  )}
                </div>
              </div>

              {/* Browsers */}
              <div className="bg-[#131313] border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                  <Globe className="w-4 h-4 text-amber-500" />
                  <h4 className="text-sm font-bold text-white">Browser Usage</h4>
                </div>
                <div className="space-y-3">
                  {stats.browsers && stats.browsers.length > 0 ? (
                    stats.browsers.map((b, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">{b.browser}</span>
                        <span className="font-bold text-amber-400">{b.count}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">No browser data</p>
                  )}
                </div>
              </div>

              {/* Operating Systems */}
              <div className="bg-[#131313] border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                  <Activity className="w-4 h-4 text-amber-500" />
                  <h4 className="text-sm font-bold text-white">Operating System</h4>
                </div>
                <div className="space-y-3">
                  {stats.operatingSystems && stats.operatingSystems.length > 0 ? (
                    stats.operatingSystems.map((os, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">{os.operatingSystem}</span>
                        <span className="font-bold text-amber-400">{os.count}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">No OS data</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminAnalytics;
