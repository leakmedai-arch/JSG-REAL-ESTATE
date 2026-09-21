import React, { useState } from 'react';
import { Heart, Share2, Bell, Sparkles, ExternalLink, ShieldCheck, Trophy, Calendar, DollarSign, MessageCircle } from 'lucide-react';

interface StreamInfoProps {
  title: string;
  streamerName: string;
  category: string;
  viewerCount?: number;
}

export const StreamInfo: React.FC<StreamInfoProps> = ({
  title,
  streamerName,
  category,
  viewerCount = 1420
}) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(382);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'about' | 'schedule' | 'support'>('about');

  const toggleLike = () => {
    if (hasLiked) {
      setLikes((l) => l - 1);
      setHasLiked(false);
    } else {
      setLikes((l) => l + 1);
      setHasLiked(true);
    }
  };

  return (
    <div id="stream-info-card" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl space-y-6">
      {/* Top Profile & Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&auto=format&fit=crop&q=80"
              alt={streamerName}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-500/50"
            />
            <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 rounded-full text-slate-950">
              <ShieldCheck className="w-3 h-3 stroke-[3]" />
            </div>
          </div>

          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
              <span className="font-semibold text-amber-400">{streamerName}</span>
              <span>•</span>
              <span className="px-2 py-0.5 bg-slate-800 rounded-full text-slate-300 font-medium">
                {category}
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live in 1080p60
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleLike}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${
              hasLiked
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-400' : ''}`} />
            {likes}
          </button>

          <button
            type="button"
            onClick={() => setIsFollowing(!isFollowing)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              isFollowing
                ? 'bg-slate-800 border border-slate-700 text-slate-300'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            {isFollowing ? 'Following' : 'Follow'}
          </button>

          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title, url: window.location.href }).catch(() => {});
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
            className="p-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-300 text-xs transition-colors cursor-pointer"
            title="Share Stream"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Goal Bar */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" /> New Stream Gear Goal
          </span>
          <span className="font-mono text-amber-400">74% ($740 / $1,000)</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" style={{ width: '74%' }} />
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-slate-800 gap-6 text-sm">
        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`pb-3 font-medium transition-colors cursor-pointer relative ${
            activeTab === 'about' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          About the Broadcast
          {activeTab === 'about' && (
            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-400 rounded-full" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('schedule')}
          className={`pb-3 font-medium transition-colors cursor-pointer relative ${
            activeTab === 'schedule' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Weekly Schedule
          {activeTab === 'schedule' && (
            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-400 rounded-full" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('support')}
          className={`pb-3 font-medium transition-colors cursor-pointer relative ${
            activeTab === 'support' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Creator Links &amp; Tips
          {activeTab === 'support' && (
            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-400 rounded-full" />
          )}
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'about' && (
        <div className="text-sm text-slate-300 leading-relaxed space-y-3">
          <p>
            Welcome to the live interactive stream broadcast! This website is engineered with zero-buffer
            responsive video playback, automated browser autoplay workarounds, and synchronized live community chat.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-2.5 py-1 bg-slate-800/80 border border-slate-700/60 rounded-lg text-xs text-slate-300">
              🎮 High FPS Gameplay
            </span>
            <span className="px-2.5 py-1 bg-slate-800/80 border border-slate-700/60 rounded-lg text-xs text-slate-300">
              ⚡ Ultra-Low Latency
            </span>
            <span className="px-2.5 py-1 bg-slate-800/80 border border-slate-700/60 rounded-lg text-xs text-slate-300">
              💬 Interactive Chat Room
            </span>
            <span className="px-2.5 py-1 bg-slate-800/80 border border-slate-700/60 rounded-lg text-xs text-slate-300">
              🛡️ Ad-Free CDN Architecture
            </span>
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Calendar className="w-3.5 h-3.5" /> Monday &amp; Wednesday
            </div>
            <div className="text-slate-200 font-medium">Ranked Arena &amp; Viewers Squad</div>
            <div className="text-slate-500">6:00 PM - 10:00 PM EST</div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Calendar className="w-3.5 h-3.5" /> Friday Night Live
            </div>
            <div className="text-slate-200 font-medium">Community Game Night &amp; Giveaway</div>
            <div className="text-slate-500">8:00 PM - Midnight EST</div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Calendar className="w-3.5 h-3.5" /> Sunday Chill
            </div>
            <div className="text-slate-200 font-medium">Coding &amp; Creative Live Stream</div>
            <div className="text-slate-500">2:00 PM - 6:00 PM EST</div>
          </div>
        </div>
      )}

      {activeTab === 'support' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            Support the stream directly. 100% of contributions go directly toward improving production quality.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-colors"
            >
              <DollarSign className="w-3.5 h-3.5" /> Tip via Stripe / Card
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold hover:bg-indigo-500/20 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Join Discord Server
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold hover:bg-purple-500/20 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Twitch Channel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
