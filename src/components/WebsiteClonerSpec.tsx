import React, { useState } from 'react';
import { Globe, Wand2, Sparkles, Check, Copy, ArrowRight, Layers, Smartphone, MessageSquare, Flame } from 'lucide-react';
import { SiteCloneRequest } from '../types';

interface WebsiteClonerSpecProps {
  onApplySiteUrl: (url: string) => void;
}

export const WebsiteClonerSpec: React.FC<WebsiteClonerSpecProps> = ({ onApplySiteUrl }) => {
  const [url, setUrl] = useState<string>('');
  const [siteName, setSiteName] = useState<string>('');
  const [brokenReason, setBrokenReason] = useState<string>('stream-player-error');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'responsive-player',
    'live-chat',
    'theater-mode',
    'fast-load'
  ]);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const featureOptions = [
    { id: 'responsive-player', label: 'Ultra-Responsive Player', desc: 'Auto-adapts to 16:9, vertical mobile, and theater mode' },
    { id: 'live-chat', label: 'Interactive Live Chat', desc: 'Real-time reactions, user badges, moderation tools' },
    { id: 'theater-mode', label: 'Cinema Theater Mode', desc: 'Expands video while keeping chat accessible' },
    { id: 'fast-load', label: 'Instant Load Time', desc: 'Lightweight code with 0 slow external bloated scripts' },
    { id: 'schedule-vods', label: 'Schedule & VOD Highlights', desc: 'Show upcoming stream countdowns and past recorded clips' },
    { id: 'donations-tips', label: 'Support & Social Links', desc: 'Direct links to Twitch, YouTube, Kick, Discord & tip jars' }
  ];

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleTestNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onApplySiteUrl(url.trim());
    }
  };

  const generateSummaryText = () => {
    const featuresList = selectedFeatures
      .map((id) => featureOptions.find((f) => f.id === id)?.label)
      .filter(Boolean)
      .join(', ');

    return `Here is the website I want to rebuild: ${url || '[PASTE_LINK_HERE]'}
App Name: ${siteName || 'Live Stream Hub'}
What was broken: ${brokenReason}
Key improvements to build: ${featuresList}
Additional notes: ${customNotes || 'Make it modern, sleek, and high-performance.'}`;
  };

  const copySummary = () => {
    navigator.clipboard.writeText(generateSummaryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div id="website-rebuilder-form" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight">Rebuild & Upgrade Your Website</h3>
            <p className="text-sm text-slate-400">Share your website link and tell us what you want improved</p>
          </div>
        </div>
        <span className="text-xs font-mono uppercase bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/30">
          Ready to clone
        </span>
      </div>

      <form onSubmit={handleTestNow} className="space-y-5">
        {/* URL Input */}
        <div>
          <label htmlFor="target-site-url" className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
            Website URL or Stream Link
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="target-site-url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-website.com or stream link (Twitch, YouTube, HLS .m3u8)"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-all font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={!url.trim()}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-semibold text-sm rounded-xl cursor-pointer transition-colors flex items-center gap-2 shrink-0 shadow-lg"
            >
              <Sparkles className="w-4 h-4" /> Test Link Live
            </button>
          </div>
        </div>

        {/* What was broken */}
        <div>
          <label htmlFor="broken-select" className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
            Why didn&apos;t it work previously during your live stream?
          </label>
          <select
            id="broken-select"
            value={brokenReason}
            onChange={(e) => setBrokenReason(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none cursor-pointer"
          >
            <option value="Stream player showed black/grey screen or failed to embed">
              Stream player showed black/grey screen or failed to embed
            </option>
            <option value="Autoplay audio was blocked / viewers heard nothing">
              Autoplay audio was blocked / viewers heard nothing
            </option>
            <option value="Website lagged, crashed, or took too long to load on mobile">
              Website lagged, crashed, or took too long to load on mobile
            </option>
            <option value="Mixed content error (HTTP stream blocked on HTTPS site)">
              Mixed content error (HTTP stream blocked on HTTPS site)
            </option>
            <option value="Outdated design / wanted better layout with live chat & modern aesthetics">
              Outdated design / wanted better layout with live chat &amp; modern aesthetics
            </option>
          </select>
        </div>

        {/* Feature Checkboxes */}
        <div>
          <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
            Upgrades to Include in the Rebuilt Website
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {featureOptions.map((opt) => {
              const isSelected = selectedFeatures.includes(opt.id);
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => toggleFeature(opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/40 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-colors shrink-0 ${
                      isSelected
                        ? 'bg-amber-500 border-amber-500 text-slate-950'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="text-sm font-medium block text-slate-200">{opt.label}</span>
                    <span className="text-xs text-slate-400 leading-snug">{opt.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional specific notes */}
        <div>
          <label htmlFor="custom-notes" className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
            Any specific branding, colors, or sections to replicate?
          </label>
          <textarea
            id="custom-notes"
            rows={2}
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="e.g. Keep the dark neon purple theme, add my Discord link, include a donation goal bar..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 outline-none transition-all"
          />
        </div>

        {/* Copy Prompt for Agent */}
        <div className="pt-2 flex items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 truncate">
            <span className="font-semibold text-slate-200">Ready:</span> Send your link in the chat anytime!
          </div>
          <button
            type="button"
            onClick={copySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white rounded-lg transition-colors cursor-pointer shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied Specification
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" /> Copy Details for Chat
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
