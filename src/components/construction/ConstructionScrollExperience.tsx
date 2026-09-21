import React, { useEffect, useRef, useState } from 'react';
import { 
  Building2, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { JSGLogo } from '../JSGLogo';
import { useSiteData } from '../../context/SiteDataContext';

interface Milestone {
  numeral: string;
  stageName: string;
  title: string;
  elevation: string;
  engineeringSpec: string;
  range: [number, number]; // [start, end]
  description: string;
}

const MILESTONES: Milestone[] = [
  {
    numeral: '01',
    stageName: 'Stage 01 · Excavation & Shoring',
    title: 'Deep Earthworks & Secant Piling',
    elevation: '-18.5m Sub-Grade',
    engineeringSpec: '38,500 m³ Earth Shifted · C60 Grout Anchors',
    range: [0.0, 0.22],
    description: 'Deep perimeter shoring walls and high-capacity tieback anchors establishing bedrock stability for high-rise load transfer.'
  },
  {
    numeral: '02',
    stageName: 'Stage 02 · Substructure & Raft',
    title: 'Heavy Reinforced Foundation Raft',
    elevation: '-6.2m Raft Level',
    engineeringSpec: '14,200 m³ Self-Consolidating Concrete',
    range: [0.22, 0.44],
    description: 'Continuous 72-hour thermal-controlled concrete pour incorporating dual-layer high-tensile steel reinforcement cages.'
  },
  {
    numeral: '03',
    stageName: 'Stage 03 · Superstructure & Core',
    title: 'Post-Tensioned Slabs & Central Core',
    elevation: '+48.0m Level 14',
    engineeringSpec: '2 Liebherr High-Mast Tower Cranes Active',
    range: [0.44, 0.68],
    description: 'Rapid vertical climbing core with seismic shear walls and cantilevered floorplates engineered to stringent Dubai Municipality standards.'
  },
  {
    numeral: '04',
    stageName: 'Stage 04 · Architectural Facade',
    title: 'Curtain Wall Glazing & Bronze Louvers',
    elevation: '+82.5m Facade Crown',
    engineeringSpec: 'Triple-Glazed Low-E Acoustic Acoustic Glass',
    range: [0.68, 0.88],
    description: 'Unitized double-silver coated panoramic glass panels integrated with aerodynamic golden metallic fins for solar deflection.'
  },
  {
    numeral: '05',
    stageName: 'Stage 05 · Handover Ready',
    title: 'Ultra-Luxury Architectural Masterpiece',
    elevation: 'Delivery Complete',
    engineeringSpec: 'DLD Registered · 100% Handover Compliance',
    range: [0.88, 1.0],
    description: 'Flawless handover condition with bespoke private infinity pool, lush subtropical landscaping, and smart home automation.'
  }
];

interface ConstructionScrollExperienceProps {
  onNavigate?: (path: string) => void;
  initialVideoSrc?: string;
}

// Permanent official high-resolution architectural construction video
const PERMANENT_VIDEO_SRC = '/construction.mp4?v=3';

export const ConstructionScrollExperience: React.FC<ConstructionScrollExperienceProps> = ({ 
  onNavigate
}) => {
  const { sections, tables } = useSiteData();
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState<number>(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  const [isVideoSeeking, setIsVideoSeeking] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  const targetTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(10);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const scrollVideoRow = tables?.jsg_scroll_video?.[0];
  const activeVideoSrc = '/construction.mp4';
  const experienceData = sections?.constructionExperience || {};
  const preHeadingText = experienceData.preHeading || 'Architectural Genesis · Dubai';
  const headingText = scrollVideoRow?.overlay_text || experienceData.heading || 'Witness Masterpiece Realization';
  const descriptionText = experienceData.description || 'Scroll down to advance structural engineering forward; scroll up to reverse the physical assembly timeline.';

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Update active milestone based on progress
  useEffect(() => {
    const idx = MILESTONES.findIndex(
      m => scrollProgress >= m.range[0] && scrollProgress <= m.range[1]
    );
    if (idx !== -1 && idx !== activeMilestoneIndex) {
      setActiveMilestoneIndex(idx);
    }
  }, [scrollProgress, activeMilestoneIndex]);

  // Video loaded metadata
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    const dur = videoRef.current.duration;
    if (dur && !isNaN(dur) && isFinite(dur)) {
      durationRef.current = dur;
    }
    setIsVideoLoaded(true);
    // Seek to first frame
    videoRef.current.currentTime = 0.001;
  };

  // Video seeking flags for smooth decode feedback
  const handleSeeking = () => setIsVideoSeeking(true);
  const handleSeeked = () => setIsVideoSeeking(false);

  // High-performance requestAnimationFrame seek loop
  useEffect(() => {
    let animId: number;

    const tick = () => {
      const video = videoRef.current;
      if (video && isVideoLoaded && durationRef.current > 0) {
        const target = targetTimeRef.current;
        const current = video.currentTime;
        const diff = Math.abs(current - target);

        // Instant intra-frame seeking when difference is above micro-threshold
        if (diff > 0.02 && !video.seeking) {
          video.currentTime = target;
        }
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isVideoLoaded]);

  // Main scroll-scrubbing listener
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || prefersReducedMotion) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - windowHeight;

      if (totalScrollableDistance <= 0) return;

      // Current progress through the sticky pinned container
      const currentScroll = -rect.top;
      const rawProgress = currentScroll / totalScrollableDistance;
      const clampedProgress = Math.max(0, Math.min(1, rawProgress));

      setScrollProgress(clampedProgress);

      const targetSeconds = clampedProgress * durationRef.current;
      targetTimeRef.current = targetSeconds;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial measure

    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  // Click on a milestone pill to scroll smoothly to that exact phase
  const scrollToMilestone = (idx: number) => {
    const milestone = MILESTONES[idx];
    if (!milestone || !containerRef.current) return;

    const targetProgress = (milestone.range[0] + milestone.range[1]) / 2;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const totalScrollableDistance = containerRef.current.clientHeight - window.innerHeight;
    const targetScrollY = scrollTop + rect.top + targetProgress * totalScrollableDistance;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  };

  // Fullscreen toggle
  const toggleFullscreen = async () => {
    if (!viewportRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await viewportRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Fullscreen not supported or allowed
    }
  };

  // Ambient audio chime (optional sensory touch)
  const toggleAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    const next = !isAudioEnabled;
    setIsAudioEnabled(next);

    if (next && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      const freqs = [220, 277.18, 329.63, 440]; // A Major resonant chime
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0.015, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.12 + 2.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 2.6);
      });
    }
  };

  const activeMilestone = MILESTONES[activeMilestoneIndex] || MILESTONES[0];
  const progressPercent = Math.round(scrollProgress * 100);

  return (
    <section
      id="construction-experience"
      ref={containerRef}
      aria-label="JSG Architectural Construction Experience"
      className="relative w-full bg-[#0d1613] text-stone-100"
      style={{ height: prefersReducedMotion ? 'auto' : '380vh' }}
    >
      {/* Sticky Fullscreen Pinned Viewport */}
      <div
        ref={viewportRef}
        className={`${
          prefersReducedMotion ? 'relative py-16' : 'sticky top-0 h-screen w-full'
        } overflow-hidden flex flex-col justify-between select-none z-10`}
      >
        {/* VIDEO BACKGROUND (Permanent High-Definition Architectural Canvas) */}
        <div className="absolute inset-0 w-full h-full bg-[#0d1613] z-0 overflow-hidden">
          <video
  autoPlay
  muted
  loop
  playsInline
  preload="auto"
  className="w-full h-full object-cover"
>
  <source src="/your-compressed-video-name.mp4" type="video/mp4" />
</video>

          {/* Delicate subtle architectural vignette (preserves raw footage and building transformation visibility) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1613]/85 via-transparent to-[#0d1613]/50 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1613]/30 via-transparent to-[#0d1613]/30 pointer-events-none" />
        </div>

        {/* ---------------------------------------------------- */}
        {/* TOP CINEMATIC HUD BAR                                */}
        {/* ---------------------------------------------------- */}
        <div className="relative z-20 px-4 sm:px-6 md:px-10 pt-16 sm:pt-20 lg:pt-8 flex items-start justify-between gap-3">
          <div className="space-y-1 sm:space-y-1.5 max-w-xl">
            {/* Pre-Heading according to style guide */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-pulse" />
              <span className="pre-heading text-[11px] sm:text-[13px] font-semibold uppercase tracking-[2px] sm:tracking-[2.5px] text-[#c5a059]">
                {preHeadingText}
              </span>
              <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded bg-[#142621]/80 text-[#d9bf8c] border border-[#c5a059]/30 font-medium">
                8K Ready · Scroll Controlled
              </span>
            </div>

            {/* Main Heading according to style guide */}
            <h2 className="main-heading text-xl sm:text-3xl lg:text-4xl text-[#f4f4f0] font-normal leading-tight drop-shadow-md">
              {headingText}
            </h2>

            <p className="body-desc hidden sm:block text-xs sm:text-sm text-[#d1d1d6] line-clamp-1 sm:line-clamp-none max-w-lg drop-shadow">
              {descriptionText}
            </p>
          </div>

          {/* Top Right Controls: Audio, Fullscreen */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Ambient Chime Audio Toggle */}
            <button
              type="button"
              onClick={toggleAudio}
              title={isAudioEnabled ? 'Mute Atmosphere' : 'Play Ambient Atmosphere'}
              className="p-1.5 sm:p-2 bg-[#142621]/80 hover:bg-[#1f4a40] text-[#c5a059] hover:text-white border border-[#c5a059]/40 rounded-xl text-xs shadow-lg backdrop-blur-md transition-all cursor-pointer"
            >
              {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
              className="p-1.5 sm:p-2 bg-[#142621]/80 hover:bg-[#1f4a40] text-[#c5a059] hover:text-white border border-[#c5a059]/40 rounded-xl text-xs shadow-lg backdrop-blur-md transition-all cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* CENTER INTERACTIVE STAGE CARD & HUD                  */}
        {/* Ultra-sleek translucent glass so video shines through */}
        {/* ---------------------------------------------------- */}
        <div className="relative z-20 px-3 sm:px-6 md:px-10 max-w-sm sm:max-w-md md:max-w-xl self-start mt-auto mb-2 sm:mb-4 md:mb-6 transition-all duration-300">
          <div className="bg-[#091814]/40 sm:bg-[#0a1b15]/55 md:bg-[#0f1d19]/75 border border-[#c5a059]/35 sm:border-[#c5a059]/45 rounded-2xl p-3 sm:p-4 md:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.5)] backdrop-blur-md space-y-1.5 sm:space-y-2.5 transition-all duration-300">
            {/* Milestone Header */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                {/* 3D Shiny Metallic Gold Card Numeral */}
                <span className="card-numeral text-xl sm:text-2xl md:text-3xl font-bold shrink-0">
                  {activeMilestone.numeral}
                </span>
                <div className="min-w-0">
                  <span className="pre-heading text-[10px] sm:text-[11px] font-semibold uppercase tracking-[1.5px] sm:tracking-[2px] text-[#c5a059] block truncate">
                    {activeMilestone.stageName}
                  </span>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#f4f4f0] truncate">
                    {activeMilestone.title}
                  </h3>
                </div>
              </div>

              {/* Progress Pill */}
              <div className="text-right shrink-0">
                <span className="text-xs sm:text-sm font-bold text-[#c5a059] block">
                  {progressPercent}%
                </span>
                <span className="text-[9px] sm:text-[10px] text-stone-400 font-mono">
                  TIMELINE
                </span>
              </div>
            </div>

            {/* Description Paragraph: compact and legible with transparent glass background */}
            <p className="text-[11px] sm:text-xs text-[#d1d1d6] leading-relaxed line-clamp-2 sm:line-clamp-none">
              {activeMilestone.description}
            </p>

            {/* Engineering Specs Pill Grid */}
            <div className="pt-1.5 sm:pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 text-[10px] sm:text-[11px]">
              <span className="text-[#fae7b5] font-mono">
                {activeMilestone.elevation}
              </span>
              <span className="text-stone-300 truncate max-w-[200px] sm:max-w-none">
                {activeMilestone.engineeringSpec}
              </span>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* BOTTOM TIMELINE SCRUB BAR & MILESTONES               */}
        {/* ---------------------------------------------------- */}
        <div className="relative z-20 px-3 sm:px-6 md:px-10 pb-4 sm:pb-6 md:pb-8 space-y-2 sm:space-y-3 bg-gradient-to-t from-[#0d1613]/90 via-[#0d1613]/60 to-transparent pt-3 sm:pt-4">
          {/* Milestone Clickable Pills */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
            {MILESTONES.map((m, idx) => {
              const isActive = idx === activeMilestoneIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToMilestone(idx)}
                  className={`px-2 py-2 sm:py-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-[#142621] border-[#c5a059] shadow-[0_4px_15px_rgba(197,160,89,0.3)]'
                      : 'bg-[#142621]/50 border-white/10 hover:border-[#c5a059]/50 hover:bg-[#142621]/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold ${isActive ? 'text-[#c5a059]' : 'text-stone-400'}`}>
                      {m.numeral}
                    </span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-ping" />}
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold text-[#f4f4f0] line-clamp-1 mt-0.5">
                    {m.title.split(' ')[0]} {m.title.split(' ')[1]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Continuous Scrub Progress Bar */}
          <div className="relative w-full h-2 bg-stone-800/80 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#8c6d33] via-[#c5a059] to-[#f3e5ab] rounded-full transition-all duration-75"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Scroll Directional Prompt */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
            <div className="flex items-center gap-2">
              <ChevronDown className="w-3.5 h-3.5 text-[#c5a059] animate-bounce" />
              <span>Scroll down to advance structural completion</span>
            </div>
            <span className="font-mono text-[#c5a059]">
              {progressPercent}% ASSEMBLED
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
