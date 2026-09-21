import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  GraduationCap, 
  Train, 
  ArrowRight, 
  Building2, 
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { COMMUNITY_GUIDES, CommunityGuide } from '../data/realEstateData';

interface AreasPageProps {
  initialArea?: string;
  onNavigate: (path: string) => void;
}

export const AreasPage: React.FC<AreasPageProps> = ({
  initialArea = 'downtown-dubai',
  onNavigate
}) => {
  const [selectedAreaId, setSelectedAreaId] = useState(initialArea);

  const currentArea = COMMUNITY_GUIDES.find((a) => a.id === selectedAreaId) || COMMUNITY_GUIDES[0];

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-slate-800 pb-20">
      {/* Top Banner */}
      <div className="bg-[#17362f] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-[#b58b4a]/30">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#b58b4a]/40 text-[#d9bf8c] text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-[#b58b4a]" />
            <span>UAE District &amp; Neighborhood Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#fbfaf7] tracking-tight">
            Explore Prime Communities in the UAE
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Detailed lifestyle, investment, schooling, and transport connectivity breakdowns for Dubai&apos;s most prestigious residential enclaves.
          </p>

          {/* Area Selector Tabs */}
          <div className="flex flex-wrap gap-2 pt-2">
            {COMMUNITY_GUIDES.map((area) => (
              <button
                key={area.id}
                onClick={() => setSelectedAreaId(area.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedAreaId === area.id ? 'bg-[#b58b4a] text-[#142621]' : 'bg-white/10 text-white'
                }`}
              >
                {area.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Community Profile Display */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl grid grid-cols-1 lg:grid-cols-12">
          {/* Image & Quick Stats (Cols 1-5) */}
          <div className="lg:col-span-5 relative min-h-[340px] lg:min-h-full">
            <img
              src={currentArea.image}
              alt={currentArea.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 sm:p-8 flex flex-col justify-end text-white space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#d9bf8c]">
                {currentArea.tag}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{currentArea.name}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-[#b58b4a]" />
                <span>{currentArea.emirate} · Freehold Area</span>
              </div>
            </div>
          </div>

          {/* Content & Details (Cols 6-12) */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Avg Price / Sq.Ft</div>
                  <div className="text-base font-extrabold text-[#17362f]">AED {currentArea.avgPriceSqft}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Rental Yield</div>
                  <div className="text-base font-extrabold text-[#b58b4a]">{currentArea.rentalYield}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Metro Connected</div>
                  <div className="text-base font-extrabold text-slate-800">
                    {currentArea.metroNearby ? 'Direct Access' : 'Private Transit'}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-1">Community Overview</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentArea.description}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-2">Key Community Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentArea.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b58b4a]" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-2">Top Nearby Schools &amp; Academies</h3>
                <div className="flex flex-wrap gap-1.5">
                  {currentArea.schools.map((s, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-xl flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#b58b4a]" />
                      <span>{s}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('/buy')}
                className="px-6 py-3 rounded-xl bg-[#17362f] hover:bg-[#21483d] text-[#d9bf8c] text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow"
              >
                <span>View Properties for Sale in {currentArea.name}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#b58b4a]" />
              </button>
              <button
                onClick={() => onNavigate('/rent')}
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                View Rentals
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
