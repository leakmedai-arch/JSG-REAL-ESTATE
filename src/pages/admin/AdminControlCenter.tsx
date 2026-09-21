"use client"
import React, { useState, useEffect } from 'react';
import { 
  Building2, LayoutDashboard, Navigation, Image as ImageIcon, 
  Users, Home, MapPin, Globe, Plus, Trash2, Edit, Save, X, LogOut, CheckCircle2, ShieldCheck, Layers, Video, FileText, Sparkles 
} from 'lucide-react';

const MENU_ITEMS = [
  { id: 'jsg_header', label: '1. Header & Logo', icon: Globe },
  { id: 'jsg_nav_pages', label: '2. Navigation Menu', icon: Navigation },
  { id: 'jsg_hero_slider', label: '3. Hero Slider', icon: ImageIcon },
  { id: 'jsg_scroll_video', label: '4. Scroll Down Video', icon: Video },
  { id: 'jsg_founders', label: '5. Founders Section', icon: Users },
  { id: 'jsg_listings', label: '6. Listings / Properties', icon: Home },
  { id: 'jsg_buildings', label: '7. Buildings', icon: Building2 },
  { id: 'jsg_communities', label: '8. Communities', icon: MapPin },
  { id: 'jsg_footer', label: '9. Footer Control', icon: Layers },
];

export function AdminControlCenter() {
  const [activeTab, setActiveTab] = useState('jsg_header');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Sub-galleries for founders and listings
  const [selectedFounderId, setSelectedFounderId] = useState<string | null>(null);
  const [founderGalleryItems, setFounderGalleryItems] = useState<any[]>([]);
  const [founderGalleryForm, setFounderGalleryForm] = useState<any>({});

  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [listingGalleryItems, setListingGalleryItems] = useState<any[]>([]);
  const [listingGalleryUploading, setListingGalleryUploading] = useState(false);

  const fetchTableData = async (table: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/${table}`);
      if (!res.ok) throw new Error(`Failed to fetch ${table}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
      } else if (data && typeof data === 'object') {
        setItems([data]);
      } else {
        setItems([]);
      }
    } catch (err: any) {
      setError(err.message || 'Error loading data from Supabase/Local');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData(activeTab);
    setForm({});
    setEditingId(null);
    setSelectedFounderId(null);
    setSelectedListingId(null);
  }, [activeTab]);

  // Fetch founder slider gallery when selectedFounderId changes
  useEffect(() => {
    if (activeTab === 'jsg_founders' && selectedFounderId) {
      fetch(`/api/admin/jsg_founder_slider`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setFounderGalleryItems(data.filter((i: any) => i.founder_id === selectedFounderId));
          }
        })
        .catch(() => setFounderGalleryItems([]));
    }
  }, [selectedFounderId, activeTab]);

  // Fetch listing gallery when selectedListingId changes
  useEffect(() => {
    if (activeTab === 'jsg_listings' && selectedListingId) {
      fetch(`/api/admin/jsg_listing_images`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setListingGalleryItems(data.filter((i: any) => i.listing_id === selectedListingId));
          }
        })
        .catch(() => setListingGalleryItems([]));
    }
  }, [selectedListingId, activeTab]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName = 'image_url') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', activeTab);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success && data.url) {
        setForm((prev: any) => ({ ...prev, [fieldName]: data.url }));
        setSuccessMessage('File uploaded successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('File upload error');
    } finally {
      setUploading(false);
    }
  };

  const handleBulkListingGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !selectedListingId) return;
    setListingGalleryUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', 'listing-gallery');
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.success && data.url) {
          await fetch('/api/admin/jsg_listing_images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listing_id: selectedListingId, image_url: data.url, order_num: listingGalleryItems.length + i + 1 })
          });
        }
      }
      // Refresh listing gallery
      const res = await fetch('/api/admin/jsg_listing_images');
      const data = await res.json();
      if (Array.isArray(data)) {
        setListingGalleryItems(data.filter((i: any) => i.listing_id === selectedListingId));
      }
      setSuccessMessage('Gallery photos uploaded successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Bulk upload failed');
    } finally {
      setListingGalleryUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = editingId ? { ...form, id: editingId } : form;
    try {
      const res = await fetch(`/api/admin/${activeTab}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage('Saved successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        setForm({});
        setEditingId(null);
        fetchTableData(activeTab);
      } else {
        alert(data.error || 'Save failed');
      }
    } catch (err) {
      alert('Save request failed');
    }
  };

  const handleDelete = async (id: string, customTable?: string) => {
    const targetTable = customTable || activeTab;
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch(`/api/admin/${targetTable}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        if (customTable === 'jsg_listing_images') {
          setListingGalleryItems(prev => prev.filter(i => i.id !== id));
        } else if (customTable === 'jsg_founder_slider') {
          setFounderGalleryItems(prev => prev.filter(i => i.id !== id));
        } else {
          fetchTableData(activeTab);
        }
        setSuccessMessage('Deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert(data.error || 'Delete failed');
      }
    } catch (err) {
      alert('Delete request failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#07110e] text-white flex flex-col md:flex-row font-sans">
      {/* Left Sidebar */}
      <aside className="w-full md:w-80 bg-[#0a1814] border-r border-[#c5a059]/20 flex flex-col shrink-0">
        <div className="p-6 border-b border-[#c5a059]/20 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tight text-[#fbfaf7] font-serif-display">JSG ADMIN</h1>
            <p className="text-[11px] text-[#c5a059] tracking-widest uppercase font-mono">Real Website Control Panel</p>
          </div>
          <span className="px-2 py-1 bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 rounded text-[10px] font-mono">LIVE</span>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto flex-1">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSelectedFounderId(null);
                  setSelectedListingId(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-black shadow-lg font-bold' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#c5a059]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#c5a059]/20 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
            <span>Role: Super Admin</span>
          </div>
          <a href="/" className="text-[#c5a059] hover:underline flex items-center gap-1 font-mono text-[11px]">
            View Site →
          </a>
        </div>
      </aside>

      {/* Right Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-gradient-to-br from-[#07110e] via-[#0b1c18] to-[#050d0a]">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 mb-8 border-b border-[#c5a059]/20 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-[#fbfaf7] font-serif-display">
              {MENU_ITEMS.find(m => m.id === activeTab)?.label}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Fully connected to live database & storage. Changes reflect instantly on the website.
            </p>
          </div>
          {successMessage && (
            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-2 rounded-xl text-xs font-semibold animate-pulse">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMessage}</span>
            </div>
          )}
        </header>

        {/* Form Card */}
        <div className="bg-[#0e221d] border border-[#c5a059]/30 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold tracking-wider text-[#c5a059] uppercase font-mono">
              {editingId ? 'Edit Record' : 'Add New Record'}
            </h3>
            {uploading && <span className="text-xs text-[#c5a059] animate-pulse font-mono">Uploading file to storage...</span>}
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTab === 'jsg_header' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={form.company_name || ''}
                    onChange={e => setForm({ ...form, company_name: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={form.tagline || ''}
                    onChange={e => setForm({ ...form, tagline: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Logo URL / Upload</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.logo_url || ''}
                      onChange={e => setForm({ ...form, logo_url: e.target.value })}
                      className="flex-1 bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                    <input type="file" onChange={e => handleFileUpload(e, 'logo_url')} className="hidden" id="logo-upload" />
                    <label htmlFor="logo-upload" className="px-4 py-2.5 bg-[#c5a059] text-black font-bold text-xs rounded-xl cursor-pointer hover:bg-yellow-500 flex items-center justify-center shrink-0">
                      Upload
                    </label>
                  </div>
                  {form.logo_url && <img src={form.logo_url} alt="Logo" className="h-12 mt-2 object-contain rounded bg-black/50 p-1 border border-slate-700" />}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Logo Color</label>
                    <input
                      type="color"
                      value={form.logo_color || '#ffffff'}
                      onChange={e => setForm({ ...form, logo_color: e.target.value })}
                      className="w-full h-10 bg-black/40 border border-slate-700 rounded-xl cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Tagline Color</label>
                    <input
                      type="color"
                      value={form.tagline_color || '#d9bf8c'}
                      onChange={e => setForm({ ...form, tagline_color: e.target.value })}
                      className="w-full h-10 bg-black/40 border border-slate-700 rounded-xl cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Background Color</label>
                    <input
                      type="color"
                      value={form.background_color || '#0d1e1a'}
                      onChange={e => setForm({ ...form, background_color: e.target.value })}
                      className="w-full h-10 bg-black/40 border border-slate-700 rounded-xl cursor-pointer"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'jsg_nav_pages' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Page Name</label>
                  <input
                    type="text"
                    value={form.name || ''}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    placeholder="Buy / Rent / Areas"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Link URL</label>
                  <input
                    type="text"
                    value={form.link || ''}
                    onChange={e => setForm({ ...form, link: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    placeholder="/buy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Order Number</label>
                  <input
                    type="number"
                    value={form.order_num || 0}
                    onChange={e => setForm({ ...form, order_num: parseInt(e.target.value) || 0 })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="active-toggle"
                    checked={form.active !== false}
                    onChange={e => setForm({ ...form, active: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-700 text-[#c5a059] focus:ring-0"
                  />
                  <label htmlFor="active-toggle" className="text-xs font-semibold text-slate-300">Active (Visible in navbar)</label>
                </div>
              </>
            )}

            {activeTab === 'jsg_hero_slider' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Slide Title / Line 1</label>
                  <input
                    type="text"
                    value={form.title || ''}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    placeholder="The Pinnacle of Dubai Luxury"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={form.subtitle || ''}
                    onChange={e => setForm({ ...form, subtitle: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    placeholder="Exclusive Waterfront Estates"
                  />
                </div>
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Background Image URL / Upload</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={form.image_url || ''}
                        onChange={e => setForm({ ...form, image_url: e.target.value })}
                        className="flex-1 bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                      />
                      <input type="file" onChange={e => handleFileUpload(e, 'image_url')} className="hidden" id="hero-img-upload" />
                      <label htmlFor="hero-img-upload" className="px-4 py-2.5 bg-[#c5a059] text-black font-bold text-xs rounded-xl cursor-pointer hover:bg-yellow-500 flex items-center justify-center shrink-0">
                        Upload Photo
                      </label>
                    </div>
                    {form.image_url && <img src={form.image_url} alt="Hero" className="h-20 mt-2 object-cover rounded-xl border border-slate-700" />}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Background Video URL / Upload (MP4)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={form.video_url || ''}
                        onChange={e => setForm({ ...form, video_url: e.target.value })}
                        className="flex-1 bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                      />
                      <input type="file" accept="video/mp4" onChange={e => handleFileUpload(e, 'video_url')} className="hidden" id="hero-vid-upload" />
                      <label htmlFor="hero-vid-upload" className="px-4 py-2.5 bg-[#c5a059] text-black font-bold text-xs rounded-xl cursor-pointer hover:bg-yellow-500 flex items-center justify-center shrink-0">
                        Upload Video
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">CTA 1 Text & Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.cta1_text || ''}
                      onChange={e => setForm({ ...form, cta1_text: e.target.value })}
                      placeholder="Explore Properties"
                      className="flex-1 bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                    <input
                      type="text"
                      value={form.cta1_link || ''}
                      onChange={e => setForm({ ...form, cta1_link: e.target.value })}
                      placeholder="/buy"
                      className="w-28 bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Order Number</label>
                  <input
                    type="number"
                    value={form.order_num || 1}
                    onChange={e => setForm({ ...form, order_num: parseInt(e.target.value) || 1 })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </>
            )}

            {activeTab === 'jsg_scroll_video' && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Scroll Down Video URL / Upload (MP4)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.video_url || ''}
                      onChange={e => setForm({ ...form, video_url: e.target.value })}
                      className="flex-1 bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                    <input type="file" accept="video/mp4" onChange={e => handleFileUpload(e, 'video_url')} className="hidden" id="scroll-vid-upload" />
                    <label htmlFor="scroll-vid-upload" className="px-4 py-2.5 bg-[#c5a059] text-black font-bold text-xs rounded-xl cursor-pointer hover:bg-yellow-500 flex items-center justify-center shrink-0">
                      Upload MP4 Video
                    </label>
                  </div>
                  {form.video_url && (
                    <video src={form.video_url} controls className="h-32 mt-3 rounded-xl border border-slate-700" />
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Overlay Heading / Text</label>
                  <input
                    type="text"
                    value={form.overlay_text || ''}
                    onChange={e => setForm({ ...form, overlay_text: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    placeholder="The Art of Extraordinary Living in Dubai"
                  />
                </div>
              </>
            )}

            {activeTab === 'jsg_founders' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Founder Name</label>
                  <input
                    type="text"
                    value={form.name || ''}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    placeholder="Jasmeet Singh Gulati"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Designation</label>
                  <input
                    type="text"
                    value={form.designation || ''}
                    onChange={e => setForm({ ...form, designation: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    placeholder="Founder & Principal"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Founder Photo</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.image_url || ''}
                      onChange={e => setForm({ ...form, image_url: e.target.value })}
                      className="flex-1 bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                    <input type="file" onChange={e => handleFileUpload(e, 'image_url')} className="hidden" id="founder-photo-upload" />
                    <label htmlFor="founder-photo-upload" className="px-4 py-2.5 bg-[#c5a059] text-black font-bold text-xs rounded-xl cursor-pointer hover:bg-yellow-500 flex items-center justify-center shrink-0">
                      Upload
                    </label>
                  </div>
                  {form.image_url && <img src={form.image_url} alt="Founder" className="h-24 mt-2 object-cover rounded-xl border border-slate-700" />}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Bio / Statement</label>
                  <textarea
                    rows={4}
                    value={form.bio || ''}
                    onChange={e => setForm({ ...form, bio: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={form.linkedin || ''}
                    onChange={e => setForm({ ...form, linkedin: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Order Number</label>
                  <input
                    type="number"
                    value={form.order_num || 1}
                    onChange={e => setForm({ ...form, order_num: parseInt(e.target.value) || 1 })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </>
            )}

            {activeTab === 'jsg_listings' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Property Title</label>
                  <input
                    type="text"
                    value={form.title || ''}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    placeholder="Palace Beach Residence"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location / Area</label>
                  <input
                    type="text"
                    value={form.location || ''}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    placeholder="Emaar Beachfront"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Price</label>
                  <input
                    type="text"
                    value={form.price || ''}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    placeholder="AED 14,500,000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Type</label>
                  <select
                    value={form.type || 'Sale'}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  >
                    <option value="Sale">Sale</option>
                    <option value="Rent">Rent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Beds</label>
                  <input
                    type="text"
                    value={form.beds || ''}
                    onChange={e => setForm({ ...form, beds: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    placeholder="4 Beds"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Baths & Sqft</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={form.baths || ''}
                      onChange={e => setForm({ ...form, baths: e.target.value })}
                      placeholder="5 Baths"
                      className="bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                    <input
                      type="text"
                      value={form.sqft || ''}
                      onChange={e => setForm({ ...form, sqft: e.target.value })}
                      placeholder="4,200 sqft"
                      className="bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Main Cover Image URL / Upload</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.image_url || ''}
                      onChange={e => setForm({ ...form, image_url: e.target.value })}
                      className="flex-1 bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                    <input type="file" onChange={e => handleFileUpload(e, 'image_url')} className="hidden" id="listing-cover-upload" />
                    <label htmlFor="listing-cover-upload" className="px-4 py-2.5 bg-[#c5a059] text-black font-bold text-xs rounded-xl cursor-pointer hover:bg-yellow-500 flex items-center justify-center shrink-0">
                      Upload
                    </label>
                  </div>
                  {form.image_url && <img src={form.image_url} alt="Listing" className="h-24 mt-2 object-cover rounded-xl border border-slate-700" />}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={4}
                    value={form.description || ''}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </>
            )}

            {activeTab === 'jsg_buildings' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Building Name</label>
                  <input
                    type="text"
                    value={form.name || ''}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    placeholder="Burj Crown"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={form.location || ''}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    placeholder="Downtown Dubai"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Building Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.image_url || ''}
                      onChange={e => setForm({ ...form, image_url: e.target.value })}
                      className="flex-1 bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                    <input type="file" onChange={e => handleFileUpload(e, 'image_url')} className="hidden" id="building-upload" />
                    <label htmlFor="building-upload" className="px-4 py-2.5 bg-[#c5a059] text-black font-bold text-xs rounded-xl cursor-pointer hover:bg-yellow-500 flex items-center justify-center shrink-0">
                      Upload
                    </label>
                  </div>
                  {form.image_url && <img src={form.image_url} alt="Building" className="h-24 mt-2 object-cover rounded-xl border border-slate-700" />}
                </div>
              </>
            )}

            {activeTab === 'jsg_communities' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Community Name</label>
                  <input
                    type="text"
                    value={form.name || ''}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    placeholder="Palm Jumeirah"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Order Number</label>
                  <input
                    type="number"
                    value={form.order_num || 1}
                    onChange={e => setForm({ ...form, order_num: parseInt(e.target.value) || 1 })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Community Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.image_url || ''}
                      onChange={e => setForm({ ...form, image_url: e.target.value })}
                      className="flex-1 bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                    <input type="file" onChange={e => handleFileUpload(e, 'image_url')} className="hidden" id="community-upload" />
                    <label htmlFor="community-upload" className="px-4 py-2.5 bg-[#c5a059] text-black font-bold text-xs rounded-xl cursor-pointer hover:bg-yellow-500 flex items-center justify-center shrink-0">
                      Upload
                    </label>
                  </div>
                  {form.image_url && <img src={form.image_url} alt="Community" className="h-24 mt-2 object-cover rounded-xl border border-slate-700" />}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={form.description || ''}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </>
            )}

            {activeTab === 'jsg_footer' && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Address</label>
                  <textarea
                    rows={2}
                    value={form.address || ''}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={form.phone || ''}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                  <input
                    type="text"
                    value={form.email || ''}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">About Company Text</label>
                  <textarea
                    rows={3}
                    value={form.about || ''}
                    onChange={e => setForm({ ...form, about: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Copyright Text</label>
                  <input
                    type="text"
                    value={form.copyright_text || ''}
                    onChange={e => setForm({ ...form, copyright_text: e.target.value })}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </>
            )}

            <div className="md:col-span-2 flex items-center gap-4 pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-black font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{editingId ? 'Update Record' : 'Save New Record'}</span>
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setForm({}); }}
                  className="px-6 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-700 transition-all"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Sub-Gallery Manager for Founders (Founder Slider Images) */}
        {activeTab === 'jsg_founders' && selectedFounderId && (
          <div className="bg-[#0e221d] border border-[#c5a059]/40 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold tracking-wider text-[#c5a059] uppercase font-mono">
                  Founder Slider Sub-Gallery Manager
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage multiple slider photos for this founder card.
                </p>
              </div>
              <button
                onClick={() => setSelectedFounderId(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
              >
                Close Gallery
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Add Photo to Gallery</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={founderGalleryForm.image_url || ''}
                    onChange={e => setFounderGalleryForm({ ...founderGalleryForm, image_url: e.target.value })}
                    placeholder="Image URL..."
                    className="flex-1 bg-black/40 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <input type="file" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const fd = new FormData();
                    fd.append('file', file);
                    fd.append('folder', 'founder-gallery');
                    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
                    const data = await res.json();
                    if (data.success) {
                      setFounderGalleryForm({ ...founderGalleryForm, image_url: data.url });
                    }
                  }} className="hidden" id="fg-upload" />
                  <label htmlFor="fg-upload" className="px-3 py-2 bg-[#c5a059] text-black font-bold text-xs rounded-xl cursor-pointer hover:bg-yellow-500 shrink-0 flex items-center">
                    Upload
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Caption</label>
                <input
                  type="text"
                  value={founderGalleryForm.caption || ''}
                  onChange={e => setFounderGalleryForm({ ...founderGalleryForm, caption: e.target.value })}
                  placeholder="Private advisory meeting..."
                  className="w-full bg-black/40 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={async () => {
                    if (!founderGalleryForm.image_url) return;
                    await fetch('/api/admin/jsg_founder_slider', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ ...founderGalleryForm, founder_id: selectedFounderId })
                    });
                    setFounderGalleryForm({});
                    const res = await fetch('/api/admin/jsg_founder_slider');
                    const data = await res.json();
                    if (Array.isArray(data)) {
                      setFounderGalleryItems(data.filter((i: any) => i.founder_id === selectedFounderId));
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#c5a059] text-black font-bold text-xs uppercase"
                >
                  Add Photo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {founderGalleryItems.map((img) => (
                <div key={img.id} className="relative group bg-black/40 rounded-xl border border-slate-800 p-2">
                  <img src={img.image_url} alt="Gallery" className="w-full h-28 object-cover rounded-lg" />
                  <p className="text-[11px] text-slate-300 mt-1 truncate">{img.caption || 'No caption'}</p>
                  <button
                    onClick={() => handleDelete(img.id, 'jsg_founder_slider')}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sub-Gallery Manager for Listings (Listing Gallery Images) */}
        {activeTab === 'jsg_listings' && selectedListingId && (
          <div className="bg-[#0e221d] border border-[#c5a059]/40 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold tracking-wider text-[#c5a059] uppercase font-mono">
                  Property Photo Gallery Manager (Bulk Upload)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Upload multiple high-resolution photos for this listing's gallery slider.
                </p>
              </div>
              <button
                onClick={() => setSelectedListingId(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
              >
                Close Gallery
              </button>
            </div>

            <div className="mb-6 flex items-center gap-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleBulkListingGalleryUpload}
                className="hidden"
                id="bulk-listing-upload"
              />
              <label
                htmlFor="bulk-listing-upload"
                className="px-6 py-3 rounded-xl bg-[#c5a059] text-black font-bold text-xs uppercase cursor-pointer hover:bg-yellow-500 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Multiple Photos ({listingGalleryUploading ? 'Uploading...' : 'Bulk'})</span>
              </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {listingGalleryItems.map((img) => (
                <div key={img.id} className="relative group bg-black/40 rounded-xl border border-slate-800 p-2">
                  <img src={img.image_url} alt="Listing Gallery" className="w-full h-32 object-cover rounded-lg" />
                  <button
                    onClick={() => handleDelete(img.id, 'jsg_listing_images')}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing Records Table / List */}
        <div className="bg-[#0e221d] border border-[#c5a059]/30 rounded-2xl p-6 md:p-8 shadow-2xl">
          <h3 className="text-sm font-bold tracking-wider text-[#c5a059] uppercase mb-6 font-mono">
            Existing Records ({items.length})
          </h3>

          {loading ? (
            <div className="py-12 text-center text-slate-400 font-mono animate-pulse">
              Loading records from live database...
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-400 font-mono">
              Error: {error}
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono">
              No records found. Add your first record above.
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl bg-black/40 border border-slate-800 gap-4 hover:border-[#c5a059]/40 transition-all"
                >
                  <div className="flex items-center gap-4">
                    {(item.image_url || item.logo_url) ? (
                      <img
                        src={item.image_url || item.logo_url}
                        alt="Thumbnail"
                        className="w-14 h-14 object-cover rounded-lg border border-slate-700 shrink-0"
                      />
                    ) : item.video_url ? (
                      <video src={item.video_url} className="w-14 h-14 object-cover rounded-lg border border-slate-700 shrink-0" />
                    ) : (
                      <div className="w-14 h-14 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 font-mono text-xs">
                        JSG
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {item.title || item.name || item.company_name || item.overlay_text || `Record #${item.id?.slice(0, 6)}`}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {item.location || item.subtitle || item.tagline || item.designation || item.link || item.email || item.address || ''}
                      </p>
                      {item.price && <span className="inline-block mt-1 text-xs font-mono text-[#c5a059] font-bold">{item.price}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    {activeTab === 'jsg_founders' && (
                      <button
                        onClick={() => setSelectedFounderId(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Slider Photos</span>
                      </button>
                    )}

                    {activeTab === 'jsg_listings' && (
                      <button
                        onClick={() => setSelectedListingId(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Photo Gallery</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setForm(item);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
