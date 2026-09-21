import React, { useState } from 'react';
import { 
  Layers, 
  Save, 
  Sparkles, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Check, 
  HelpCircle,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface AllSectionsEditorProps {
  sections: any;
  setSections: React.Dispatch<React.SetStateAction<any>>;
  settings: any;
  setSettings: React.Dispatch<React.SetStateAction<any>>;
  onSave: () => void;
  showNotification: (msg: string) => void;
}

export const AllSectionsEditor: React.FC<AllSectionsEditorProps> = ({
  sections,
  setSections,
  settings,
  setSettings,
  onSave,
  showNotification
}) => {
  // Why Choose JSG
  const whyData = sections.why || {
    eyebrow: 'Institutional Excellence',
    title: 'The JSG Advisory Distinction',
    description: 'We do not sell properties; we architect bespoke acquisition strategies for high-net-worth families, international funds, and private offices.',
    cards: [
      { title: 'Discreet Private Off-Market Portfolio', text: 'Exclusive access to unlisted trophy penthouses and beachfront mansions before public release.' },
      { title: 'Rigorous Financial & Yield Underwriting', text: 'Institutional cash-flow modelling, rental yield verification, and DLD historical transaction auditing.' },
      { title: 'Direct Developer Tier-1 Allocation', text: 'First-priority unit selection and preferential payment schedule negotiations with Dubai master builders.' },
      { title: 'End-to-End Fiduciary Representation', text: 'Comprehensive legal structuring, Golden Visa processing, escrow management, and post-handover leasing.' }
    ]
  };

  // Sell Banner
  const sellData = sections.sell || {
    eyebrow: 'Private Representation',
    title: 'List Your Trophy Property with JSG',
    description: 'Reach qualified international buyers and verified family offices through our confidential luxury advisory network.',
    button: 'Request Private Listing Valuation'
  };

  // Contact Section
  const contactData = sections.contact || {
    eyebrow: 'Begin Your Acquisition',
    title: 'Consult with Our Senior Partners',
    description: 'Whether you require private asset acquisition, off-plan portfolio structuring, or luxury property valuation, our senior team is at your service.'
  };

  const handleUpdateWhy = (field: string, value: any) => {
    setSections({
      ...sections,
      why: {
        ...whyData,
        [field]: value
      }
    });
  };

  const handleUpdateWhyCard = (idx: number, field: string, value: string) => {
    const updatedCards = [...whyData.cards];
    updatedCards[idx] = {
      ...updatedCards[idx],
      [field]: value
    };
    handleUpdateWhy('cards', updatedCards);
  };

  const handleAddWhyCard = () => {
    const newCard = {
      title: 'New Service Capability',
      text: 'Describe the unique value proposition and advisory distinction.'
    };
    handleUpdateWhy('cards', [...whyData.cards, newCard]);
    showNotification('New advisory card added.');
  };

  const handleDeleteWhyCard = (idx: number) => {
    const updated = whyData.cards.filter((_: any, i: number) => i !== idx);
    handleUpdateWhy('cards', updated);
    showNotification('Card removed.');
  };

  const handleUpdateSell = (field: string, value: string) => {
    setSections({
      ...sections,
      sell: {
        ...sellData,
        [field]: value
      }
    });
  };

  const handleUpdateContact = (field: string, value: string) => {
    setSections({
      ...sections,
      contact: {
        ...contactData,
        [field]: value
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in text-xs">
      {/* Title & Central Save */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#b58b4a]/20 text-[#d9bf8c] font-bold text-[10px] uppercase tracking-wider">
              Priority 7
            </span>
            <h1 className="text-2xl font-black text-white">All Website Sections Content</h1>
          </div>
          <p className="text-xs text-[#d9bf8c] mt-1">
            Every heading, paragraph, card, icon, button and link across Why Choose JSG, Sell With Us, and Contact Advisory.
          </p>
        </div>
        <button
          type="button"
          onClick={onSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-bold shadow-lg hover:opacity-95 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save All Sections to Live Site</span>
        </button>
      </div>

      {/* 1. Why Choose JSG Difference Section */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#fae7b5] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#b58b4a]" />
              <span>&quot;Why Choose JSG&quot; Distinction Section</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              The flagship emerald background section highlighting four core fiduciary capabilities.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddWhyCard}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#fae7b5] font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Card</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">Eyebrow Tagline</label>
            <input
              type="text"
              value={whyData.eyebrow || ''}
              onChange={(e) => handleUpdateWhy('eyebrow', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">Main Heading</label>
            <input
              type="text"
              value={whyData.title || ''}
              onChange={(e) => handleUpdateWhy('title', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-serif focus:outline-none focus:border-[#b58b4a]"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-slate-300 font-medium">Detailed Narrative Description</label>
            <textarea
              rows={2}
              value={whyData.description || ''}
              onChange={(e) => handleUpdateWhy('description', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs leading-relaxed focus:outline-none focus:border-[#b58b4a]"
            />
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold text-[#d9bf8c] block">Distinction Cards ({whyData.cards.length})</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {whyData.cards.map((card: any, idx: number) => (
              <div key={idx} className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#d9bf8c]">Card 0{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteWhyCard(idx)}
                    className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-300 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Card Title</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => handleUpdateWhyCard(idx, 'title', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs focus:outline-none focus:border-[#b58b4a]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Card Description</label>
                  <textarea
                    rows={2}
                    value={card.text}
                    onChange={(e) => handleUpdateWhyCard(idx, 'text', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs leading-relaxed focus:outline-none focus:border-[#b58b4a]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Sell / List Your Property Banner */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-6">
        <div>
          <h2 className="text-sm font-bold text-[#fae7b5] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#b58b4a]" />
            <span>&quot;List Your Property&quot; Representation Banner</span>
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            The full-width acquisition banner inviting ultra-prime sellers to list directly with JSG.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">Eyebrow Tagline</label>
            <input
              type="text"
              value={sellData.eyebrow || ''}
              onChange={(e) => handleUpdateSell('eyebrow', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">Banner Headline</label>
            <input
              type="text"
              value={sellData.title || ''}
              onChange={(e) => handleUpdateSell('title', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-serif focus:outline-none focus:border-[#b58b4a]"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-slate-300 font-medium">Banner Description</label>
            <textarea
              rows={2}
              value={sellData.description || ''}
              onChange={(e) => handleUpdateSell('description', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs leading-relaxed focus:outline-none focus:border-[#b58b4a]"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-slate-300 font-medium">Call to Action Button Label</label>
            <input
              type="text"
              value={sellData.button || ''}
              onChange={(e) => handleUpdateSell('button', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#b58b4a]"
            />
          </div>
        </div>
      </div>

      {/* 3. Contact & Direct Advisory Section */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-6">
        <div>
          <h2 className="text-sm font-bold text-[#fae7b5] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#b58b4a]" />
            <span>Contact &amp; Private Consultation Section Text</span>
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Headings and explanatory guidance for the homepage contact &amp; appointment form.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">Eyebrow Tagline</label>
            <input
              type="text"
              value={contactData.eyebrow || ''}
              onChange={(e) => handleUpdateContact('eyebrow', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">Main Heading</label>
            <input
              type="text"
              value={contactData.title || ''}
              onChange={(e) => handleUpdateContact('title', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-serif focus:outline-none focus:border-[#b58b4a]"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-slate-300 font-medium">Detailed Advisory Invitation</label>
            <textarea
              rows={2}
              value={contactData.description || ''}
              onChange={(e) => handleUpdateContact('description', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs leading-relaxed focus:outline-none focus:border-[#b58b4a]"
            />
          </div>
        </div>
      </div>

      {/* 4. Section Visibility Toggles */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-[#fae7b5] flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#b58b4a]" />
          <span>Global Section Visibility Toggles</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <label className="p-3 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-between cursor-pointer hover:border-[#b58b4a]/30">
            <span className="font-semibold text-slate-200">Featured Properties Strip</span>
            <input
              type="checkbox"
              checked={sections.featuredPropertiesVisible !== false}
              onChange={(e) => setSections({ ...sections, featuredPropertiesVisible: e.target.checked })}
              className="w-4 h-4 rounded text-[#b58b4a]"
            />
          </label>

          <label className="p-3 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-between cursor-pointer hover:border-[#b58b4a]/30">
            <span className="font-semibold text-slate-200">Developers Partner Strip</span>
            <input
              type="checkbox"
              checked={sections.developersStripVisible !== false}
              onChange={(e) => setSections({ ...sections, developersStripVisible: e.target.checked })}
              className="w-4 h-4 rounded text-[#b58b4a]"
            />
          </label>

          <label className="p-3 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-between cursor-pointer hover:border-[#b58b4a]/30">
            <span className="font-semibold text-slate-200">Prime Communities Strip</span>
            <input
              type="checkbox"
              checked={sections.communitiesStripVisible !== false}
              onChange={(e) => setSections({ ...sections, communitiesStripVisible: e.target.checked })}
              className="w-4 h-4 rounded text-[#b58b4a]"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
