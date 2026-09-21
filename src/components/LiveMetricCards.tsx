import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MapPin, 
  Building2, 
  Award, 
  HeartHandshake, 
  Sparkles, 
  TrendingUp, 
  Crown,
  Compass,
  ArrowUpRight
} from 'lucide-react';

interface MetricItem {
  id: string;
  targetNum: number;
  suffix: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  accent: string;
  badge: string;
}

const METRICS: MetricItem[] = [
  {
    id: 'areas',
    targetNum: 12,
    suffix: '+',
    label: 'Dubai Prime Areas',
    sublabel: 'Palm, Hills, Downtown & Marina',
    icon: MapPin,
    accent: '#b89759',
    badge: 'Core Enclaves'
  },
  {
    id: 'listings',
    targetNum: 250,
    suffix: '+',
    label: 'Curated Portfolios',
    sublabel: 'Vetted Bilateral Mandates',
    icon: Building2,
    accent: '#10b981',
    badge: 'Direct VIP'
  },
  {
    id: 'experience',
    targetNum: 18,
    suffix: '+',
    label: 'Years of Expertise',
    sublabel: 'Continuous Dubai Market Intel',
    icon: Award,
    accent: '#d4af37',
    badge: 'Since 2008'
  },
  {
    id: 'focus',
    targetNum: 100,
    suffix: '%',
    label: 'Private Client Focus',
    sublabel: 'Discreet Wealth Advisory',
    icon: HeartHandshake,
    accent: '#b89759',
    badge: 'Fiduciary'
  }
];

interface BackgroundTickerItem {
  id: string;
  enclave: string;
  stat: string;
  badge: string;
  link?: string;
}

const BACKGROUND_ENCLAVES: BackgroundTickerItem[] = [
  { id: 'b1', enclave: 'Palm Jumeirah', stat: 'AED 4,850/sq.ft · +18.4% Cap Gain', badge: 'Frond Mansions' },
  { id: 'b2', enclave: 'Downtown Dubai', stat: 'Burj Crown Sky Suites · 8.2% Net Yield', badge: 'High Yield' },
  { id: 'b3', enclave: 'Dubai Hills Estate', stat: 'Fairway Championship Villas · +21.5% 3-Yr ROI', badge: 'Championship' },
  { id: 'b4', enclave: 'Jumeirah Bay Island', stat: 'Bvlgari Sovereign Plots · Trophy Realization', badge: 'Ultra-Prime' },
  { id: 'b5', enclave: 'Emirates Hills', stat: 'Private Lakefront Compounds · AED 3,900/sq.ft', badge: 'Off-Market' },
  { id: 'b6', enclave: 'Dubai Islands', stat: 'Waterfront Mega-Masterplan · 0% Agency Fee', badge: 'Pre-Launch' },
  { id: 'b7', enclave: 'DIFC Financial', stat: 'Branded Executive Living · 8.8% Cap Rate', badge: 'Capital Hub' },
  { id: 'b8', enclave: 'Bluewaters Island', stat: 'Coastal Haute Penthouses · Direct Owner', badge: 'Waterfront' }
];

interface ReactiveGlassCardProps {
  metric: MetricItem;
  delayIndex: number;
}

const ReactiveGlassCard: React.FC<ReactiveGlassCardProps> = ({ metric, delayIndex }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rotX: 0, rotY: 0, glowX: 50, glowY: 50, isHovered: false });
  const [currentCount, setCurrentCount] = useState(0);
  const animFrameId = useRef<number | null>(null);

  // Live counter animation on mount
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1600;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCurrentCount(Math.floor(easeOut * metric.targetNum));

      if (progress < 1) {
        animFrameId.current = requestAnimationFrame(step);
      } else {
        setCurrentCount(metric.targetNum);
      }
    };

    animFrameId.current = requestAnimationFrame(step);
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [metric.targetNum]);

  // High-performance 60fps 3D mouse tracking with zero latency
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Generous, attractive 3D tilt angles (up to 14° Y, 12° X)
    const rotY = ((x - centerX) / centerX) * 14;
    const rotX = -((y - centerY) / centerY) * 12;
    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;

    setTilt({ rotX, rotY, glowX, glowY, isHovered: true });
  }, []);

  const handleMouseEnter = () => {
    setTilt((prev) => ({ ...prev, isHovered: true }));
  };

  const handleMouseLeave = () => {
    // Smooth reset on exit
    setTilt({ rotX: 0, rotY: 0, glowX: 50, glowY: 50, isHovered: false });
  };

  const IconComponent = metric.icon;

  // Dynamic directional shadow calculation: casts shadow away from cursor in 3D
  const shadowX = -tilt.rotY * 2.2;
  const shadowY = tilt.rotX * 2.2 + 16;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative select-none cursor-pointer py-1"
      style={{
        perspective: '1200px',
      }}
    >
      {/* 3D INNER CARD: Responds immediately to mouse movement */}
      <div
        className={`relative rounded-2xl p-4 sm:p-5 border ${
          tilt.isHovered
            ? 'border-[#b89759] bg-white/95'
            : 'border-[#dfd5c4] bg-white/90'
        } backdrop-blur-xl overflow-hidden`}
        style={{
          // When hovered: ultra-fast 0.05s linear response to eliminate lag!
          // When unhovered: smooth 0.5s organic spring return to resting position
          transition: tilt.isHovered 
            ? 'transform 0.05s linear, border-color 0.2s ease-out, background-color 0.2s ease-out' 
            : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease-out, border-color 0.3s ease-out',
          transform: `rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg) ${
            tilt.isHovered ? 'translateZ(26px) translateY(-6px) scale(1.03)' : 'translateZ(0px) translateY(0px) scale(1)'
          }`,
          transformStyle: 'preserve-3d',
          boxShadow: tilt.isHovered
            ? `${shadowX}px ${shadowY}px 32px -4px rgba(12, 38, 30, 0.22), 0 0 20px rgba(212, 175, 55, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.9)`
            : '0 8px 24px -4px rgba(12, 38, 30, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        }}
      >
        {/* Real-Time Specular Holographic Cursor Spotlight */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl z-20 transition-opacity duration-200"
          style={{
            opacity: tilt.isHovered ? 0.9 : 0,
            background: `radial-gradient(180px circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(212, 175, 55, 0.28), rgba(255, 255, 255, 0.6), transparent 75%)`,
            mixBlendMode: 'soft-light'
          }}
        />

        {/* Ambient Top Hairline Prismatic Gold Glaze */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent pointer-events-none z-25" />

        {/* Periodic Specular Glass Beam Sweep */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-15">
          <div 
            className="absolute -top-10 -bottom-10 w-28 bg-gradient-to-r from-transparent via-white/70 to-transparent animate-glass-shine pointer-events-none"
            style={{ animationDelay: `${delayIndex * 1.1}s` }}
          />
        </div>

        {/* ===================================================================== */}
        {/* 3D FLOATING CONTENT LAYERS (Popping out with translateZ depth)         */}
        {/* ===================================================================== */}
        <div className="relative z-30 flex flex-col justify-between h-full [transform-style:preserve-3d]">
          {/* Top Row: Mini Category Pill & 3D Floating Gold Icon Badge */}
          <div className="flex items-center justify-between gap-2 mb-3 [transform-style:preserve-3d]">
            <span 
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase tracking-wider bg-[#0c261e]/5 text-[#0c261e] border border-[#e8dfd3]"
              style={{
                transform: 'translateZ(18px)',
                transition: 'transform 0.1s ease-out'
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#b89759]" />
              {metric.badge}
            </span>

            {/* Floating 3D Metallic Jewel Icon Badge */}
            <div 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#fbf8f2] via-[#f5ede0] to-[#e8d7be] border border-[#d9c7a7] flex items-center justify-center shrink-0 text-[#8c6d33] shadow-md transition-transform duration-200"
              style={{
                transform: tilt.isHovered ? 'translateZ(42px) scale(1.12)' : 'translateZ(20px) scale(1)',
                boxShadow: tilt.isHovered 
                  ? '0 12px 20px -3px rgba(184, 151, 89, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.9)' 
                  : '0 4px 10px rgba(0, 0, 0, 0.06)'
              }}
            >
              <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-xs" />
            </div>
          </div>

          {/* Center: Large High-Contrast 3D Numeric Display */}
          <div 
            className="mt-1 [transform-style:preserve-3d]"
            style={{
              transform: tilt.isHovered ? 'translateZ(34px)' : 'translateZ(10px)',
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0c261e] font-serif-display leading-none flex items-baseline gap-0.5">
              <span>{currentCount}</span>
              <span className="text-[#b89759] font-bold text-xl sm:text-2xl lg:text-3xl">
                {metric.suffix}
              </span>
            </div>

            {/* Label */}
            <h4 className="text-xs sm:text-[13px] font-bold text-[#1c1917] tracking-tight mt-1.5">
              {metric.label}
            </h4>

            {/* Micro Sublabel */}
            <p className="text-[10px] sm:text-[10.5px] text-[#64748b] font-medium mt-0.5 truncate">
              {metric.sublabel}
            </p>
          </div>

          {/* Bottom Interactive Prompt Indicator */}
          <div 
            className="mt-3 pt-2.5 border-t border-[#f0e8dc] flex items-center justify-between text-[10px] text-[#8c6d33] font-bold [transform-style:preserve-3d]"
            style={{
              transform: tilt.isHovered ? 'translateZ(24px)' : 'translateZ(5px)',
              transition: 'transform 0.1s ease-out'
            }}
          >
            <span className="flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#b89759]" />
              Verified Metric
            </span>
            <ArrowUpRight className={`w-3 h-3 transition-transform ${tilt.isHovered ? 'translate-x-0.5 -translate-y-0.5 text-[#b89759]' : 'opacity-60'}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const LiveMetricCards: React.FC<{ className?: string; onNavigate?: (path: string) => void }> = ({ 
  className = '',
  onNavigate
}) => {
  return (
    <div className={`relative w-full overflow-hidden py-4 sm:py-6 ${className}`}>
      {/* ========================================================================= */}
      {/* 1. INFINITE SCROLL STREAM IN THE BACKGROUND                               */}
      {/* Runs continuously behind the cards as requested                           */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 flex flex-col justify-center pointer-events-none select-none z-0 opacity-40 hover:opacity-75 transition-opacity duration-300">
        {/* Soft Warm Halos */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[450px] h-[180px] rounded-full bg-gradient-to-r from-[#d4af37]/15 to-transparent blur-[70px]" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[450px] h-[180px] rounded-full bg-gradient-to-l from-[#0c261e]/15 to-transparent blur-[70px]" />

        {/* Ambient Top Infinite Ticker (Scrolling Right) */}
        <div className="w-full overflow-hidden py-1">
          <div className="animate-marquee-right flex items-center gap-6 whitespace-nowrap will-change-transform">
            {[...BACKGROUND_ENCLAVES, ...BACKGROUND_ENCLAVES, ...BACKGROUND_ENCLAVES].map((item, idx) => (
              <div 
                key={`bg-tick-${item.id}-${idx}`}
                className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#fdfbf7]/80 border border-[#e8dfd3] shadow-xs"
              >
                <Compass className="w-3 h-3 text-[#b89759]" />
                <span className="text-[11px] font-bold text-[#0c261e] tracking-wide uppercase">
                  {item.enclave}
                </span>
                <span className="text-[10px] text-[#8c6d33] font-semibold">
                  {item.stat}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#0c261e]/5 text-[#0c261e]">
                  {item.badge}
                </span>
                <span className="text-[#b89759]/50 text-[9px]">❖</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ambient Bottom Infinite Ticker (Scrolling Left) */}
        <div className="w-full overflow-hidden py-1 mt-2">
          <div className="animate-marquee-left flex items-center gap-6 whitespace-nowrap will-change-transform">
            {[...BACKGROUND_ENCLAVES, ...BACKGROUND_ENCLAVES, ...BACKGROUND_ENCLAVES].map((item, idx) => (
              <div 
                key={`bg-tick-2-${item.id}-${idx}`}
                className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#fdfbf7]/80 border border-[#e8dfd3] shadow-xs"
              >
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                <span className="text-[11px] font-bold text-[#0c261e] tracking-wide uppercase">
                  {item.enclave}
                </span>
                <span className="text-[10px] text-[#475569] font-medium">
                  {item.stat}
                </span>
                <span className="text-[#b89759]/50 text-[9px]">❖</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle Feathering Gradients on Left and Right edges for Infinite Stream */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#fbf9f4] to-transparent z-5 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#fbf9f4] to-transparent z-5 pointer-events-none" />

      {/* ========================================================================= */}
      {/* 2. FOREGROUND LAYER: 4 3D REACTIVE GLASS CARDS FLOATING ON TOP            */}
      {/* Responds actively to cursor position with 3D tilt, depth and specular     */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {METRICS.map((metric, idx) => (
            <ReactiveGlassCard key={metric.id} metric={metric} delayIndex={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};
