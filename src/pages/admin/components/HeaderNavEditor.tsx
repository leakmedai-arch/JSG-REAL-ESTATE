import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Plus, 
  Trash2, 
  Save, 
  Image as ImageIcon, 
  RotateCcw,
  Check
} from 'lucide-react';
import { JSGLogo } from '../../../components/JSGLogo';

interface HeaderNavEditorProps {
  settings: any;
  setSettings: React.Dispatch<React.SetStateAction<any>>;
  onSave: () => void;
  showNotification: (msg: string) => void;
}

export const HeaderNavEditor: React.FC<HeaderNavEditorProps> = ({
  settings,
  setSettings,
  onSave,
  showNotification
}) => {
  const [newNavLabel, setNewNavLabel] = useState('');
  const [newNavPath, setNewNavPath] = useState('');

  const handleAddNavItem = () => {
    if (!newNavLabel.trim() || !newNavPath.trim()) return;
    const currentNav = settings.navItems || [
      { id: 'buy', label: 'Buy', path: '/buy' },
      { id: 'rent', label: 'Rent', path: '/rent' },
      { id: 'sell', label: 'Sell', path: '/sell' },
      { id: 'new-projects', label: 'New Projects', path: '/new-projects' },
      { id: 'mortgage-calc', label: 'Mortgage Calculator', path: '/mortgage-calculator' },
      { id: 'rent-vs-buy', label: 'Rent vs Buy', path: '/rent-vs-buy' },
      { id: 'areas', label: 'Areas', path: '/areas' }
    ];

    const newItem = {
      id: `nav-${Date.now()}`,
      label: newNavLabel.trim(),
      path: newNavPath.trim()
    };

    setSettings({
      ...settings,
      navItems: [...currentNav, newItem]
    });
    setNewNavLabel('');
    setNewNavPath('');
    showNotification('Navigation link added.');
  };

  const handleRemoveNavItem = (id: string) => {
    const currentNav = settings.navItems || [];
    setSettings({
      ...settings,
      navItems: currentNav.filter((item: any) => item.id !== id)
    });
    showNotification('Navigation link removed.');
  };

  const defaultNavItems = [
    { id: 'nav-buy', label: 'Buy', path: '/buy' },
    { id: 'nav-rent', label: 'Rent', path: '/rent' },
    { id: 'nav-sell', label: 'Sell', path: '/sell' },
    { id: 'nav-projects', label: 'New Projects', path: '/new-projects' },
    { id: 'nav-mortgage', label: 'Mortgage Calculator', path: '/mortgage-calculator' },
    { id: 'nav-rent-buy', label: 'Rent vs Buy', path: '/rent-vs-buy' },
    { id: 'nav-areas', label: 'Areas', path: '/areas' },
    { id: 'nav-showcase', label: 'Live Showcase', path: '/live-showcase' }
  ];

  const currentNavList = settings.navItems && settings.navItems.length > 0 
    ? settings.navItems 
    : defaultNavItems;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Header & Navigation Management</h1>
          <p className="text-xs text-[#d9bf8c]">
            Configure top announcement bar, official logo, contact routing, and navigation menus.
          </p>
        </div>
        <button
          type="button"
          onClick={onSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-bold shadow-lg hover:opacity-95 flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Header & Navigation</span>
        </button>
      </div>

      {/* 1. Official Logo Asset Status */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-[#fae7b5] flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[#b58b4a]" />
          <span>Official Brand Logo Asset</span>
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-black/20 border border-white/5">
          <div className="p-4 rounded-xl bg-[#0e241f] border border-[#b58b4a]/40 flex items-center justify-center">
            <JSGLogo size="md" theme="dark" showText={false} />
          </div>
          <div className="space-y-1.5 flex-1 text-center sm:text-left">
            <div className="font-bold text-white text-sm">Official High-Resolution Vector Asset</div>
            <div className="text-slate-400 text-[11px]">Source path: <code className="text-[#fae7b5]">/assets/jsg-logo.png</code></div>
            <div className="text-emerald-400 text-[11px] flex items-center gap-1 justify-center sm:justify-start">
              <Check className="w-3.5 h-3.5" /> Preserved across public header, footer, and admin console.
            </div>
          </div>
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => {
                setSettings({ ...settings, logoUrl: '/assets/jsg-logo.png' });
                showNotification('Reset to official JSG logo.');
              }}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#fae7b5] text-xs font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Bar & Branding Details */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-[#fae7b5] flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#b58b4a]" />
          <span>Brand Identity & Regulatory Badges</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Company / Brand Name</label>
            <input
              type="text"
              value={settings.siteName || 'JSG Real Estate'}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#b58b4a]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">RERA Broker Registration #</label>
            <input
              type="text"
              value={settings.reraLicense || '19284'}
              onChange={(e) => setSettings({ ...settings, reraLicense: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#b58b4a]"
            />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <label className="font-semibold text-slate-300">Brand Tagline</label>
            <input
              type="text"
              value={settings.tagline || 'Dubai Luxury Real Estate'}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#b58b4a]"
            />
          </div>
        </div>
      </div>

      {/* 3. Contact & Direct Lead Channels */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-[#fae7b5] flex items-center gap-2">
          <Phone className="w-4 h-4 text-[#b58b4a]" />
          <span>Direct Contact Numbers & Office Routing</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-[#b58b4a]" />
              <span>Primary Telephone</span>
            </label>
            <input
              type="text"
              value={settings.contact?.phone || '+971 4 320 2030'}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  contact: { ...settings.contact, phone: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-emerald-400" />
              <span>Direct WhatsApp Desk</span>
            </label>
            <input
              type="text"
              value={settings.contact?.whatsapp || '+971 50 123 4567'}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  contact: { ...settings.contact, whatsapp: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-[#b58b4a]" />
              <span>General Inquiries Email</span>
            </label>
            <input
              type="text"
              value={settings.contact?.email || 'info@jsgrealestate.ae'}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  contact: { ...settings.contact, email: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
            />
          </div>
          <div className="sm:col-span-3 space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-[#b58b4a]" />
              <span>Headquarters Physical Address</span>
            </label>
            <input
              type="text"
              value={settings.contact?.location || 'Downtown Dubai, UAE'}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  contact: { ...settings.contact, location: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
            />
          </div>
        </div>
      </div>

      {/* 4. Navigation Menu Builder */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#fae7b5] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#b58b4a]" />
            <span>Navigation Menu Items</span>
          </h2>
          <span className="text-slate-400 text-[11px]">{currentNavList.length} items configured</span>
        </div>

        <div className="divide-y divide-white/5 border border-white/10 rounded-2xl overflow-hidden bg-black/20">
          {currentNavList.map((item: any, idx: number) => (
            <div key={item.id || idx} className="p-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-slate-400 font-mono text-[10px]">
                  {idx + 1}
                </span>
                <div>
                  <div className="font-bold text-white">{item.label}</div>
                  <div className="text-slate-400 font-mono text-[11px]">{item.path}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveNavItem(item.id)}
                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-colors"
                title="Remove Navigation Link"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Link Form */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="Link Label (e.g. VIP Concierge)"
              value={newNavLabel}
              onChange={(e) => setNewNavLabel(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs"
            />
          </div>
          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="Target URL Path (e.g. /p/vip-services)"
              value={newNavPath}
              onChange={(e) => setNewNavPath(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs font-mono"
            />
          </div>
          <div>
            <button
              type="button"
              onClick={handleAddNavItem}
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#fae7b5] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Link</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
