import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  CheckCircle2,
  Users,
  Compass
} from 'lucide-react';
import { JSGSiteData } from '../types/jsg';
import { useSiteData } from '../context/SiteDataContext';

interface JSGSectionsProps {
  data: JSGSiteData;
  onExploreProperties: () => void;
}

export const JSGSections: React.FC<JSGSectionsProps> = ({ data, onExploreProperties }) => {
  const [formSent, setFormSent] = React.useState(false);
  const { getCommunityImage } = useSiteData();

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Prime Areas Section */}
      <section id="areas" className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="pre-heading block">
            Prime Locations
          </span>
          <h2 className="main-heading text-2xl sm:text-3xl text-[#1c1917] tracking-tight">
            Discover Dubai&apos;s Most Coveted Communities
          </h2>
          <p className="body-desc text-xs sm:text-sm text-stone-600">
            From landmark waterfront apartments in Dubai Marina to palatial villas in Palm Jumeirah and Dubai Hills.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {data.areas.map((area, idx) => {
            const currentImg = getCommunityImage(area.name, area.image);
            return (
              <div
                key={idx}
                onClick={onExploreProperties}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-stone-900 border border-[#e8dfd3] shadow-sm hover:shadow-xl transition-all cursor-pointer"
              >
                <img
                  src={currentImg}
                  alt={area.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/90 via-[#1c1917]/30 to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
                  <h3 className="sub-heading font-bold text-base sm:text-lg leading-tight group-hover:text-[#d9bf8c] transition-colors">
                    {area.name}
                  </h3>
                  <p className="body-desc text-[11px] text-stone-300 mt-1 line-clamp-1">{area.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Buildings & Landmark Towers */}
      <section id="buildings" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e8dfd3] pb-4">
          <div>
            <span className="pre-heading block mb-1">
              Iconic Addresses
            </span>
            <h2 className="main-heading text-2xl sm:text-3xl text-[#1c1917] tracking-tight">
              Featured Buildings &amp; Towers
            </h2>
          </div>
          <button
            type="button"
            onClick={onExploreProperties}
            className="btn-3d px-4 py-2 bg-white text-[#8a631c] hover:text-[#b58b4a] border border-[#e8dfd3] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span>View All Tower Listings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {data.buildings.map((b, idx) => {
            const currentImg = getCommunityImage(b.name, b.image);
            return (
              <div
                key={idx}
                className="group bg-white rounded-2xl border border-[#e8dfd3] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col cursor-pointer relative"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-stone-900">
                  <img
                    src={currentImg}
                    alt={b.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="sub-heading font-bold text-sm text-[#1c1917] group-hover:text-[#8a631c] transition-colors">
                      {b.name}
                    </h4>
                    <p className="body-desc text-[11px] text-stone-500 mt-0.5 line-clamp-1">{b.subtitle}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose JSG Difference */}
      <section id="why" className="bg-[#142621] text-[#f4f4f0] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-[#c5a059]/30">
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="pre-heading block">
            {data.why.eyebrow}
          </span>
          <h2 className="main-heading text-2xl sm:text-4xl text-[#f4f4f0] tracking-tight">
            {data.why.title}
          </h2>
          <p className="body-desc text-sm sm:text-base text-[#d1d1d6] leading-relaxed">
            {data.why.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 relative z-10">
          {data.why.cards.map((card, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/5 border border-[#c5a059]/25 backdrop-blur-md hover:bg-white/10 transition-colors"
            >
              <div className="sub-heading text-sm font-semibold text-[#f4f4f0] mb-1.5">{card.title}</div>
              <p className="body-desc text-xs text-[#d1d1d6] leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sell / List Property Banner */}
      <section id="sell" className="bg-[#f5f0e8] border border-[#e8dfd3] rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl space-y-2">
          <span className="pre-heading block">
            {data.sell.eyebrow}
          </span>
          <h2 className="main-heading text-2xl sm:text-3xl text-[#1c1917] tracking-tight">
            {data.sell.title}
          </h2>
          <p className="body-desc text-sm text-stone-600 leading-relaxed">
            {data.sell.description}
          </p>
        </div>

        <a
          href={`https://wa.me/97143202030?text=${encodeURIComponent('Hello JSG Real Estate, I would like to list my property with your team.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-3d px-8 py-4 bg-[#142621] hover:bg-[#1a3830] text-[#c5a059] hover:text-white font-bold text-sm rounded-2xl shadow-xl transition-all shrink-0 border border-[#c5a059]/40 cursor-pointer"
        >
          {data.sell.button}
        </a>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white border border-[#e8dfd3] rounded-3xl p-8 sm:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-4">
            <span className="pre-heading block">
              {data.contact.eyebrow}
            </span>
            <h2 className="main-heading text-2xl sm:text-3xl text-[#1c1917] tracking-tight">
              {data.contact.title}
            </h2>
            <p className="body-desc text-sm text-stone-600 leading-relaxed">
              {data.contact.description}
            </p>

            <div className="space-y-3 pt-4 text-xs sm:text-sm text-[#1c1917]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#f5f0e8] text-[#8a631c]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-stone-500 block">Direct Telephone</span>
                  <a href={`tel:${data.contact.phone}`} className="font-bold hover:text-[#b58b4a]">
                    {data.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#f5f0e8] text-[#8a631c]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-stone-500 block">Email Enquiries</span>
                  <a href={`mailto:${data.contact.email}`} className="font-bold hover:text-[#b58b4a]">
                    {data.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#f5f0e8] text-[#8a631c]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-stone-500 block">Headquarters Office</span>
                  <span className="font-bold">{data.contact.location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#fbf9f4] border border-[#e8dfd3] rounded-2xl p-6 space-y-4">
            <h3 className="sub-heading text-base font-semibold text-[#1c1917]">Send Direct Message</h3>
            {formSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold">
                ✓ Thank you! A JSG senior luxury advisor will contact you within 15 minutes.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setFormSent(true);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    className="w-full bg-white border border-[#e8dfd3] focus:border-[#b58b4a] rounded-xl px-3.5 py-2.5 text-[#1c1917] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="email@domain.com"
                    className="w-full bg-white border border-[#e8dfd3] focus:border-[#b58b4a] rounded-xl px-3.5 py-2.5 text-[#1c1917] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Message / Requirements</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us the area, budget, or property requirements..."
                    className="w-full bg-white border border-[#e8dfd3] focus:border-[#b58b4a] rounded-xl p-3 text-[#1c1917] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-3d w-full py-3.5 bg-[#142621] hover:bg-[#1a3830] text-[#c5a059] hover:text-white font-bold rounded-xl shadow transition-colors cursor-pointer border border-[#c5a059]/40"
                >
                  {data.contact.button}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
