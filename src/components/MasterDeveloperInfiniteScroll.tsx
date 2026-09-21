import React, { useState } from 'react';
import { 
  Building2, 
  Sparkles, 
  ArrowUpRight, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  TrendingUp,
  MapPin,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { DEVELOPERS, Developer } from '../data/realEstateData';
import { DeveloperBrandLogo } from './DeveloperBrandLogo';

interface MasterDeveloperInfiniteScrollProps {
  onNavigate: (path: string) => void;
  onSelectDeveloper?: (developer: Developer) => void;
}

export const MasterDeveloperInfiniteScroll: React.FC<MasterDeveloperInfiniteScrollProps> = ({ 
  onNavigate,
  onSelectDeveloper 
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredDevId, setHoveredDevId] = useState<string | null>(null);

  const handleDevClick = (dev: Developer) => {
    if (onSelectDeveloper) {
      onSelectDeveloper(dev);
    }
    onNavigate('/new-projects/developers');
  };

  return (
    <section 
      aria-label="UAE Master Developers Infinite Marquee"
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#091814] via-[#0d221c] to-[#091814] text-white py-10 sm:py-14 border-y border-[#b58b4a]/30 shadow-2xl select-none"
    >
      {/* Background Luxury Ambient Glows */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#b58b4a]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17362f] border border-[#b58b4a]/40 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d9bf8c] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d9bf8c]" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#d9bf8c]">
              DIRECT TIER-1 ALLOCATIONS · 0% BROKER COMMISSION
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#fbfaf7] tracking-tight font-serif-display">
            Official Master Developers Alliance
          </h2>
          <p className="text-xs sm:text-sm text-[#d9cfc1] max-w-2xl leading-relaxed">
            Direct priority launch access, pre-public price lists, and developer-backed 80/20 &amp; post-handover payment structures.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] text-[#b58b4a] font-medium hidden sm:inline">
            Hover to pause &bull; Click to inspect developer portfolio
          </span>
          <button
            type="button"
            onClick={() => onNavigate('/new-projects/developers')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] hover:brightness-110 text-[#0d221c] font-black text-xs shadow-lg transition-all cursor-pointer flex items-center gap-1.5 border border-[#b58b4a]/60 hover:scale-102"
          >
            <span>Explore All Developers</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Infinite Seamless Scrolling Container */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Soft edge blur masks */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-[#091814] via-[#091814]/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-[#091814] via-[#091814]/80 to-transparent z-20 pointer-events-none" />

        {/* Moving Marquee Row */}
        <div 
          className={`flex items-stretch gap-5 w-max animate-marquee-left will-change-transform ${
            isPaused ? 'ticker-paused' : ''
          }`}
          style={{ animationDuration: '45s' }}
        >
          {[...DEVELOPERS, ...DEVELOPERS, ...DEVELOPERS].map((dev, idx) => {
            const isCardHovered = hoveredDevId === `${dev.id}-${idx}`;

            return (
              <div
                key={`${dev.id}-${idx}`}
                onClick={() => handleDevClick(dev)}
                onMouseEnter={() => setHoveredDevId(`${dev.id}-${idx}`)}
                onMouseLeave={() => setHoveredDevId(null)}
                className="w-[300px] sm:w-[350px] shrink-0 rounded-2xl bg-[#112923]/90 hover:bg-[#15362e] border border-[#b58b4a]/35 hover:border-[#d9bf8c] p-5 shadow-xl hover:shadow-[0_12px_32px_rgba(181,139,74,0.25)] transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Subtle top golden hairline */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#d9bf8c] to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Header: Official Logo + Handover Badge */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="h-12 w-32 sm:h-14 sm:w-36 bg-[#091814] rounded-xl px-2.5 py-1.5 border border-[#b58b4a]/30 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-[#d9bf8c]/60 transition-colors">
                      <DeveloperBrandLogo
                        id={dev.id}
                        name={dev.name}
                        logoUrl={dev.logo}
                        className="max-h-full max-w-full object-contain filter brightness-105 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#091814]/80 text-[#d9bf8c] text-[10px] font-bold border border-[#b58b4a]/40 shadow-xs">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>{dev.handoverRate} Delivery</span>
                      </span>
                      <div className="text-[10px] text-[#e2d9cd] mt-0.5 font-mono">
                        Est. {dev.founded}
                      </div>
                    </div>
                  </div>

                  {/* Developer Name & Tagline */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-[#d9bf8c] transition-colors flex items-center gap-1.5">
                        <span>{dev.name}</span>
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#d9bf8c]" />
                      </h3>
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        {dev.projectsCount}+ Launches
                      </span>
                    </div>

                    <p className="text-xs text-[#d9bf8c] font-medium italic line-clamp-1">
                      &ldquo;{dev.tagline}&rdquo;
                    </p>

                    <p className="text-[11px] text-[#c4b9a8] line-clamp-2 leading-relaxed mt-1">
                      {dev.description}
                    </p>
                  </div>
                </div>

                {/* Footer: Key Master Projects */}
                <div className="pt-3.5 mt-3.5 border-t border-[#b58b4a]/25 space-y-2">
                  <div className="text-[10px] uppercase font-black tracking-wider text-[#d9bf8c]">
                    Flagship Master Enclaves:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {dev.featuredProjects.slice(0, 3).map((proj, pIdx) => (
                      <span
                        key={pIdx}
                        className="px-2 py-0.5 rounded-md bg-[#091814]/90 text-white text-[10px] font-medium border border-[#b58b4a]/30 group-hover:border-[#d9bf8c]/50 transition-colors truncate max-w-[150px]"
                      >
                        {proj}
                      </span>
                    ))}
                    {dev.featuredProjects.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-[#091814]/90 text-[#d9bf8c] text-[10px] font-mono border border-[#b58b4a]/30">
                        +{dev.featuredProjects.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust & Guarantee Micro-Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-5 border-t border-[#b58b4a]/20 flex flex-wrap items-center justify-between gap-4 text-xs text-[#d9cfc1] relative z-10">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[#d9bf8c]" />
          <span className="font-semibold text-white">Direct Developer Price Protection</span>
          <span className="text-[#b58b4a]">&bull;</span>
          <span>No Agent Fees</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Escrow Protected (DLD Law No. 8)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>UAE Golden Visa Certified</span>
          </div>
        </div>
      </div>
    </section>
  );
};
