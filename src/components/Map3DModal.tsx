import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Compass, 
  Layers, 
  Navigation, 
  ExternalLink, 
  Building2, 
  Train, 
  Car, 
  Clock, 
  ShieldCheck,
  RotateCw
} from 'lucide-react';

interface Map3DModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Map3DModal: React.FC<Map3DModalProps> = ({ isOpen, onClose }) => {
  const [mapViewMode, setMapViewMode] = useState<'3d' | 'satellite' | 'street'>('3d');
  const [tiltAngle, setTiltAngle] = useState(45);

  if (!isOpen) return null;

  const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=Zainal+Mohebi+Plaza+Karama+Dubai';
  const directionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=Zainal+Mohebi+Plaza+Karama+Dubai';
  // Standard Google Maps Embed query for Zainal Mohebi Plaza Karama Dubai
  const embedUrl = 'https://maps.google.com/maps?q=Zainal%20Mohebi%20Plaza,%20Al%20Karama,%20Dubai&t=k&z=17&ie=UTF8&iwloc=&output=embed';

  return (
    <div 
      id="3d-map-modal"
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl h-[88vh] max-h-[760px] bg-[#17211f] border border-[#b58b4a]/40 rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.85)] flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 bg-[#17362f] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#b58b4a]/20 border border-[#b58b4a]/40 flex items-center justify-center text-[#d9bf8c]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#d9bf8c]">
                  3D Architectural Location
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Prime Dubai Hub
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Zainal Mohebi Plaza &bull; Al Karama, Dubai, UAE
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 border border-white/10 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#d9bf8c]" />
              <span>Open in Google Maps 3D</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Close Map"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Interactive Map Viewport */}
        <div className="relative flex-1 bg-slate-950 overflow-hidden">
          {/* Real Map Viewport Iframe */}
          <iframe
            title="3D Map of Zainal Mohebi Plaza Karama Dubai"
            src={embedUrl}
            className="w-full h-full border-0 filter contrast-105"
            loading="lazy"
            allowFullScreen
          />

          {/* Floating 3D HUD Badge */}
          <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-xl border border-white/15 rounded-2xl p-3 sm:p-4 text-xs max-w-xs shadow-2xl space-y-2">
            <div className="flex items-center gap-2 text-[#d9bf8c] font-black uppercase text-[10px] tracking-wider">
              <Compass className="w-3.5 h-3.5 text-[#b58b4a]" />
              <span>Headquarters Coordinates</span>
            </div>
            <p className="font-mono text-xs text-white">
              25°14'49.6"N 55°18'19.4"E
            </p>
            <p className="text-[11px] text-slate-300">
              Sheikh Khalifa Bin Zayed St, Opp. Centrepoint, Al Karama, Dubai, United Arab Emirates
            </p>

            <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[10px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <Train className="w-3.5 h-3.5 text-emerald-400" />
                <span>ADCB Metro (2 Min)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>DXB Airport (10 Min)</span>
              </div>
            </div>
          </div>

          {/* Floating Bottom Quick Action */}
          <div className="absolute bottom-4 inset-x-4 sm:inset-x-auto sm:right-4 z-10 flex flex-wrap gap-2">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#b58b4a] hover:bg-[#c49a55] text-[#17362f] font-black text-xs shadow-xl flex items-center justify-center gap-2 transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Driving Directions</span>
            </a>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden flex-1 px-4 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/15"
            >
              <ExternalLink className="w-4 h-4 text-[#d9bf8c]" />
              <span>Google Maps</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
