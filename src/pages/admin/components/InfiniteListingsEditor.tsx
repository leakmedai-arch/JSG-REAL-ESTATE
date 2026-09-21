import React, { useState } from 'react';
import { 
  Building2, 
  Save, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  MapPin, 
  DollarSign, 
  Sparkles,
  RotateCcw,
  ArrowRight,
  Eye
} from 'lucide-react';

interface InfiniteCard {
  id: string;
  title: string;
  image: string;
  defaultImage: string;
  price: string;
  area: string;
}

interface InfiniteListingsEditorProps {
  sections: any;
  setSections: React.Dispatch<React.SetStateAction<any>>;
  onSave: () => void;
  showNotification: (msg: string) => void;
}

const DEFAULT_ROW1: InfiniteCard[] = [
  {
    id: 'dubai-bg-1',
    title: "Palm Jumeirah Signature Beachfront Villa",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    price: "AED 28.5M",
    area: "Palm Jumeirah, Dubai"
  },
  {
    id: 'dubai-bg-2',
    title: "Burj Crown Sky Penthouse",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
    price: "AED 16.5M",
    area: "Downtown Dubai"
  },
  {
    id: 'dubai-bg-3',
    title: "Fairway Vistas Championship Mansion",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    price: "AED 24.2M",
    area: "Dubai Hills Estate"
  },
  {
    id: 'dubai-bg-4',
    title: "The Royal Marina High-Altitude Suite",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    price: "AED 5.85M",
    area: "Dubai Marina"
  },
  {
    id: 'dubai-bg-5',
    title: "District One Crystal Lagoon Villa",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    price: "AED 21.0M",
    area: "MBR City, Dubai"
  },
  {
    id: 'dubai-bg-6',
    title: "One Canal Waterfront Luxury Sky Villa",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    price: "AED 19.5M",
    area: "Dubai Water Canal"
  }
];

const DEFAULT_ROW2: InfiniteCard[] = [
  {
    id: 'dubai-bg-7',
    title: "Jumeirah Bay Island Bulgari Mansion",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    price: "AED 55.0M",
    area: "Jumeirah Bay Island, Dubai"
  },
  {
    id: 'dubai-bg-8',
    title: "Atlantis The Royal Palm Crescent Suite",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    price: "AED 34.0M",
    area: "Palm Jumeirah, Dubai"
  },
  {
    id: 'dubai-bg-9',
    title: "Emirates Hills Montgomerie Villa",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
    price: "AED 38.5M",
    area: "Emirates Hills, Dubai"
  },
  {
    id: 'dubai-bg-10',
    title: "Il Primo Opera Grand Penthouse",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
    price: "AED 22.0M",
    area: "Downtown Dubai"
  },
  {
    id: 'dubai-bg-11',
    title: "Bluewaters Bay Island Residence",
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
    price: "AED 8.4M",
    area: "Bluewaters Island, Dubai"
  },
  {
    id: 'dubai-bg-12',
    title: "Al Barari Botanical Luxury Estate",
    image: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80",
    price: "AED 17.5M",
    area: "Al Barari, Dubai"
  }
];

export const InfiniteListingsEditor: React.FC<InfiniteListingsEditorProps> = ({
  sections,
  setSections,
  onSave,
  showNotification
}) => {
  const [selectedRow, setSelectedRow] = useState<'row1' | 'row2'>('row1');

  const row1Cards: InfiniteCard[] = (sections?.infiniteCardsRow1 && sections.infiniteCardsRow1.length > 0)
    ? sections.infiniteCardsRow1
    : DEFAULT_ROW1;

  const row2Cards: InfiniteCard[] = (sections?.infiniteCardsRow2 && sections.infiniteCardsRow2.length > 0)
    ? sections.infiniteCardsRow2
    : DEFAULT_ROW2;

  const activeCards = selectedRow === 'row1' ? row1Cards : row2Cards;

  const handleUpdateCard = (rowKey: 'infiniteCardsRow1' | 'infiniteCardsRow2', id: string, field: keyof InfiniteCard, value: string) => {
    const targetList = rowKey === 'infiniteCardsRow1' ? row1Cards : row2Cards;
    const updated = targetList.map(c => c.id === id ? { ...c, [field]: value } : c);
    setSections({
      ...sections,
      [rowKey]: updated
    });
  };

  const handleAddCard = (rowKey: 'infiniteCardsRow1' | 'infiniteCardsRow2') => {
    const targetList = rowKey === 'infiniteCardsRow1' ? row1Cards : row2Cards;
    const newCard: InfiniteCard = {
      id: `dubai-card-${Date.now()}`,
      title: 'New Luxury Penthouse Suite',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      defaultImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      price: 'AED 15.0M',
      area: 'Palm Jumeirah, Dubai'
    };
    setSections({
      ...sections,
      [rowKey]: [...targetList, newCard]
    });
    showNotification('Card added to infinite marquee.');
  };

  const handleDeleteCard = (rowKey: 'infiniteCardsRow1' | 'infiniteCardsRow2', id: string) => {
    const targetList = rowKey === 'infiniteCardsRow1' ? row1Cards : row2Cards;
    if (targetList.length <= 2) {
      alert('At least 2 cards are required to maintain a seamless continuous infinite loop.');
      return;
    }
    const updated = targetList.filter(c => c.id !== id);
    setSections({
      ...sections,
      [rowKey]: updated
    });
    showNotification('Card removed from infinite loop.');
  };

  const handleResetDefaults = (rowKey: 'infiniteCardsRow1' | 'infiniteCardsRow2') => {
    if (!confirm('Reset this marquee row to verified Dubai luxury defaults?')) return;
    setSections({
      ...sections,
      [rowKey]: rowKey === 'infiniteCardsRow1' ? DEFAULT_ROW1 : DEFAULT_ROW2
    });
    showNotification('Row reset to defaults.');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-[#b58b4a]" />
            <span>Infinite Property Listings (Marquee Loops)</span>
          </h1>
          <p className="text-xs text-[#d9bf8c]">
            Edit cards, images, titles, pricing, and locations without breaking the smooth infinite scroll animation.
          </p>
        </div>
        <button
          type="button"
          onClick={onSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-bold shadow-lg hover:opacity-95 flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Infinite Listings</span>
        </button>
      </div>

      {/* Row Tabs */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <button
          type="button"
          onClick={() => setSelectedRow('row1')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            selectedRow === 'row1'
              ? 'bg-[#b58b4a] text-[#142621]'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <span>Marquee Stream 1 (Top Carousel)</span>
          <span className="px-1.5 py-0.5 rounded-full bg-black/20 text-[10px]">{row1Cards.length} Cards</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedRow('row2')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            selectedRow === 'row2'
              ? 'bg-[#b58b4a] text-[#142621]'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <span>Marquee Stream 2 (Reverse Carousel)</span>
          <span className="px-1.5 py-0.5 rounded-full bg-black/20 text-[10px]">{row2Cards.length} Cards</span>
        </button>
      </div>

      {/* Actions Toolbar */}
      <div className="flex items-center justify-between">
        <div className="text-slate-400 text-xs">
          Showing <strong>{activeCards.length}</strong> listings in continuous motion loop.
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleResetDefaults(selectedRow === 'row1' ? 'infiniteCardsRow1' : 'infiniteCardsRow2')}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1.5 border border-white/10 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddCard(selectedRow === 'row1' ? 'infiniteCardsRow1' : 'infiniteCardsRow2')}
            className="px-4 py-1.5 rounded-lg bg-[#b58b4a]/20 hover:bg-[#b58b4a]/30 text-[#fae7b5] border border-[#b58b4a]/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Property Card</span>
          </button>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeCards.map((card, idx) => (
          <div 
            key={card.id || idx}
            className="p-5 rounded-2xl bg-[#142e27] border border-white/10 shadow-lg space-y-4 relative group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-black/30 border border-white/10 flex items-center justify-center font-mono text-[11px] text-[#fae7b5] font-bold">
                  {idx + 1}
                </span>
                <span className="font-bold text-white text-sm truncate max-w-[240px]">
                  {card.title || 'Untitled Property'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteCard(selectedRow === 'row1' ? 'infiniteCardsRow1' : 'infiniteCardsRow2', card.id)}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 transition-colors"
                title="Remove Card"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Preview Banner */}
            <div className="relative h-32 rounded-xl overflow-hidden border border-white/10 bg-black/40">
              <img 
                src={card.image} 
                alt={card.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = card.defaultImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-bold font-mono">{card.price}</span>
                <span className="text-[#fae7b5] text-[10px] font-semibold">{card.area}</span>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] text-slate-300 font-semibold">Property Title</label>
                <input 
                  type="text"
                  value={card.title}
                  onChange={(e) => handleUpdateCard(selectedRow === 'row1' ? 'infiniteCardsRow1' : 'infiniteCardsRow2', card.id, 'title', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-medium focus:border-[#b58b4a]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 font-semibold flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-[#b58b4a]" />
                  <span>Price (AED)</span>
                </label>
                <input 
                  type="text"
                  value={card.price}
                  onChange={(e) => handleUpdateCard(selectedRow === 'row1' ? 'infiniteCardsRow1' : 'infiniteCardsRow2', card.id, 'price', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono focus:border-[#b58b4a]"
                  placeholder="AED 25.0M"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#b58b4a]" />
                  <span>Community Location</span>
                </label>
                <input 
                  type="text"
                  value={card.area}
                  onChange={(e) => handleUpdateCard(selectedRow === 'row1' ? 'infiniteCardsRow1' : 'infiniteCardsRow2', card.id, 'area', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-[#b58b4a]"
                  placeholder="Downtown Dubai"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] text-slate-300 font-semibold flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-[#b58b4a]" />
                  <span>Property Photo URL</span>
                </label>
                <input 
                  type="text"
                  value={card.image}
                  onChange={(e) => handleUpdateCard(selectedRow === 'row1' ? 'infiniteCardsRow1' : 'infiniteCardsRow2', card.id, 'image', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-[11px] focus:border-[#b58b4a]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
