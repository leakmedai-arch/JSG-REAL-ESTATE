import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Save, 
  Award, 
  Briefcase, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  RotateCcw,
  Upload,
  Sparkles,
  Layers,
  PhoneCall,
  ExternalLink
} from 'lucide-react';

interface FounderEditorProps {
  sections: any;
  setSections: React.Dispatch<React.SetStateAction<any>>;
  onSave: () => void;
  showNotification: (msg: string) => void;
}

export const FounderEditor: React.FC<FounderEditorProps> = ({
  sections,
  setSections,
  onSave,
  showNotification
}) => {
  const founder = sections.founder || {
    name: 'JASMEET SINGH GULATI',
    title: 'Founder & Managing Director',
    subtitle: '15+ Years Driving Institutional & Ultra-Luxury UAE Real Estate Acquisitions',
    experienceYears: 15,
    dealsVolume: 'AED 4.8B+',
    primaryBtnText: 'Schedule Private Advisory',
    primaryBtnLink: '/contact',
    secondaryBtnText: 'Direct WhatsApp Line',
    secondaryBtnLink: 'https://wa.me/97143202030',
    typewriterPhrases: [
      'Institutional Asset Advisory & Private Off-Market Acquisitions',
      'Dubai Trophy Penthouses & Waterfront Signature Mansions',
      'High-Yield Portfolios Delivering Consistent 8–11% ROI'
    ],
    executiveStatement: 'At JSG Real Estate, our philosophy transcends conventional transactions. We curate generational assets for visionary individuals who view Dubai as the preeminent luxury metropolis of the modern world.',
    detailedBio: 'Jasmeet Singh Gulati founded JSG Real Estate with an uncompromising focus on discretion, analytical precision, and fiduciary integrity. Having directed over AED 4.8 Billion in high-profile residential and commercial transactions across Downtown Dubai, Palm Jumeirah, and Emirates Hills, Jasmeet serves as the trusted property advisor to international family offices and discerning private investors.',
    portraitImage: '/assets/founder.jpg',
    credentials: ['RERA Certified Real Estate Broker #19284', 'DLD Gold Tier Agency Principal', '15+ Years UAE Market Leadership']
  };

  const showcaseSlides = sections.showcaseSlides || [
    { id: 'sc-1', title: 'Palm Jumeirah Custom Beachfront Mansion', tag: 'Private Advisory', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80' },
    { id: 'sc-2', title: 'Downtown Sky Penthouse Overlooking Burj Khalifa', tag: 'Trophy Asset', url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80' },
    { id: 'sc-3', title: 'Emirates Hills Fairway Estate', tag: 'Ultra-Prime', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
    { id: 'sc-4', title: 'Bulgari Island Waterfront Residence', tag: 'Off-Market', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80' }
  ];

  const [newCredential, setNewCredential] = useState('');
  const [newPhrase, setNewPhrase] = useState('');
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [newSlideUrl, setNewSlideUrl] = useState('');
  const [newSlideTag, setNewSlideTag] = useState('');

  const handleUpdateFounderField = (field: string, value: any) => {
    setSections({
      ...sections,
      founder: {
        ...founder,
        [field]: value
      }
    });
  };

  const handlePortraitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      handleUpdateFounderField('portraitImage', reader.result as string);
      showNotification('Founder portrait uploaded successfully.');
    };
    reader.readAsDataURL(file);
  };

  const handleAddCredential = () => {
    if (!newCredential.trim()) return;
    const current = founder.credentials || [];
    handleUpdateFounderField('credentials', [...current, newCredential.trim()]);
    setNewCredential('');
    showNotification('Credential added.');
  };

  const handleRemoveCredential = (index: number) => {
    const current = founder.credentials || [];
    handleUpdateFounderField('credentials', current.filter((_: any, i: number) => i !== index));
    showNotification('Credential removed.');
  };

  const handleAddPhrase = () => {
    if (!newPhrase.trim()) return;
    const current = founder.typewriterPhrases || [];
    handleUpdateFounderField('typewriterPhrases', [...current, newPhrase.trim()]);
    setNewPhrase('');
    showNotification('Typewriter phrase added.');
  };

  const handleRemovePhrase = (index: number) => {
    const current = founder.typewriterPhrases || [];
    handleUpdateFounderField('typewriterPhrases', current.filter((_: any, i: number) => i !== index));
    showNotification('Typewriter phrase removed.');
  };

  // Slider Images under Founder Section
  const handleUpdateShowcaseSlide = (id: string, field: string, value: string) => {
    setSections({
      ...sections,
      showcaseSlides: showcaseSlides.map((s: any) => 
        s.id === id ? { ...s, [field]: value } : s
      )
    });
  };

  const handleAddShowcaseSlide = () => {
    if (!newSlideTitle.trim() || !newSlideUrl.trim()) {
      alert('Please provide a title and image URL for the showcase slide.');
      return;
    }

    const newSlide = {
      id: `sc-${Date.now()}`,
      title: newSlideTitle.trim(),
      tag: newSlideTag.trim() || 'Showcase',
      url: newSlideUrl.trim()
    };

    setSections({
      ...sections,
      showcaseSlides: [...showcaseSlides, newSlide]
    });

    setNewSlideTitle('');
    setNewSlideUrl('');
    setNewSlideTag('');
    showNotification('Showcase slide added.');
  };

  const handleDeleteShowcaseSlide = (id: string) => {
    setSections({
      ...sections,
      showcaseSlides: showcaseSlides.filter((s: any) => s.id !== id)
    });
    showNotification('Showcase slide removed.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in text-xs">
      {/* Header & Central Save */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#b58b4a]/20 text-[#d9bf8c] font-bold text-[10px] uppercase tracking-wider">
              Priority 5
            </span>
            <h1 className="text-2xl font-black text-white">Founder & Executive Section</h1>
          </div>
          <p className="text-xs text-[#d9bf8c] mt-1">
            Edit photos, slider showcase images, name, title, biography, buttons, typewriter phrases, and metrics.
          </p>
        </div>
        <button
          type="button"
          onClick={onSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-bold shadow-lg hover:opacity-95 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Founder Section to Live Site</span>
        </button>
      </div>

      {/* 1. Official Executive Photos */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-6">
        <h2 className="text-sm font-bold text-[#fae7b5] flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[#b58b4a]" />
          <span>Official Executive Photography</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-3">
            <label className="block font-semibold text-slate-200">Main Executive Portrait</label>
            <div className="flex items-center gap-4">
              <img
                src={founder.portraitImage || '/assets/founder.jpg'}
                alt={founder.name}
                className="w-24 h-28 object-cover rounded-2xl border-2 border-[#b58b4a]/60 shadow-lg shrink-0"
                onError={(e: any) => {
                  e.target.src = '/assets/founder.jpg';
                }}
              />
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={founder.portraitImage || ''}
                  onChange={(e) => handleUpdateFounderField('portraitImage', e.target.value)}
                  placeholder="/assets/founder.jpg or HTTPS URL"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-[11px] focus:outline-none focus:border-[#b58b4a]"
                />
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-[11px] cursor-pointer transition-colors">
                    <Upload className="w-3 h-3 text-[#b58b4a]" />
                    <span>Upload New Photo</span>
                    <input type="file" accept="image/*" onChange={handlePortraitUpload} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      handleUpdateFounderField('portraitImage', '/assets/founder.jpg');
                      showNotification('Reset to baseline portrait.');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px]"
                  >
                    Reset Default
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-3">
            <label className="block font-semibold text-slate-200">Secondary Advisory / Action Photo</label>
            <div className="flex items-center gap-4">
              <img
                src={founder.secondaryImage || 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=800&q=80'}
                alt="Advisory Action"
                className="w-24 h-28 object-cover rounded-2xl border-2 border-[#b58b4a]/40 shadow-lg shrink-0"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={founder.secondaryImage || ''}
                  onChange={(e) => handleUpdateFounderField('secondaryImage', e.target.value)}
                  placeholder="https://... photo URL"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-[11px] focus:outline-none focus:border-[#b58b4a]"
                />
                <span className="text-[10px] text-slate-400 block">
                  Rendered in the executive overview and VIP briefing panels.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Founder Showcase Slider Images */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#fae7b5] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#b58b4a]" />
              <span>Founder Section Showcase Slider Photos</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Curated luxury architectural slides featured in the founder&apos;s personal showcase carousel.
            </p>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">{showcaseSlides.length} active slides</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {showcaseSlides.map((slide: any) => (
            <div key={slide.id} className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={slide.url}
                  alt={slide.title}
                  className="w-20 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                  onError={(e: any) => {
                    e.target.src = '/assets/founder.jpg';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => handleUpdateShowcaseSlide(slide.id, 'title', e.target.value)}
                    className="w-full font-bold text-white text-xs px-2 py-1 rounded bg-white/5 border border-white/10 focus:outline-none focus:border-[#b58b4a]"
                  />
                  <div className="flex items-center gap-2 mt-1.5">
                    <input
                      type="text"
                      value={slide.tag || ''}
                      onChange={(e) => handleUpdateShowcaseSlide(slide.id, 'tag', e.target.value)}
                      placeholder="e.g. Trophy Asset"
                      className="w-28 text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#d9bf8c] font-semibold focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteShowcaseSlide(slide.id)}
                      className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-300 ml-auto cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Image URL</label>
                <input
                  type="text"
                  value={slide.url}
                  onChange={(e) => handleUpdateShowcaseSlide(slide.id, 'url', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-[10px] focus:outline-none focus:border-[#b58b4a]"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Add New Showcase Slide Form */}
        <div className="p-4 rounded-2xl bg-black/40 border border-[#b58b4a]/20 space-y-3">
          <span className="text-xs font-bold text-[#d9bf8c] block">Add New Showcase Slide</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <input
                type="text"
                value={newSlideTitle}
                onChange={(e) => setNewSlideTitle(e.target.value)}
                placeholder="Slide Title (e.g. Palm Villa)"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
              />
            </div>
            <div>
              <input
                type="text"
                value={newSlideUrl}
                onChange={(e) => setNewSlideUrl(e.target.value)}
                placeholder="Image URL (https://...)"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#b58b4a]"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSlideTag}
                onChange={(e) => setNewSlideTag(e.target.value)}
                placeholder="Tag (e.g. Off-Market)"
                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
              />
              <button
                type="button"
                onClick={handleAddShowcaseSlide}
                className="px-4 py-2 rounded-xl bg-[#b58b4a] hover:bg-[#c5a059] text-[#142621] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Name, Title, Bio & Metrics */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-6">
        <h2 className="text-sm font-bold text-[#fae7b5] flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-[#b58b4a]" />
          <span>Executive Name, Title & Biography</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">Full Name</label>
            <input
              type="text"
              value={founder.name}
              onChange={(e) => handleUpdateFounderField('name', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs focus:outline-none focus:border-[#b58b4a]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">Official Executive Title</label>
            <input
              type="text"
              value={founder.title}
              onChange={(e) => handleUpdateFounderField('title', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">Career Transaction Volume</label>
            <input
              type="text"
              value={founder.dealsVolume}
              onChange={(e) => handleUpdateFounderField('dealsVolume', e.target.value)}
              placeholder="AED 4.8B+"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#d9bf8c] font-black text-xs focus:outline-none focus:border-[#b58b4a]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">Experience (Years in UAE)</label>
            <input
              type="number"
              value={founder.experienceYears}
              onChange={(e) => handleUpdateFounderField('experienceYears', Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-slate-300 font-medium">Subtitle Banner</label>
            <input
              type="text"
              value={founder.subtitle || ''}
              onChange={(e) => handleUpdateFounderField('subtitle', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-slate-300 font-medium">Executive Philosophy Statement</label>
            <textarea
              rows={3}
              value={founder.executiveStatement}
              onChange={(e) => handleUpdateFounderField('executiveStatement', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-serif text-xs leading-relaxed focus:outline-none focus:border-[#b58b4a]"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-slate-300 font-medium">Detailed Professional Biography</label>
            <textarea
              rows={4}
              value={founder.detailedBio}
              onChange={(e) => handleUpdateFounderField('detailedBio', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs leading-relaxed focus:outline-none focus:border-[#b58b4a]"
            />
          </div>
        </div>
      </div>

      {/* 4. Action Buttons & Contact Links */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-6">
        <h2 className="text-sm font-bold text-[#fae7b5] flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-[#b58b4a]" />
          <span>Founder Section Action Buttons</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">Primary Button Label</label>
            <input
              type="text"
              value={founder.primaryBtnText || 'Schedule Private Advisory'}
              onChange={(e) => handleUpdateFounderField('primaryBtnText', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">Primary Button Target Link</label>
            <input
              type="text"
              value={founder.primaryBtnLink || '/contact'}
              onChange={(e) => handleUpdateFounderField('primaryBtnLink', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#d9bf8c] font-mono text-[11px] focus:outline-none focus:border-[#b58b4a]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">Secondary Button Label</label>
            <input
              type="text"
              value={founder.secondaryBtnText || 'Direct WhatsApp Line'}
              onChange={(e) => handleUpdateFounderField('secondaryBtnText', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">Secondary Button Target Link</label>
            <input
              type="text"
              value={founder.secondaryBtnLink || 'https://wa.me/97143202030'}
              onChange={(e) => handleUpdateFounderField('secondaryBtnLink', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#d9bf8c] font-mono text-[11px] focus:outline-none focus:border-[#b58b4a]"
            />
          </div>
        </div>
      </div>

      {/* 5. Accreditations & Typewriter Phrases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-[#fae7b5] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#b58b4a]" />
            <span>Official Accreditations</span>
          </h2>
          <div className="space-y-2">
            {(founder.credentials || []).map((cred: string, idx: number) => (
              <div key={idx} className="p-2.5 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
                <span className="font-semibold text-white text-xs">{cred}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCredential(idx)}
                  className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-300"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Add credential (e.g. DLD Gold Producer)"
              value={newCredential}
              onChange={(e) => setNewCredential(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
            />
            <button
              type="button"
              onClick={handleAddCredential}
              className="px-4 py-2 rounded-xl bg-[#b58b4a] hover:bg-[#c5a059] text-[#142621] font-bold"
            >
              Add
            </button>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-[#fae7b5] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#b58b4a]" />
            <span>Typewriter Animation Phrases</span>
          </h2>
          <div className="space-y-2">
            {(founder.typewriterPhrases || []).map((phrase: string, idx: number) => (
              <div key={idx} className="p-2.5 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
                <span className="font-medium text-slate-200 text-xs">{phrase}</span>
                <button
                  type="button"
                  onClick={() => handleRemovePhrase(idx)}
                  className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-300"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Add typewriter phrase..."
              value={newPhrase}
              onChange={(e) => setNewPhrase(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
            />
            <button
              type="button"
              onClick={handleAddPhrase}
              className="px-4 py-2 rounded-xl bg-[#b58b4a] hover:bg-[#c5a059] text-[#142621] font-bold"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
