import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ArrowRight, 
  Building, 
  Bed, 
  Compass,
  PhoneCall,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { SpeakWithUsModal } from './SpeakWithUsModal';

interface Slide {
  id: number;
  tagline: string;
  headline: string;
  subheadline: string;
  propertyTitle: string;
  location: string;
  price: string;
  stats: string;
  image: string;
  category: string;
  buttonTitle: string;
  ctaPath: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    tagline: 'ULTRA-LUXURY SIGNATURE RESIDENCE',
    headline: 'Find a Place That Feels Like Yours.',
    subheadline: 'Private beachfront living on Palm Jumeirah with crystal sea waters, private infinity pool, and uninterrupted Dubai Marina skyline views.',
    propertyTitle: 'The Frond Signature Beachfront Villa',
    location: 'Palm Jumeirah, Dubai',
    price: 'AED 28,500,000',
    stats: '6 Beds · 8,400 Sq.Ft · Private Beach & Yacht Berth',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=3840&q=95',
    category: 'Beachfront Villa',
    buttonTitle: 'Palm Jumeirah Villa',
    ctaPath: '/buy/villas'
  },
  {
    id: 2,
    tagline: 'TROPHY ASSET PENTHOUSE',
    headline: 'Dubai Properties. Curated With Purpose.',
    subheadline: 'Towering above the world with front-row vistas of the Burj Khalifa and the Dubai Fountains. Crafted for visionary collectors.',
    propertyTitle: 'Burj Crown Duplex Sky Penthouse',
    location: 'Downtown Dubai',
    price: 'AED 16,500,000',
    stats: '4 Beds · 5,200 Sq.Ft · Private Cantilevered Terrace',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=3840&q=95',
    category: 'Sky Penthouse',
    buttonTitle: 'Burj Crown Penthouse',
    ctaPath: '/buy/apartments'
  },
  {
    id: 3,
    tagline: 'CHAMPIONSHIP GOLF ESTATE',
    headline: 'Property · Lifestyle · Trust.',
    subheadline: 'Overlooking the lush 18-hole championship fairways of Dubai Hills. Contemporary minimalist architecture framed by serene greenery.',
    propertyTitle: 'Fairway Vistas Architectural Mansion',
    location: 'Dubai Hills Estate',
    price: 'AED 19,800,000',
    stats: '5 Beds · 7,200 Sq.Ft · Double-Height Ceilings',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=3840&q=95',
    category: 'Golf Mansion',
    buttonTitle: 'Dubai Hills Mansion',
    ctaPath: '/buy/villas'
  },
  {
    id: 4,
    tagline: 'EXCLUSIVE WATERFRONT HORIZONS',
    headline: 'Iconic Architecture. Unrivaled Horizons.',
    subheadline: 'Panoramic floor-to-ceiling glass wrapping around the world-famous Dubai Marina waterway with 5-star concierge services.',
    propertyTitle: 'The Royal Marina Panoramic Residence',
    location: 'Dubai Marina',
    price: 'AED 3,850,000',
    stats: '3 Beds · 2,150 Sq.Ft · Full Marina & Yacht Berthing View',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=3840&q=95',
    category: 'Marina Waterfront',
    buttonTitle: 'Dubai Marina Residence',
    ctaPath: '/buy/apartments'
  },
  {
    id: 5,
    tagline: 'PRIME OFF-PLAN OPPORTUNITY',
    headline: 'The Art of Living in the Modern Emirate.',
    subheadline: 'High-yield master-planned communities across Dubai, Abu Dhabi, and Ras Al Khaimah with flexible post-handover payment structures.',
    propertyTitle: 'Creek Waters & Wynn Resort Island Portfolios',
    location: 'Dubai Creek & Al Marjan Island',
    price: 'From AED 1,950,000',
    stats: '80/20 Payment Plans · Projected 8.5% Net Yield',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=3840&q=95',
    category: 'Island Towers',
    buttonTitle: 'Creek Waters Island',
    ctaPath: '/new-projects'
  }
];

interface HeroSliderProps {
  onNavigate: (path: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigate }) => {
  const { sections, tables, updateHeroSliderPhoto } = useSiteData();
  const dbSlides = tables?.jsg_hero_slider;
  const activeSlides = SLIDES.map((defaultSlide, idx) => {
    const s = dbSlides?.[idx];
    if (!s) return defaultSlide;
    return {
      ...defaultSlide,
      tagline: s.subtitle || defaultSlide.tagline,
      headline: s.title || defaultSlide.headline,
      subheadline: s.subtitle || defaultSlide.subheadline,
      propertyTitle: s.title || defaultSlide.propertyTitle,
      location: s.location || defaultSlide.location,
      price: s.price || defaultSlide.price,
      stats: s.stats || defaultSlide.stats,
      image: s.image_url || defaultSlide.image,
      category: s.category || defaultSlide.category,
      buttonTitle: s.cta1_text || defaultSlide.buttonTitle,
      ctaPath: s.cta1_link || defaultSlide.ctaPath
    };
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTab, setSearchTab] = useState<'buy' | 'rent' | 'off-plan'>('buy');
  const [keyword, setKeyword] = useState('');
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedBeds, setSelectedBeds] = useState('any');
  const [selectedPrice, setSelectedPrice] = useState('any');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [isSpeakModalOpen, setIsSpeakModalOpen] = useState(false);

  const getSlideImage = (s: Slide) => {
    return sections.heroSliderPhotos?.[s.id] || sections.heroSliderPhotos?.[String(s.id)] || s.image;
  };

  const handleHeroPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        updateHeroSliderPhoto(slide.id, result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Touch gesture tracking for mobile smooth swipe
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const SLIDE_DURATION = 4600; // ms per slide - cinematic luxury pacing

  // Continuous automatic slide advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((curr) => (curr + 1) % activeSlides.length);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTab === 'off-plan') {
      onNavigate('/new-projects');
      return;
    }
    if (searchTab === 'buy') {
      if (selectedType === 'Villas') onNavigate('/buy/villas');
      else if (selectedType === 'Apartments') onNavigate('/buy/apartments');
      else if (selectedType === 'Townhouses') onNavigate('/buy/townhouses');
      else onNavigate('/buy');
    } else {
      if (selectedType === 'Apartments') onNavigate('/rent/apartments');
      else if (selectedType === 'Villas') onNavigate('/rent/villas');
      else onNavigate('/rent');
    }
  };

  const slide = activeSlides[currentSlide] || activeSlides[0];

  return (
    <section 
      className="relative w-full min-h-[580px] sm:min-h-[660px] lg:h-[730px] flex flex-col justify-end overflow-hidden select-none bg-[#0c261e] perspective-[1200px]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Image Layer with 8K Crisp Depth & Silky Crossfade */}
      {activeSlides.map((s, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 cubic-bezier(0.4, 0, 0.2, 1) ${
              isActive 
                ? 'opacity-100 z-10' 
                : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={getSlideImage(s)}
              alt={s.propertyTitle}
              className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${
                isActive ? 'scale-105 animate-ken-burns' : 'scale-100'
              }`}
              referrerPolicy="no-referrer"
            />

            {/* Ultra-Minimal Clean Vignette: Ensures Text Readability While Keeping 8K Photos 100% Crisp & Sharp */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent via-55% to-black/20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent via-50% to-transparent pointer-events-none" />
          </div>
        );
      })}

      {/* Periodic Cinematic Golden Sun Ray Passing & Lens Flare Shimmer */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {/* Soft Golden Sun Light Source */}
        <div className="absolute -top-32 right-1/4 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(255,238,185,0.4)_0%,rgba(212,175,55,0.15)_45%,transparent_70%)] blur-2xl animate-sun-source pointer-events-none" />

        {/* Diagonal Golden Sun Ray Passing Periodically */}
        <div className="absolute -top-[50%] -left-[45%] w-[85%] h-[200%] pointer-events-none animate-sun-ray">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-[rgba(255,242,204,0.38)] via-50% to-transparent blur-lg mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.25)] via-50% to-transparent blur-xs mix-blend-screen" />
        </div>
      </div>

      {/* Slide Content Overlay Layer - Safe top clearance for header, elegant bottom anchoring */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-5 sm:pb-7 lg:pb-9 pt-24 sm:pt-28 lg:pt-20 [transform-style:preserve-3d]">
        {/* Hero Headlines & CTA Actions Positioned Close to the Search Bar */}
        <div key={slide.id} className="max-w-3xl space-y-2.5 sm:space-y-3.5 mb-3 sm:mb-4">
          {/* Animated Main Headline - Refined Luxury Serif in crisp alabaster with dual-layer shadow */}
          <h1 className="font-serif-display text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#fdfbf7] tracking-[0.02em] leading-[1.12] drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] drop-shadow-[0_6px_20px_rgba(12,38,30,0.7)] animate-hero-stagger-1">
            {slide.headline}
          </h1>

          {/* Subheadline description - Clean neutral sans-serif in soft warm alabaster with legible soft shadow */}
          <p className="font-sans-clean text-xs sm:text-sm lg:text-[15px] text-[#f1ede6] font-normal leading-relaxed max-w-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)] animate-hero-stagger-2 line-clamp-2 sm:line-clamp-none">
            {slide.subheadline}
          </p>

          {/* CTAs Action Buttons - Cohesive Balanced Grid on Mobile, Aligned Inline Row on Tablet & Desktop */}
          <div className="pt-1 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 animate-hero-stagger-4">
            {/* Primary Action: Explore Properties */}
            <button
              type="button"
              onClick={() => onNavigate(slide.ctaPath)}
              data-cursor="Explore"
              className="h-10 sm:h-11 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-[#b58b4a] via-[#d4af37] to-[#b58b4a] text-[#0c261e] shadow-[0_6px_20px_rgba(181,139,74,0.35)] hover:brightness-110 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap select-none"
            >
              <span>Explore Properties</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#0c261e] shrink-0" />
            </button>

            {/* Direct Advisor Connect: Speak With Us */}
            <button
              type="button"
              onClick={() => setIsSpeakModalOpen(true)}
              data-cursor="Speak With Us"
              className="h-10 sm:h-11 px-3 sm:px-3.5 rounded-xl text-xs sm:text-sm font-bold bg-[#0c261e]/90 hover:bg-[#153e32] backdrop-blur-md border border-[#d4af37]/70 hover:border-[#d4af37] text-white shadow-[0_6px_20px_rgba(12,38,30,0.45)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-1.5 cursor-pointer group select-none whitespace-nowrap"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <PhoneCall className="w-3.5 h-3.5 text-[#d9bf8c] group-hover:scale-110 transition-transform shrink-0" />
              <span className="font-extrabold tracking-wide text-[#fdfbf7]">Speak With Us</span>
            </button>

            {/* Secondary Action: View New Projects */}
            <button
              type="button"
              onClick={() => onNavigate('/new-projects')}
              data-cursor="New Projects"
              className="col-span-2 sm:col-span-1 h-10 sm:h-11 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#0c261e]/60 hover:bg-[#0c261e]/80 backdrop-blur-md border border-[#c5a059]/40 text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap select-none"
            >
              <Compass className="w-3.5 h-3.5 text-[#d9bf8c] shrink-0" />
              <span>View New Projects</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar: Smart Search Box with Safe Top Spacing to Never Cover Buttons */}
        <div className="w-full mt-2 sm:mt-3">
          {/* Mobile & Tablet Ultra-Slim Search Bar (< lg) */}
          <form onSubmit={handleSearchSubmit} className="block lg:hidden">
            {/* 1. Purpose Selector Pills: Buy, Rent, Off-Plan */}
            <div className="flex items-center gap-1.5 mb-1.5">
              {(['buy', 'rent', 'off-plan'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSearchTab(tab)}
                  className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer capitalize tracking-wide select-none ${
                    searchTab === tab
                      ? 'bg-[#b89759] text-white shadow-md'
                      : 'bg-[#0c261e]/85 text-[#d9bf8c] border border-[#c5a059]/30 hover:border-[#c5a059] hover:bg-[#0c261e]'
                  }`}
                >
                  {tab === 'off-plan' ? 'Off-Plan' : tab}
                </button>
              ))}
            </div>

            {/* 2. Unified Slim Search Capsule Bar - Slim profile */}
            <div className="p-1 sm:p-1.5 rounded-full bg-[#fdfbf7] border border-[#e8dfd3] shadow-[0_12px_35px_rgba(17,41,35,0.3)] flex items-center gap-1 sm:gap-2">
              {/* Keyword Search Input */}
              <div className="flex items-center gap-2 pl-2.5 sm:pl-3 flex-1 min-w-0">
                <Search className="w-3.5 h-3.5 text-[#b89759] shrink-0" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search Marina, Villa, Tower..."
                  className="w-full bg-transparent text-[#1b2e23] placeholder-[#7a7a7a] outline-none text-xs font-medium"
                />
              </div>

              {/* Compact Filter Trigger Toggle */}
              <button
                type="button"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className={`px-2.5 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 select-none ${
                  showMobileFilters || selectedType !== 'All Types' || selectedBeds !== 'any' || selectedPrice !== 'any'
                    ? 'bg-[#b89759] text-white shadow-sm'
                    : 'bg-[#f4ece1] text-[#8c6d33] border border-[#e2d4c0] hover:bg-[#ede3d5]'
                }`}
              >
                <SlidersHorizontal className="w-3 h-3 shrink-0" />
                <span className="hidden xs:inline">Filters</span>
                {(selectedType !== 'All Types' || selectedBeds !== 'any' || selectedPrice !== 'any') && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5" />
                )}
              </button>

              {/* Slim Submit Search Button */}
              <button
                type="submit"
                style={{ backgroundColor: '#b89759' }}
                className="btn-3d-bronze-gold py-1.5 sm:py-2 px-3.5 sm:px-4 rounded-full text-white font-black flex items-center justify-center gap-1 cursor-pointer shadow-md select-none tracking-wide text-xs uppercase shrink-0"
              >
                <span>Search</span>
              </button>
            </div>

            {/* 3. Collapsible Filter Row on Mobile/Tablet */}
            {showMobileFilters && (
              <div className="mt-2 p-2.5 sm:p-3 rounded-2xl bg-[#fdfbf7]/98 backdrop-blur-xl border border-[#e8dfd3] shadow-2xl grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {/* Property Type Dropdown */}
                <div className="flex items-center bg-[#f4ece1]/90 rounded-xl px-2.5 py-1.5 border border-[#e2d4c0]">
                  <Building className="w-3.5 h-3.5 text-[#b89759] mr-2 shrink-0" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-transparent text-[#1b2e23] font-medium outline-none cursor-pointer text-xs"
                  >
                    <option value="All Types">Property Type (All)</option>
                    <option value="Apartments">Apartments</option>
                    <option value="Villas">Villas &amp; Mansions</option>
                    <option value="Townhouses">Townhouses</option>
                    <option value="Penthouses">Penthouses</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                {/* Beds Dropdown */}
                <div className="flex items-center bg-[#f4ece1]/90 rounded-xl px-2.5 py-1.5 border border-[#e2d4c0]">
                  <Bed className="w-3.5 h-3.5 text-[#b89759] mr-2 shrink-0" />
                  <select
                    value={selectedBeds}
                    onChange={(e) => setSelectedBeds(e.target.value)}
                    className="w-full bg-transparent text-[#1b2e23] font-medium outline-none cursor-pointer text-xs"
                  >
                    <option value="any">Beds (Any)</option>
                    <option value="1">1 Bed</option>
                    <option value="2">2 Beds</option>
                    <option value="3">3 Beds</option>
                    <option value="4">4+ Beds</option>
                    <option value="5">5+ Mansions</option>
                  </select>
                </div>

                {/* Price Dropdown */}
                <div className="flex items-center bg-[#f4ece1]/90 rounded-xl px-2.5 py-1.5 border border-[#e2d4c0]">
                  <span className="text-[10px] font-bold text-[#8c6d33] mr-1.5 shrink-0">AED</span>
                  <select
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    className="w-full bg-transparent text-[#1b2e23] font-medium outline-none cursor-pointer text-xs"
                  >
                    <option value="any">Price (Any)</option>
                    <option value="under-2m">Up to 2M AED</option>
                    <option value="2m-5m">2M - 5M AED</option>
                    <option value="5m-15m">5M - 15M AED</option>
                    <option value="15m+">15M+ (Trophy)</option>
                  </select>
                </div>
              </div>
            )}
          </form>

          {/* Desktop Search Bar (>= lg): Full Horizontal Luxury Pill */}
          <form 
            onSubmit={handleSearchSubmit}
            className="hidden lg:grid p-2 sm:p-2.5 rounded-full bg-[#fdfbf7] border border-[#e8dfd3] shadow-[0_20px_50px_rgba(17,41,35,0.35)] grid-cols-6 gap-2.5 items-center text-xs text-[#1b2e23]"
          >
            {/* 1. Category Selector: Buy, Rent, Off-Plan */}
            <div className="relative flex items-center bg-[#f4ece1]/80 rounded-full px-3 py-2 border border-[#e2d4c0]">
              <span className="text-[10px] font-bold text-[#8c6d33] uppercase mr-1.5 shrink-0">Purpose:</span>
              <select
                value={searchTab}
                onChange={(e) => setSearchTab(e.target.value as any)}
                className="w-full bg-transparent text-[#1b2e23] font-bold outline-none cursor-pointer text-xs"
              >
                <option value="buy" className="bg-[#fdfbf7] text-[#1b2e23]">Buy</option>
                <option value="rent" className="bg-[#fdfbf7] text-[#1b2e23]">Rent</option>
                <option value="off-plan" className="bg-[#fdfbf7] text-[#1b2e23]">Off-Plan</option>
              </select>
            </div>

            {/* 2. Keyword Search */}
            <div className="relative flex items-center bg-[#f4ece1]/80 rounded-full px-3 py-2 border border-[#e2d4c0]">
              <Search className="w-3.5 h-3.5 text-[#b89759] mr-2 shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Keyword (Marina, Villa...)"
                className="w-full bg-transparent text-[#1b2e23] placeholder-[#7a7a7a] outline-none text-xs font-medium"
              />
            </div>

            {/* 3. Property Type Dropdown */}
            <div className="relative flex items-center bg-[#f4ece1]/80 rounded-full px-3 py-2 border border-[#e2d4c0]">
              <Building className="w-3.5 h-3.5 text-[#b89759] mr-2 shrink-0" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-transparent text-[#1b2e23] font-medium outline-none cursor-pointer text-xs"
              >
                <option value="All Types" className="bg-[#fdfbf7] text-[#1b2e23]">Property Type (All)</option>
                <option value="Apartments" className="bg-[#fdfbf7] text-[#1b2e23]">Apartments</option>
                <option value="Villas" className="bg-[#fdfbf7] text-[#1b2e23]">Villas &amp; Mansions</option>
                <option value="Townhouses" className="bg-[#fdfbf7] text-[#1b2e23]">Townhouses</option>
                <option value="Penthouses" className="bg-[#fdfbf7] text-[#1b2e23]">Penthouses</option>
                <option value="Commercial" className="bg-[#fdfbf7] text-[#1b2e23]">Commercial</option>
              </select>
            </div>

            {/* 4. Beds Dropdown */}
            <div className="relative flex items-center bg-[#f4ece1]/80 rounded-full px-3 py-2 border border-[#e2d4c0]">
              <Bed className="w-3.5 h-3.5 text-[#b89759] mr-2 shrink-0" />
              <select
                value={selectedBeds}
                onChange={(e) => setSelectedBeds(e.target.value)}
                className="w-full bg-transparent text-[#1b2e23] font-medium outline-none cursor-pointer text-xs"
              >
                <option value="any" className="bg-[#fdfbf7] text-[#1b2e23]">Beds (Any)</option>
                <option value="1" className="bg-[#fdfbf7] text-[#1b2e23]">1 Bed</option>
                <option value="2" className="bg-[#fdfbf7] text-[#1b2e23]">2 Beds</option>
                <option value="3" className="bg-[#fdfbf7] text-[#1b2e23]">3 Beds</option>
                <option value="4" className="bg-[#fdfbf7] text-[#1b2e23]">4+ Beds</option>
                <option value="5" className="bg-[#fdfbf7] text-[#1b2e23]">5+ Mansions</option>
              </select>
            </div>

            {/* 5. Price Dropdown */}
            <div className="relative flex items-center bg-[#f4ece1]/80 rounded-full px-3 py-2 border border-[#e2d4c0]">
              <span className="text-[10px] font-bold text-[#8c6d33] mr-1.5 shrink-0">AED</span>
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="w-full bg-transparent text-[#1b2e23] font-medium outline-none cursor-pointer text-xs"
              >
                <option value="any" className="bg-[#fdfbf7] text-[#1b2e23]">Price (Any)</option>
                <option value="under-2m" className="bg-[#fdfbf7] text-[#1b2e23]">Up to 2M AED</option>
                <option value="2m-5m" className="bg-[#fdfbf7] text-[#1b2e23]">2M - 5M AED</option>
                <option value="5m-15m" className="bg-[#fdfbf7] text-[#1b2e23]">5M - 15M AED</option>
                <option value="15m+" className="bg-[#fdfbf7] text-[#1b2e23]">15M+ (Trophy)</option>
              </select>
            </div>

            {/* 6. Warm Bronze-Gold CTA Search Button (#b89759) */}
            <button
              type="submit"
              style={{ backgroundColor: '#b89759' }}
              className="btn-3d-bronze-gold py-2.5 px-4 rounded-full text-white font-black flex items-center justify-center gap-2 cursor-pointer shadow-md select-none tracking-wide text-xs uppercase"
            >
              <Search className="w-4 h-4 text-white" />
              <span>Search</span>
            </button>
          </form>
        </div>
      </div>

      {/* Speak With Us Connect Modal */}
      {isSpeakModalOpen && (
        <SpeakWithUsModal
          isOpen={isSpeakModalOpen}
          onClose={() => setIsSpeakModalOpen(false)}
        />
      )}
    </section>
  );
};
