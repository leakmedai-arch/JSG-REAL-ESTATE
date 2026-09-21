import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, ExternalLink, ShieldAlert, Radio, VolumeX, Globe } from 'lucide-react';

interface DiagnosticIssue {
  id: string;
  title: string;
  badge: string;
  severity: 'high' | 'medium' | 'low';
  icon: React.ComponentType<{ className?: string }>;
  whyItFailed: string;
  howWeFixIt: string;
  codeSnippet?: string;
}

const COMMON_ISSUES: DiagnosticIssue[] = [
  {
    id: 'twitch-parent',
    title: 'Twitch Embed "Blocked / Grey Screen"',
    badge: 'Twitch Error',
    severity: 'high',
    icon: Radio,
    whyItFailed:
      'Twitch requires an exact `&parent=YOUR_DOMAIN` parameter in the iframe URL. If you shared it on stream or moved from localhost to a live URL without updating the parent parameter, Twitch security completely halts the player.',
    howWeFixIt:
      'Our player automatically detects the active hostname at runtime and dynamically injects `&parent=${window.location.hostname}` so it never breaks.',
    codeSnippet: 'https://player.twitch.tv/?channel=NAME&parent=yourdomain.com&muted=true'
  },
  {
    id: 'mixed-content',
    title: 'Mixed Content (HTTP Stream on HTTPS Site)',
    badge: 'Browser Security',
    severity: 'high',
    icon: ShieldAlert,
    whyItFailed:
      'If your stream server (e.g., OBS RTMP, Node-Media-Server, NGINX RTMP) outputs `http://...` and your website runs on `https://...`, modern browsers silently block the video stream with a mixed-content error.',
    howWeFixIt:
      'We set up SSL certificates on stream endpoints or proxy the HLS stream securely over HTTPS with CORS enabled.',
    codeSnippet: '// Bad: http://ip:8080/live.m3u8\n// Good: https://stream.yourdomain.com/live.m3u8'
  },
  {
    id: 'autoplay-mute',
    title: 'Autoplay Blocked (Audio / Video Not Starting)',
    badge: 'Playback Policy',
    severity: 'medium',
    icon: VolumeX,
    whyItFailed:
      'Chrome, Safari, and iOS strictly prohibit video autoplay if the sound is unmuted unless the user has already clicked on the page. Without muted fallback, streams will sit frozen on black frames.',
    howWeFixIt:
      'We start playback muted with a prominent "Click to Unmute / Tap for Sound" banner, instantly solving the browser block.',
    codeSnippet: '<video autoPlay muted playsInline />'
  },
  {
    id: 'x-frame-options',
    title: 'Website Embed Refused (X-Frame-Options)',
    badge: 'Iframe Block',
    severity: 'high',
    icon: Globe,
    whyItFailed:
      'Many websites set `X-Frame-Options: SAMEORIGIN` or `frame-ancestors: none`. If you tried to embed their website inside an iframe on your stream site, the browser replaces it with a blank box.',
    howWeFixIt:
      'Instead of an unsafe iframe embed, we recreate the exact UI natively in clean, fast React code so you own 100% of the site without security blocks.'
  },
  {
    id: 'cors-hls',
    title: 'CORS Headers Missing on HLS / M3U8',
    badge: 'CORS Network Error',
    severity: 'medium',
    icon: AlertTriangle,
    whyItFailed:
      'Custom streaming servers often forget to include `Access-Control-Allow-Origin: *` in chunk responses, causing HLS.js or fetch requests to fail.',
    howWeFixIt:
      'We include built-in fallback error detection and standard CORS configuration templates for NGINX/OBS streaming.'
  }
];

export const DiagnosticsPanel: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string>('twitch-parent');

  return (
    <div id="diagnostics-panel" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight">Why Did Your Previous Live Stream Website Fail?</h3>
            <p className="text-sm text-slate-400">The 5 most frequent root causes and how we fix each one permanently</p>
          </div>
        </div>
        <span className="text-xs font-mono uppercase bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
          Root Cause Guide
        </span>
      </div>

      <div className="space-y-3">
        {COMMON_ISSUES.map((issue) => {
          const Icon = issue.icon;
          const isExpanded = expandedId === issue.id;

          return (
            <div
              key={issue.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? 'bg-slate-800/80 border-slate-700 ring-1 ring-amber-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? '' : issue.id)}
                className="w-full text-left p-4 flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      issue.severity === 'high'
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-slate-200 text-sm md:text-base">{issue.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      issue.severity === 'high'
                        ? 'bg-red-950/60 text-red-300 border border-red-800/40'
                        : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                    }`}
                  >
                    {issue.badge}
                  </span>
                  <span className="text-slate-500 text-xs">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-1 text-sm border-t border-slate-800/60 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/30">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-red-400 uppercase tracking-wide mb-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> What Caused The Failure
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{issue.whyItFailed}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> How We Solve It In This App
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{issue.howWeFixIt}</p>
                    </div>
                  </div>

                  {issue.codeSnippet && (
                    <div className="rounded-lg bg-slate-950 border border-slate-800 p-2.5 font-mono text-xs text-slate-300 overflow-x-auto">
                      <pre>{issue.codeSnippet}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
