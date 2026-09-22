import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { fadeDown } from '../lib/animations';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronDown, 
  Radio, 
  Search, 
  Calculator, 
  TrendingUp, 
  BookOpen, 
  Compass, 
  Users, 
  ArrowUpRight, 
  ShieldCheck, 
  Sparkles, 
  Menu, 
  X, 
  Home, 
  Key, 
  Percent, 
  Briefcase, 
  FileText,
  Clock,
  Layers,
  CheckCircle2,
  DollarSign,
  Video,
  MessageCircle
} from 'lucide-react';
import { JSGLogo } from './JSGLogo';
import { Map3DModal } from './Map3DModal';
import { LiveAgentCallModal } from './LiveAgentCallModal';

interface SmartHeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const SmartHeader: React.FC<SmartHeaderProps> = ({ currentPath, onNavigate }) => {
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isLiveAgentModalOpen, setIsLiveAgentModalOpen] = useState(false);
  const [isTickerPaused, setIsTickerPaused] = useState(false);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 3D cursor movement and tilt reactive physics state
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rotX: 0, rotY: 0, glowX: 50, glowY: 50, isHovered: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Calculate subtle 3D tilt: max 2 degrees for smooth, organic floating response
    const rotY = ((x - centerX) / centerX) * 1.8;
    const rotX = -((y - centerY) / centerY) * 2.2;
    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;
    setTilt({ rotX, rotY, glowX, glowY, isHovered: true });
  };

  const handleMouseLeaveHeader = () => {
    setTilt(prev => ({ ...prev, rotX: 0, rotY: 0, isHovered: false }));
  };

  // Clean sans-serif typography for navigation links (Inter / Plus Jakarta Sans @ 12.5-13px, bold & readable on white glass)
  const getNavClass = (isActive: boolean) =>
    `flex items-center gap-0.5 px-2 2xl:px-2.5 py-1 rounded-full text-[12.5px] 2xl:text-[13px] font-bold tracking-tight whitespace-nowrap transition-all duration-200 cursor-pointer ${
      isActive
        ? 'text-[#8a631c] bg-white/80 shadow-[0_2px_8px_rgba(181,139,74,0.3)] border border-[#b58b4a]/60'
        : 'text-[#0e2922] hover:text-[#b58b4a] hover:bg-white/50'
    }`;

  const getSimpleNavClass = (isActive: boolean) =>
    `px-2 2xl:px-2.5 py-1 rounded-full text-[12.5px] 2xl:text-[13px] font-bold tracking-tight whitespace-nowrap transition-all duration-200 cursor-pointer ${
      isActive
        ? 'text-[#8a631c] bg-white/80 shadow-[0_2px_8px_rgba(181,139,74,0.3)] border border-[#b58b4a]/60'
        : 'text-[#0e2922] hover:text-[#b58b4a] hover:bg-white/50'
    }`;

  // Monitor scroll for dynamic scroll physics and vertical compression
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (menuName: string) => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
    }
    setActiveMegaMenu(menuName);
  };

  const handleMouseLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 180);
  };

  const handleItemClick = (path: string) => {
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  return (
    <>
      {/* Top Infinite Marquee Ticker Strip: Location, Phone Number & Live Call with Agent */}
      {/* Stops on cursor hover or touch, and items are fully clickable */}
      <div 
        id="header-ticker-strip"
        className="relative w-full overflow-hidden bg-gradient-to-r from-[#112923] via-[#17362f] to-[#112923] text-white py-2 border-b border-[#b58b4a]/30 z-30 select-none shadow-sm"
        onMouseEnter={() => setIsTickerPaused(true)}
        onMouseLeave={() => setIsTickerPaused(false)}
        onTouchStart={() => setIsTickerPaused(true)}
        onTouchEnd={() => setIsTickerPaused(false)}
      >
        <div className={`animate-infinite-ticker flex items-center ${isTickerPaused ? 'ticker-paused' : ''}`}>
          {[0, 1, 2, 3].map((copyIdx) => (
            <div key={copyIdx} className="flex items-center gap-7 px-4 shrink-0 text-xs">
              {/* 1. Location: Zainal Mohebi Plaza, Karama, Dubai -> 3D Map */}
              <button
                type="button"
                onClick={() => setIsMapModalOpen(true)}
                className="flex items-center gap-1.5 text-[#fbfaf7] hover:text-[#d9bf8c] transition-colors cursor-pointer group/item px-2.5 py-0.5 rounded-lg hover:bg-white/10"
                title="Open 3D Map: Zainal Mohebi Plaza, Karama, Dubai"
              >
                <MapPin className="w-3.5 h-3.5 text-[#d9bf8c] group-hover/item:scale-110 transition-transform" />
                <span className="font-medium text-slate-300">Location:</span>
                <span className="underline decoration-[#b58b4a] underline-offset-4 font-bold text-white">
                  Zainal Mohebi Plaza, Karama, Dubai
                </span>
                <span className="text-[10px] bg-[#b58b4a]/30 text-[#d9bf8c] px-1.5 py-0.2 rounded font-mono font-black border border-[#b58b4a]/40">
                  3D MAP
                </span>
              </button>

              <span className="text-white/25">&bull;</span>

              {/* 2. Direct Phone Dial -> Makes direct call in dial pad */}
              <a
                href="tel:+97143202030"
                className="flex items-center gap-1.5 text-[#fbfaf7] hover:text-[#d9bf8c] transition-colors cursor-pointer group/item px-2.5 py-0.5 rounded-lg hover:bg-white/10"
                title="Direct Call to +971 4 320 2030 (Opens Dial Pad)"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400 group-hover/item:scale-110 transition-transform" />
                <span className="font-medium text-slate-300">Call Direct:</span>
                <span className="font-mono font-bold text-white tracking-wider">
                  +971 4 320 2030
                </span>
                <span className="text-[10px] bg-emerald-500/25 text-emerald-300 px-1.5 py-0.2 rounded font-bold border border-emerald-500/40">
                  DIAL PAD
                </span>
              </a>

              <span className="text-white/25">&bull;</span>

              {/* 3. Live Call with Agent: See Property In Real Time Before You Go */}
              <button
                type="button"
                onClick={() => window.open('https://wa.me/97143202030?text=Hello%20JSG%20Real%20Estate,%20I%20would%20like%20a%20WhatsApp%20live%20call%20with%20an%20agent.', '_blank')}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/30 hover:bg-red-600/50 border border-red-500/60 text-white transition-all cursor-pointer group/item shadow-sm"
                title="Connect with agent in real-time video call to inspect property before you go"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <Video className="w-3.5 h-3.5 text-red-400" />
                <span className="font-bold text-amber-200">
                  Live Call with Agent:
                </span>
                <span className="text-white font-medium">
                  See Property Before You Go (Real 4K Inspection)
                </span>
                <span className="text-[10px] bg-red-600 text-white font-black px-1.5 py-0.2 rounded shadow">
                  CONNECT NOW
                </span>
              </button>

              <span className="text-white/25">&bull;</span>

              {/* RERA License Badge */}
              <div className="hidden lg:flex items-center gap-1.5 text-slate-300 font-medium text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>RERA Regulated Brokerage #19284</span>
              </div>

              <span className="text-white/25">&bull;</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sleek Ultra-Slim Floating Header Container with Pill/Capsule Corners (Border-Radius: 50px) */}
      <motion.header 
        initial="hidden"
        animate="visible"
        variants={fadeDown}
        className="sticky top-0 z-50 pt-2 pb-2.5 px-2 sm:px-4 lg:px-6 w-full bg-gradient-to-b from-[#112923] via-[#0c1c18]/85 to-transparent pointer-events-none transition-all duration-300"
      >
        <div 
          ref={headerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeaveHeader}
          className={`floating-pill-glass-header pointer-events-auto relative select-none max-w-[1400px] 2xl:max-w-[1640px] 3xl:max-w-[1920px] 4xl:max-w-[2300px] w-full mx-auto px-3 sm:px-5 md:px-6 lg:px-7 flex items-center justify-between gap-1.5 sm:gap-2 lg:gap-3 transition-all duration-300 ${
            scrolled ? 'scrolled-header py-1.5 sm:py-2' : 'py-2 sm:py-2.5'
          }`}
          style={{
            transform: `perspective(1200px) rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg) ${scrolled ? 'scale(0.99)' : 'scale(1)'}`,
            transition: tilt.isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out, padding 0.3s ease, box-shadow 0.3s ease',
          }}
        >
          {/* Specular 3D Light Glimpse Periodic Passing & Reactive Spotlight */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[50px]">
            {/* Periodic glimpse of light passing across the glass - Unmistakable 3D Specular Shine */}
            <div className="absolute top-0 bottom-0 w-64 -skew-x-[30deg] animate-light-glimpse pointer-events-none">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white/85 to-transparent blur-[1.5px]" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d9bf8c]/55 to-transparent blur-md" />
            </div>
            {/* 3D Cursor Reactive Spotlight */}
            {tilt.isHovered && (
              <div 
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle 280px at ${tilt.glowX}% ${tilt.glowY}%, rgba(217, 191, 140, 0.22), transparent 70%)`
                }}
              />
            )}
            <div className="absolute top-0 inset-x-10 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
            <div className="absolute bottom-0 inset-x-10 h-[1px] bg-gradient-to-r from-transparent via-[#b58b4a]/40 to-transparent" />
          </div>

          {/* Logo on Extreme Left Inside Capsule Curve */}
          <div 
            onClick={() => handleItemClick('/')}
            className="cursor-pointer group flex items-center gap-2 transition-transform duration-200 hover:scale-[1.01] shrink-0 relative z-10 pl-0"
          >
            <JSGLogo size="sm" showText={true} theme="light" />
          </div>

          {/* Desktop Navigation Links with 3D Depth Mega Menus */}
          <nav className="hidden xl:flex items-center gap-1 relative z-10">
            {/* BUY MEGA MENU */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('buy')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => handleItemClick('/buy')}
                className={getNavClass(currentPath.startsWith('/buy') || activeMegaMenu === 'buy')}
              >
                <span>Buy</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#b58b4a] transition-transform duration-200 ${activeMegaMenu === 'buy' ? 'rotate-180' : ''}`} />
              </button>

            {/* Mega Dropdown Panel */}
            {activeMegaMenu === 'buy' && (
              <div 
                className="absolute top-full left-0 w-[680px] mt-2 p-6 bg-[#17362f]/98 backdrop-blur-2xl border border-[#b58b4a]/30 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] z-50 text-white animate-fadeIn"
                style={{ transform: 'perspective(1000px) rotateX(0deg)' }}
              >
                <div className="grid grid-cols-3 gap-6">
                  {/* Col 1: Residential Properties for Sale */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#d9bf8c] flex items-center gap-1.5 pb-1 border-b border-white/10">
                      <Building2 className="w-3.5 h-3.5 text-[#b58b4a]" />
                      <span>Properties for Sale</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-200">
                      <li>
                        <button onClick={() => handleItemClick('/buy')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>All Residential for Sale</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/buy/apartments')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Apartments &amp; Flats</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/buy/villas')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Villas &amp; Mansions</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/buy/townhouses')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Townhouses</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/buy/land')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Residential Plots &amp; Land</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/buy/commercial')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Commercial Properties</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Col 2: Buyer Tools */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#d9bf8c] flex items-center gap-1.5 pb-1 border-b border-white/10">
                      <Calculator className="w-3.5 h-3.5 text-[#b58b4a]" />
                      <span>Buyer Tools</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-200">
                      <li>
                        <button onClick={() => handleItemClick('/buy/mortgage-calculator')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Mortgage Calculator</span>
                          <span className="px-1.5 py-0.5 text-[9px] bg-[#b58b4a]/30 text-[#d9bf8c] rounded">UAE Rates</span>
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/buy/sold-prices')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Sold House Prices (DLD)</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/buy/price-map')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Sale Price Heatmap</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/find-agent')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Find a Real Estate Agent</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Col 3: Buying Insights & Guides */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#d9bf8c] flex items-center gap-1.5 pb-1 border-b border-white/10">
                      <BookOpen className="w-3.5 h-3.5 text-[#b58b4a]" />
                      <span>Buying Insights</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-200">
                      <li>
                        <button onClick={() => handleItemClick('/insights/buyers-guide')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Buyer&apos;s Complete Guide</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/insights/area-insights')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Area &amp; Community Insights</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/areas/dubai')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Tower &amp; Compound Guides</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/new-projects')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>New Projects &amp; Off-Plan</span>
                          <span className="px-1.5 py-0.5 text-[9px] bg-red-600/80 text-white rounded">Hot</span>
                        </button>
                      </li>
                    </ul>

                    {/* Quick CTA Box */}
                    <div className="pt-2">
                      <button
                        onClick={() => handleItemClick('/buy/mortgage-calculator')}
                        className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-[#b58b4a]/30 text-left text-[11px] text-[#d9bf8c] flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span>Need a Mortgage? Pre-Approve Now</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#b58b4a]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RENT MEGA MENU */}
          <div 
            className="relative"
            onMouseEnter={() => handleMouseEnter('rent')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => handleItemClick('/rent')}
              className={getNavClass(currentPath.startsWith('/rent') || activeMegaMenu === 'rent')}
            >
              <span>Rent</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#b58b4a] transition-transform duration-200 ${activeMegaMenu === 'rent' ? 'rotate-180' : ''}`} />
            </button>

            {/* Rent Mega Dropdown */}
            {activeMegaMenu === 'rent' && (
              <div 
                className="absolute top-full left-0 w-[680px] mt-2 p-6 bg-[#17362f]/98 backdrop-blur-2xl border border-[#b58b4a]/30 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] z-50 text-white animate-fadeIn"
              >
                <div className="grid grid-cols-3 gap-6">
                  {/* Col 1 */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#d9bf8c] flex items-center gap-1.5 pb-1 border-b border-white/10">
                      <Key className="w-3.5 h-3.5 text-[#b58b4a]" />
                      <span>Properties for Rent</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-200">
                      <li>
                        <button onClick={() => handleItemClick('/rent')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>All Properties for Rent</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/rent/apartments')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Apartments for Rent</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/rent/studios')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Executive Studios</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/rent/villas')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Villas for Rent</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/rent/townhouses')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Townhouses for Rent</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/rent/short-term')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Short-Term &amp; Holiday Homes</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Col 2: Renter Tools */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#d9bf8c] flex items-center gap-1.5 pb-1 border-b border-white/10">
                      <Percent className="w-3.5 h-3.5 text-[#b58b4a]" />
                      <span>Renter Tools</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-200">
                      <li>
                        <button onClick={() => handleItemClick('/rent/monthly')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Pay Rent Monthly</span>
                          <span className="px-1.5 py-0.5 text-[9px] bg-emerald-600/80 text-white rounded">Flex</span>
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/rent/rent-vs-buy')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Rent vs Buy Calculator</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/rent/rented-prices')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Rented House Prices (Ejari)</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/rent/price-map')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Rental Yield &amp; Price Map</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Col 3: Renting Insights */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#d9bf8c] flex items-center gap-1.5 pb-1 border-b border-white/10">
                      <FileText className="w-3.5 h-3.5 text-[#b58b4a]" />
                      <span>Renting Insights</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-200">
                      <li>
                        <button onClick={() => handleItemClick('/insights/renters-guide')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Renter&apos;s Legal Guide</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/insights/area-insights')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Community &amp; Lifestyle</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/find-agent')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Find a Rental Specialist</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SELL BUTTON */}
          <button
            type="button"
            onClick={() => handleItemClick('/sell')}
            className={getSimpleNavClass(currentPath === '/sell')}
          >
            Sell
          </button>

          {/* NEW PROJECTS MEGA MENU */}
          <div 
            className="relative"
            onMouseEnter={() => handleMouseEnter('new-projects')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => handleItemClick('/new-projects')}
              className={getNavClass(currentPath.startsWith('/new-projects') || activeMegaMenu === 'new-projects')}
            >
              <span>New Projects</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#b58b4a] transition-transform duration-200 ${activeMegaMenu === 'new-projects' ? 'rotate-180' : ''}`} />
            </button>

            {/* New Projects Dropdown */}
            {activeMegaMenu === 'new-projects' && (
              <div 
                className="absolute top-full left-0 w-[680px] mt-2 p-6 bg-[#17362f]/98 backdrop-blur-2xl border border-[#b58b4a]/30 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] z-50 text-white animate-fadeIn"
              >
                <div className="grid grid-cols-3 gap-6">
                  {/* Col 1: By Emirate */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#d9bf8c] flex items-center gap-1.5 pb-1 border-b border-white/10">
                      <Compass className="w-3.5 h-3.5 text-[#b58b4a]" />
                      <span>By Emirate</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-200">
                      <li>
                        <button onClick={() => handleItemClick('/new-projects')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>All UAE New Projects</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/new-projects/dubai')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Dubai Off-Plan Launches</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/new-projects/abu-dhabi')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Abu Dhabi Developments</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/new-projects/sharjah')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Sharjah Master Communities</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/new-projects/rak')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Ras Al Khaimah (Wynn Island)</span>
                          <span className="px-1.5 py-0.5 text-[9px] bg-amber-500/80 text-black font-bold rounded">Casino Area</span>
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Col 2: Find Developers */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#d9bf8c] flex items-center gap-1.5 pb-1 border-b border-white/10">
                      <Building2 className="w-3.5 h-3.5 text-[#b58b4a]" />
                      <span>Premier Developers</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-200">
                      <li>
                        <button onClick={() => handleItemClick('/new-projects/developers')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer font-bold text-white">
                          <span>All Master Developers</span>
                          <ArrowUpRight className="w-3 h-3 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/new-projects/developers')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Emaar Properties</span>
                          <span className="text-[10px] text-slate-400">Downtown, Hills</span>
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/new-projects/developers')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>DAMAC Properties</span>
                          <span className="text-[10px] text-slate-400">Lagoons, Cavalli</span>
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/new-projects/developers')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Sobha Realty</span>
                          <span className="text-[10px] text-slate-400">Hartland II</span>
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/new-projects/developers')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Aldar Properties</span>
                          <span className="text-[10px] text-slate-400">Saadiyat, Yas</span>
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/new-projects/developers')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Azizi Developments</span>
                          <span className="text-[10px] text-slate-400">Riviera, Venice</span>
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Col 3: Investing Insights */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#d9bf8c] flex items-center gap-1.5 pb-1 border-b border-white/10">
                      <TrendingUp className="w-3.5 h-3.5 text-[#b58b4a]" />
                      <span>Investing Insights</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-200">
                      <li>
                        <button onClick={() => handleItemClick('/insights/investors-guide')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Investor&apos;s Comprehensive Guide</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/tools/market-reports')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Highest ROI Areas (8.5%+)</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/new-projects')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Post-Handover Payment Plans</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/insights/buyers-guide')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>UAE Golden Visa Eligibility</span>
                          <span className="px-1.5 py-0.5 text-[9px] bg-emerald-700/80 text-white rounded">AED 2M+</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* TOOLS & INSIGHTS MEGA MENU */}
          <div 
            className="relative"
            onMouseEnter={() => handleMouseEnter('tools')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => handleItemClick('/tools')}
              className={getNavClass(currentPath.startsWith('/tools') || currentPath.startsWith('/insights') || activeMegaMenu === 'tools')}
            >
              <span>Tools &amp; Insights</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#b58b4a] transition-transform duration-200 ${activeMegaMenu === 'tools' ? 'rotate-180' : ''}`} />
            </button>

            {/* Tools Dropdown */}
            {activeMegaMenu === 'tools' && (
              <div 
                className="absolute top-full left-0 w-[640px] mt-2 p-6 bg-[#17362f]/98 backdrop-blur-2xl border border-[#b58b4a]/30 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] z-50 text-white animate-fadeIn"
              >
                <div className="grid grid-cols-2 gap-6">
                  {/* Financial Tools */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#d9bf8c] flex items-center gap-1.5 pb-1 border-b border-white/10">
                      <Calculator className="w-3.5 h-3.5 text-[#b58b4a]" />
                      <span>Financial Calculators &amp; Data</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-200">
                      <li>
                        <button onClick={() => handleItemClick('/buy/mortgage-calculator')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Mortgage EMI Calculator</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/rent/rent-vs-buy')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Rent vs Buy Financial Analyzer</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/tools/market-reports')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Quarterly Dubai Market Reports</span>
                          <span className="px-1.5 py-0.5 text-[9px] bg-[#b58b4a] text-white rounded">Q3 2026</span>
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/buy/sold-prices')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>DLD Sale Transactions Database</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/rent/rented-prices')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Ejari Rental Index Records</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Editorial Insights */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#d9bf8c] flex items-center gap-1.5 pb-1 border-b border-white/10">
                      <BookOpen className="w-3.5 h-3.5 text-[#b58b4a]" />
                      <span>Editorial Guides &amp; Blog</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-200">
                      <li>
                        <button onClick={() => handleItemClick('/insights/buyers-guide')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Buyer&apos;s Handbook 2026</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/insights/renters-guide')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Tenant Rights &amp; Ejari Guide</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/insights/area-insights')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Popular Communities Comparison</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleItemClick('/insights/investors-guide')} className="w-full text-left hover:text-[#d9bf8c] flex items-center justify-between group cursor-pointer">
                          <span>Tax-Free UAE Investment Perks</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#b58b4a]" />
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AREAS DROPDOWN */}
          <div 
            className="relative"
            onMouseEnter={() => handleMouseEnter('areas')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => handleItemClick('/areas/dubai')}
              className={getNavClass(currentPath.startsWith('/areas') || activeMegaMenu === 'areas')}
            >
              <span>Areas</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#b58b4a] transition-transform duration-200 ${activeMegaMenu === 'areas' ? 'rotate-180' : ''}`} />
            </button>

            {activeMegaMenu === 'areas' && (
              <div 
                className="absolute top-full left-0 w-64 mt-2 p-4 bg-[#17362f]/98 backdrop-blur-2xl border border-[#b58b4a]/30 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] z-50 text-white animate-fadeIn"
              >
                <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#d9bf8c] pb-2 border-b border-white/10 mb-2">
                  Emirates &amp; Regions
                </div>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  <li>
                    <button onClick={() => handleItemClick('/areas/dubai')} className="w-full text-left py-1 px-2 rounded-lg hover:bg-white/10 hover:text-[#d9bf8c] flex items-center justify-between cursor-pointer">
                      <span>Dubai</span>
                      <span className="text-[10px] text-[#d9bf8c]">Downtown, Palm, Marina</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleItemClick('/areas/abu-dhabi')} className="w-full text-left py-1 px-2 rounded-lg hover:bg-white/10 hover:text-[#d9bf8c] flex items-center justify-between cursor-pointer">
                      <span>Abu Dhabi</span>
                      <span className="text-[10px] text-slate-400">Saadiyat, Yas</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleItemClick('/areas/sharjah')} className="w-full text-left py-1 px-2 rounded-lg hover:bg-white/10 hover:text-[#d9bf8c] flex items-center justify-between cursor-pointer">
                      <span>Sharjah</span>
                      <span className="text-[10px] text-slate-400">Aljada, Masaar</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleItemClick('/areas/ajman')} className="w-full text-left py-1 px-2 rounded-lg hover:bg-white/10 hover:text-[#d9bf8c] flex items-center justify-between cursor-pointer">
                      <span>Ajman</span>
                      <span className="text-[10px] text-slate-400">Corniche Living</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleItemClick('/areas/ras-al-khaimah')} className="w-full text-left py-1 px-2 rounded-lg hover:bg-white/10 hover:text-[#d9bf8c] flex items-center justify-between cursor-pointer">
                      <span>Ras Al Khaimah</span>
                      <span className="text-[10px] text-[#d9bf8c]">Al Marjan Island</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* FIND AGENTS */}
          <button
            type="button"
            onClick={() => handleItemClick('/find-agent')}
            className={getSimpleNavClass(currentPath === '/find-agent')}
          >
            Find Agents
          </button>
        </nav>

        {/* Right Action CTAs: Distinct 3D Button Styling firmly inside capsule curve */}
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 relative z-10 shrink-0">
          {/* Live Call with Agent Button: Emerald & Gold 3D Video Button */}
          <button
            type="button"
            onClick={() => window.open('https://wa.me/97143202030?text=Hello%20JSG%20Real%20Estate,%20I%20would%20like%20a%20WhatsApp%20live%20call%20with%20an%20agent.', '_blank')}
            className="flex items-center justify-center gap-1.5 h-8 px-2 sm:px-3 rounded-full text-[11px] sm:text-xs font-black text-[#0d221c] bg-gradient-to-r from-[#b58b4a] via-[#c5a059] to-[#d9bf8c] hover:brightness-110 tracking-wide cursor-pointer select-none whitespace-nowrap shrink-0 shadow-md border border-[#b58b4a]/60 hover:scale-102 transition-transform"
            title="Connect with Licensed Agent in Real-Time 4K Video Call to View Palace"
          >
            <Video className="w-3.5 h-3.5 text-[#0d221c] shrink-0" />
            <span className="hidden md:inline">Live Agent Call</span>
          </button>

          {/* WhatsApp Direct: Official Green 3D Button - guaranteed safely inside the curve capsule */}
          <a
            href="https://wa.me/97143202030?text=Hello%20JSG%20Real%20Estate%2C%20I%20am%20enquiring%20about%20luxury%20properties%20in%20Dubai."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d-green inline-flex items-center justify-center gap-1 sm:gap-1.5 h-8 px-2.5 sm:px-3 rounded-full text-[11px] sm:text-xs font-bold text-white tracking-wide cursor-pointer select-none whitespace-nowrap shrink-0"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="hidden xs:inline">WhatsApp</span>
          </a>

          {/* List Property CTA: 3D Gold Button (Visible only on ultra-wide screens to ensure ample space for WhatsApp) */}
          <button
            type="button"
            onClick={() => handleItemClick('/sell')}
            className="btn-3d-gold hidden 2xl:flex items-center gap-1.5 h-8 px-2.5 sm:px-3 rounded-full text-[11px] sm:text-xs font-black text-[#11241f] tracking-wide cursor-pointer select-none whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#11241f] shrink-0" />
            <span>List Property</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden w-8 h-8 rounded-full flex items-center justify-center bg-[#17362f]/80 text-[#d9bf8c] hover:bg-[#17362f] border border-[#b58b4a]/40 transition-colors cursor-pointer shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-white" /> : <Menu className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>
    </motion.header>

      {/* MOBILE FULL-SCREEN SOPHISTICATED DRAWER */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-[60px] bottom-0 bg-[#0e2923]/98 backdrop-blur-3xl text-white p-6 overflow-y-auto border-t border-[#b58b4a]/25 space-y-6 z-50 animate-fadeIn">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search apartments, villas, communities..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleItemClick('/buy');
                }
              }}
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-400 outline-none focus:border-[#b58b4a]"
            />
          </div>

          {/* Primary Mobile Navigation Groups */}
          <div className="space-y-3 divide-y divide-white/10">
            {/* BUY SECTION */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setMobileSubmenu(mobileSubmenu === 'buy' ? null : 'buy')}
                className="w-full flex items-center justify-between text-sm font-bold text-[#d9bf8c] py-2"
              >
                <span>Buy Properties</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileSubmenu === 'buy' ? 'rotate-180' : ''}`} />
              </button>
              {mobileSubmenu === 'buy' && (
                <div className="pl-3 py-2 space-y-2 text-xs text-slate-200 border-l border-[#b58b4a]/30 my-1">
                  <button onClick={() => handleItemClick('/buy')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">All Residential for Sale</button>
                  <button onClick={() => handleItemClick('/buy/apartments')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">Apartments in Dubai</button>
                  <button onClick={() => handleItemClick('/buy/villas')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">Luxury Villas &amp; Mansions</button>
                  <button onClick={() => handleItemClick('/buy/townhouses')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">Family Townhouses</button>
                  <button onClick={() => handleItemClick('/buy/land')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">Plots &amp; Land</button>
                  <button onClick={() => handleItemClick('/buy/mortgage-calculator')} className="block w-full text-left py-1 text-[#d9bf8c] font-semibold">Mortgage Calculator</button>
                  <button onClick={() => handleItemClick('/buy/sold-prices')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">Sold House Prices (DLD)</button>
                  <button onClick={() => handleItemClick('/insights/buyers-guide')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">Buyer&apos;s Complete Guide</button>
                </div>
              )}
            </div>

            {/* RENT SECTION */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setMobileSubmenu(mobileSubmenu === 'rent' ? null : 'rent')}
                className="w-full flex items-center justify-between text-sm font-bold text-[#d9bf8c] py-2"
              >
                <span>Rent Properties</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileSubmenu === 'rent' ? 'rotate-180' : ''}`} />
              </button>
              {mobileSubmenu === 'rent' && (
                <div className="pl-3 py-2 space-y-2 text-xs text-slate-200 border-l border-[#b58b4a]/30 my-1">
                  <button onClick={() => handleItemClick('/rent')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">All Properties for Rent</button>
                  <button onClick={() => handleItemClick('/rent/apartments')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">Apartments for Rent</button>
                  <button onClick={() => handleItemClick('/rent/studios')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">Studio Apartments</button>
                  <button onClick={() => handleItemClick('/rent/villas')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">Villas for Rent</button>
                  <button onClick={() => handleItemClick('/rent/rent-vs-buy')} className="block w-full text-left py-1 text-[#d9bf8c] font-semibold">Rent vs Buy Calculator</button>
                  <button onClick={() => handleItemClick('/rent/monthly')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">Pay Rent Monthly</button>
                  <button onClick={() => handleItemClick('/rent/rented-prices')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">Rented House Prices (Ejari)</button>
                  <button onClick={() => handleItemClick('/insights/renters-guide')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">Tenant Rights &amp; Guide</button>
                </div>
              )}
            </div>

            {/* SELL */}
            <div className="pt-2">
              <button
                onClick={() => handleItemClick('/sell')}
                className="w-full text-left text-sm font-bold text-white py-2 flex items-center justify-between"
              >
                <span>Sell / List With Us</span>
                <Sparkles className="w-4 h-4 text-[#d9bf8c]" />
              </button>
            </div>

            {/* NEW PROJECTS */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setMobileSubmenu(mobileSubmenu === 'new-projects' ? null : 'new-projects')}
                className="w-full flex items-center justify-between text-sm font-bold text-[#d9bf8c] py-2"
              >
                <span>New Projects &amp; Off-Plan</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileSubmenu === 'new-projects' ? 'rotate-180' : ''}`} />
              </button>
              {mobileSubmenu === 'new-projects' && (
                <div className="pl-3 py-2 space-y-2 text-xs text-slate-200 border-l border-[#b58b4a]/30 my-1">
                  <button onClick={() => handleItemClick('/new-projects')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">All Off-Plan Launches</button>
                  <button onClick={() => handleItemClick('/new-projects/dubai')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">Dubai New Projects</button>
                  <button onClick={() => handleItemClick('/new-projects/abu-dhabi')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">Abu Dhabi Projects</button>
                  <button onClick={() => handleItemClick('/new-projects/rak')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">Ras Al Khaimah Wynn Island</button>
                  <button onClick={() => handleItemClick('/new-projects/developers')} className="block w-full text-left py-1 text-[#d9bf8c] font-semibold">Master Developers (Emaar, DAMAC, Sobha)</button>
                  <button onClick={() => handleItemClick('/insights/investors-guide')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">Investor&apos;s Guide &amp; Golden Visa</button>
                </div>
              )}
            </div>

            {/* TOOLS & INSIGHTS */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setMobileSubmenu(mobileSubmenu === 'tools' ? null : 'tools')}
                className="w-full flex items-center justify-between text-sm font-bold text-[#d9bf8c] py-2"
              >
                <span>Tools, Reports &amp; Insights</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileSubmenu === 'tools' ? 'rotate-180' : ''}`} />
              </button>
              {mobileSubmenu === 'tools' && (
                <div className="pl-3 py-2 space-y-2 text-xs text-slate-200 border-l border-[#b58b4a]/30 my-1">
                  <button onClick={() => handleItemClick('/tools/market-reports')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">Quarterly Market Reports</button>
                  <button onClick={() => handleItemClick('/buy/mortgage-calculator')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">Mortgage Calculator</button>
                  <button onClick={() => handleItemClick('/rent/rent-vs-buy')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">Rent vs Buy Calculator</button>
                  <button onClick={() => handleItemClick('/insights/area-insights')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">Area &amp; Community Insights</button>
                  <button onClick={() => handleItemClick('/insights/buyers-guide')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">Buyer Guides</button>
                </div>
              )}
            </div>

            {/* AREAS */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setMobileSubmenu(mobileSubmenu === 'areas' ? null : 'areas')}
                className="w-full flex items-center justify-between text-sm font-bold text-[#d9bf8c] py-2"
              >
                <span>Emirates &amp; Areas</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileSubmenu === 'areas' ? 'rotate-180' : ''}`} />
              </button>
              {mobileSubmenu === 'areas' && (
                <div className="pl-3 py-2 space-y-2 text-xs text-slate-200 border-l border-[#b58b4a]/30 my-1">
                  <button onClick={() => handleItemClick('/areas/dubai')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">Dubai (Downtown, Marina, Palm)</button>
                  <button onClick={() => handleItemClick('/areas/abu-dhabi')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">Abu Dhabi</button>
                  <button onClick={() => handleItemClick('/areas/sharjah')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">Sharjah</button>
                  <button onClick={() => handleItemClick('/areas/ras-al-khaimah')} className="block w-full text-left py-1 hover:text-[#d9bf8c]">Ras Al Khaimah</button>
                </div>
              )}
            </div>

            {/* FIND AGENT */}
            <div className="pt-2">
              <button
                onClick={() => handleItemClick('/find-agent')}
                className="w-full text-left text-sm font-bold text-white py-2 flex items-center justify-between"
              >
                <span>Find an Agent</span>
                <Users className="w-4 h-4 text-[#d9bf8c]" />
              </button>
            </div>
          </div>

          {/* Quick Contact Buttons */}
          <div className="pt-4 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                window.open('https://wa.me/97143202030?text=Hello%20JSG%20Real%20Estate,%20I%20would%20like%20a%20WhatsApp%20live%20call%20with%20an%20agent.', '_blank');
              }}
              className="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
            >
              <Radio className="w-4 h-4 animate-pulse" /> Live Call With Agent
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsMapModalOpen(true);
              }}
              className="w-full py-3 rounded-xl bg-[#17362f] text-[#d9bf8c] font-bold text-xs flex items-center justify-center gap-2 border border-[#b58b4a]/30"
            >
              <MapPin className="w-4 h-4 text-[#d9bf8c]" /> 3D Map (Zainal Mohebi Plaza)
            </button>
            <a
              href="tel:+97143202030"
              className="w-full py-3 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-400" /> Call Direct (+971 4 320 2030)
            </a>
            <a
              href="https://wa.me/97143202030"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              WhatsApp Us (+971 4 320 2030)
            </a>
          </div>
        </div>
      )}

    {/* 3D Map Modal for Zainal Mohebi Plaza, Karama, Dubai */}
    <Map3DModal isOpen={isMapModalOpen} onClose={() => setIsMapModalOpen(false)} />

    {/* Live Agent Call Modal: See Property Before You Go */}
    <LiveAgentCallModal isOpen={isLiveAgentModalOpen} onClose={() => setIsLiveAgentModalOpen(false)} />
  </>
  );
};
