import React, { useState } from 'react';
import { 
  Menu, 
  Plus, 
  Trash2, 
  Save, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink, 
  FileText, 
  Layers, 
  Check, 
  Eye, 
  EyeOff, 
  Globe,
  ChevronRight,
  FolderPlus
} from 'lucide-react';

interface NavigationEditorProps {
  settings: any;
  setSettings: React.Dispatch<React.SetStateAction<any>>;
  pages: any[];
  onSave: () => void;
  onSavePage: (pageData: any) => Promise<void>;
  onDeletePage: (id: string) => Promise<void>;
  showNotification: (msg: string) => void;
}

export const NavigationEditor: React.FC<NavigationEditorProps> = ({
  settings,
  setSettings,
  pages,
  onSave,
  onSavePage,
  onDeletePage,
  showNotification
}) => {
  const defaultNavItems = [
    { id: 'buy', label: 'Buy', path: '/buy', order: 1, isVisible: true, hasDropdown: true },
    { id: 'rent', label: 'Rent', path: '/rent', order: 2, isVisible: true, hasDropdown: true },
    { id: 'sell', label: 'Sell', path: '/sell', order: 3, isVisible: true, hasDropdown: false },
    { id: 'new-projects', label: 'New Projects', path: '/new-projects', order: 4, isVisible: true, hasDropdown: true },
    { id: 'mortgage-calc', label: 'Mortgage Calculator', path: '/mortgage-calculator', order: 5, isVisible: true, hasDropdown: false },
    { id: 'rent-vs-buy', label: 'Rent vs Buy', path: '/rent-vs-buy', order: 6, isVisible: true, hasDropdown: false },
    { id: 'areas', label: 'Areas', path: '/areas', order: 7, isVisible: true, hasDropdown: true },
    { id: 'live-showcase', label: 'Live Showcase', path: '/live-showcase', order: 8, isVisible: true, hasDropdown: false }
  ];

  const currentNav = settings.navItems && settings.navItems.length > 0 
    ? settings.navItems 
    : defaultNavItems;

  const [newLabel, setNewLabel] = useState('');
  const [newPath, setNewPath] = useState('');
  const [newHasDropdown, setNewHasDropdown] = useState(false);

  // Subpage Modal / Form State
  const [editingSubpage, setEditingSubpage] = useState<any | null>(null);
  const [showSubpageModal, setShowSubpageModal] = useState(false);

  const handleAddNavItem = () => {
    if (!newLabel.trim() || !newPath.trim()) {
      alert('Please provide a menu label and route link (e.g. /private-office).');
      return;
    }

    const newItem = {
      id: `nav-${Date.now()}`,
      label: newLabel.trim(),
      path: newPath.trim(),
      order: currentNav.length + 1,
      isVisible: true,
      hasDropdown: newHasDropdown
    };

    setSettings({
      ...settings,
      navItems: [...currentNav, newItem]
    });

    setNewLabel('');
    setNewPath('');
    setNewHasDropdown(false);
    showNotification('Menu item added to header navigation.');
  };

  const handleUpdateItem = (id: string, field: string, value: any) => {
    setSettings({
      ...settings,
      navItems: currentNav.map((item: any) => 
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === currentNav.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...currentNav];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // re-index orders
    const reordered = updated.map((item, idx) => ({ ...item, order: idx + 1 }));
    setSettings({
      ...settings,
      navItems: reordered
    });
  };

  const handleDeleteItem = (id: string) => {
    setSettings({
      ...settings,
      navItems: currentNav.filter((item: any) => item.id !== id)
    });
    showNotification('Navigation link removed.');
  };

  const handleOpenNewSubpage = () => {
    setEditingSubpage({
      title: '',
      slug: '',
      metaTitle: '',
      metaDescription: '',
      isPublished: true,
      heroHeadline: '',
      heroSubtitle: '',
      content: ''
    });
    setShowSubpageModal(true);
  };

  const handleSaveSubpageForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubpage.title || !editingSubpage.slug) {
      alert('Title and URL slug are required');
      return;
    }

    const cleanSlug = editingSubpage.slug.startsWith('/') ? editingSubpage.slug : `/${editingSubpage.slug}`;
    await onSavePage({
      ...editingSubpage,
      slug: cleanSlug
    });
    setShowSubpageModal(false);
    setEditingSubpage(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in text-xs">
      {/* Header & Central Save */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#b58b4a]/20 text-[#d9bf8c] font-bold text-[10px] uppercase tracking-wider">
              Priority 2
            </span>
            <h1 className="text-2xl font-black text-white">Navigation & Menu Architecture</h1>
          </div>
          <p className="text-xs text-[#d9bf8c] mt-1">
            Edit every menu name, path, sequence order, dropdown states, and live subpages.
          </p>
        </div>
        <button
          type="button"
          onClick={onSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-bold shadow-lg hover:opacity-95 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Navigation to Live Site</span>
        </button>
      </div>

      {/* 1. Primary Menu Items Editor */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#fae7b5] flex items-center gap-2">
            <Menu className="w-4 h-4 text-[#b58b4a]" />
            <span>Primary Header Menu Links & Order</span>
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">{currentNav.length} active links</span>
        </div>

        <div className="space-y-2">
          {currentNav.map((item: any, idx: number) => (
            <div 
              key={item.id || idx}
              className="p-3.5 rounded-2xl bg-black/30 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#b58b4a]/30 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                {/* Order Up/Down buttons */}
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveItem(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 rounded bg-white/5 hover:bg-white/15 text-slate-300 disabled:opacity-20 cursor-pointer"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveItem(idx, 'down')}
                    disabled={idx === currentNav.length - 1}
                    className="p-1 rounded bg-white/5 hover:bg-white/15 text-slate-300 disabled:opacity-20 cursor-pointer"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Label</label>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleUpdateItem(item.id, 'label', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-xs focus:outline-none focus:border-[#b58b4a]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Target Route Link</label>
                    <input
                      type="text"
                      value={item.path}
                      onChange={(e) => handleUpdateItem(item.id, 'path', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[#d9bf8c] font-mono text-[11px] focus:outline-none focus:border-[#b58b4a]"
                    />
                  </div>
                </div>
              </div>

              {/* Status & Delete */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleUpdateItem(item.id, 'isVisible', item.isVisible === false ? true : false)}
                  className={`p-2 rounded-xl border flex items-center gap-1 cursor-pointer transition-colors ${
                    item.isVisible !== false 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                  title={item.isVisible !== false ? 'Visible on Website' : 'Hidden from Navigation'}
                >
                  {item.isVisible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span className="text-[10px] font-bold">{item.isVisible !== false ? 'Active' : 'Hidden'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 cursor-pointer"
                  title="Remove this navigation link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Menu Link Form */}
        <div className="p-4 rounded-2xl bg-black/40 border border-[#b58b4a]/20 space-y-3">
          <span className="text-xs font-bold text-[#d9bf8c] block">Add New Navigation Link</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Private Office"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#b58b4a]"
              />
            </div>
            <div>
              <input
                type="text"
                value={newPath}
                onChange={(e) => setNewPath(e.target.value)}
                placeholder="e.g. /private-office"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 font-mono focus:outline-none focus:border-[#b58b4a]"
              />
            </div>
            <button
              type="button"
              onClick={handleAddNavItem}
              className="py-2 px-4 rounded-xl bg-[#b58b4a] hover:bg-[#c5a059] text-[#142621] font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Navigation</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Subpages & Dynamic Custom Pages */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#fae7b5] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#b58b4a]" />
              <span>Custom Website Subpages</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Manage custom URLs and editorial landing pages rendered seamlessly by the live router.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenNewSubpage}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-2 cursor-pointer border border-white/10"
          >
            <Plus className="w-4 h-4 text-[#b58b4a]" />
            <span>Create New Subpage</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pages && pages.length > 0 ? (
            pages.map((p) => (
              <div 
                key={p.id}
                className="p-4 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-between gap-3 hover:border-[#b58b4a]/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{p.title}</span>
                    <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold ${
                      p.isPublished ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {p.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#d9bf8c] block">{p.slug}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSubpage(p);
                      setShowSubpageModal(true);
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeletePage(p.id)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 p-8 text-center rounded-2xl bg-black/20 border border-dashed border-white/10 text-slate-400">
              No custom subpages yet. Click &quot;Create New Subpage&quot; to build dedicated landing pages.
            </div>
          )}
        </div>
      </div>

      {/* Subpage Modal */}
      {showSubpageModal && editingSubpage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#142e27] border border-[#b58b4a]/40 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              {editingSubpage.id ? 'Edit Subpage' : 'Create New Subpage'}
            </h3>
            <form onSubmit={handleSaveSubpageForm} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Page Title</label>
                <input
                  type="text"
                  required
                  value={editingSubpage.title}
                  onChange={(e) => setEditingSubpage({ ...editingSubpage, title: e.target.value })}
                  placeholder="e.g. VIP Private Client Services"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">URL Route Slug</label>
                <input
                  type="text"
                  required
                  value={editingSubpage.slug}
                  onChange={(e) => setEditingSubpage({ ...editingSubpage, slug: e.target.value })}
                  placeholder="e.g. /vip-services"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#b58b4a]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Hero Subheading</label>
                <input
                  type="text"
                  value={editingSubpage.heroSubtitle || ''}
                  onChange={(e) => setEditingSubpage({ ...editingSubpage, heroSubtitle: e.target.value })}
                  placeholder="Bespoke luxury advisory for institutional acquisitions..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Editorial Content (Markdown or Text)</label>
                <textarea
                  rows={4}
                  value={editingSubpage.content || ''}
                  onChange={(e) => setEditingSubpage({ ...editingSubpage, content: e.target.value })}
                  placeholder="Describe the services, process, or private portfolio details..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pub"
                  checked={editingSubpage.isPublished}
                  onChange={(e) => setEditingSubpage({ ...editingSubpage, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded text-[#b58b4a]"
                />
                <label htmlFor="pub" className="text-slate-200 font-medium cursor-pointer">
                  Publish page immediately to live website
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowSubpageModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#b58b4a] hover:bg-[#c5a059] text-[#142621] font-bold cursor-pointer"
                >
                  Save Subpage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
