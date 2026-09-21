import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Search, 
  Radio, 
  Video,
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  Calculator, 
  Users,
  Compass
} from 'lucide-react';
import { HeroSlider } from '../components/HeroSlider';
import { Luxury3DMarqueeSection } from '../components/Luxury3DMarqueeSection';
import { LiveMetricCards } from '../components/LiveMetricCards';
import { ServicesSection } from '../components/ServicesSection';
import { FounderSection } from '../components/FounderSection';
import { ConstructionScrollExperience } from '../components/construction/ConstructionScrollExperience';
import { PropertyGrid } from '../components/PropertyGrid';
import { MasterDeveloperInfiniteScroll } from '../components/MasterDeveloperInfiniteScroll';
import { JSGSections } from '../components/JSGSections';
import { LiveAgentCallModal } from '../components/LiveAgentCallModal';
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from '../components/ScrollReveal';
import { Property } from '../types/jsg';
import { ALL_PROPERTIES, DEVELOPERS, COMMUNITY_GUIDES } from '../data/realEstateData';
import { useSiteData } from '../context/SiteDataContext';
import jsgRawData from '../jsgData.json';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectProperty }) => {
  const data = jsgRawData as any;
  const { properties: liveProperties } = useSiteData();
  const [isLiveAgentCallOpen, setIsLiveAgentCallOpen] = useState(false);

  const displayProperties = liveProperties && liveProperties.length > 0 ? liveProperties : data.properties;

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* 1. Next-Gen Intelligent Hero Slider with Integrated Floating Pill Search Bar */}
      <HeroSlider onNavigate={onNavigate} />

      {/* 1B. Interactive 3D Infinite Scroll Marquee (Developer Alliances & Live Market Pulse with Cursor & Scroll Reactivity) */}
      <Luxury3DMarqueeSection onNavigate={onNavigate} />

      {/* 2. Founder's Signature Vision Section */}
      <ScrollReveal>
        <FounderSection onNavigate={onNavigate} />
      </ScrollReveal>

      {/* 2B. Scroll-Controlled Architectural Construction Video Experience */}
      <ScrollReveal>
        <ConstructionScrollExperience onNavigate={onNavigate} />
      </ScrollReveal>

      {/* 3. 3D Animated Reactive Metric Cards Bar with Integrated Infinite Stream in Background */}
      <ScrollReveal>
        <section aria-label="Key Performance Metrics" className="pt-2 sm:pt-4">
          <LiveMetricCards onNavigate={onNavigate} />
        </section>
      </ScrollReveal>

      {/* 4. Semantic Luxury Services Section ("One property partner." with Buy, Rent, Sell, New Projects) */}
      <ScrollReveal>
        <ServicesSection onNavigate={onNavigate} />
      </ScrollReveal>

      {/* 3. Quick Action Feature Cards (Mortgage, Valuation, Sold Prices, Off-Plan) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <ScrollRevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ScrollRevealItem>
            <div 
              onClick={() => onNavigate('/buy/mortgage-calculator')}
              data-cursor="Calculate"
              className="bg-white rounded-2xl p-5 border border-[#e8dfd3] shadow-md hover:shadow-xl transition-all cursor-pointer group flex items-start gap-4 hover:-translate-y-1.5 duration-300"
            >
              <div className="p-3 rounded-xl bg-[#b58b4a]/10 text-[#8a631c] group-hover:bg-[#b58b4a] group-hover:text-white transition-colors">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1c1917] group-hover:text-[#8a631c]">Mortgage Calculator</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">Calculate UAE EMI payments &amp; 4% DLD fees</p>
              </div>
            </div>
          </ScrollRevealItem>

          <ScrollRevealItem>
            <div 
              onClick={() => onNavigate('/sell')}
              data-cursor="Valuate"
              className="bg-white rounded-2xl p-5 border border-[#e8dfd3] shadow-md hover:shadow-xl transition-all cursor-pointer group flex items-start gap-4 hover:-translate-y-1.5 duration-300"
            >
              <div className="p-3 rounded-xl bg-[#b58b4a]/10 text-[#8a631c] group-hover:bg-[#b58b4a] group-hover:text-white transition-colors">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1c1917] group-hover:text-[#8a631c]">Instant Property Valuation</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">Estimate market value &amp; yields in 30 seconds</p>
              </div>
            </div>
          </ScrollRevealItem>

          <ScrollRevealItem>
            <div 
              onClick={() => onNavigate('/buy/sold-prices')}
              data-cursor="Registry"
              className="bg-white rounded-2xl p-5 border border-[#e8dfd3] shadow-md hover:shadow-xl transition-all cursor-pointer group flex items-start gap-4 hover:-translate-y-1.5 duration-300"
            >
              <div className="p-3 rounded-xl bg-[#b58b4a]/10 text-[#8a631c] group-hover:bg-[#b58b4a] group-hover:text-white transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1c1917] group-hover:text-[#8a631c]">DLD Sold Price Registry</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">Official realized transaction benchmarks</p>
              </div>
            </div>
          </ScrollRevealItem>

          <ScrollRevealItem>
            <div 
              onClick={() => onNavigate('/new-projects')}
              data-cursor="Launches"
              className="bg-white rounded-2xl p-5 border border-[#e8dfd3] shadow-md hover:shadow-xl transition-all cursor-pointer group flex items-start gap-4 hover:-translate-y-1.5 duration-300"
            >
              <div className="p-3 rounded-xl bg-[#b58b4a]/10 text-[#8a631c] group-hover:bg-[#b58b4a] group-hover:text-white transition-colors">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1c1917] group-hover:text-[#8a631c]">New Off-Plan Launches</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">Emaar, Nakheel &amp; Sobha 80/20 payment plans</p>
              </div>
            </div>
          </ScrollRevealItem>
        </ScrollRevealGroup>
      </section>

      {/* 4. Live Agent Call & Live Palace Walkthrough Banner */}
      <ScrollReveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            data-cursor="Live Call"
            className="rounded-3xl bg-gradient-to-r from-[#0d221c] via-[#14362d] to-[#0d221c] p-6 sm:p-8 text-white border border-[#b58b4a]/50 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group hover:border-[#b58b4a] transition-colors"
          >
            {/* Subtle gold ambient glow */}
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#b58b4a]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#b58b4a]/20 border border-[#b58b4a]/40 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                <Video className="w-6 h-6 sm:w-7 sm:h-7 text-[#d9bf8c] animate-pulse" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#0d221c] text-[10px] font-black uppercase tracking-wider mb-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0d221c] animate-ping" />
                  Live Agent Connected
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#fbfaf7] tracking-tight">
                  Live Agent Call &amp; 4K Palace Walkthrough
                </h3>
                <p className="text-xs text-[#e8dfd3] mt-1 max-w-xl leading-relaxed">
                  Connect via live two-way 4K video with our licensed on-site broker to inspect palace rooms, beachfront terraces, and panoramic Dubai views in real time.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto relative z-10">
              <button
                type="button"
                onClick={() => setIsLiveAgentCallOpen(true)}
                className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#b58b4a] via-[#c5a059] to-[#d9bf8c] hover:brightness-110 text-[#0d221c] font-black text-xs shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-[#b58b4a]/60 hover:scale-102 active:scale-98"
                title="Start Live Video Call with Agent"
              >
                <Video className="w-4 h-4 text-[#0d221c]" />
                <span>Live Agent Call</span>
              </button>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 5. Featured Properties Catalog */}
      <ScrollReveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PropertyGrid
            properties={displayProperties}
            onSelectProperty={onSelectProperty}
            onOpenLiveShowcase={() => onNavigate('/live-showcase')}
          />
        </section>
      </ScrollReveal>

      {/* 6. Professional Infinite Scroll of Master Developers with Official Logos & Intel */}
      <ScrollReveal>
        <MasterDeveloperInfiniteScroll onNavigate={onNavigate} />
      </ScrollReveal>

      {/* 7. Prime Dubai Areas & Community Overview */}
      <ScrollReveal>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <JSGSections
            data={data}
            onExploreProperties={() => onNavigate('/buy')}
          />
        </div>
      </ScrollReveal>

      {/* Live Agent Call Modal with Video Call & Live Palace Location View */}
      <LiveAgentCallModal
        isOpen={isLiveAgentCallOpen}
        onClose={() => setIsLiveAgentCallOpen(false)}
        propertyTitle="Palm Jumeirah Sovereign Beach Palace"
        propertyLocation="Frond N, Palm Jumeirah, Dubai"
        propertyPrice="AED 125,000,000"
      />
    </div>
  );
};
