import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertTriangle, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Building2
} from 'lucide-react';
import { JSGLogo } from '../../components/JSGLogo';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [requires2fa, setRequires2fa] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockCountdown, setLockCountdown] = useState<number | null>(null);

  // Check if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('jsg_admin_token');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

  // Handle brute force countdown timer
  useEffect(() => {
    if (lockCountdown === null || lockCountdown <= 0) return;
    const interval = setInterval(() => {
      setLockCountdown(prev => (prev && prev > 1 ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [lockCountdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockCountdown) return;

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, twoFactorCode })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('jsg_admin_token', data.token);
        localStorage.setItem('jsg_admin_user', JSON.stringify(data.user));
        navigate('/admin');
      } else {
        if (data.requires2fa) {
          setRequires2fa(true);
          setError('Please enter your 6-digit Two-Factor Authentication code.');
        } else if (data.locked && data.remainingSeconds) {
          setLockCountdown(data.remainingSeconds);
          setError(`Too many failed login attempts. IP temporarily locked for ${data.remainingSeconds}s.`);
        } else {
          setError(data.error || 'Authentication failed. Please verify your credentials.');
        }
      }
    } catch (err) {
      setError('Connection error with the security gateway. Please verify server status.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemoCredentials = () => {
    setEmail('maleeka');
    setPassword('JSG@Admin2026!');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e241f] via-[#14332b] to-[#0a1b17] flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden py-12">
      {/* Background Architectural Grid & Subtle Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#b58b4a]/15 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#b58b4a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center space-y-3">
          <JSGLogo size="lg" theme="dark" showText={false} className="hover:scale-105 transition-transform" />
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-[#fbfaf7]">
              MALEEKA — JSG REAL ESTATE
            </h1>
            <p className="text-xs uppercase tracking-[0.25em] text-[#d9bf8c] font-bold">
              Website Content Control Panel · Admin: Maleeka
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#17362f]/90 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.6)] border border-[#b58b4a]/30 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs font-bold text-[#fae7b5]">
              <ShieldCheck className="w-4 h-4 text-[#b58b4a]" />
              <span>TLS 1.3 · High Security Session</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">PORT 3000</span>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          {lockCountdown && (
            <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs text-center font-bold">
              Rate Limiter Active. Unlock in: <span className="text-white font-mono">{lockCountdown}s</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Admin Email / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jsgrealestate.ae"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-[#b58b4a] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Master Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('For password recovery, please contact system admin or check server terminal.')}
                  className="text-[11px] text-[#d9bf8c] hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-[#b58b4a] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 2FA Input (if triggered) */}
            {requires2fa && (
              <div className="space-y-1.5 pt-2 animate-fade-in">
                <label className="block text-xs font-semibold text-[#fae7b5] uppercase tracking-wider">
                  2FA Verification Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#b58b4a]">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    placeholder="Enter 123456"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-[#b58b4a]/50 text-[#fae7b5] placeholder:text-slate-500 text-xs tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-[#b58b4a]"
                  />
                </div>
                <span className="text-[10px] text-slate-400">Simulation code: 123456</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || Boolean(lockCountdown)}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#b58b4a] via-[#c9a35e] to-[#d9bf8c] text-[#142621] font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 active:scale-[0.99] disabled:opacity-40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authorizing Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="pt-4 border-t border-white/10 flex flex-col items-center gap-2">
            <span className="text-[11px] text-slate-400">Authorized Personnel Demo Access</span>
            <button
              type="button"
              onClick={handleUseDemoCredentials}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-[#fae7b5] border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#b58b4a]" />
              <span>Fill Default Master Credentials</span>
            </button>
          </div>
        </div>

        {/* Back to Public Site */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-xs text-slate-400 hover:text-[#d9bf8c] transition-colors"
          >
            ← Return to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
