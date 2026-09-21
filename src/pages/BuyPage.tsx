import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  ArrowRight, 
  Sparkles, 
  Radio, 
  Calculator, 
  Phone, 
  CheckCircle2, 
  Compass,
  DollarSign
} from 'lucide-react';
import { ALL_PROPERTIES } from '../data/realEstateData';
import { useSiteData } from '../context/SiteDataContext';
import { Property } from '../types/jsg';

interface BuyPageProps {
  initialCategory?: string;
  onNavigate: (path: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const BuyPage: React.FC<BuyPageProps> = ({ 
  initialCategory = 'all', 
  onNavigate,
  onSelectProperty 
}) => {
  const { properties: liveProperties } = useSiteData();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(50000000);
  const [selectedBeds, setSelectedBeds] = useState<string>('any');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const propertySource = liveProperties && liveProperties.length > 0 ? liveProperties : ALL_PROPERTIES;

  // Filter buy properties
  const filteredProperties = useMemo(() => {
    return propertySource.filter((p) => {
      if (p.mode !== 'buy') return false;

      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'apartments' && p.category !== 'apartment' && p.category !== 'penthouse') return false;
        if (selectedCategory === 'villas' && p.category !== 'villa') return false;
        if (selectedCategory === 'townhouses' && p.category !== 'townhouse') return false;
        if (selectedCategory === 'land' && p.category !== 'land') return false;
        if (selectedCategory === 'commercial' && p.category !== 'commercial') return false;
      }

      // Location filter
      if (selectedArea !== 'All' && !p.location.toLowerCase().includes(selectedArea.toLowerCase())) {
        return false;
      }

      // Bedroom filter
      if (selectedBeds !== 'any') {
        const reqBeds = parseInt(selectedBeds, 10);
        if (reqBeds === 5 && p.beds < 5) return false;
        if (reqBeds !== 5 && p.beds !== reqBeds) return false;
      }

      // Price filter
      if (p.price < minPrice || p.price > maxPrice) return false;

      // Text query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });
  }, [selectedCategory, selectedArea, selectedBeds, minPrice, maxPrice, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-slate-800 pb-20">
      {/* Top Hero Banner */}
      <div className="bg-[#17362f] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#b58b4a]/30">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#b58b4a]/40 text-[#d9bf8c] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#b58b4a]" />
            <span>Dubai Freehold Properties for Sale</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#fbfaf7] tracking-tight">
            Residential &amp; Commercial Properties for Sale
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
            Explore premier freehold apartments, luxury villas, contemporary townhouses, and trophy penthouses in Dubai&apos;s most desirable communities. 100% verified with the Dubai Land Department.
          </p>

          {/* Category Navigation Pills */}
          <div className="flex flex-wrap gap-2 pt-4">
            {[
              { id: 'all', label: 'All Properties' },
              { id: 'apartments', label: 'Apartments & Flats' },
              { id: 'villas', label: 'Villas & Mansions' },
              { id: 'townhouses', label: 'Townhouses' },
              { id: 'land', label: 'Plots & Land' },
              { id: 'commercial', label: 'Commercial' }
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
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Keyword Search */}
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search keyword or building..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 outline-none"
            />
          </div>

          {/* Area Selector */}
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <MapPin className="w-4 h-4 text-[#b58b4a] mr-2 shrink-0" />
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-800 outline-none cursor-pointer"
            >
              <option value="All">All Locations</option>
              <option value="Palm Jumeirah">Palm Jumeirah</option>
              <option value="Downtown Dubai">Downtown Dubai</option>
              <option value="Dubai Hills">Dubai Hills Estate</option>
              <option value="Dubai Marina">Dubai Marina</option>
              <option value="DIFC">DIFC</option>
              <option value="Jumeirah Bay">Jumeirah Bay Island</option>
            </select>
          </div>

          {/* Bedroom Filter */}
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <Bed className="w-4 h-4 text-[#b58b4a] mr-2 shrink-0" />
            <select
              value={selectedBeds}
              onChange={(e) => setSelectedBeds(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-800 outline-none cursor-pointer"
            >
              <option value="any">Any Bedrooms</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4 Bedrooms</option>
              <option value="5">5+ Bedrooms</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <SlidersHorizontal className="w-4 h-4 text-[#b58b4a] mr-2 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-transparent text-xs text-slate-800 outline-none cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Quick Tools CTA */}
          <button
            onClick={() => onNavigate('/buy/mortgage-calculator')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#17362f] hover:bg-[#21483d] text-[#d9bf8c] font-extrabold text-xs transition-colors cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5 text-[#b58b4a]" />
            <span>Mortgage Calc</span>
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex items-center justify-between">
        <div className="text-xs text-slate-500">
          Showing <span className="font-bold text-slate-900">{filteredProperties.length}</span> luxury properties available for sale in Dubai
        </div>
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => onNavigate('/buy/sold-prices')}
            className="text-[#17362f] hover:text-[#b58b4a] font-bold underline cursor-pointer"
          >
            View DLD Historical Sold Prices
          </button>
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col group"
              >
                {/* Image Box */}
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
                    AED {property.price.toLocaleString()}
                  </div>
                </div>

                {/* Body Details */}
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

                  {/* Specs Strip */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Bed className="w-3.5 h-3.5 text-[#b58b4a]" />
                      <span>{property.beds > 0 ? `${property.beds} Beds` : 'Plot'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bath className="w-3.5 h-3.5 text-[#b58b4a]" />
                      <span>{property.baths > 0 ? `${property.baths} Baths` : 'Commercial'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Maximize className="w-3.5 h-3.5 text-[#b58b4a]" />
                      <span>{property.area.toLocaleString()} sqft</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onSelectProperty(property)}
                      className="flex-1 py-2.5 rounded-xl bg-[#17362f] hover:bg-[#21483d] text-[#fbfaf7] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow"
                    >
                      <span>View Residence</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#b58b4a]" />
                    </button>

                    {property.videoUrl && (
                      <button
                        type="button"
                        onClick={() => onNavigate('/live-showcase')}
                        className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                        title="Watch Live Video Walkthrough"
                      >
                        <Radio className="w-4 h-4 animate-pulse" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No matching properties found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your price range, location, or bedroom criteria. Our private advisors also have off-market listings.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedArea('All');
                setSelectedBeds('any');
                setSearchQuery('');
              }}
              className="px-5 py-2 rounded-xl bg-[#17362f] text-[#d9bf8c] text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Bottom Insights Callout Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="rounded-3xl bg-gradient-to-r from-[#17362f] via-[#21483d] to-[#17362f] text-white p-8 sm:p-12 shadow-2xl border border-[#b58b4a]/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="text-xs font-bold uppercase tracking-widest text-[#d9bf8c]">
              Dubai Real Estate Fiduciary Advisory
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Unsure whether to buy or lease in Dubai?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Use our verified financial calculators to compare mortgage repayments against rising rental indexes, or talk with a licensed JSG real estate consultant.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => onNavigate('/rent/rent-vs-buy')}
              className="px-6 py-3 rounded-xl bg-[#b58b4a] hover:bg-[#d9bf8c] text-[#142621] text-xs font-extrabold shadow-lg transition-colors cursor-pointer text-center"
            >
              Rent vs Buy Analysis
            </button>
            <button
              onClick={() => onNavigate('/find-agent')}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-bold transition-colors cursor-pointer text-center"
            >
              Speak with a Broker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
