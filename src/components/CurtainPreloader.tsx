import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { JSGLogo } from './JSGLogo';

interface CurtainPreloaderProps {
  onComplete?: () => void;
}

export const CurtainPreloader: React.FC<CurtainPreloaderProps> = ({ onComplete }) => {
  const [isDone, setIsDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [showSkip, setShowSkip] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if user already saw the intro during this browser session
    const hasSeen = sessionStorage.getItem('alvi_intro_shown');
    if (hasSeen) {
      setIsDone(true);
      if (onComplete) onComplete();
      return;
    }

    // Attempt video playback with audio
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback if browser blocks autoplay with audio
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }

    // 5-second countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Also auto-complete after 5 seconds if desired or let user skip
    const timeout = setTimeout(() => {
      setShowSkip(true);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsDone(true);
    sessionStorage.setItem('alvi_intro_shown', 'true');
    if (onComplete) onComplete();
  };

  if (isDone) return null;

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="curtain-wipe"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[99999] bg-black text-[#fdfbf7] flex flex-col items-center justify-between p-8 sm:p-12 select-none pointer-events-auto overflow-hidden"
        >
          {/* Full Screen High-Res Video Background with Audio */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            loop
            className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-95"
            src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-dubai-skyscrapers-at-sunset-41221-large.mp4"
          />

          {/* Dark Luxury Gradient Overlay for Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/75 z-10 pointer-events-none" />

          {/* Top Header details */}
          <div className="relative z-20 w-full flex items-center justify-between text-[11px] tracking-[0.25em] uppercase text-[#c5a059] font-mono">
            <span>Dubai · UAE</span>
            <span>ALVI LUXURY LIVING</span>
          </div>

          {/* Central Logo & Architectural Reveal */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center space-y-6 max-w-lg">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="p-5 rounded-3xl bg-black/40 border border-[#c5a059]/40 shadow-2xl backdrop-blur-xl"
            >
              <JSGLogo size="lg" variant="dark" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2"
            >
              <p className="font-serif-display text-3xl sm:text-4xl font-black text-[#fbfaf7] tracking-widest drop-shadow-md">
                ALVI
              </p>
              <p className="text-xs sm:text-sm tracking-[0.4em] uppercase text-[#d9bf8c] font-sans font-semibold">
                Curated Luxury Living
              </p>
            </motion.div>
          </div>

          {/* Bottom Right: 5-Second Countdown & Skip Button */}
          <div className="relative z-20 w-full flex justify-end items-center">
            <div className="flex items-center gap-4 bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 shadow-2xl">
              {!showSkip ? (
                <div className="flex items-center gap-2 text-xs font-mono text-[#d9bf8c]">
                  <span className="w-2 h-2 rounded-full bg-[#b58b4a] animate-ping" />
                  <span>Loading Cinematic Experience ({timeLeft}s)</span>
                </div>
              ) : null}

              <button
                onClick={handleSkip}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-black font-bold text-xs tracking-wider uppercase shadow-lg hover:opacity-90 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Skip Intro</span>
                <span className="text-sm">→</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
