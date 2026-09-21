import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Radio, 
  Video,
  MessageCircle, 
  Phone, 
  Share2, 
  Heart, 
  Check, 
  Sparkles,
  Play,
  ArrowUpRight,
  Eye,
  Filter,
  Search,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Layers
} from 'lucide-react';
import { Property, JSGSiteData } from '../types/jsg';
import { ALL_PROPERTIES } from '../data/realEstateData';
import { useSiteData } from '../context/SiteDataContext';
import { LiveAgentCallModal } from './LiveAgentCallModal';

interface PropertyGridProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onOpenLiveShowcase?: (property: Property) => void;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  onSelectProperty,
  onOpenLiveShowcase
}) => {
  const { getPropertyImages } = useSiteData();
  const [activeFilter, setActiveFilter] = useState<'all' | 'buy' | 'rent' | 'new'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [savedFavorites, setSavedFavorites] = useState<number[]>([]);
  const [activeLiveCallProperty, setActiveLiveCallProperty] = useState<Property | null>(null);
  const [cardAngleIndices, setCardAngleIndices] = useState<Record<number, number>>({});

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredProperties = properties.filter((p) => {
    if (activeFilter !== 'all' && p.mode !== activeFilter) return false;
    if (selectedType !== 'all' && p.type.toLowerCase() !== selectedType.toLowerCase()) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const formatPrice = (price: number, mode: string) => {
    const formatted = price.toLocaleString();
    if (mode === 'rent') return `AED ${formatted} / year`;
    return `AED ${formatted}`;
  };

  return (
    <section id="properties" className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e8dfd3] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#b58b4a] block mb-1">
            Curated Portfolio · Dubai &amp; UAE
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1917] tracking-tight">
            Featured Residences &amp; Properties
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Discover verified apartments, luxury villas, and off-plan residences with live video broadcasts.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#f7f4ed] border border-[#e8dfd3] rounded-2xl">
          {(['all', 'buy', 'rent', 'new'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setActiveFilter(mode)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === mode
                  ? 'bg-[#1c1917] text-[#d9bf8c] shadow-md'
                  : 'text-stone-600 hover:text-[#1c1917]'
              }`}
            >
              {mode === 'all' ? 'All Properties' : mode === 'new' ? 'New Projects' : `For ${mode}`}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-[#e8dfd3] shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by community, tower or keyword..."
            className="w-full bg-[#fbfaf7] border border-[#e8dfd3] focus:border-[#b58b4a] focus:ring-1 focus:ring-[#b58b4a] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1c1917] outline-none"
          />
        </div>

        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-[#fbfaf7] border border-[#e8dfd3] focus:border-[#b58b4a] rounded-xl px-3.5 py-2.5 text-xs text-[#1c1917] outline-none cursor-pointer"
          >
            <option value="all">All Property Types</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="penthouse">Penthouse</option>
            <option value="townhouse">Townhouse</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-xs text-stone-600 px-2">
          <span>Showing <strong className="text-[#1c1917]">{filteredProperties.length}</strong> of {properties.length} luxury units</span>
          <span className="inline-flex items-center gap-1 text-[#b58b4a] font-semibold">
            <Radio className="w-3 h-3 text-red-600 animate-pulse" /> Live Tours Available
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 4xl:grid-cols-5 gap-6 2xl:gap-8">
        {filteredProperties.map((property) => {
          const isFav = savedFavorites.includes(property.id);
          const whatsappMessage = encodeURIComponent(
            `Hello JSG Real Estate, I saw ${property.title} in ${property.location} and would like to arrange a private viewing or live video tour.`
          );
          const propertyImages = getPropertyImages(property);
          const currentAngleIndex = cardAngleIndices[property.id] || 0;
          const activeCardImage = propertyImages[currentAngleIndex] || property.image;

          const handlePrevCardAngle = (e: React.MouseEvent) => {
            e.stopPropagation();
            setCardAngleIndices(prev => ({
              ...prev,
              [property.id]: currentAngleIndex > 0 ? currentAngleIndex - 1 : propertyImages.length - 1
            }));
          };

          const handleNextCardAngle = (e: React.MouseEvent) => {
            e.stopPropagation();
            setCardAngleIndices(prev => ({
              ...prev,
              [property.id]: currentAngleIndex < propertyImages.length - 1 ? currentAngleIndex + 1 : 0
            }));
          };

          return (
            <div
              key={property.id}
              onClick={() => onSelectProperty(property)}
              data-cursor="View Residence"
              className="group bg-white rounded-2xl border border-[#e8dfd3] overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#c5a059]/60 hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col cursor-pointer"
            >
              {/* Image Container */}
              <div 
                className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900 group/cardimg"
              >
                <img
                  src={activeCardImage}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  loading="lazy"
                />

                {/* Badge tags */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
                  <span className="px-2.5 py-1 bg-[#1c1917]/90 backdrop-blur-md text-white text-[11px] font-bold rounded-lg uppercase tracking-wider shadow">
                    {property.tag}
                  </span>
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-[#1c1917] text-[11px] font-semibold rounded-lg uppercase tracking-wider shadow border border-white/50">
                    {property.mode.toUpperCase()}
                  </span>
                  {propertyImages.length > 1 && (
                    <span className="px-2 py-1 bg-[#0e241e]/90 backdrop-blur-md text-[#d9bf8c] text-[10px] font-bold rounded-lg shadow border border-[#b58b4a]/30 flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      <span>{currentAngleIndex + 1}/{propertyImages.length} Angles</span>
                    </span>
                  )}
                </div>

                {/* Multi-Angle Chevrons on Card */}
                {propertyImages.length > 1 && (
                  <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none z-10 opacity-0 group-hover/cardimg:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={handlePrevCardAngle}
                      className="pointer-events-auto p-1.5 rounded-full bg-black/70 hover:bg-[#102a22] text-white hover:text-[#d9bf8c] border border-white/20 transition-all cursor-pointer shadow-md"
                      title="Previous angle"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextCardAngle}
                      className="pointer-events-auto p-1.5 rounded-full bg-black/70 hover:bg-[#102a22] text-white hover:text-[#d9bf8c] border border-white/20 transition-all cursor-pointer shadow-md"
                      title="Next angle"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Action icons */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(property.id, e)}
                    className="p-2 rounded-xl bg-white/90 backdrop-blur-md hover:bg-white text-stone-700 hover:text-rose-600 shadow transition-colors"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-600 text-rose-600' : ''}`} />
                  </button>
                </div>

                {/* Live Agent Call Overlay CTA (Direct Video Call & Live Palace Location View) */}
                <div className="absolute bottom-3 inset-x-3 z-10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLiveCallProperty(property);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#b58b4a] via-[#c5a059] to-[#d9bf8c] hover:brightness-110 text-[#0d221c] font-black text-xs rounded-xl shadow-lg transition-transform group-hover:scale-102 border border-[#b58b4a]/40"
                    title="Make 4K Live Video Call with Agent at this Palace"
                  >
                    <Video className="w-3.5 h-3.5 text-[#0d221c]" />
                    <span>Live Agent Call</span>
                  </button>

                  <span className="px-2 py-1 bg-[#091713]/85 backdrop-blur-md text-[#d9bf8c] text-[10px] rounded-lg font-mono border border-[#b58b4a]/30">
                    ID #{property.id}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#b58b4a]" />
                    <span className="truncate">{property.location}</span>
                  </div>

                  <h3 className="font-bold text-[#1c1917] text-base group-hover:text-[#8a631c] transition-colors line-clamp-1">
                    {property.title}
                  </h3>

                  <div className="mt-2 text-lg font-extrabold text-[#1c1917] tracking-tight">
                    {formatPrice(property.price, property.mode)}
                  </div>
                </div>

                {/* Property Specs */}
                <div className="pt-3 border-t border-[#e8dfd3] grid grid-cols-3 gap-2 text-xs text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-3.5 h-3.5 text-[#b58b4a]" />
                    <span>{property.beds} Beds</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bath className="w-3.5 h-3.5 text-[#b58b4a]" />
                    <span>{property.baths} Baths</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Maximize className="w-3.5 h-3.5 text-[#b58b4a]" />
                    <span>{property.area} sqft</span>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={`https://wa.me/97143202030?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp
                  </a>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProperty(property);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#1c1917] hover:bg-[#2c2724] text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Agent Call Modal with Video Call & Live Palace Location View */}
      {activeLiveCallProperty && (
        <LiveAgentCallModal
          isOpen={true}
          onClose={() => setActiveLiveCallProperty(null)}
          propertyTitle={activeLiveCallProperty.title}
          propertyLocation={activeLiveCallProperty.location}
          initialImage={activeLiveCallProperty.image}
          propertyPrice={formatPrice(activeLiveCallProperty.price, activeLiveCallProperty.mode)}
        />
      )}
    </section>
  );
};
