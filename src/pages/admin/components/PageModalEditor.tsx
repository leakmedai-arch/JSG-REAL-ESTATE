import React, { useState } from 'react';
import { X, Plus, Trash2, FileText, Globe } from 'lucide-react';
import { PageBlock } from '../../../context/SiteDataContext';

interface PageModalEditorProps {
  page: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (pageData: any) => Promise<void>;
}

export const PageModalEditor: React.FC<PageModalEditorProps> = ({
  page,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<any>(
    page || {
      title: '',
      slug: '',
      subtitle: '',
      navPlacement: 'header',
      isPublished: true,
      order: 1,
      metaTitle: '',
      metaDescription: '',
      blocks: [
        {
          id: `block-${Date.now()}`,
          type: 'hero',
          title: 'Welcome to Our Bespoke Advisory',
          content: 'Crafted for institutional and private clients seeking trophy assets across Dubai.'
        }
      ]
    }
  );

  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const addBlock = (type: 'hero' | 'text' | 'features' | 'cta') => {
    const newBlock: PageBlock = {
      id: `block-${Date.now()}`,
      type,
      title: type === 'cta' ? 'Schedule a Private Consultation' : 'Section Heading',
      content: 'Section description and body text...',
      buttonText: type === 'cta' ? 'Connect on WhatsApp' : undefined,
      buttonLink: type === 'cta' ? '/buy' : undefined
    };
    setFormData((prev: any) => ({
      ...prev,
      blocks: [...(prev.blocks || []), newBlock]
    }));
  };

  const removeBlock = (idx: number) => {
    setFormData((prev: any) => ({
      ...prev,
      blocks: prev.blocks.filter((_: any, i: number) => i !== idx)
    }));
  };

  const updateBlock = (idx: number, updates: Partial<PageBlock>) => {
    const newBlocks = [...formData.blocks];
    newBlocks[idx] = { ...newBlocks[idx], ...updates };
    setFormData({ ...formData, blocks: newBlocks });
  };

  const handleSlugify = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#17362f] text-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-[#b58b4a]/30 my-auto animate-fade-in">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#b58b4a]/20 border border-[#b58b4a]/40 flex items-center justify-center text-[#fae7b5]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#fbfaf7]">
                {page ? 'Edit Dynamic Page' : 'Create New Website Page'}
              </h2>
              <p className="text-xs text-[#d9bf8c]">
                Live on public website under <span className="font-mono">/p/{formData.slug || 'your-slug'}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Page Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData({
                    ...formData,
                    title,
                    slug: formData.slug || handleSlugify(title),
                    metaTitle: formData.metaTitle || title
                  });
                }}
                placeholder="e.g. Dubai Waterfront Living Guide"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">URL Slug * (Unique)</label>
              <div className="flex items-center">
                <span className="px-3 py-2.5 bg-black/30 rounded-l-xl text-slate-400 font-mono border border-r-0 border-white/15">
                  /p/
                </span>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: handleSlugify(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-r-xl bg-white/5 border border-white/15 text-[#fae7b5] font-mono"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Page Subtitle / Executive Summary</label>
            <input
              type="text"
              value={formData.subtitle || ''}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Brief summary displayed under the primary heading"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Navigation Placement</label>
              <select
                value={formData.navPlacement}
                onChange={(e) => setFormData({ ...formData, navPlacement: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12241f] border border-white/15 text-white"
              >
                <option value="header">Include in Header Navigation</option>
                <option value="footer">Include in Footer</option>
                <option value="none">Direct Link Only (Unlisted)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Publishing Status</label>
              <select
                value={formData.isPublished ? 'published' : 'draft'}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.value === 'published' })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12241f] border border-white/15 text-white"
              >
                <option value="published">Published (Live to Public)</option>
                <option value="draft">Draft (Admin Only)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Sort Order</label>
              <input
                type="number"
                value={formData.order || 1}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white"
              />
            </div>
          </div>

          {/* SEO Metadata */}
          <div className="p-4 rounded-2xl bg-black/20 border border-white/10 space-y-3">
            <span className="font-bold text-[#fae7b5] block">SEO & Social Meta Tags</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400">Meta Title Tag</label>
                <input
                  type="text"
                  value={formData.metaTitle || ''}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="Appears in Google Search & Tab Title"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400">Meta Description</label>
                <input
                  type="text"
                  value={formData.metaDescription || ''}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="150-160 characters summary for search engines"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                />
              </div>
            </div>
          </div>

          {/* Blocks Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#fae7b5] text-sm">Content Sections & Blocks</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => addBlock('text')}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#d9bf8c] font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Text Block
                </button>
                <button
                  type="button"
                  onClick={() => addBlock('features')}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#d9bf8c] font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Features
                </button>
                <button
                  type="button"
                  onClick={() => addBlock('cta')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#b58b4a]/20 hover:bg-[#b58b4a]/30 text-[#fae7b5] font-semibold flex items-center gap-1 border border-[#b58b4a]/40"
                >
                  <Plus className="w-3.5 h-3.5" /> Call to Action
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {formData.blocks?.map((block: PageBlock, idx: number) => (
                <div key={block.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider text-[#d9bf8c] text-[10px]">
                      Block #{idx + 1} — {block.type.toUpperCase()}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeBlock(idx)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={block.title || ''}
                    onChange={(e) => updateBlock(idx, { title: e.target.value })}
                    placeholder="Block Title"
                    className="w-full px-3 py-2 rounded-xl bg-black/20 border border-white/10 text-white font-semibold"
                  />

                  <textarea
                    rows={3}
                    value={block.content || ''}
                    onChange={(e) => updateBlock(idx, { content: e.target.value })}
                    placeholder="Block content body..."
                    className="w-full px-3 py-2 rounded-xl bg-black/20 border border-white/10 text-white leading-relaxed"
                  />

                  {block.type === 'cta' && (
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <input
                        type="text"
                        value={block.buttonText || ''}
                        onChange={(e) => updateBlock(idx, { buttonText: e.target.value })}
                        placeholder="Button Text"
                        className="px-3 py-2 rounded-xl bg-black/20 border border-white/10 text-white"
                      />
                      <input
                        type="text"
                        value={block.buttonLink || ''}
                        onChange={(e) => updateBlock(idx, { buttonLink: e.target.value })}
                        placeholder="Button Link (/buy, etc.)"
                        className="px-3 py-2 rounded-xl bg-black/20 border border-white/10 text-white"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-bold shadow-lg hover:opacity-95"
            >
              {saving ? 'Saving...' : page ? 'Update Page' : 'Create & Publish Page'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
