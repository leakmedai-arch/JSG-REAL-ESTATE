import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Compass, 
  MapPin, 
  ArrowUpRight, 
  TrendingUp, 
  Sparkles, 
  Shield, 
  Building,
  Anchor,
  TreePine,
  Key
} from 'lucide-react';

interface PrimeEnclavesMarqueeProps {
  onNavigate: (path: string) => void;
}

interface EnclaveItem {
  id: string;
  enclave: string;
  type: string;
  avgSqFt: string;
  yieldOrGain: string;
  mandates: string;
  link: string;
}

const ENCLAVE_DATA: EnclaveItem[] = [
  {
    id: 'e1',
    enclave: 'Palm Jumeirah',
    type: 'Bespoke Frond Mansions',
    avgSqFt: 'AED 4,850/sq.ft',
    yieldOrGain: '+18.4% Cap Gain',
    mandates: '6 Bilateral Mandates',
    link: '/buy?area=Palm+Jumeirah'
  },
  {
    id: 'e2',
    enclave: 'Downtown Dubai',
    type: 'Burj Crown Sky Penthouses',
    avgSqFt: 'AED 3,600/sq.ft',
    yieldOrGain: '8.2% Net Yield',
    mandates: 'Instant Allocation',
    link: '/buy?area=Downtown+Dubai'
  },
  {
    id: 'e3',
    enclave: 'Dubai Hills Estate',
    type: 'Fairway Championship Villas',
    avgSqFt: 'AED 2,450/sq.ft',
    yieldOrGain: '+21.5% 3-Yr ROI',
    mandates: 'Off-Market Access',
    link: '/buy?area=Dubai+Hills'
  },
  {
    id: 'e4',
    enclave: 'Jumeirah Bay Island',
    type: 'Bvlgari Sovereign Plots',
    avgSqFt: 'AED 11,200/sq.ft',
    yieldOrGain: 'Trophy Realization',
    mandates: 'Private Desk Only',
    link: '/contact'
  },
  {
    id: 'e5',
    enclave: 'Emirates Hills',
    type: 'Private Lakefront Compounds',
    avgSqFt: 'AED 3,900/sq.ft',
    yieldOrGain: '+15.2% YoY Value',
    mandates: 'Confidential Sale',
    link: '/contact'
  },
  {
    id: 'e6',
    enclave: 'Dubai Islands',
    type: 'Waterfront Mega-Masterplan',
    avgSqFt: 'AED 2,100/sq.ft',
    yieldOrGain: 'Pre-Handover Surge',
    mandates: '0% Agency Fee',
    link: '/new-projects'
  },
  {
    id: 'e7',
    enclave: 'DIFC Financial District',
    type: 'Executive Branded Residences',
    avgSqFt: 'AED 3,250/sq.ft',
    yieldOrGain: '8.8% Proven Yield',
    mandates: 'High Tenancy Rate',
    link: '/buy'
  },
  {
    id: 'e8',
    enclave: 'Al Barari',
    type: 'Botanical Eco-Mansions',
    avgSqFt: 'AED 1,950/sq.ft',
    yieldOrGain: '+14.6% Luxury Demand',
    mandates: 'Private Viewing',
    link: '/buy'
  },
  {
    id: 'e9',
    enclave: 'Bluewaters Island',
    type: 'Haute Coastal Penthouses',
    avgSqFt: 'AED 4,100/sq.ft',
    yieldOrGain: '+17.0% Waterfront Gain',
    mandates: 'Direct Owner',
    link: '/buy'
  }
];

export const PrimeEnclavesMarquee: React.FC<PrimeEnclavesMarqueeProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Interactive 3D Cursor Tracking & Parallax
  const [cursorPos, setCursorPos] = useState({ x: 350, y: 24 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  // Scroll Velocity tracking for responsive physical momentum
  const [scrollTilt, setScrollTilt] = useState(0);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    setCursorPos({ x: px, y: py });

    const nx = (px / rect.width) - 0.5;
    const ny = (py / rect.height) - 0.5;

    // Elegant subtle 3D tilt
    setTilt({
      rotateX: -ny * 10,
      rotateY: nx * 8
    });
  }, []);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const deltaY = currentY - lastScrollY.current;
      lastScrollY.current = currentY;

      const clampedDelta = Math.max(Math.min(deltaY * 0.08, 4), -4);
      setScrollTilt(clampedDelta);

      if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
      scrollTimeout.current = window.setTimeout(() => {
        setScrollTilt(0);
      }, 120);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
    };
  }, []);

  const combinedRotateX = tilt.rotateX + scrollTilt;

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative z-30 w-full overflow-hidden select-none -mt-4 sm:-mt-6 -mb-4 sm:-mb-6"
      style={{ perspective: '1200px' }}
      aria-label="Dubai Prime Enclaves & Realized Benchmarks"
    >
      {/* ========================================================================= */}
      {/* 3D SLIM LIGHT LUXURY TICKER BAR (Warm Alabaster & Champagne Gold Finish)  */}
      {/* Flows RIGHT (Opposite of top ticker to avoid feeling repetitive)           */}
      {/* ========================================================================= */}
      <div 
        className="relative w-full h-11 sm:h-12 bg-[#fcfaf6] border-y border-[#dfd5c4] shadow-[0_6px_20px_rgba(184,151,89,0.12),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(212,175,55,0.2)] flex items-center transition-transform duration-150 ease-out [transform-style:preserve-3d]"
        style={{
          transform: `rotateX(${combinedRotateX}deg) rotateY(${tilt.rotateY}deg) translateZ(6px)`
        }}
      >
        {/* Dynamic Warm Champagne Cursor Specular Radiance */}
        <div 
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 ease-out"
          style={{
            opacity: isHovered ? 0.85 : 0.3,
            background: `radial-gradient(420px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(212, 175, 55, 0.16), rgba(12, 38, 30, 0.04), transparent 70%)`
          }}
        />

        {/* Top 3D Highlight Hairline */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#b89759]/40 to-transparent pointer-events-none z-30" />

        {/* ======================================================================= */}
        {/* FIXED 3D ANCHOR BADGE ON LEFT (PRIME ENCLAVE INDEX)                     */}
        {/* ======================================================================= */}
        <div className="relative z-30 shrink-0 h-full flex items-center pl-3.5 sm:pl-6 pr-3 sm:pr-4.5 bg-gradient-to-r from-[#f4ece1] via-[#faf5ec] to-[#faf5ec] border-r border-[#dfd5c4] shadow-[4px_0_12px_rgba(184,151,89,0.1)]">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-md bg-white border border-[#b89759]/40 shadow-xs">
            <Compass className="w-3.5 h-3.5 text-[#8c6d33] animate-spin-slow" />
            <span className="font-serif-display font-black text-[10px] sm:text-[11px] tracking-[0.16em] uppercase text-[#0c261e] whitespace-nowrap">
              ENCLAVE INDEX
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 ml-2.5 text-[10px] font-bold tracking-widest text-[#8c6d33] uppercase">
            <span>LIVE BENCHMARKS</span>
            <span className="text-[#b89759]">·</span>
          </div>
        </div>

        {/* Edge Feathers for Soft Infinite Bleed */}
        <div className="absolute left-36 sm:left-56 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#fcfaf6] to-transparent z-25 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#fcfaf6] to-transparent z-25 pointer-events-none" />

        {/* ======================================================================= */}
        {/* CONTINUOUS 3D SLIM INFINITE MARQUEE (FLOWS RIGHT)                       */}
        {/* ======================================================================= */}
        <div className="relative z-10 overflow-hidden w-full h-full flex items-center">
          <div className="animate-marquee-right flex items-center whitespace-nowrap will-change-transform">
            {[...ENCLAVE_DATA, ...ENCLAVE_DATA, ...ENCLAVE_DATA].map((item, index) => (
              <div
                key={`enclave-${item.id}-${index}`}
                onClick={() => onNavigate(item.link)}
                className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 cursor-pointer group transition-colors duration-200"
              >
                {/* Enclave Name with Gold Dot */}
                <span className="inline-flex items-center gap-1 text-[11px] sm:text-[12px] font-black uppercase tracking-wider text-[#0c261e] group-hover:text-[#8c6d33] transition-colors">
                  <MapPin className="w-3 h-3 text-[#b89759] shrink-0" />
                  {item.enclave}
                </span>

                {/* Enclave Subtype Tag */}
                <span className="text-[10px] sm:text-[11px] text-[#64748b] font-medium hidden sm:inline-block">
                  {item.type}
                </span>

                {/* Price / SQFT Tag */}
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] sm:text-[10px] font-bold bg-[#efe7da] text-[#0c261e] border border-[#dfd5c4]">
                  {item.avgSqFt}
                </span>

                {/* Capital Gain / Yield Metric */}
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] sm:text-[10px] font-extrabold bg-emerald-100/80 text-emerald-800 border border-emerald-300/60">
                  <TrendingUp className="w-2.5 h-2.5 text-emerald-600" />
                  {item.yieldOrGain}
                </span>

                {/* Private Mandates Pill */}
                <span className="inline-flex items-center gap-1 text-[9.5px] sm:text-[10px] font-bold text-[#8c6d33] bg-white px-2 py-0.5 rounded-full border border-[#b89759]/30 shadow-2xs">
                  <Sparkles className="w-2.5 h-2.5 text-[#b89759]" />
                  {item.mandates}
                </span>

                {/* Micro Click Indicator */}
                <ArrowUpRight className="w-3 h-3 text-[#8c6d33] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />

                {/* Subtle Amber Diamond Divider */}
                <span className="text-[#b89759]/50 text-[9px] font-serif ml-2 select-none">
                  ❖
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Status Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 pr-4 pl-3 shrink-0 text-[9.5px] font-bold tracking-widest text-[#8c6d33] uppercase border-l border-[#dfd5c4] h-full bg-[#fcfaf6] z-30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#b89759] animate-pulse" />
          <span>CURATED PORTFOLIO</span>
        </div>
      </div>
    </section>
  );
};
