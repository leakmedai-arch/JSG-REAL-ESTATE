import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Crown, 
  Award, 
  CheckCircle2, 
  ArrowUpRight,
  Radio
} from 'lucide-react';

interface Luxury3DMarqueeSectionProps {
  onNavigate: (path: string) => void;
}

interface NewsTickerItem {
  id: string;
  category: string;
  title: string;
  metric?: string;
  link: string;
  isPositive?: boolean;
}

const NEWS_ITEMS: NewsTickerItem[] = [
  {
    id: 'n1',
    category: 'DLD VERIFIED',
    title: 'Dubai Realized Volume Reaches AED 4.85B+ Across Prime Waterfronts',
    metric: '+14.2% YoY',
    link: '/buy/sold-prices',
    isPositive: true
  },
  {
    id: 'n2',
    category: 'EMAAR MASTER',
    title: 'Direct VIP Allocation · Burj Crown, Dubai Hills & Oasis Mansions',
    metric: '98.5% On-Time',
    link: '/new-projects',
    isPositive: true
  },
  {
    id: 'n3',
    category: 'GOVT LICENSE',
    title: 'RERA Certified Brokerage #19284 · Official Dubai Land Department Escrow',
    metric: '100% Compliant',
    link: '/about',
    isPositive: true
  },
  {
    id: 'n4',
    category: 'NAKHEEL LUXURY',
    title: 'Palm Jumeirah & Dubai Islands Bespoke Beachfront Residences Released',
    metric: 'Direct Allocation',
    link: '/new-projects',
    isPositive: true
  },
  {
    id: 'n5',
    category: 'INVESTOR YIELD',
    title: 'Downtown & Marina Portfolios Delivering 8.5% Net Projected Cap Rate',
    metric: 'Tax-Neutral 8.5%',
    link: '/buy',
    isPositive: true
  },
  {
    id: 'n6',
    category: 'MERAAS WATERFRONT',
    title: 'Bluewaters Island & Bvlgari Coastal Mansions Available via Bilateral Mandate',
    metric: 'Ultra-Prime',
    link: '/buy',
    isPositive: true
  },
  {
    id: 'n7',
    category: 'OFF-PLAN PRIVILEGE',
    title: '0% Buyer Commission on Developer Pre-Launch Units with Flexible Payment Plans',
    metric: '0% Commission',
    link: '/new-projects',
    isPositive: true
  },
  {
    id: 'n8',
    category: 'OMNIYAT TROPHY',
    title: 'The Opus by Zaha Hadid & The Lana Residences Private Viewings Open',
    metric: 'Curated Collection',
    link: '/buy',
    isPositive: true
  },
  {
    id: 'n9',
    category: 'GOLDEN VISA',
    title: '10-Year UAE Investor Golden Visa Facilitation & Fast-Track Family Processing',
    metric: '10-Yr Residency',
    link: '/about',
    isPositive: true
  },
  {
    id: 'n10',
    category: 'SOBHA REALTY',
    title: 'Sobha Hartland II & SeaHaven High-Yield Towers · 99.1% Defect-Free Handover',
    metric: 'Artisan Finish',
    link: '/new-projects',
    isPositive: true
  },
  {
    id: 'n11',
    category: 'PRIVATE CLIENT',
    title: 'Confidential Off-Market Trophy Mansions in Emirates Hills & Frond G Available',
    metric: 'Private Desk',
    link: '/contact',
    isPositive: true
  },
  {
    id: 'n12',
    category: 'SOVEREIGN SETTLEMENT',
    title: 'Multi-Currency & Sovereign Escrow Account Structuring for International Buyers',
    metric: 'Global Capital',
    link: '/buy',
    isPositive: true
  }
];

export const Luxury3DMarqueeSection: React.FC<Luxury3DMarqueeSectionProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Interactive 3D Cursor Tracking & Parallax State
  const [cursorPos, setCursorPos] = useState({ x: 300, y: 25 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  // Scroll Velocity & Scroll Micro-Tilt
  const [scrollTilt, setScrollTilt] = useState(0);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<number | null>(null);

  // Smooth mouse move handler with normalized 3D tilt calculation
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    setCursorPos({ x: px, y: py });

    const nx = (px / rect.width) - 0.5;
    const ny = (py / rect.height) - 0.5;

    // Crisp micro 3D tilt for a slim bar
    setTilt({
      rotateX: -ny * 12,
      rotateY: nx * 10
    });
  }, []);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  // Scroll dynamics tracking
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
      className="relative z-30 w-full overflow-hidden select-none -mt-10 sm:-mt-14 -mb-4 sm:-mb-6"
      style={{ perspective: '1200px' }}
      aria-label="JSG Live Real Estate Market News Wire"
    >
      {/* ========================================================================= */}
      {/* 3D SLIM NEWS TICKER BAR (Meets Hero with Founder Section)                 */}
      {/* ========================================================================= */}
      <div 
        className="relative w-full h-11 sm:h-12 bg-[#0c261e] border-y border-[#c5a059]/40 shadow-[0_8px_24px_rgba(12,38,30,0.38),inset_0_1px_0_rgba(212,175,55,0.45),inset_0_-1px_0_rgba(0,0,0,0.5)] flex items-center transition-transform duration-150 ease-out [transform-style:preserve-3d]"
        style={{
          transform: `rotateX(${combinedRotateX}deg) rotateY(${tilt.rotateY}deg) translateZ(8px)`
        }}
      >
        {/* Real-time 3D Specular Cursor Light Beam */}
        <div 
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 ease-out mix-blend-screen"
          style={{
            opacity: isHovered ? 0.75 : 0.2,
            background: `radial-gradient(380px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(212, 175, 55, 0.35), rgba(16, 185, 129, 0.12), transparent 70%)`
          }}
        />

        {/* 3D Glass Highlight Prismatic Line */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/80 to-transparent pointer-events-none z-30" />

        {/* ======================================================================= */}
        {/* FIXED 3D NEWS WIRE BADGE (ANCHORED ON LEFT)                             */}
        {/* ======================================================================= */}
        <div className="relative z-30 shrink-0 h-full flex items-center pl-3.5 sm:pl-6 pr-3 sm:pr-4.5 bg-gradient-to-r from-[#071914] via-[#0c261e] to-[#0c261e] border-r border-[#c5a059]/40 shadow-[4px_0_16px_rgba(0,0,0,0.4)]">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-md bg-[#13382c] border border-[#c5a059]/50 shadow-[inset_0_1px_2px_rgba(212,175,55,0.25)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="font-serif-display font-black text-[10px] sm:text-[11px] tracking-[0.16em] uppercase text-[#d4af37] whitespace-nowrap">
              MARKET WIRE
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 ml-2 text-[10px] font-bold tracking-widest text-[#d9bf8c]/80 uppercase">
            <span>DLD DIRECT</span>
            <span className="text-[#c5a059]">·</span>
          </div>
        </div>

        {/* Edge Feathers for Smooth Ingress / Egress */}
        <div className="absolute left-32 sm:left-48 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#0c261e] to-transparent z-25 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#0c261e] to-transparent z-25 pointer-events-none" />

        {/* ======================================================================= */}
        {/* CONTINUOUS 3D SLIM INFINITE NEWS MARQUEE                                */}
        {/* ======================================================================= */}
        <div className="relative z-10 overflow-hidden w-full h-full flex items-center">
          <div className="animate-marquee-left flex items-center whitespace-nowrap will-change-transform">
            {[...NEWS_ITEMS, ...NEWS_ITEMS, ...NEWS_ITEMS].map((item, index) => (
              <div
                key={`news-${item.id}-${index}`}
                onClick={() => onNavigate(item.link)}
                className="inline-flex items-center gap-2.5 sm:gap-3.5 px-4 sm:px-6 cursor-pointer group transition-colors duration-200"
              >
                {/* News Category Pill */}
                <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[9.5px] font-black tracking-wider uppercase bg-[#1a4437] text-[#d4af37] border border-[#c5a059]/40 group-hover:bg-[#d4af37] group-hover:text-[#0c261e] transition-colors shadow-xs">
                  {item.category}
                </span>

                {/* News Headline */}
                <span className="text-[11.5px] sm:text-[12.5px] font-semibold text-[#f5f0e6] group-hover:text-[#d4af37] transition-colors tracking-tight flex items-center gap-1.5">
                  {item.title}
                </span>

                {/* News Metric Badge (Green / Gold) */}
                {item.metric && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] sm:text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-600/30">
                    <TrendingUp className="w-2.5 h-2.5 text-emerald-400" />
                    {item.metric}
                  </span>
                )}

                {/* Interactive Arrow on Hover */}
                <ArrowUpRight className="w-3 h-3 text-[#d4af37] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />

                {/* Gold Diamond News Divider */}
                <span className="text-[#c5a059]/60 text-[10px] font-serif ml-1.5 select-none">
                  ◆
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Status Badge */}
        <div className="hidden lg:flex items-center gap-1.5 pr-4 pl-3 shrink-0 text-[9.5px] font-bold tracking-widest text-[#d9bf8c]/75 uppercase border-l border-[#c5a059]/30 h-full bg-[#0c261e]/90 z-30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>REAL-TIME 24/7</span>
        </div>
      </div>
    </section>
  );
};
