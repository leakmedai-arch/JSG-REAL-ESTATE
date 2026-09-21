import React, { useEffect, useRef, useState } from 'react';
import {
  Rotate3d,
  Layers,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronRight,
  ShieldCheck,
  Eye,
  Sliders
} from 'lucide-react';
import { CONSTRUCTION_MILESTONES, MilestoneInfo } from './types';
import { Construction3DScene } from './Construction3DScene';

interface ConstructionJourneySectionProps {
  onExploreProperties?: () => void;
}

export const ConstructionJourneySection: React.FC<ConstructionJourneySectionProps> = ({ onExploreProperties }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneInstanceRef = useRef<Construction3DScene | null>(null);

  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInspectMode, setIsInspectMode] = useState(false);
  const [isXRayMode, setIsXRayMode] = useState(false);
  const [isPlayingAuto, setIsPlayingAuto] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [showTechnicalSpecs, setShowTechnicalSpecs] = useState(true);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeMilestone: MilestoneInfo = CONSTRUCTION_MILESTONES[activeStageIndex] || CONSTRUCTION_MILESTONES[0];

  // 1. Initialize Three.js WebGL Scene
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new Construction3DScene({
      canvas: canvasRef.current,
      onStageChange: (stageIdx) => {
        setActiveStageIndex(stageIdx);
      }
    });
    sceneInstanceRef.current = scene;

    const handleResize = () => {
      scene.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      scene.dispose();
      sceneInstanceRef.current = null;
    };
  }, []);

  // 2. Scroll-Scrubbing Listener
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !sceneInstanceRef.current || isPlayingAuto) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollDistance = rect.height - windowHeight;
      if (totalScrollDistance <= 0) return;

      const currentScroll = -rect.top;
      const rawProgress = currentScroll / totalScrollDistance;
      const clamped = Math.max(0, Math.min(1, rawProgress));

      setScrollProgress(clamped);
      sceneInstanceRef.current.setScrollProgress(clamped);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isPlayingAuto]);

  // 3. Cinematic Auto-Tour Animation Loop
  useEffect(() => {
    if (!isPlayingAuto) return;

    let animId: number;
    let currentP = scrollProgress;

    const loop = () => {
      currentP += 0.0016; // Smooth film scrub speed
      if (currentP > 1) {
        currentP = 0;
      }
      setScrollProgress(currentP);
      if (sceneInstanceRef.current) {
        sceneInstanceRef.current.setScrollProgress(currentP);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlayingAuto, scrollProgress]);

  // 4. Milestone Direct Jump
  const handleMilestoneSelect = (index: number) => {
    const milestone = CONSTRUCTION_MILESTONES[index];
    if (!milestone || !containerRef.current) return;

    setIsPlayingAuto(false);
    setActiveStageIndex(index);
    setScrollProgress(milestone.targetProgress);

    if (sceneInstanceRef.current) {
      sceneInstanceRef.current.setScrollProgress(milestone.targetProgress);
    }

    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const totalScrollDistance = containerRef.current.clientHeight - window.innerHeight;
    const targetScrollY = scrollTop + rect.top + milestone.targetProgress * totalScrollDistance;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  };

  // 5. Orbit & X-Ray Toggles
  const toggleInspectMode = () => {
    if (!sceneInstanceRef.current) return;
    const next = !isInspectMode;
    setIsInspectMode(next);
    sceneInstanceRef.current.isInspectMode = next;
  };

  const toggleXRayMode = () => {
    if (!sceneInstanceRef.current) return;
    const next = !isXRayMode;
    setIsXRayMode(next);
    sceneInstanceRef.current.isXRayMode = next;
  };

  // 6. Subtle Ambient Architectural Audio
  const toggleAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    const nextState = !isAudioEnabled;
    setIsAudioEnabled(nextState);
    if (nextState) {
      playAtmosphereChime();
    }
  };

  const playAtmosphereChime = () => {
    if (!audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const freqs = [329.63, 440, 554.37, 659.25]; // E major chord
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.02, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.1 + 2.0);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 2.2);
      });
    } catch {
      // Audio fallback
    }
  };

  return (
    <section
      id="construction-journey"
      ref={containerRef}
      className="relative w-full bg-[#111827] text-slate-100 overflow-visible"
      style={{ height: '560vh' }} // Expansive scroll path for 13-stage journey
    >
      {/* Sticky Fullscreen 3D Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between select-none">
        
        {/* Three.js WebGL Canvas (fills 100% of viewport) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
        />

        {/* ---------------------------------------------------- */}
        {/* TOP MINIMAL BAR                                      */}
        {/* ---------------------------------------------------- */}
        <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pointer-events-auto">
          <div className="flex items-center justify-between gap-3 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2.5 shadow-2xl">
            
            {/* Brand / Section Title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#b58b4a] text-[#17362f] flex items-center justify-center font-black text-xs shadow-md">
                3D
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#d9bf8c]">
                    Real-Life 3D Architectural Journey
                  </span>
                  <span className="hidden sm:inline text-[10px] text-slate-400 font-mono">
                    &bull; Scroll To Construct
                  </span>
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  JSG Signature Residence &bull; Ground to Turnkey Villa
                </h2>
              </div>
            </div>

            {/* Quick Minimal Controls Pill */}
            <div className="flex items-center gap-1.5 text-xs">
              {/* 360° Free Drag Orbit */}
              <button
                type="button"
                onClick={toggleInspectMode}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer text-xs ${
                  isInspectMode
                    ? 'bg-[#b58b4a] text-[#17362f] shadow-lg ring-1 ring-[#b58b4a]'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                }`}
                title="Drag mouse or finger to rotate the building in 360°"
              >
                <Rotate3d className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isInspectMode ? 'Inspect Active' : '360° Orbit'}</span>
              </button>

              {/* Cutaway / X-Ray MEP Toggle */}
              <button
                type="button"
                onClick={toggleXRayMode}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer text-xs ${
                  isXRayMode
                    ? 'bg-[#0ea5e9] text-white shadow-lg ring-1 ring-[#0ea5e9]'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                }`}
                title="Toggle semi-transparent cutaway to reveal internal MEP anatomy"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Anatomy X-Ray</span>
              </button>

              {/* Auto Tour Play / Pause */}
              <button
                type="button"
                onClick={() => setIsPlayingAuto(!isPlayingAuto)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 font-bold flex items-center gap-1.5 transition-all cursor-pointer text-xs"
                title={isPlayingAuto ? 'Pause documentary tour' : 'Auto tour'}
              >
                {isPlayingAuto ? <Pause className="w-3.5 h-3.5 text-[#d9bf8c]" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden md:inline">{isPlayingAuto ? 'Pause' : 'Tour'}</span>
              </button>

              {/* Audio Atmosphere Toggle */}
              <button
                type="button"
                onClick={toggleAudio}
                className={`p-1.5 rounded-xl border transition-all cursor-pointer text-xs ${
                  isAudioEnabled
                    ? 'bg-[#b58b4a]/20 border-[#b58b4a] text-[#d9bf8c]'
                    : 'bg-white/10 border-white/10 text-slate-400 hover:text-slate-200'
                }`}
                title={isAudioEnabled ? 'Mute audio' : 'Enable ambient sound'}
              >
                {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </header>

        {/* ---------------------------------------------------- */}
        {/* COMPACT FLOATING ENGINEERING SPECS BADGE (BOTTOM-LEFT) */}
        {/* ---------------------------------------------------- */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto pointer-events-none flex justify-between items-end">
          {showTechnicalSpecs ? (
            <div className="pointer-events-auto max-w-sm sm:max-w-md bg-slate-950/75 backdrop-blur-xl border border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xl text-white space-y-3 transition-all">
              
              {/* Category & Minimize Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#b58b4a] text-[#17362f] flex items-center justify-center font-mono font-black text-xs">
                    {activeMilestone.number}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#d9bf8c]">
                    {activeMilestone.category}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTechnicalSpecs(false)}
                  className="text-slate-400 hover:text-slate-200 p-1 text-[11px] cursor-pointer"
                  title="Minimize info card for full 3D view"
                >
                  Hide
                </button>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  {activeMilestone.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1 leading-relaxed">
                  {activeMilestone.subtitle}
                </p>
              </div>

              {/* 2-Column Technical Specs */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
                {activeMilestone.technicalSpecs.map((spec, sIdx) => (
                  <div key={sIdx} className="bg-white/5 rounded-lg p-2 border border-white/5">
                    <div className="text-[9px] uppercase font-bold text-slate-400">
                      {spec.label}
                    </div>
                    <div className="text-xs font-mono font-black text-white mt-0.5">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Inspector Quote */}
              <div className="flex items-start gap-2 pt-1 text-[10px] text-slate-300 italic">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d9bf8c] shrink-0 mt-0.5" />
                <p>&ldquo;{activeMilestone.inspectorQuote}&rdquo;</p>
              </div>

              {/* Turnkey Inquire Button when nearing completion */}
              {activeStageIndex >= 6 && onExploreProperties && (
                <button
                  type="button"
                  onClick={onExploreProperties}
                  className="w-full py-2.5 rounded-xl bg-[#b58b4a] hover:bg-[#c49a55] text-[#17362f] font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
                >
                  <span>Inquire About Turnkey Villa Handover</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowTechnicalSpecs(true)}
              className="pointer-events-auto bg-slate-900/80 backdrop-blur-md border border-white/15 text-white px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xl hover:bg-slate-800 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#d9bf8c]" />
              <span>Show Specs ({activeMilestone.shortLabel})</span>
            </button>
          )}

          {/* Right helper text */}
          <div className="hidden lg:block text-right pointer-events-none">
            {isInspectMode ? (
              <div className="bg-slate-900/70 backdrop-blur-md text-white rounded-xl px-3.5 py-2 text-xs flex items-center gap-2 border border-white/10 shadow-lg">
                <Rotate3d className="w-3.5 h-3.5 text-[#d9bf8c] animate-spin" />
                <span>Click &amp; drag mouse or touch screen to rotate 360&deg;</span>
              </div>
            ) : (
              <div className="bg-slate-900/70 backdrop-blur-md text-slate-300 rounded-xl px-3.5 py-2 text-xs flex items-center gap-2 border border-white/10 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Scroll down to build &bull; Scroll up to reverse engineering</span>
              </div>
            )}
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* MINIMAL FLOATING PROGRESS INDICATOR (EXACT USER SPEC)*/}
        {/* ---------------------------------------------------- */}
        <footer className="relative z-10 w-full max-w-4xl mx-auto px-4 pb-5 pointer-events-auto">
          <div className="bg-slate-950/80 backdrop-blur-2xl border border-white/15 rounded-2xl p-2.5 sm:p-3 shadow-2xl space-y-2">
            
            {/* Micro Progress Line */}
            <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden relative">
              <div
                className="bg-gradient-to-r from-[#b58b4a] via-[#d9bf8c] to-[#0ea5e9] h-full transition-all duration-100 rounded-full"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>

            {/* The 8 Minimal Milestone Buttons requested:
                01 LAND | 02 FOUNDATION | 03 STRUCTURE | 04 WALLS |
                05 SERVICES | 06 FACADE | 07 INTERIOR | 08 COMPLETE */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
              {CONSTRUCTION_MILESTONES.map((milestone, idx) => {
                const isActive = activeStageIndex === idx;
                const isPassed = scrollProgress >= milestone.targetProgress;

                return (
                  <button
                    key={milestone.id}
                    type="button"
                    onClick={() => handleMilestoneSelect(idx)}
                    className={`py-1 px-1.5 rounded-lg text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 border ${
                      isActive
                        ? 'bg-[#b58b4a] text-[#17362f] border-[#b58b4a] shadow-md font-black scale-105'
                        : isPassed
                        ? 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                        : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-slate-200'
                    }`}
                    title={`${milestone.number} ${milestone.shortLabel} — ${milestone.title}`}
                  >
                    <span className="text-[9px] font-mono leading-none">
                      {milestone.number}
                    </span>
                    <span className="text-[9px] font-bold tracking-tight leading-none truncate max-w-full">
                      {milestone.shortLabel}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sub-status label */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b58b4a]" />
                <span className="font-bold text-slate-200">{activeMilestone.number} {activeMilestone.title}</span>
              </span>
              <span className="font-mono text-slate-300">
                {Math.round(scrollProgress * 100)}%
              </span>
            </div>

          </div>
        </footer>

      </div>
    </section>
  );
};
