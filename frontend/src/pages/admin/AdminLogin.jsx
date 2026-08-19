import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import Seo from '../../components/common/Seo';
import authService from '../../services/authService';
import officialLogo from '../../assets/jm-creations-official-logo.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to admin dashboard
    if (authService.isAuthenticated()) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login(email, password);
      if (response.success) {
        navigate('/admin', { replace: true });
      } else {
        setError(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="Admin Login — JM Creations Control Center" />
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center p-4 selection:bg-[#D4AF37]/30 selection:text-[#FFD165]">
        {/* Subtle background glow */}
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 sm:p-10 max-w-md w-full shadow-2xl space-y-6 relative z-10">
          <div className="text-center space-y-4">
            <div className="inline-block p-2.5 bg-[#F5C553] rounded-2xl shadow-xl shadow-[#F5C553]/20 transition-transform hover:scale-105 mx-auto">
              <img
                src={officialLogo}
                alt="JM Creations - End-to-End Business Solutions"
                className="h-16 w-auto object-contain rounded-xl"
              />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight font-['Outfit']">
                JM CREATIONS
              </h1>
              <p className="text-xs text-[#F5C553] font-extrabold uppercase tracking-widest mt-1">
                Authorized Admin Control Center
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@jmcreations.com"
                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all placeholder:text-gray-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#151515] border border-white/10 rounded-xl pl-4 pr-11 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-3.5 rounded-xl text-xs uppercase font-extrabold tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>SIGN IN</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-white/5 text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Protected by JWT Server Authorization</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
