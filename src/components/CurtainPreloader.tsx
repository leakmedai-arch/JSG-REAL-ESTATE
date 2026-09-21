import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { JSGLogo } from './JSGLogo';

interface CurtainPreloaderProps {
  onComplete?: () => void;
}

export const CurtainPreloader: React.FC<CurtainPreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Check if user already saw the intro during this browser session
    const hasSeen = sessionStorage.getItem('jsg_intro_shown');
    if (hasSeen) {
      setIsDone(true);
      if (onComplete) onComplete();
      return;
    }

    // Smooth luxury progress counter
    const startTime = Date.now();
    const duration = 1200; // 1.2s smooth reveal matching Dev.UN timing

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const ratio = Math.min(elapsed / duration, 1);
      // Custom ease out quad
      const eased = Math.round(ratio * 100);
      setProgress(eased);

      if (ratio >= 1) {
        clearInterval(interval);
        setTimeout(() => {
          setIsDone(true);
          sessionStorage.setItem('jsg_intro_shown', 'true');
          if (onComplete) onComplete();
        }, 150);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (isDone) return null;

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="curtain-wipe"
          initial={{ y: 0 }}
          exit={{ 
            y: '-100%',
            transition: { 
              duration: 0.85, 
              ease: [0.76, 0, 0.24, 1] // Luxury high-end curtain ease
            }
          }}
          className="fixed inset-0 z-[99999] bg-[#0c261e] text-[#fdfbf7] flex flex-col items-center justify-between p-8 sm:p-12 select-none pointer-events-auto"
        >
          {/* Subtle Top Ambient Details */}
          <div className="w-full flex items-center justify-between text-[11px] tracking-[0.25em] uppercase text-[#c5a059]/70 font-mono">
            <span>Dubai · UAE</span>
            <span>JSG Real Estate</span>
          </div>

          {/* Central Logo & Architectural Reveal */}
          <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="p-4 rounded-3xl bg-white/5 border border-[#c5a059]/30 shadow-2xl backdrop-blur-xl"
            >
              <JSGLogo size="lg" variant="dark" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1"
            >
              <p className="font-serif-display text-xl sm:text-2xl font-bold text-[#fbfaf7] tracking-wider">
                JANAT SAMA GENERAL
              </p>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#d9bf8c] font-sans">
                Curated Luxury Living
              </p>
            </motion.div>

            {/* Smooth Progress Line & Percentage Counter */}
            <div className="w-48 sm:w-64 space-y-2 pt-2">
              <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden relative">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#b58b4a] via-[#e2c896] to-[#b58b4a]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-[#c5a059]">
                <span>LOADING EXPERIENCE</span>
                <span>{progress}%</span>
              </div>
            </div>
          </div>

          {/* Bottom Skip Option */}
          <div className="w-full flex justify-center">
            <button
              onClick={() => {
                setIsDone(true);
                sessionStorage.setItem('jsg_intro_shown', 'true');
                if (onComplete) onComplete();
              }}
              className="text-[10px] font-medium tracking-widest uppercase text-stone-400 hover:text-[#d9bf8c] transition-colors py-1 px-3 rounded-full hover:bg-white/5 cursor-pointer"
            >
              Skip Intro
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
