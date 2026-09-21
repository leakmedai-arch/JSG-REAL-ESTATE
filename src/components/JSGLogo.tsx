import React, { useState } from 'react';

interface JSGLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  theme?: 'dark' | 'light' | 'gold';
  variant?: 'transparent' | 'solid';
  allowUpload?: boolean;
}

export const JSGLogo: React.FC<JSGLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  theme = 'dark',
}) => {
  const [imageError, setImageError] = useState(false);

  // Permanently fixed to the user's uploaded official high-res logo
  const officialLogoSrc = '/assets/jsg-logo.png';

  // Compact container sizes so the header remains very slim and elegant
  const containerSizes = {
    xs: 'h-7 w-7',
    sm: 'h-8 w-8 sm:h-8.5 sm:w-8.5',
    md: 'h-10 w-10 sm:h-11 sm:w-11',
    lg: 'h-14 w-14 sm:h-16 sm:w-16',
    xl: 'h-20 w-20 sm:h-24 sm:w-24',
  };

  const textColors = {
    dark: {
      primary: 'text-[#fbfaf7] group-hover:text-[#d9bf8c]',
      secondary: 'text-[#d9bf8c]',
    },
    light: {
      primary: 'text-black group-hover:text-black',
      secondary: 'text-[#b58b4a]',
    },
    gold: {
      primary: 'text-[#d9bf8c]',
      secondary: 'text-[#f3e3b6]',
    },
  };

  const currentTheme = textColors[theme] || textColors.dark;

  return (
    <div className={`relative flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Logo Image / Emblem Container - Sleek & Compact with Photo Zoomed */}
      <div className={`relative ${containerSizes[size]} overflow-hidden rounded-xl flex items-center justify-center shrink-0`}>
        {!imageError ? (
          <img
            id="header-brand-logo"
            src={officialLogoSrc}
            alt="JSG Real Estate Dubai"
            className="w-full h-full object-contain scale-[1.55] drop-shadow-[0_2px_14px_rgba(217,191,140,0.55)] transition-transform duration-300 group-hover/logo-img:scale-[1.65]"
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          /* Architectural Vector Fallback */
          <div className="relative flex items-center justify-center">
            <svg
              className="w-full h-full aspect-square"
              viewBox="0 0 1000 1000"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="goldGradientMain" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff2c2" />
                  <stop offset="20%" stopColor="#e5c158" />
                  <stop offset="50%" stopColor="#b8860b" />
                  <stop offset="75%" stopColor="#7a5212" />
                  <stop offset="100%" stopColor="#e8c76b" />
                </linearGradient>
                <filter id="goldShine" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.45" />
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#b8860b" floodOpacity="0.35" />
                </filter>
              </defs>
              <g fill="url(#goldGradientMain)" filter="url(#goldShine)" fillRule="evenodd">
                <path d="M 390,246 L 164,414 L 244,414 L 244,744 L 390,744 Z M 294,440 L 334,440 L 334,688 L 294,688 Z" />
                <path d="M 512,152 L 588,212 L 588,414 L 484,514 L 484,688 L 526,688 L 526,600 L 588,600 L 588,744 L 426,744 L 426,450 L 526,350 L 526,270 L 512,216 L 474,270 L 474,350 L 426,350 L 426,212 Z" />
                <path d="M 634,246 L 860,414 L 780,414 L 780,744 L 634,744 Z" />
                <path d="M 684,350 L 730,384 L 730,460 L 684,460 Z" />
                <path d="M 684,560 L 730,560 L 730,688 L 684,688 Z" />
              </g>
              <text
                x="512"
                y="820"
                textAnchor="middle"
                fill="url(#goldGradientMain)"
                fontFamily="Cinzel, 'Times New Roman', Georgia, serif"
                fontSize="68"
                fontWeight="800"
                letterSpacing="0.22em"
                filter="url(#goldShine)"
              >
                REAL ESTATE
              </text>
            </svg>
          </div>
        )}
      </div>

      {/* Accompanying Typographic Title - Sleek & Elegant */}
      {showText && (
        <div className="flex flex-col tracking-tight transition-colors min-w-0">
          <span 
            className={`font-black tracking-wider ${size === 'sm' ? 'text-[11px] xs:text-[12px] sm:text-[13px]' : 'text-xs sm:text-base'} leading-tight ${currentTheme.primary} whitespace-nowrap`}
            style={theme === 'light' ? { color: '#000000' } : undefined}
          >
            JSG REAL ESTATE
          </span>
          <span className={`hidden sm:block ${size === 'sm' ? 'text-[7.5px] sm:text-[8px] tracking-[0.16em]' : 'text-[8px] sm:text-[9px] tracking-[0.20em]'} uppercase font-bold ${currentTheme.secondary} whitespace-nowrap`}>
            PROPERTY • LIFESTYLE • TRUST
          </span>
        </div>
      )}
    </div>
  );
};


