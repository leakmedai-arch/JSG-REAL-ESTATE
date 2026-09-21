import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  Unlock, 
  CheckCircle, 
  RefreshCw, 
  ShieldAlert, 
  Eye, 
  Server, 
  Key
} from 'lucide-react';

interface SecurityCenterViewerProps {
  authToken: string;
  showNotification: (msg: string) => void;
}

export const SecurityCenterViewer: React.FC<SecurityCenterViewerProps> = ({
  authToken,
  showNotification
}) => {
  const [secStatus, setSecStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchSecurityStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/security/status', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSecStatus(data);
      }
    } catch (err) {
      console.error('Failed to fetch security status', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityStatus();
  }, [authToken]);

  const handleUnlockIp = async (ip: string) => {
    try {
      const res = await fetch('/api/admin/security/unlock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ ip })
      });
      if (res.ok) {
        showNotification(`Lock removed for IP: ${ip}`);
        fetchSecurityStatus();
      } else {
        alert('Failed to unlock IP');
      }
    } catch (err) {
      alert('Error unlocking IP');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Security & Active Protection Center</h1>
          <p className="text-xs text-[#d9bf8c]">
            Real-time brute-force rate-limiting, IP lockout status, cryptographic password standards, and OWASP audit.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchSecurityStatus}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#fae7b5] font-bold border border-white/10 flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Status</span>
        </button>
      </div>

      {/* 1. Rate Limiting Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold">Brute-Force Guard</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">Active</div>
          <div className="text-[11px] text-[#fae7b5]">Max 5 attempts / 15-minute lock</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold">Current Locked IPs</span>
            <Lock className="w-5 h-5 text-[#b58b4a]" />
          </div>
          <div className="text-2xl font-black text-white">
            {secStatus?.activeLockouts?.length || 0}
          </div>
          <div className="text-[11px] text-slate-400">Monitored origin addresses</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold">Cryptographic Hash</span>
            <Key className="w-5 h-5 text-[#fae7b5]" />
          </div>
          <div className="text-2xl font-black text-white">PBKDF2-SHA512</div>
          <div className="text-[11px] text-emerald-400">10,000 passes + 64-byte salt</div>
        </div>
      </div>

      {/* 2. Active IP Lockouts Table */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-[#fae7b5] flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#b58b4a]" />
          <span>Active Lockouts & IP Rate Limiter Entries</span>
        </h2>

        {(!secStatus?.activeLockouts || secStatus.activeLockouts.length === 0) ? (
          <div className="p-8 rounded-2xl bg-black/20 border border-white/5 text-center text-slate-400">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            <div className="font-bold text-white text-sm">No Active Lockouts</div>
            <div className="text-[11px] text-slate-400 mt-1">All client IP addresses are in good standing with zero brute-force breaches.</div>
          </div>
        ) : (
          <div className="divide-y divide-white/5 rounded-2xl overflow-hidden border border-white/10 bg-black/20">
            {secStatus.activeLockouts.map((item: any) => (
              <div key={item.ip} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-white text-sm">{item.ip}</div>
                  <div className="text-[11px] text-red-300">
                    {item.failedAttempts} failed attempts · Locked until {new Date(item.lockedUntil).toLocaleTimeString()}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleUnlockIp(item.ip)}
                  className="px-3.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-red-500/30"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Release Lock</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. OWASP & Platform Security Checklist */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-[#fae7b5] flex items-center gap-2">
          <Server className="w-4 h-4 text-[#b58b4a]" />
          <span>Platform Hardening & Compliance Checklist</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5 flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white text-xs">Content Security Policy (CSP)</div>
              <div className="text-slate-400 text-[11px]">Strict script-src, style-src, and frame-ancestors enforcement.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5 flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white text-xs">Strict Transport Security (HSTS)</div>
              <div className="text-slate-400 text-[11px]">max-age=31536000; includeSubDomains; preload enabled.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5 flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white text-xs">X-Content-Type-Options: nosniff</div>
              <div className="text-slate-400 text-[11px]">Prevents MIME type sniffing vulnerabilities.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5 flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white text-xs">X-Frame-Options: SAMEORIGIN</div>
              <div className="text-slate-400 text-[11px]">Protects admin console from clickjacking attempts.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5 flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white text-xs">Timing-Safe Password Comparison</div>
              <div className="text-slate-400 text-[11px]">crypto.timingSafeEqual guards against timing side-channel attacks.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5 flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white text-xs">Bearer Token Authentication</div>
              <div className="text-slate-400 text-[11px]">Signed JWT tokens required for all /api/admin/* endpoints.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
