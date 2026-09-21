import React, { useState } from 'react';
import { 
  Sliders, 
  Save, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Image as ImageIcon, 
  Sparkles, 
  Check, 
  ExternalLink,
  Upload,
  Layers,
  RotateCcw
} from 'lucide-react';

interface SlidersEditorProps {
  sections: any;
  setSections: React.Dispatch<React.SetStateAction<any>>;
  onSave: () => void;
  showNotification: (msg: string) => void;
}

const DEFAULT_SLIDES = [
  {
    id: 1,
    tagline: 'SIGNATURE WATERFRONT COLLECTION',
    headline: 'Where the Arabian Gulf Meets Architectural Purity.',
    subheadline: 'Direct private beach access, custom Italian bookmatched marble finishes, and 25-meter infinity pool facing the Dubai skyline.',
    propertyTitle: 'Palm Jumeirah Signature Beachfront Villa',
    location: 'Palm Jumeirah, Frond N',
    price: 'AED 28,500,000',
    stats: '6 Beds · 8,400 Sq.Ft · Private Frond Beach',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=3840&q=95',
    category: 'Waterfront Villa',
    buttonTitle: 'Explore Palm Villa',
    ctaPath: '/buy'
  },
  {
    id: 2,
    tagline: 'DOWNTOWN SKYLINE PENTHOUSE',
    headline: 'High-Altitude Grandeur Above the Center of the World.',
    subheadline: 'Panoramic Burj Khalifa vistas, private high-speed biometric elevator, and double-height entertainment salon with wrap-around sky terrace.',
    propertyTitle: 'Burj Crown Sky Penthouse Suite',
    location: 'Downtown Dubai',
    price: 'AED 16,500,000',
    stats: '4 Beds · 5,200 Sq.Ft · Unobstructed Burj View',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=3840&q=95',
    category: 'Sky Penthouse',
    buttonTitle: 'Burj Crown Penthouse',
    ctaPath: '/buy/apartments'
  },
  {
    id: 3,
    tagline: 'GOLF COURSE ESTATE',
    headline: 'Serene Championship Fairway Living.',
    subheadline: 'Lush championship golf course panoramas with expansive private basements, internal courtyards, and cinema rooms.',
    propertyTitle: 'Fairway Vistas Championship Mansion',
    location: 'Dubai Hills Estate',
    price: 'AED 24,200,000',
    stats: '6 Beds · 9,100 Sq.Ft · Full Golf Course Panorama',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=3840&q=95',
    category: 'Golf Villa',
    buttonTitle: 'Dubai Hills Mansion',
    ctaPath: '/buy/villas'
  },
  {
    id: 4,
    tagline: 'PRIVATE YACHT HARBOUR RESIDENCE',
    headline: 'Elevated Waterfront Living in the Heart of the Marina.',
    subheadline: 'Direct marina promenade connection, private yacht berthing options, and bespoke interior concierge service.',
    propertyTitle: 'The Royal Marina High-Altitude Suite',
    location: 'Dubai Marina',
    price: 'AED 3,850,000',
    stats: '3 Beds · 2,150 Sq.Ft · Full Marina & Yacht Berthing View',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=3840&q=95',
    category: 'Marina Waterfront',
    buttonTitle: 'Dubai Marina Residence',
    ctaPath: '/buy/apartments'
  },
  {
    id: 5,
    tagline: 'PRIME OFF-PLAN OPPORTUNITY',
    headline: 'The Art of Living in the Modern Emirate.',
    subheadline: 'High-yield master-planned communities across Dubai, Abu Dhabi, and Ras Al Khaimah with flexible post-handover payment structures.',
    propertyTitle: 'Creek Waters & Wynn Resort Island Portfolios',
    location: 'Dubai Creek & Al Marjan Island',
    price: 'From AED 1,950,000',
    stats: '80/20 Payment Plans · Projected 8.5% Net Yield',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=3840&q=95',
    category: 'Island Towers',
    buttonTitle: 'Creek Waters Island',
    ctaPath: '/new-projects'
  }
];

export const SlidersEditor: React.FC<SlidersEditorProps> = ({
  sections,
  setSections,
  onSave,
  showNotification
}) => {
  // Use sections.heroSlides if exists, otherwise populate from default
  const slides = (sections.heroSlides && sections.heroSlides.length > 0)
    ? sections.heroSlides
    : DEFAULT_SLIDES;

  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  const handleUpdateSlide = (idx: number, field: string, value: any) => {
    const updated = [...slides];
    updated[idx] = {
      ...updated[idx],
      [field]: value
    };

    // If updating image, also sync with heroSliderPhotos
    let newPhotos = { ...(sections.heroSliderPhotos || {}) };
    if (field === 'image') {
      const slideId = updated[idx].id;
      newPhotos[slideId] = value;
      newPhotos[String(slideId)] = value;
    }

    setSections({
      ...sections,
      heroSlides: updated,
      heroSliderPhotos: newPhotos
    });
  };

  const handleMoveSlide = (idx: number, direction: 'up' | 'down') => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === slides.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...slides];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;

    setSections({
      ...sections,
      heroSlides: updated
    });
    setActiveSlideIndex(targetIdx);
    showNotification(`Slide moved ${direction}.`);
  };

  const handleAddSlide = () => {
    const newId = Date.now();
    const newSlide = {
      id: newId,
      tagline: 'NEW LUXURY RELEASE',
      headline: 'Architectural Excellence in Prime Dubai',
      subheadline: 'Exclusive trophy residence featuring world-class amenities and bespoke finishes.',
      propertyTitle: 'New Luxury Residence',
      location: 'Downtown Dubai',
      price: 'AED 15,000,000',
      stats: '5 Beds · 6,200 Sq.Ft · Skyline View',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=3840&q=95',
      category: 'Luxury Villa',
      buttonTitle: 'View Residence',
      ctaPath: '/buy'
    };

    const updated = [...slides, newSlide];
    setSections({
      ...sections,
      heroSlides: updated
    });
    setActiveSlideIndex(updated.length - 1);
    showNotification('New slide added to rotation.');
  };

  const handleDeleteSlide = (idx: number) => {
    if (slides.length <= 1) {
      alert('The hero slider requires at least one active slide.');
      return;
    }

    const updated = slides.filter((_: any, i: number) => i !== idx);
    setSections({
      ...sections,
      heroSlides: updated
    });
    setActiveSlideIndex(Math.max(0, idx - 1));
    showNotification('Slide removed from rotation.');
  };

  const handleImageUpload = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      handleUpdateSlide(idx, 'image', dataUrl);
      showNotification('Slide image uploaded and applied.');
    };
    reader.readAsDataURL(file);
  };

  const current = slides[activeSlideIndex] || slides[0];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in text-xs">
      {/* Header & Central Save */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#b58b4a]/20 text-[#d9bf8c] font-bold text-[10px] uppercase tracking-wider">
              Priority 4
            </span>
            <h1 className="text-2xl font-black text-white">Hero Slider & Showcase Control</h1>
          </div>
          <p className="text-xs text-[#d9bf8c] mt-1">
            Add, replace, delete and reorder images; edit every heading, subtitle, description and button without altering slider animation.
          </p>
        </div>
        <button
          type="button"
          onClick={onSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-bold shadow-lg hover:opacity-95 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Sliders to Live Site</span>
        </button>
      </div>

      {/* Slide Navigation Strip */}
      <div className="p-4 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-2">
          {slides.map((s: any, idx: number) => (
            <button
              key={s.id || idx}
              type="button"
              onClick={() => setActiveSlideIndex(idx)}
              className={`px-4 py-2.5 rounded-2xl flex items-center gap-2.5 transition-all cursor-pointer ${
                activeSlideIndex === idx
                  ? 'bg-gradient-to-r from-[#b58b4a] to-[#996f2e] text-[#142621] font-bold shadow-md'
                  : 'bg-black/30 hover:bg-black/50 text-slate-300 border border-white/5'
              }`}
            >
              <span className="font-mono text-xs">0{idx + 1}</span>
              <span className="truncate max-w-[120px] font-semibold">{s.propertyTitle || `Slide ${idx + 1}`}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddSlide}
          className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-[#fae7b5] border border-white/10 font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-[#b58b4a]" />
          <span>Add Slide</span>
        </button>
      </div>

      {/* Active Slide Visual Editor */}
      {current && (
        <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-base font-bold text-white">
                Editing Slide 0{activeSlideIndex + 1}: {current.propertyTitle}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#b58b4a]/20 text-[#d9bf8c] text-[10px] font-bold">
                {current.category || 'Luxury'}
              </span>
            </div>

            {/* Action Bar: Reorder & Delete */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleMoveSlide(activeSlideIndex, 'up')}
                disabled={activeSlideIndex === 0}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 disabled:opacity-20 flex items-center gap-1 cursor-pointer border border-white/5"
                title="Move Slide Forward in Rotation"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Move Up</span>
              </button>

              <button
                type="button"
                onClick={() => handleMoveSlide(activeSlideIndex, 'down')}
                disabled={activeSlideIndex === slides.length - 1}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 disabled:opacity-20 flex items-center gap-1 cursor-pointer border border-white/5"
                title="Move Slide Backward in Rotation"
              >
                <ArrowDown className="w-3.5 h-3.5" />
                <span>Move Down</span>
              </button>

              <button
                type="button"
                onClick={() => handleDeleteSlide(activeSlideIndex)}
                className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 flex items-center gap-1 cursor-pointer"
                title="Delete this slide"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Slide Photo Management */}
          <div className="space-y-3">
            <label className="block font-semibold text-slate-200">Slide High-Resolution Background Photo</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#b58b4a]/30 bg-black/40">
                <img
                  src={current.image}
                  alt={current.propertyTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[10px] text-[#d9bf8c] font-bold">Current Slide Preview</span>
                </div>
              </div>

              <div className="md:col-span-2 space-y-3 flex flex-col justify-center">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Image URL</label>
                  <input
                    type="text"
                    value={current.image || ''}
                    onChange={(e) => handleUpdateSlide(activeSlideIndex, 'image', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-[11px] focus:outline-none focus:border-[#b58b4a]"
                  />
                </div>
                <div>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold cursor-pointer border border-white/10 transition-colors">
                    <Upload className="w-4 h-4 text-[#b58b4a]" />
                    <span>Upload New Photo from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(activeSlideIndex, e)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Slide Text & Button Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="block text-slate-300 font-medium">Tagline / Eyebrow Badge</label>
              <input
                type="text"
                value={current.tagline || ''}
                onChange={(e) => handleUpdateSlide(activeSlideIndex, 'tagline', e.target.value)}
                placeholder="SIGNATURE WATERFRONT COLLECTION"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-300 font-medium">Property Title</label>
              <input
                type="text"
                value={current.propertyTitle || ''}
                onChange={(e) => handleUpdateSlide(activeSlideIndex, 'propertyTitle', e.target.value)}
                placeholder="Palm Jumeirah Signature Beachfront Villa"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#b58b4a]"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-slate-300 font-medium">Headline</label>
              <input
                type="text"
                value={current.headline || ''}
                onChange={(e) => handleUpdateSlide(activeSlideIndex, 'headline', e.target.value)}
                placeholder="Where the Arabian Gulf Meets Architectural Purity."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-serif text-sm focus:outline-none focus:border-[#b58b4a]"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-slate-300 font-medium">Subheadline / Narrative Description</label>
              <textarea
                rows={2}
                value={current.subheadline || ''}
                onChange={(e) => handleUpdateSlide(activeSlideIndex, 'subheadline', e.target.value)}
                placeholder="Direct private beach access, custom Italian marble finishes..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs leading-relaxed focus:outline-none focus:border-[#b58b4a]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-300 font-medium">Location Enclave</label>
              <input
                type="text"
                value={current.location || ''}
                onChange={(e) => handleUpdateSlide(activeSlideIndex, 'location', e.target.value)}
                placeholder="Palm Jumeirah, Frond N"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-300 font-medium">Price in AED</label>
              <input
                type="text"
                value={current.price || ''}
                onChange={(e) => handleUpdateSlide(activeSlideIndex, 'price', e.target.value)}
                placeholder="AED 28,500,000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono text-[#d9bf8c] focus:outline-none focus:border-[#b58b4a]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-300 font-medium">Property Stats (Beds · Sq.Ft · View)</label>
              <input
                type="text"
                value={current.stats || ''}
                onChange={(e) => handleUpdateSlide(activeSlideIndex, 'stats', e.target.value)}
                placeholder="6 Beds · 8,400 Sq.Ft · Private Frond Beach"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-300 font-medium">Category / Property Type</label>
              <input
                type="text"
                value={current.category || ''}
                onChange={(e) => handleUpdateSlide(activeSlideIndex, 'category', e.target.value)}
                placeholder="Waterfront Villa"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-300 font-medium">CTA Button Label</label>
              <input
                type="text"
                value={current.buttonTitle || ''}
                onChange={(e) => handleUpdateSlide(activeSlideIndex, 'buttonTitle', e.target.value)}
                placeholder="Explore Palm Villa"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-300 font-medium">CTA Target Route Link</label>
              <input
                type="text"
                value={current.ctaPath || ''}
                onChange={(e) => handleUpdateSlide(activeSlideIndex, 'ctaPath', e.target.value)}
                placeholder="/buy"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#d9bf8c] font-mono text-[11px] focus:outline-none focus:border-[#b58b4a]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
