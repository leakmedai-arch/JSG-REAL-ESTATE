import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Save, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Sparkles, 
  Upload, 
  Check, 
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface GalleryEditorProps {
  sections: any;
  setSections: React.Dispatch<React.SetStateAction<any>>;
  communityImages: Record<string, string>;
  setCommunityImages?: (images: Record<string, string>) => void;
  onSave: () => void;
  showNotification: (msg: string) => void;
}

export const GalleryEditor: React.FC<GalleryEditorProps> = ({
  sections,
  setSections,
  communityImages,
  onSave,
  showNotification
}) => {
  const row1 = sections.infiniteCardsRow1 || [];
  const row2 = sections.infiniteCardsRow2 || [];

  const [activeTab, setActiveTab] = useState<'row1' | 'row2' | 'community'>('row1');

  // Row 1 & 2 Card Handlers
  const handleUpdateCard = (row: 1 | 2, id: string, field: string, value: string) => {
    if (row === 1) {
      setSections({
        ...sections,
        infiniteCardsRow1: row1.map((c: any) => c.id === id ? { ...c, [field]: value } : c)
      });
    } else {
      setSections({
        ...sections,
        infiniteCardsRow2: row2.map((c: any) => c.id === id ? { ...c, [field]: value } : c)
      });
    }
  };

  const handleResetCardImage = (row: 1 | 2, id: string) => {
    if (row === 1) {
      setSections({
        ...sections,
        infiniteCardsRow1: row1.map((c: any) => c.id === id ? { ...c, image: c.defaultImage } : c)
      });
    } else {
      setSections({
        ...sections,
        infiniteCardsRow2: row2.map((c: any) => c.id === id ? { ...c, image: c.defaultImage } : c)
      });
    }
    showNotification('Card image reset to default architecture photography.');
  };

  const handleAddCard = (row: 1 | 2) => {
    const newCard = {
      id: `card-${Date.now()}`,
      title: 'Trophy Luxury Property',
      price: 'AED 18,500,000',
      area: 'Downtown Dubai',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      defaultImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
    };

    if (row === 1) {
      setSections({ ...sections, infiniteCardsRow1: [...row1, newCard] });
    } else {
      setSections({ ...sections, infiniteCardsRow2: [...row2, newCard] });
    }
    showNotification(`Card added to Row ${row} marquee.`);
  };

  const handleDeleteCard = (row: 1 | 2, id: string) => {
    if (row === 1) {
      setSections({ ...sections, infiniteCardsRow1: row1.filter((c: any) => c.id !== id) });
    } else {
      setSections({ ...sections, infiniteCardsRow2: row2.filter((c: any) => c.id !== id) });
    }
    showNotification('Card removed from marquee.');
  };

  const handleCardImageUpload = (row: 1 | 2, id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      handleUpdateCard(row, id, 'image', reader.result as string);
      showNotification('Card image uploaded.');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in text-xs">
      {/* Title & Central Save */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#b58b4a]/20 text-[#d9bf8c] font-bold text-[10px] uppercase tracking-wider">
              Priority 8
            </span>
            <h1 className="text-2xl font-black text-white">Gallery & Infinite Marquee Control</h1>
          </div>
          <p className="text-xs text-[#d9bf8c] mt-1">
            Replace, add, and delete gallery photography across Row 1 &amp; Row 2 marquees without modifying existing CSS animations.
          </p>
        </div>
        <button
          type="button"
          onClick={onSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-bold shadow-lg hover:opacity-95 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Gallery to Live Site</span>
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#142e27] border border-white/10 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('row1')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'row1'
              ? 'bg-[#b58b4a] text-[#142621]'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          Row 1 Infinite Marquee ({row1.length} cards)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('row2')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'row2'
              ? 'bg-[#b58b4a] text-[#142621]'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          Row 2 Infinite Marquee ({row2.length} cards)
        </button>
      </div>

      {/* Active Tab: Row 1 Cards */}
      {activeTab === 'row1' && (
        <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#fae7b5] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#b58b4a]" />
                <span>Row 1 · Infinite Horizontal Marquee Luxury Cards</span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Smooth leftward scroll marquee presenting signature architectural residences.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleAddCard(1)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#fae7b5] font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#b58b4a]" />
              <span>Add Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {row1.map((card: any) => (
              <div key={card.id} className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10 bg-black shrink-0">
                    <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => handleUpdateCard(1, card.id, 'title', e.target.value)}
                      className="w-full font-bold text-white text-xs px-2 py-1 rounded bg-white/5 border border-white/10"
                      placeholder="Title"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={card.price || ''}
                        onChange={(e) => handleUpdateCard(1, card.id, 'price', e.target.value)}
                        className="w-full font-mono text-[#d9bf8c] text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10"
                        placeholder="Price"
                      />
                      <input
                        type="text"
                        value={card.area || ''}
                        onChange={(e) => handleUpdateCard(1, card.id, 'area', e.target.value)}
                        className="w-full text-slate-300 text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10"
                        placeholder="Location"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Image URL</label>
                  <input
                    type="text"
                    value={card.image}
                    onChange={(e) => handleUpdateCard(1, card.id, 'image', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-[10px]"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-[10px] cursor-pointer">
                      <Upload className="w-3 h-3 text-[#b58b4a]" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleCardImageUpload(1, card.id, e)}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => handleResetCardImage(1, card.id)}
                      className="text-[10px] text-amber-300/80 hover:text-amber-200"
                    >
                      Reset Default
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCard(1, card.id)}
                    className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-300 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Tab: Row 2 Cards */}
      {activeTab === 'row2' && (
        <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#fae7b5] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#b58b4a]" />
                <span>Row 2 · Reverse Direction Marquee Luxury Cards</span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Dual-speed rightward scroll marquee creating multi-layered parallax depth.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleAddCard(2)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#fae7b5] font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#b58b4a]" />
              <span>Add Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {row2.map((card: any) => (
              <div key={card.id} className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10 bg-black shrink-0">
                    <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => handleUpdateCard(2, card.id, 'title', e.target.value)}
                      className="w-full font-bold text-white text-xs px-2 py-1 rounded bg-white/5 border border-white/10"
                      placeholder="Title"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={card.price || ''}
                        onChange={(e) => handleUpdateCard(2, card.id, 'price', e.target.value)}
                        className="w-full font-mono text-[#d9bf8c] text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10"
                        placeholder="Price"
                      />
                      <input
                        type="text"
                        value={card.area || ''}
                        onChange={(e) => handleUpdateCard(2, card.id, 'area', e.target.value)}
                        className="w-full text-slate-300 text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10"
                        placeholder="Location"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Image URL</label>
                  <input
                    type="text"
                    value={card.image}
                    onChange={(e) => handleUpdateCard(2, card.id, 'image', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-[10px]"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-[10px] cursor-pointer">
                      <Upload className="w-3 h-3 text-[#b58b4a]" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleCardImageUpload(2, card.id, e)}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => handleResetCardImage(2, card.id)}
                      className="text-[10px] text-amber-300/80 hover:text-amber-200"
                    >
                      Reset Default
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCard(2, card.id)}
                    className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-300 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
