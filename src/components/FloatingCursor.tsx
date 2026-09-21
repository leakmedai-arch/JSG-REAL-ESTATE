import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export const FloatingCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // High-performance smooth spring physics for luxury inertia
  const springConfig = { damping: 26, stiffness: 380, mass: 0.35 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if touch device - disable custom cursor on touch devices to ensure natural UX
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if hovering clickable buttons, cards, links, or inputs
      const interactive = target.closest('button, a, input, select, textarea, [role="button"], [data-cursor], .group');
      setIsHoveringInteractive(!!interactive);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed top-0 left-0 z-[99990] w-0 h-0 overflow-visible">
      {/* Outer Smooth Trailing Luxury Ring */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHoveringInteractive ? 1.5 : 1,
          borderColor: isHoveringInteractive ? '#b58b4a' : '#c5a059',
          backgroundColor: isHoveringInteractive ? 'rgba(181, 139, 74, 0.16)' : 'rgba(197, 160, 89, 0.08)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="w-7 h-7 rounded-full border border-[#c5a059]/75 shadow-[0_0_12px_rgba(181,139,74,0.3)] flex items-center justify-center will-change-transform"
      >
        {/* Inner Golden Precision Dot */}
        <motion.div
          animate={{
            scale: isHoveringInteractive ? 0.7 : 1,
            backgroundColor: isHoveringInteractive ? '#8a631c' : '#b58b4a',
          }}
          className="w-1.5 h-1.5 rounded-full"
        />
      </motion.div>
    </div>
  );
};
