import React from 'react';

interface DeveloperBrandLogoProps {
  id: string;
  name: string;
  logoUrl: string;
  className?: string;
}

export const DeveloperBrandLogo: React.FC<DeveloperBrandLogoProps> = ({
  id,
  name,
  logoUrl,
  className = "max-h-full max-w-full"
}) => {
  // Ultra-crisp vector SVG marks representing the authentic developer brandmarks
  if (id === 'emaar') {
    return (
      <div className="flex items-center gap-2 text-white">
        <svg viewBox="0 0 100 28" className="h-6 w-auto fill-current" aria-label="Emaar">
          {/* Emaar Iconic Calligraphic Arch / Sun / Typography */}
          <path d="M6 14 C6 7.5, 12 3, 19 3 C26 3, 31 8, 31 14 C31 20.5, 25 25, 19 25 C12 25, 6 20, 6 14 Z M11 14 C11 17.5, 14 21, 19 21 C24 21, 26 17.5, 26 14 C26 10.5, 23 7, 19 7 C14 7, 11 10.5, 11 14 Z" fill="#d9bf8c"/>
          <text x="36" y="19" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="900" fontSize="15" letterSpacing="2.5" fill="#fbfaf7">EMAAR</text>
        </svg>
      </div>
    );
  }

  if (id === 'damac') {
    return (
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 110 28" className="h-6 w-auto" aria-label="DAMAC">
          {/* DAMAC stylized wave curves */}
          <path d="M4 19 C8 10, 14 10, 18 19" stroke="#b58b4a" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M10 14 C14 6, 20 6, 24 14" stroke="#d9bf8c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <text x="28" y="20" fontFamily="Playfair Display, Georgia, serif" fontWeight="900" fontSize="16" letterSpacing="3.5" fill="#fbfaf7">DAMAC</text>
        </svg>
      </div>
    );
  }

  if (id === 'danube') {
    return (
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 120 28" className="h-6 w-auto" aria-label="Danube Properties">
          <rect x="2" y="5" width="22" height="18" rx="4" fill="#b91c1c" />
          <text x="7" y="19" fontFamily="sans-serif" fontWeight="900" fontSize="14" fill="#ffffff">D</text>
          <text x="30" y="16" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="13" letterSpacing="1" fill="#fbfaf7">DANUBE</text>
          <text x="31" y="24" fontFamily="sans-serif" fontWeight="700" fontSize="7" letterSpacing="2.5" fill="#d9bf8c">PROPERTIES</text>
        </svg>
      </div>
    );
  }

  if (id === 'sobha') {
    return (
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 110 28" className="h-6 w-auto" aria-label="Sobha Realty">
          <circle cx="12" cy="14" r="9" stroke="#c5a059" strokeWidth="2" fill="none" />
          <path d="M8 17 L12 10 L16 17" stroke="#d9bf8c" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <text x="26" y="16" fontFamily="Playfair Display, serif" fontWeight="800" fontSize="14" letterSpacing="2.5" fill="#fbfaf7">SOBHA</text>
          <text x="27" y="23" fontFamily="sans-serif" fontWeight="600" fontSize="6.5" letterSpacing="3" fill="#b58b4a">REALTY</text>
        </svg>
      </div>
    );
  }

  if (id === 'aldar') {
    return (
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 110 28" className="h-6 w-auto" aria-label="Aldar">
          {/* Aldar Iconic Circular Monogram / UAE Master Developer */}
          <circle cx="12" cy="14" r="8.5" fill="#0d221c" stroke="#d9bf8c" strokeWidth="2.5" />
          <circle cx="12" cy="14" r="3.5" fill="#d9bf8c" />
          <text x="26" y="20" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="900" fontSize="16" letterSpacing="3" fill="#fbfaf7">ALDAR</text>
        </svg>
      </div>
    );
  }

  if (id === 'azizi') {
    return (
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 110 28" className="h-6 w-auto" aria-label="Azizi Developments">
          <rect x="3" y="6" width="18" height="16" rx="2" fill="#b58b4a" />
          <path d="M7 10 L17 10 L8 18 L17 18" stroke="#091814" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <text x="26" y="17" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="900" fontSize="15" letterSpacing="2" fill="#fbfaf7">AZIZI</text>
        </svg>
      </div>
    );
  }

  // Fallback to image tag with text fallback
  return (
    <img
      src={logoUrl}
      alt={`${name} official logo`}
      className={className}
      loading="lazy"
      onError={(e) => {
        const target = e.currentTarget;
        target.style.display = 'none';
        if (target.parentElement) {
          target.parentElement.innerHTML = `<span class="font-serif-display font-black text-xs text-[#d9bf8c] tracking-widest uppercase">${name}</span>`;
        }
      }}
    />
  );
};
