import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  FolderKanban,
  FileText,
  Quote,
  UserCheck,
  Globe,
  Activity,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  User,
} from 'lucide-react';
import authService from '../../services/authService';
import officialLogo from '../../assets/jm-creations-official-logo.png';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Verify server session
    let isMounted = true;

    const checkAuth = async () => {
      try {
        if (!authService.getToken()) {
          navigate('/admin/login', { replace: true });
          return;
        }
        const res = await authService.getMe();
        if (isMounted && res.success && res.user) {
          setAdminUser(res.user);
        }
      } catch (err) {
        if (isMounted) {
          authService.logout();
          navigate('/admin/login', { replace: true });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [location.pathname, navigate]);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/admin/login', { replace: true });
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
    { label: 'Services', path: '/admin/services', icon: Briefcase },
    { label: 'Portfolio', path: '/admin/portfolio', icon: FolderKanban },
    { label: 'Blogs', path: '/admin/blogs', icon: FileText },
    { label: 'Testimonials', path: '/admin/testimonials', icon: Quote },
    { label: 'Careers', path: '/admin/careers', icon: UserCheck },
    { label: 'Site Content', path: '/admin/site-content', icon: Globe },
    { label: 'Analytics', path: '/admin/analytics', icon: Activity },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mb-4"></div>
        <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Authenticating session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#FFFFFF] flex font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#111111] border-r border-white/10 shrink-0">
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <div className="p-1.5 bg-[#F5C553] rounded-xl shadow-md">
            <img
              src={officialLogo}
              alt="JM Creations - End-to-End Business Solutions"
              className="h-9 w-auto object-contain rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-white text-base tracking-tight font-['Outfit'] leading-none">
              JM CREATIONS
            </span>
            <span className="text-[9px] text-[#F5C553] font-extrabold tracking-widest uppercase mt-0.5">
              Admin Panel
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#D4AF37]/15 text-[#FFD165] border border-[#D4AF37]/30 font-semibold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : ''}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User profile info & logout */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-[#0B0B0B]/50">
          {adminUser && (
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="w-8 h-8 rounded-full bg-[#151515] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{adminUser.name || 'Admin User'}</p>
                <p className="text-[11px] text-gray-400 truncate">{adminUser.email}</p>
              </div>
            </div>
          )}

          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors border border-white/5"
          >
            <ExternalLink className="w-4 h-4 text-[#D4AF37]" />
            <span>View Live Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors border border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="relative w-64 bg-[#111111] h-full flex flex-col z-10 p-4 border-r border-white/10">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gold-gradient text-black font-extrabold flex items-center justify-center text-xs">
                  JM
                </div>
                <span className="font-extrabold text-white font-['Outfit']">Admin Panel</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5 text-[#D4AF37]" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#D4AF37]/15 text-[#FFD165] font-semibold border border-[#D4AF37]/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#D4AF37]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <Link
                to="/"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5"
              >
                <ExternalLink className="w-4 h-4 text-[#D4AF37]" />
                <span>View Live Site</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[#111111] border-b border-white/10 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg bg-white/5 border border-white/10"
            >
              <Menu className="w-5 h-5 text-[#D4AF37]" />
            </button>
            <h2 className="text-sm sm:text-base font-bold text-white font-['Outfit']">
              {navItems.find((item) => item.path === location.pathname)?.label || 'Admin Management'}
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#FFD165] border border-[#D4AF37]/30 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Authenticated Session</span>
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#0B0B0B]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
