import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  ShieldCheck, 
  Calendar, 
  Phone, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  Download,
  Share2,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Layers,
  Eye
} from 'lucide-react';
import { Property } from '../types/jsg';
import { useSiteData } from '../context/SiteDataContext';
import { ALL_PROPERTIES } from '../data/realEstateData';

interface PropertyModalProps {
  property: Property | null;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

const ANGLE_LABELS = [
  'Main Exterior & Waterfront Facade',
  'Panoramic Living Salon & Terrace',
  'Master Bedroom Suite & Skyline View',
  'Designer Kitchen & Dining Island',
  'Private Pool, Beach & Gardens',
  'Marble Spa Bathroom',
  'Private Balcony & Sunset Vista',
  'Interior Architectural Details'
];

export const PropertyModal: React.FC<PropertyModalProps> = ({ property, onClose, onNavigate }) => {
  if (!property) return null;

  const { getPropertyImages } = useSiteData();
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const propertyImages = getPropertyImages(property);
  const currentPhoto = propertyImages[activeAngleIndex] || property.image;

  const handleNextAngle = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveAngleIndex(prev => (prev < propertyImages.length - 1 ? prev + 1 : 0));
  };

  const handlePrevAngle = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveAngleIndex(prev => (prev > 0 ? prev - 1 : propertyImages.length - 1));
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userPhone) return;
    try {
      // In a real flow, this would save to database
      setBookingSuccess(true);
    } catch (err) {
      console.error('Failed to submit appointment:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div 
        className="bg-white text-slate-900 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Floating Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors cursor-pointer border border-white/20 shadow"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Photo Carousel & Angle Viewer */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-950 overflow-hidden group select-none">
          <img
            key={currentPhoto}
            src={currentPhoto}
            alt={`${property.title} - ${ANGLE_LABELS[activeAngleIndex % ANGLE_LABELS.length]}`}
            className="w-full h-full object-cover transition-opacity duration-300"
            referrerPolicy="no-referrer"
          />

          {/* Scrim Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Angle Navigation Chevrons */}
          {propertyImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevAngle}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-[#102a22] text-white/90 hover:text-[#d9bf8c] border border-white/20 transition-all cursor-pointer shadow-lg"
                title="View previous angle"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNextAngle}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-[#102a22] text-white/90 hover:text-[#d9bf8c] border border-white/20 transition-all cursor-pointer shadow-lg"
                title="View next angle"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Badges on Hero */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 pointer-events-none">
            <span className="bg-[#17362f]/90 backdrop-blur-md text-[#d9bf8c] text-xs font-bold px-3.5 py-1.5 rounded-full border border-[#b58b4a]/40 shadow">
              {property.tag}
            </span>
            {propertyImages.length > 1 && (
              <span className="bg-black/75 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/30 shadow flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#d9bf8c]" />
                <span>Angle {activeAngleIndex + 1} of {propertyImages.length}</span>
              </span>
            )}
          </div>

          {/* Bottom Overlay: Price + Current Angle Caption */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white pointer-events-none">
            <div>
              <div className="inline-block px-2.5 py-1 rounded-lg bg-[#0e241e]/90 text-[#d9bf8c] text-[11px] font-bold border border-[#b58b4a]/30 mb-2">
                📸 {ANGLE_LABELS[activeAngleIndex % ANGLE_LABELS.length] || `Angle #${activeAngleIndex + 1}`}
              </div>
              <div className="bg-white/95 backdrop-blur-md text-[#17362f] text-xl sm:text-2xl font-black px-4 py-1.5 rounded-2xl shadow-lg inline-block">
                AED {property.price.toLocaleString()} {property.mode === 'rent' && <span className="text-xs text-slate-500 font-normal">/ year</span>}
              </div>
            </div>

            {/* Thumbnail dots/pill preview */}
            {propertyImages.length > 1 && (
              <div className="pointer-events-auto flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/20">
                {propertyImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveAngleIndex(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === activeAngleIndex 
                        ? 'w-7 bg-[#d9bf8c]' 
                        : 'w-2.5 bg-white/40 hover:bg-white/70'
                    }`}
                    title={`Switch to Angle #${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Multi-Angle Thumbnail Strip */}
        {propertyImages.length > 1 && (
          <div className="bg-stone-100 border-b border-stone-200 px-4 py-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#8a631c]" />
                <span>Multiple Angles of this Property ({propertyImages.length} Views)</span>
              </span>
              <span className="text-[10px] text-stone-500">
                Click any angle to view details
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {propertyImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveAngleIndex(idx)}
                  className={`relative shrink-0 w-20 sm:w-24 aspect-[16/10] rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${
                    idx === activeAngleIndex
                      ? 'border-[#b58b4a] shadow-md scale-102 ring-2 ring-[#b58b4a]/40'
                      : 'border-transparent opacity-75 hover:opacity-100 hover:border-stone-400'
                  }`}
                >
                  <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0.5 right-1 bg-black/80 text-white text-[9px] font-mono px-1 rounded">
                    #{idx + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <MapPin className="w-4 h-4 text-[#b58b4a]" />
                <span>{property.location}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{property.title}</h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                DLD Verified Title
              </span>
            </div>
          </div>

          {/* Specs bar */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Bedrooms</div>
              <div className="font-extrabold text-slate-900 text-sm">{property.beds > 0 ? `${property.beds} Bedrooms` : 'Studio'}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Bathrooms</div>
              <div className="font-extrabold text-slate-900 text-sm">{property.baths} Baths</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Total Area</div>
              <div className="font-extrabold text-slate-900 text-sm">{property.area.toLocaleString()} sqft</div>
            </div>
            <div className="hidden sm:block">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Category</div>
              <div className="font-extrabold text-slate-900 text-sm capitalize">{property.category}</div>
            </div>
          </div>

          {/* Narrative */}
          <div className="space-y-2">
            <h3 className="text-sm font-extrabold text-slate-900">Architectural Description</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {property.description} Finished to the most exacting international luxury standards, this residence features floor-to-ceiling double-glazed thermal windows, custom European marble flooring, automated smart home lighting integration, and private access elevators.
            </p>
          </div>

          {/* Booking & Consultation Box */}
          <div className="p-6 rounded-2xl bg-[#17362f] text-white space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-white">Arrange a Private Viewing</h4>
                <p className="text-xs text-slate-300">Chauffeur pick-up available across Dubai &amp; Abu Dhabi</p>
              </div>
              <span className="text-xs text-[#d9bf8c] font-bold">JSG VIP Protocol</span>
            </div>

            {!bookingSuccess ? (
              <form onSubmit={handleBooking} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white placeholder:text-slate-400 outline-none"
                />
                <input
                  type="tel"
                  required
                  placeholder="Your WhatsApp / Phone"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white placeholder:text-slate-400 outline-none"
                />
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-[#b58b4a] hover:bg-[#d9bf8c] text-[#142621] font-extrabold cursor-pointer transition-colors shadow"
                >
                  Schedule Tour
                </button>
              </form>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Thank you {userName}! Our lead concierge has scheduled your viewing and will contact you at {userPhone}.</span>
              </div>
            )}
          </div>

          {/* Secondary Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={() => {
                onClose();
                onNavigate('/buy/mortgage-calculator');
              }}
              className="text-xs font-bold text-[#17362f] hover:text-[#b58b4a] underline cursor-pointer"
            >
              Calculate Estimated Monthly Mortgage for this Residence
            </button>

            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/97143202030?text=Hello%20JSG%20Real%20Estate%2C%20I%20am%20interested%20in%20${encodeURIComponent(property.title)}%20(AED%20${property.price})`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Direct</span>
              </a>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
