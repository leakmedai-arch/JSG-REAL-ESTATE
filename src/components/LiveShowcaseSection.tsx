import React from 'react';
import { 
  Building2, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Radio, 
  MessageCircle, 
  Phone, 
  Share2, 
  Heart, 
  ExternalLink,
  Users,
  Calendar,
  Sparkles,
  Play
} from 'lucide-react';
import { Property } from '../types/jsg';
import { StreamPlayer } from './StreamPlayer';
import { LiveChat } from './LiveChat';
import { parseStreamUrl } from '../utils/streamParser';

interface LiveShowcaseSectionProps {
  property: Property;
  onClose: () => void;
  onSelectOtherProperty: (property: Property) => void;
  allProperties: Property[];
}

export const LiveShowcaseSection: React.FC<LiveShowcaseSectionProps> = ({
  property,
  onClose,
  onSelectOtherProperty,
  allProperties
}) => {
  // Use a reliable high-bitrate live video stream for luxury property walkthroughs
  const streamSource = property.videoUrl || 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
  const parsedStream = parseStreamUrl(streamSource);

  const whatsappMessage = encodeURIComponent(
    `Hello JSG Real Estate, I am actively watching the live walkthrough for ${property.title} in ${property.location} and would like to reserve a private viewing.`
  );

  return (
    <div id="live-showcase-view" className="space-y-6 animate-fadeIn">
      {/* Top Banner with back button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#17362f] text-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-600/90 text-white animate-pulse">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base">Live Interactive Property Broadcast</span>
              <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-extrabold uppercase rounded-full tracking-wider">
                ON AIR
              </span>
            </div>
            <p className="text-xs text-[#d9bf8c]">
              Now touring: {property.title} · {property.location}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-md transition-colors cursor-pointer"
          >
            ← Return to Property Catalog
          </button>
        </div>
      </div>

      {/* Main Grid: Player on left, Synchronized Chat on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Player & Specs */}
        <div className="lg:col-span-8 space-y-6">
          <StreamPlayer
            stream={parsedStream}
            streamTitle={`JSG Live Showcase: ${property.title}`}
            isLive={true}
          />

          {/* Property Quick Bar */}
          <div className="bg-white rounded-2xl p-6 border border-[#e4ddd1] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e4ddd1]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 bg-[#b58b4a] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                    {property.tag}
                  </span>
                  <span className="text-xs text-[#707a74]">{property.location}</span>
                </div>
                <h1 className="text-xl font-bold text-[#17211f]">{property.title}</h1>
              </div>

              <div className="sm:text-right">
                <span className="text-xs text-[#707a74] block">Price</span>
                <span className="text-2xl font-black text-[#17362f]">
                  AED {property.price.toLocaleString()}
                  {property.mode === 'rent' ? ' / yr' : ''}
                </span>
              </div>
            </div>

            {/* Key Specs */}
            <div className="grid grid-cols-3 gap-4 text-center py-2 bg-[#f7f4ed] rounded-xl border border-[#e4ddd1]">
              <div>
                <span className="text-xs text-[#707a74] block">Bedrooms</span>
                <span className="font-bold text-[#17211f] text-sm">{property.beds}</span>
              </div>
              <div>
                <span className="text-xs text-[#707a74] block">Bathrooms</span>
                <span className="font-bold text-[#17211f] text-sm">{property.baths}</span>
              </div>
              <div>
                <span className="text-xs text-[#707a74] block">Built-up Size</span>
                <span className="font-bold text-[#17211f] text-sm">{property.area} sqft</span>
              </div>
            </div>

            {/* Real Estate Contact Action CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`https://wa.me/97143202030?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg transition-transform hover:scale-101"
              >
                <MessageCircle className="w-4 h-4" /> Message Agent Live on WhatsApp
              </a>

              <a
                href="tel:+97143202030"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#17362f] hover:bg-[#21483d] text-white rounded-xl font-bold text-xs shadow transition-colors"
              >
                <Phone className="w-4 h-4" /> Call +971 4 320 2030
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Live Stream Chat */}
        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <LiveChat />
          </div>
        </div>
      </div>

      {/* Switch to Other Property Walkthroughs */}
      <div className="bg-white rounded-2xl p-6 border border-[#e4ddd1] shadow-sm space-y-4">
        <h3 className="font-bold text-base text-[#17362f]">Other Live Broadcast Walkthroughs</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {allProperties.slice(0, 4).map((other) => (
            <div
              key={other.id}
              onClick={() => onSelectOtherProperty(other)}
              className={`group p-2 rounded-xl border transition-all cursor-pointer ${
                other.id === property.id
                  ? 'border-[#b58b4a] bg-[#f7f4ed]'
                  : 'border-[#e4ddd1] hover:border-[#17362f] bg-white'
              }`}
            >
              <div className="relative aspect-video rounded-lg overflow-hidden mb-2 bg-slate-900">
                <img
                  src={other.image}
                  alt={other.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 text-white text-[9px] font-mono rounded">
                  {other.mode.toUpperCase()}
                </span>
              </div>
              <h4 className="font-semibold text-xs text-[#17211f] truncate group-hover:text-[#17362f]">
                {other.title}
              </h4>
              <p className="text-[10px] text-[#707a74] mt-0.5">AED {other.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
