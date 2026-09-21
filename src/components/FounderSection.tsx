import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Quote, 
  Building2, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  RotateCcw
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

interface FounderSectionProps {
  onNavigate: (path: string) => void;
}

export interface ShowcaseSlide {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  tag?: string;
  isCustom?: boolean;
}

export interface InfiniteCard {
  id: string;
  title: string;
  image: string;
  defaultImage: string;
  price: string;
  area: string;
}

const PARTNER_SUBTITLES = [
  'Founder & Managing Director',
  'Managing Partner & Executive Director',
  'Founding Partner & Senior Managing Director',
  'Executive Partner & Managing Director',
  'Senior Managing Partner & Director',
  'Managing Partner & Advisory Director'
];

const getSlideTitle = (_slide?: ShowcaseSlide) => {
  return 'JSG Executive Leadership';
};

const getSlideSubtitle = (slide?: ShowcaseSlide, index: number = 0) => {
  if (slide?.subtitle && (slide.subtitle.toLowerCase().includes('partner') || slide.subtitle.toLowerCase().includes('director'))) {
    return slide.subtitle;
  }
  return PARTNER_SUBTITLES[index % PARTNER_SUBTITLES.length];
};

const getSlideTag = (index: number = 0) => {
  return index === 0 ? 'Executive Leadership' : 'Executive Partner';
};

const DEFAULT_SHOWCASE_SLIDES: ShowcaseSlide[] = [
  {
    id: 'founder-1',
    url: '/assets/founder.jpg',
    title: 'JSG Executive Leadership',
    subtitle: 'Founder & Managing Director',
    tag: 'Executive Leadership'
  },
  {
    id: 'suite-2',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
    title: 'JSG Executive Leadership',
    subtitle: 'Managing Partner & Executive Director',
    tag: 'Executive Partner'
  },
  {
    id: 'penthouse-3',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
    title: 'JSG Executive Leadership',
    subtitle: 'Founding Partner & Senior Managing Director',
    tag: 'Executive Partner'
  },
  {
    id: 'mansion-4',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    title: 'JSG Executive Leadership',
    subtitle: 'Executive Partner & Managing Director',
    tag: 'Executive Partner'
  }
];

const INSPIRATIONAL_LINES = [
  "A Property Is More Than an Address.",
  "It is where life happens.",
  "Where ambition grows.",
  "Where your next chapter begins.",
  "We help you find the place that feels like yours."
];

// STRICTLY REAL LUXURY PROPERTIES LOCATED EXCLUSIVELY IN DUBAI
const DEFAULT_BACKGROUND_CARDS_ROW1: InfiniteCard[] = [
  {
    id: 'dubai-bg-1',
    title: "Palm Jumeirah Signature Beachfront Villa",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    price: "AED 28.5M",
    area: "Palm Jumeirah, Dubai"
  },
  {
    id: 'dubai-bg-2',
    title: "Burj Crown Sky Penthouse",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
    price: "AED 16.5M",
    area: "Downtown Dubai"
  },
  {
    id: 'dubai-bg-3',
    title: "Fairway Vistas Championship Mansion",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    price: "AED 24.2M",
    area: "Dubai Hills Estate"
  },
  {
    id: 'dubai-bg-4',
    title: "The Royal Marina High-Altitude Suite",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    price: "AED 5.85M",
    area: "Dubai Marina"
  },
  {
    id: 'dubai-bg-5',
    title: "District One Crystal Lagoon Villa",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    price: "AED 21.0M",
    area: "MBR City, Dubai"
  },
  {
    id: 'dubai-bg-6',
    title: "One Canal Waterfront Luxury Sky Villa",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    price: "AED 19.5M",
    area: "Dubai Water Canal"
  }
];

const DEFAULT_BACKGROUND_CARDS_ROW2: InfiniteCard[] = [
  {
    id: 'dubai-bg-7',
    title: "Jumeirah Bay Island Bulgari Mansion",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    price: "AED 55.0M",
    area: "Jumeirah Bay Island, Dubai"
  },
  {
    id: 'dubai-bg-8',
    title: "Atlantis The Royal Palm Crescent Suite",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    price: "AED 34.0M",
    area: "Palm Jumeirah, Dubai"
  },
  {
    id: 'dubai-bg-9',
    title: "Emirates Hills Montgomerie Villa",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
    price: "AED 38.5M",
    area: "Emirates Hills, Dubai"
  },
  {
    id: 'dubai-bg-10',
    title: "Il Primo Opera Grand Penthouse",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
    price: "AED 22.0M",
    area: "Downtown Dubai"
  },
  {
    id: 'dubai-bg-11',
    title: "Bluewaters Bay Island Residence",
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
    price: "AED 8.4M",
    area: "Bluewaters Island, Dubai"
  },
  {
    id: 'dubai-bg-12',
    title: "Al Barari Botanical Luxury Estate",
    image: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80",
    price: "AED 17.5M",
    area: "Al Barari, Dubai"
  }
];

export const FounderSection: React.FC<FounderSectionProps> = ({ onNavigate }) => {
  const { 
    sections, 
    tables,
    updateFounderCardPhoto, 
    resetFounderCardPhoto, 
    updateShowcaseSlides 
  } = useSiteData();

  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Multi-Photo Showcase Slider State (Hydrated from central server with default fallback)
  const dbFounders = tables?.jsg_founders;
  const dbFounderSlider = tables?.jsg_founder_slider;

  let dynamicSlides: ShowcaseSlide[] = [];
  if (dbFounders && dbFounders.length > 0) {
    dbFounders.forEach((f: any, i: number) => {
      dynamicSlides.push({
        id: f.id || `founder-${i}`,
        url: f.image_url || '/assets/founder.jpg',
        title: f.name || 'JSG Executive Leadership',
        subtitle: f.designation || 'Founder & Managing Director',
        tag: i === 0 ? 'Executive Leadership' : 'Executive Partner'
      });
      if (dbFounderSlider && dbFounderSlider.length > 0) {
        dbFounderSlider.filter((fs: any) => fs.founder_id === f.id).forEach((fs: any, j: number) => {
          dynamicSlides.push({
            id: fs.id || `fslide-${i}-${j}`,
            url: fs.image_url,
            title: f.name || 'JSG Executive Leadership',
            subtitle: fs.caption || f.designation || 'Executive Partner',
            tag: 'Executive Partner'
          });
        });
      }
    });
  }

  const slides: ShowcaseSlide[] = dynamicSlides.length > 0
    ? dynamicSlides
    : ((sections.showcaseSlides && sections.showcaseSlides.length > 0)
        ? (sections.showcaseSlides as ShowcaseSlide[])
        : DEFAULT_SHOWCASE_SLIDES);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [autoSlideSpeed] = useState<number>(3400); // Fast, lively, luxury pacing
  const [isHovered, setIsHovered] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);

  // Interactive Gesture / Pointer Drag State for Fluidity
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const sliderViewportRef = useRef<HTMLDivElement>(null);

  // Infinite Scroll Dubai Property Cards State (Central Server Authority)
  const row1Cards: InfiniteCard[] = (sections.infiniteCardsRow1 && sections.infiniteCardsRow1.length > 0)
    ? (sections.infiniteCardsRow1 as InfiniteCard[])
    : DEFAULT_BACKGROUND_CARDS_ROW1;

  const row2Cards: InfiniteCard[] = (sections.infiniteCardsRow2 && sections.infiniteCardsRow2.length > 0)
    ? (sections.infiniteCardsRow2 as InfiniteCard[])
    : DEFAULT_BACKGROUND_CARDS_ROW2;

  // Smooth auto-play slider loop with real-time progress bar (pauses during active drag or hover)
  useEffect(() => {
    if (isHovered || isDragging || slides.length <= 1) {
      return;
    }

    const stepMs = 40;
    const totalSteps = autoSlideSpeed / stepMs;
    let stepCount = 0;

    const interval = setInterval(() => {
      stepCount++;
      setSlideProgress(Math.min(100, (stepCount / totalSteps) * 100));

      if (stepCount >= totalSteps) {
        stepCount = 0;
        setSlideProgress(0);
        setCurrentSlideIndex(prev => (prev + 1) % slides.length);
      }
    }, stepMs);

    return () => clearInterval(interval);
  }, [isHovered, isDragging, slides.length, autoSlideSpeed]);

  const handlePrevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (slides.length <= 1) return;
    setSlideProgress(0);
    setCurrentSlideIndex(prev => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (slides.length <= 1) return;
    setSlideProgress(0);
    setCurrentSlideIndex(prev => (prev + 1) % slides.length);
  };

  // Pointer drag event handlers for ultra-smooth interactive dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragOffset(0);
    if (sliderViewportRef.current) {
      sliderViewportRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - dragStartX;
    // Apply soft rubber-banding resistance if dragging beyond bounds
    setDragOffset(diff);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (sliderViewportRef.current) {
      try {
        sliderViewportRef.current.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }

    const threshold = 45;
    if (dragOffset < -threshold) {
      handleNextSlide();
    } else if (dragOffset > threshold) {
      handlePrevSlide();
    }
    setDragOffset(0);
  };

  const handlePointerCancel = () => {
    setIsDragging(false);
    setDragOffset(0);
  };

  // Typewriter effect sequence for inspiring messages
  useEffect(() => {
    const fullText = INSPIRATIONAL_LINES[activeLineIndex];
    let charIndex = 0;
    setDisplayedText('');
    setIsTyping(true);

    const typeInterval = setInterval(() => {
      if (charIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);

        // Pause before cycling to next line
        const cycleTimeout = setTimeout(() => {
          setActiveLineIndex((prev) => (prev + 1) % INSPIRATIONAL_LINES.length);
        }, 3200);

        return () => clearTimeout(cycleTimeout);
      }
    }, 45);

    return () => clearInterval(typeInterval);
  }, [activeLineIndex]);

  const currentSlide: ShowcaseSlide | undefined = slides[currentSlideIndex] || slides[0];

  return (
    <section className="relative w-full min-h-[720px] lg:min-h-[780px] bg-[#fbf9f4]/95 overflow-hidden py-12 lg:py-16 flex items-center justify-center select-none border-y border-[#e8dfd3]">
      {/* ========================================================================= */}
      {/* LAYER 1: INFINITE 3D PROPERTY WORLD (Vivid Dubai Properties, Unmasked)     */}
      {/* ========================================================================= */}
      <div 
        className="absolute inset-0 overflow-hidden opacity-95 transition-opacity duration-500"
        style={{ perspective: '1200px' }}
      >
        {/* Ambient Warm Champagne Glow Orbs */}
        <div className="absolute -top-32 left-1/4 w-[520px] h-[520px] rounded-full bg-[#d9bf8c]/35 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 right-1/4 w-[520px] h-[520px] rounded-full bg-[#b58b4a]/20 blur-[120px] pointer-events-none" />

        {/* 3D Angled Track Container */}
        <div 
          className="w-[140%] -ml-[20%] h-full flex flex-col justify-center gap-6"
          style={{ transform: 'rotateX(6deg) rotateY(-8deg) scale(1.02)' }}
        >
          {/* Row 1: Scrolling Left Continuously */}
          <div className="flex gap-5 animate-marquee-left">
            {[...row1Cards, ...row1Cards, ...row1Cards].map((card, i) => (
              <div
                key={`r1-${card.id}-${i}`}
                className="w-72 h-40 sm:w-80 sm:h-44 rounded-2xl overflow-hidden relative shrink-0 border border-[#b58b4a]/50 shadow-xl bg-stone-900 pointer-events-auto transition-transform duration-300 hover:scale-[1.03] hover:z-30 hover:border-[#d9bf8c]"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover filter contrast-105 saturate-110"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0d221c]/90 via-[#0d221c]/35 to-transparent p-3.5 flex flex-col justify-end">
                  <div className="flex items-center justify-between text-[11px] font-bold mb-0.5">
                    <span className="text-[#d9bf8c] uppercase tracking-wider font-mono">{card.area}</span>
                    <span className="text-[#fbfaf7] font-extrabold bg-[#0d221c]/80 px-2 py-0.5 rounded-full border border-[#b58b4a]/40">{card.price}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white truncate drop-shadow">{card.title}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: Scrolling Right Continuously */}
          <div className="flex gap-5 animate-marquee-right">
            {[...row2Cards, ...row2Cards, ...row2Cards].map((card, i) => (
              <div
                key={`r2-${card.id}-${i}`}
                className="w-72 h-40 sm:w-80 sm:h-44 rounded-2xl overflow-hidden relative shrink-0 border border-[#b58b4a]/50 shadow-xl bg-stone-900 pointer-events-auto transition-transform duration-300 hover:scale-[1.03] hover:z-30 hover:border-[#d9bf8c]"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover filter contrast-105 saturate-110"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0d221c]/90 via-[#0d221c]/35 to-transparent p-3.5 flex flex-col justify-end">
                  <div className="flex items-center justify-between text-[11px] font-bold mb-0.5">
                    <span className="text-[#d9bf8c] uppercase tracking-wider font-mono">{card.area}</span>
                    <span className="text-[#fbfaf7] font-extrabold bg-[#0d221c]/80 px-2 py-0.5 rounded-full border border-[#b58b4a]/40">{card.price}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white truncate drop-shadow">{card.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lightweight Edge Vignettes (No Center Masking Fog - Property Cards Remain Completely Visible) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fbf9f4]/45 via-transparent to-[#fbf9f4]/45 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fbf9f4]/50 via-transparent to-[#fbf9f4]/50 pointer-events-none opacity-50" />
      </div>

      {/* Architectural Wood Slat Accent Backdrop */}
      <div className="absolute right-0 top-0 bottom-0 w-1/4 max-w-[320px] pointer-events-none z-10 opacity-15 wood-slats-backdrop mix-blend-multiply" />

      {/* ========================================================================= */}
      {/* LAYER 2 & LAYER 3 CONTAINER (Calibrated Frosted Glass Panels)             */}
      {/* ========================================================================= */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* LAYER 2: INSPIRING JSG MESSAGE & NARRATIVE (Columns 1-6) */}
          <div className="lg:col-span-6 space-y-6 bg-[#fbf9f4]/45 lg:bg-[#fbf9f4]/40 hover:bg-[#fbf9f4]/55 backdrop-blur-md p-6 sm:p-8 lg:p-9 rounded-3xl border border-[#d9bf8c]/50 shadow-[0_12px_40px_rgba(181,139,74,0.12)] relative z-20 transition-all duration-300">
            {/* Top Founder Seal Badge */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#c5a059]/40 shadow-sm">
                <Quote className="w-3.5 h-3.5 text-[#c5a059]" />
                <span className="pre-heading font-serif text-[11px] font-bold text-[#8a631c] tracking-widest uppercase">
                  FOUNDER&apos;S SIGNATURE VISION
                </span>
              </div>
            </div>

            {/* Typewriter Sequential Animated Message - Playfair Display serif in deep bronze charcoal */}
            <div className="min-h-[140px] sm:min-h-[160px] flex flex-col justify-center">
              <h2 className="main-heading font-serif-display text-2xl sm:text-4xl lg:text-5xl text-[#1c1917] tracking-tight leading-[1.2]">
                &ldquo;{displayedText}
                <span className={`inline-block w-1.5 h-7 sm:h-9 bg-[#c5a059] ml-1.5 align-middle ${isTyping ? 'animate-pulse' : 'opacity-0'}`} />
                &rdquo;
              </h2>

              {/* Progress dots for current quote line */}
              <div className="flex items-center gap-2 mt-4">
                {INSPIRATIONAL_LINES.map((line, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveLineIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === activeLineIndex ? 'w-8 bg-[#c5a059]' : 'w-2 bg-stone-300 hover:bg-stone-400'
                    }`}
                    title={line}
                    aria-label={`Show quote ${idx + 1}`}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setActiveLineIndex((prev) => (prev + 1) % INSPIRATIONAL_LINES.length)}
                  className="ml-2 text-stone-400 hover:text-[#c5a059] transition-colors p-1 cursor-pointer"
                  title="Next thought"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Supporting Philosophy Text */}
            <p className="body-desc text-sm sm:text-base text-stone-700 font-normal leading-relaxed max-w-xl">
              At JSG Real Estate, our advisory philosophy is built on absolute discretion, architectural knowledge, and transparent fiduciary guidance. Whether curating a private beachfront retreat on Palm Jumeirah or engineering a high-yield institutional off-plan portfolio, our leadership team ensures every acquisition is executed with precision.
            </p>

            {/* Core Values Badges - Frosted glass finish */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
              <div className="p-3 rounded-xl bg-white/70 hover:bg-white/90 border border-[#e8dfd3] shadow-sm backdrop-blur-sm transition-colors">
                <ShieldCheck className="w-4 h-4 text-[#b58b4a] mb-1" />
                <div className="text-xs font-bold text-[#1c1917]">Trust &amp; Rigor</div>
                <div className="text-[10px] text-stone-500">100% DLD Registered</div>
              </div>
              <div className="p-3 rounded-xl bg-white/70 hover:bg-white/90 border border-[#e8dfd3] shadow-sm backdrop-blur-sm transition-colors">
                <Award className="w-4 h-4 text-[#b58b4a] mb-1" />
                <div className="text-xs font-bold text-[#1c1917]">Curated Assets</div>
                <div className="text-[10px] text-stone-500">Hand-selected luxury</div>
              </div>
              <div className="p-3 rounded-xl bg-white/70 hover:bg-white/90 border border-[#e8dfd3] shadow-sm backdrop-blur-sm transition-colors">
                <Building2 className="w-4 h-4 text-[#b58b4a] mb-1" />
                <div className="text-xs font-bold text-[#1c1917]">Direct Access</div>
                <div className="text-[10px] text-stone-500">Tier-1 Developers</div>
              </div>
            </div>

            {/* Direct Connect CTA */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/find-agent')}
                className="btn-3d-gold px-5 py-2.5 rounded-xl text-xs font-extrabold text-[#17211f] shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Connect With Leadership</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/sell')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1c1917] hover:bg-[#2c2724] text-white shadow-sm transition-all cursor-pointer"
              >
                <span>Request Private Valuation</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* LAYER 3: INTERACTIVE SHOWCASE SLIDER (Fast, Smooth, Interactive, No Pause) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative z-20 w-full">
            <div className="relative w-full max-w-lg lg:max-w-[500px] xl:max-w-[530px] group transition-all duration-300">
              {/* Luxury Champagne Gold Ambient Halo */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-[#b58b4a]/30 via-[#d9bf8c]/40 to-amber-500/20 rounded-[32px] blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Card Framing - Translucent Frosted Glass Finish */}
              <div 
                className="relative bg-white/75 lg:bg-white/70 hover:bg-white/80 backdrop-blur-md border-2 border-[#d9bf8c]/70 rounded-[28px] p-3.5 sm:p-4 lg:p-5 shadow-[0_25px_60px_rgba(181,139,74,0.18)] transition-all duration-300"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                
                {/* Photo Display Window / Slider Viewport with Gesture Swiping & Cursor Grabbing */}
                <div 
                  ref={sliderViewportRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerCancel}
                  data-cursor={isDragging ? 'Dragging' : 'Drag / Swipe'}
                  className={`relative w-full h-[490px] sm:h-[550px] lg:h-[600px] xl:h-[630px] rounded-2xl overflow-hidden bg-stone-900 border border-[#d9bf8c]/50 shadow-inner select-none touch-pan-y ${
                    isDragging ? 'cursor-grabbing' : 'cursor-grab'
                  }`}
                >
                  {slides.length > 0 && (
                    <>
                      {/* Smooth Spring-Damped Track with Real-Time Gesture Tracking */}
                      <div 
                        className="w-full h-full flex"
                        style={{ 
                          transform: isDragging 
                            ? `translateX(calc(-${currentSlideIndex * 100}% + ${dragOffset}px))` 
                            : `translateX(-${currentSlideIndex * 100}%)`,
                          transition: isDragging 
                            ? 'none' 
                            : 'transform 520ms cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        {slides.map((s, idx) => (
                          <div
                            key={s.id}
                            className="w-full h-full shrink-0 relative bg-stone-900 overflow-hidden"
                          >
                            <img
                              key={`${s.id}-${s.url}`}
                              src={s.url}
                              alt={`JSG Executive Leadership - ${getSlideSubtitle(s, idx)}`}
                              className={`w-full h-full object-cover object-top transition-transform duration-1000 ease-out pointer-events-none ${
                                idx === currentSlideIndex ? 'scale-105' : 'scale-100'
                              }`}
                              referrerPolicy="no-referrer"
                            />

                            {/* Multi-stop gradient overlay for crisp typography */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917] via-[#1c1917]/25 to-transparent pointer-events-none" />
                          </div>
                        ))}
                      </div>

                      {/* Top Controls Overlay: Tag & Slide Counter & Quick Actions */}
                      {currentSlide && (
                        <div className="absolute top-3.5 inset-x-3.5 z-20 flex items-center justify-between pointer-events-auto">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/25 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg">
                            <Sparkles className="w-3.5 h-3.5 text-[#d9bf8c]" />
                            <span>{getSlideTag(currentSlideIndex)}</span>
                          </div>

                          {/* Slide Counter Badge */}
                          <div className="inline-flex items-center gap-1.5">
                            <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-mono font-bold text-[#d9bf8c] border border-white/20 shadow-md">
                              0{currentSlideIndex + 1} / 0{slides.length}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Active Slide Caption Overlay with Integrated Navigation Controls Close to the Bar */}
                      {currentSlide && (
                        <div className="absolute bottom-3.5 inset-x-3.5 z-20 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-t from-black/95 via-black/85 to-black/60 backdrop-blur-md border border-[#d9bf8c]/40 text-white shadow-2xl pointer-events-auto flex items-center justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5 truncate font-serif-display">
                              <span>{getSlideTitle(currentSlide)}</span>
                              <CheckCircle2 className="w-4 h-4 text-[#d9bf8c] shrink-0" />
                            </div>
                            <div className="text-xs sm:text-sm font-semibold text-[#d9bf8c] truncate mt-0.5">
                              {getSlideSubtitle(currentSlide, currentSlideIndex)}
                            </div>
                          </div>

                          {/* Navigation Buttons Moved Close to the Bar (No longer crowding the center of the photo) */}
                          {slides.length > 1 && (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={handlePrevSlide}
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer shadow-md active:scale-95 hover:border-[#d9bf8c]"
                                aria-label="Previous Photo"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={handleNextSlide}
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer shadow-md active:scale-95 hover:border-[#d9bf8c]"
                                aria-label="Next Photo"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}

                </div>

                {/* Interactive Segmented Progress Bars (Clickable, Smooth Progress Feedback) */}
                {slides.length > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-3.5">
                    {slides.map((s, idx) => {
                      const isActive = idx === currentSlideIndex;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setSlideProgress(0);
                            setCurrentSlideIndex(idx);
                          }}
                          className={`relative h-2 rounded-full overflow-hidden transition-all duration-300 cursor-pointer ${
                            isActive 
                              ? 'w-10 sm:w-12 bg-black/20 ring-1 ring-[#b58b4a]/60' 
                              : 'w-2.5 sm:w-3 bg-stone-300 hover:bg-[#b58b4a]/40 hover:w-5'
                          }`}
                          title={`View: ${getSlideSubtitle(s, idx)}`}
                          aria-label={`Slide ${idx + 1}: ${getSlideSubtitle(s, idx)}`}
                        >
                          {isActive && (
                            <div 
                              className="absolute inset-0 bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] rounded-full transition-all duration-75"
                              style={{ width: `${slideProgress}%` }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
