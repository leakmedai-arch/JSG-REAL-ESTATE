import React, { useState } from 'react';
import { 
  Sparkles, 
  Save, 
  Plus, 
  Trash2, 
  Check, 
  ExternalLink,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

interface HeroEditorProps {
  sections: any;
  setSections: React.Dispatch<React.SetStateAction<any>>;
  onSave: () => void;
  showNotification: (msg: string) => void;
}

export const HeroEditor: React.FC<HeroEditorProps> = ({
  sections,
  setSections,
  onSave,
  showNotification
}) => {
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [newSlideImage, setNewSlideImage] = useState('');
  const [newSlideLocation, setNewSlideLocation] = useState('');
  const [newSlidePrice, setNewSlidePrice] = useState('');

  const slides = sections.heroSlides || [];

  const handleAddSlide = () => {
    if (!newSlideTitle.trim() || !newSlideImage.trim()) {
      alert('Please provide at least a title and image URL for the hero slide.');
      return;
    }

    const newSlide = {
      id: `hero-slide-${Date.now()}`,
      title: newSlideTitle.trim(),
      subtitle: 'Curated luxury acquisition opportunity in prime Dubai.',
      location: newSlideLocation.trim() || 'Dubai, UAE',
      priceAed: Number(newSlidePrice) || 15000000,
      image: newSlideImage.trim(),
      tag: 'Featured Luxury',
      beds: 5,
      baths: 6,
      areaSqft: 6500,
      link: '/buy',
      active: true,
      order: slides.length + 1
    };

    setSections({
      ...sections,
      heroSlides: [...slides, newSlide]
    });

    setNewSlideTitle('');
    setNewSlideImage('');
    setNewSlideLocation('');
    setNewSlidePrice('');
    showNotification('Hero slide added to rotation.');
  };

  const handleDeleteSlide = (id: string) => {
    setSections({
      ...sections,
      heroSlides: slides.filter((s: any) => s.id !== id)
    });
    showNotification('Hero slide removed.');
  };

  const handleToggleSlideActive = (id: string) => {
    setSections({
      ...sections,
      heroSlides: slides.map((s: any) => 
        s.id === id ? { ...s, active: !s.active } : s
      )
    });
  };

  const handleUpdateSlideField = (id: string, field: string, value: any) => {
    setSections({
      ...sections,
      heroSlides: slides.map((s: any) => 
        s.id === id ? { ...s, [field]: value } : s
      )
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Hero Section & Dynamic Carousel</h1>
          <p className="text-xs text-[#d9bf8c]">
            Control main viewport headline, CTA destinations, and full-bleed luxury background slides.
          </p>
        </div>
        <button
          type="button"
          onClick={onSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-bold shadow-lg hover:opacity-95 flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Hero Configuration</span>
        </button>
      </div>

      {/* 1. Hero Headline & CTAs */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-[#fae7b5] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#b58b4a]" />
          <span>Hero Viewport Messaging & Action Buttons</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-semibold text-slate-300">Hero Main Headline</label>
            <input
              type="text"
              value={sections.hero?.heading || 'Dubai Luxury Real Estate'}
              onChange={(e) => 
                setSections({
                  ...sections,
                  hero: { ...(sections.hero || {}), heading: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-serif text-sm"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-semibold text-slate-300">Hero Subheading / Descriptor</label>
            <textarea
              rows={2}
              value={sections.hero?.subheading || 'Curated ultra-prime penthouses, signature waterfront villas, and institutional advisory across Dubai trophy enclaves.'}
              onChange={(e) => 
                setSections({
                  ...sections,
                  hero: { ...(sections.hero || {}), subheading: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Primary CTA Button Label</label>
            <input
              type="text"
              value={sections.hero?.primaryCtaText || 'Explore Portfolio'}
              onChange={(e) => 
                setSections({
                  ...sections,
                  hero: { ...(sections.hero || {}), primaryCtaText: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Primary CTA Target URL</label>
            <input
              type="text"
              value={sections.hero?.primaryCtaLink || '/buy'}
              onChange={(e) => 
                setSections({
                  ...sections,
                  hero: { ...(sections.hero || {}), primaryCtaLink: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Secondary CTA Button Label</label>
            <input
              type="text"
              value={sections.hero?.secondaryCtaText || 'Private Consultation'}
              onChange={(e) => 
                setSections({
                  ...sections,
                  hero: { ...(sections.hero || {}), secondaryCtaText: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Secondary CTA Target URL</label>
            <input
              type="text"
              value={sections.hero?.secondaryCtaLink || '/agents'}
              onChange={(e) => 
                setSections({
                  ...sections,
                  hero: { ...(sections.hero || {}), secondaryCtaLink: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
            />
          </div>
        </div>
      </div>

      {/* 2. Hero Background Slides */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#fae7b5] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#b58b4a]" />
            <span>Full-Bleed Luxury Background Slides</span>
          </h2>
          <span className="text-slate-400 text-[11px]">{slides.length} active slides</span>
        </div>

        <div className="space-y-4">
          {slides.map((slide: any, idx: number) => (
            <div key={slide.id || idx} className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-16 h-12 rounded-lg object-cover border border-white/10"
                    onError={(e: any) => {
                      e.target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div>
                    <span className="font-bold text-white text-sm block">{slide.title}</span>
                    <span className="text-slate-400 text-[11px]">{slide.location} · AED {(slide.priceAed || 0).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-[11px] text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={slide.active !== false}
                      onChange={() => handleToggleSlideActive(slide.id)}
                      className="rounded accent-[#b58b4a] w-4 h-4"
                    />
                    <span>Active in Carousel</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleDeleteSlide(slide.id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 text-[10px] uppercase tracking-wider">Slide Title</label>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => handleUpdateSlideField(slide.id, 'title', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 text-[10px] uppercase tracking-wider">Location Tag</label>
                  <input
                    type="text"
                    value={slide.location}
                    onChange={(e) => handleUpdateSlideField(slide.id, 'location', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-slate-400 text-[10px] uppercase tracking-wider">Image URL</label>
                  <input
                    type="text"
                    value={slide.image}
                    onChange={(e) => handleUpdateSlideField(slide.id, 'image', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Slide Form */}
        <div className="p-4 rounded-2xl bg-black/20 border border-white/5 space-y-3">
          <div className="font-bold text-[#fae7b5]">Add New Hero Slide</div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <input
                type="text"
                placeholder="Slide Title (e.g. Palm Crescent Villa)"
                value={newSlideTitle}
                onChange={(e) => setNewSlideTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Location (e.g. Palm Jumeirah)"
                value={newSlideLocation}
                onChange={(e) => setNewSlideLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Price AED (e.g. 35000000)"
                value={newSlidePrice}
                onChange={(e) => setNewSlidePrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs font-mono"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Image URL"
                value={newSlideImage}
                onChange={(e) => setNewSlideImage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs font-mono"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddSlide}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#fae7b5] font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-white/10"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Slide to Carousel</span>
          </button>
        </div>
      </div>
    </div>
  );
};
