import React, { useState, useMemo } from 'react';
import { 
  Key, 
  Search, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  ArrowRight, 
  Sparkles, 
  Radio, 
  CreditCard, 
  ShieldCheck, 
  SlidersHorizontal,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { ALL_PROPERTIES } from '../data/realEstateData';
import { useSiteData } from '../context/SiteDataContext';
import { Property } from '../types/jsg';

interface RentPageProps {
  initialCategory?: string;
  onNavigate: (path: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const RentPage: React.FC<RentPageProps> = ({
  initialCategory = 'all',
  onNavigate,
  onSelectProperty
}) => {
  const { properties: liveProperties } = useSiteData();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');
  const [paymentFrequency, setPaymentFrequency] = useState<'yearly' | 'monthly'>('yearly');
  const [selectedBeds, setSelectedBeds] = useState<string>('any');

  const propertySource = liveProperties && liveProperties.length > 0 ? liveProperties : ALL_PROPERTIES;

  // Filter properties in rent mode
  const rentalProperties = useMemo(() => {
    return propertySource.filter((p) => {
      if (p.mode !== 'rent') return false;

      if (selectedCategory !== 'all') {
        if (selectedCategory === 'apartments' && p.category !== 'apartment') return false;
        if (selectedCategory === 'studios' && p.category !== 'studio') return false;
        if (selectedCategory === 'villas' && p.category !== 'villa') return false;
        if (selectedCategory === 'townhouses' && p.category !== 'townhouse') return false;
        if (selectedCategory === 'commercial' && p.category !== 'commercial') return false;
      }

      if (selectedArea !== 'All' && !p.location.toLowerCase().includes(selectedArea.toLowerCase())) {
        return false;
      }

      if (selectedBeds !== 'any') {
        const reqBeds = parseInt(selectedBeds, 10);
        if (p.beds !== reqBeds) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [selectedCategory, selectedArea, selectedBeds, searchQuery]);

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-slate-800 pb-20">
      {/* Top Banner */}
      <div className="bg-[#17362f] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#b58b4a]/30">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#b58b4a]/40 text-[#d9bf8c] text-xs font-bold uppercase tracking-wider">
            <Key className="w-3.5 h-3.5 text-[#b58b4a]" />
            <span>Dubai Long-Term &amp; Luxury Executive Rentals</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#fbfaf7] tracking-tight">
                Verified Dubai Properties for Rent
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl mt-2">
                Discover luxury apartments, executive studios, private canal residences, and gated community villas. Ejari compliant with optional monthly card payment options.
              </p>
            </div>

            {/* Pay Monthly Flex Switch */}
            <div className="bg-black/40 border border-[#b58b4a]/40 p-2 rounded-2xl flex items-center gap-2 self-start">
              <span className="text-xs text-[#d9bf8c] font-bold pl-2">Payment:</span>
              <button
                type="button"
                onClick={() => setPaymentFrequency('yearly')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  paymentFrequency === 'yearly' ? 'bg-[#b58b4a] text-[#142621]' : 'text-slate-300 hover:text-white'
                }`}
              >
                1-4 Cheques (Yearly)
              </button>
              <button
                type="button"
                onClick={() => setPaymentFrequency('monthly')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  paymentFrequency === 'monthly' ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Pay Monthly Flex
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 pt-4">
            {[
              { id: 'all', label: 'All Rentals' },
              { id: 'apartments', label: 'Apartments' },
              { id: 'studios', label: 'Executive Studios' },
              { id: 'villas', label: 'Villas' },
              { id: 'townhouses', label: 'Townhouses' },
              { id: 'commercial', label: 'Commercial Spaces' },
              { id: 'short-term', label: 'Short-Term / Holiday' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#b58b4a] text-[#142621] shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Filter Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search apartment, area, tower..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 outline-none"
            />
          </div>

          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <MapPin className="w-4 h-4 text-[#b58b4a] mr-2 shrink-0" />
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-800 outline-none cursor-pointer"
            >
              <option value="All">All Locations</option>
              <option value="Business Bay">Business Bay</option>
              <option value="Downtown">Downtown Dubai</option>
              <option value="Dubai Marina">Dubai Marina</option>
              <option value="District One">District One (MBR City)</option>
            </select>
          </div>

          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <Bed className="w-4 h-4 text-[#b58b4a] mr-2 shrink-0" />
            <select
              value={selectedBeds}
              onChange={(e) => setSelectedBeds(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-800 outline-none cursor-pointer"
            >
              <option value="any">Any Bedrooms</option>
              <option value="0">Studio</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="5">5 Bedrooms</option>
            </select>
          </div>

          <button
            onClick={() => onNavigate('/rent/rent-vs-buy')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#17362f] hover:bg-[#21483d] text-[#d9bf8c] font-extrabold text-xs transition-colors cursor-pointer"
          >
            <span>Rent vs Buy Calculator</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#b58b4a]" />
          </button>
        </div>
      </div>

      {/* Monthly Renting Perk Highlight Strip */}
      {paymentFrequency === 'monthly' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-900">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>Pay Rent Monthly Enabled:</strong> Break down hefty upfront rental cheques into automated monthly card payments with 0% extra fees.
              </span>
            </div>
            <button
              onClick={() => onNavigate('/rent/monthly')}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shrink-0"
            >
              Learn More
            </button>
          </div>
        </div>
      )}

      {/* Property Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rentalProperties.map((property) => {
            const displayPrice = paymentFrequency === 'monthly' 
              ? Math.round(property.price / 12) 
              : property.price;
            const suffix = paymentFrequency === 'monthly' ? '/ month' : '/ year';

            return (
              <div
                key={property.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#17362f]/90 backdrop-blur-md text-[#d9bf8c] text-[11px] font-bold px-3 py-1 rounded-full border border-[#b58b4a]/40 shadow">
                    {property.tag}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-[#17362f] text-sm font-extrabold px-3 py-1 rounded-xl shadow">
                    AED {displayPrice.toLocaleString()} <span className="text-xs text-slate-500 font-normal">{suffix}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#b58b4a]" />
                      <span>{property.location}</span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#17362f] transition-colors">
                      {property.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                      {property.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Bed className="w-3.5 h-3.5 text-[#b58b4a]" />
                      <span>{property.beds === 0 ? 'Studio' : `${property.beds} Beds`}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bath className="w-3.5 h-3.5 text-[#b58b4a]" />
                      <span>{property.baths} Baths</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Maximize className="w-3.5 h-3.5 text-[#b58b4a]" />
                      <span>{property.area.toLocaleString()} sqft</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onSelectProperty(property)}
                      className="flex-1 py-2.5 rounded-xl bg-[#17362f] hover:bg-[#21483d] text-[#fbfaf7] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#b58b4a]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
