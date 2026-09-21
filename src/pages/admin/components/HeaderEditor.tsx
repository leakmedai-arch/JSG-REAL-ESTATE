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
  Check,
  Sparkles,
  MessageCircle,
  Video,
  ShieldCheck,
  Upload
} from 'lucide-react';
import { JSGLogo } from '../../../components/JSGLogo';

interface HeaderEditorProps {
  settings: any;
  setSettings: React.Dispatch<React.SetStateAction<any>>;
  onSave: () => void;
  showNotification: (msg: string) => void;
}

export const HeaderEditor: React.FC<HeaderEditorProps> = ({
  settings,
  setSettings,
  onSave,
  showNotification
}) => {
  const header = settings?.header || {};
  const contact = settings?.contact || {};

  const handleUpdateContact = (field: string, value: string) => {
    setSettings({
      ...settings,
      contact: {
        ...contact,
        [field]: value
      }
    });
  };

  const handleUpdateHeader = (field: string, value: any) => {
    setSettings({
      ...settings,
      header: {
        ...header,
        [field]: value
      }
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch('/api/upload-logo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            base64Data: base64,
            mimeType: file.type
          })
        });
        const data = await res.json();
        if (res.ok && data.logoUrl) {
          setSettings({
            ...settings,
            logoUrl: data.logoUrl
          });
          showNotification('Official logo uploaded and applied to central database.');
        } else {
          // Fallback to data url
          setSettings({
            ...settings,
            logoUrl: base64
          });
          showNotification('Logo updated.');
        }
      } catch (err) {
        setSettings({
          ...settings,
          logoUrl: base64
        });
        showNotification('Logo applied.');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in text-xs">
      {/* Title & Central Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#b58b4a]/20 text-[#d9bf8c] font-bold text-[10px] uppercase tracking-wider">
              Priority 1
            </span>
            <h1 className="text-2xl font-black text-white">Header & Top Bar Control</h1>
          </div>
          <p className="text-xs text-[#d9bf8c] mt-1">
            Edit official logo, favicon, top announcement ticker, contact routing, phone, WhatsApp and action buttons.
          </p>
        </div>
        <button
          type="button"
          onClick={onSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-bold shadow-lg hover:opacity-95 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Header to Live Site</span>
        </button>
      </div>

      {/* 1. Official Logo & Favicon */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#fae7b5] flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#b58b4a]" />
            <span>Brand Logo & Favicon</span>
          </h2>
          {settings?.logoUrl && (
            <button
              type="button"
              onClick={() => {
                setSettings({ ...settings, logoUrl: '' });
                showNotification('Reset to official SVG logo vector.');
              }}
              className="text-[11px] text-amber-300/80 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Default Vector</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block font-semibold text-slate-200">Official Brand Logo</label>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/30 border border-white/5">
              <div className="w-24 h-14 rounded-xl bg-[#0e241f] flex items-center justify-center p-2 border border-[#b58b4a]/30 overflow-hidden shrink-0">
                {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                ) : (
                  <JSGLogo size="sm" showText={false} theme="dark" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={settings?.logoUrl || ''}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                  placeholder="https://... or /logo.png"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 font-mono text-[11px] focus:outline-none focus:border-[#b58b4a]"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-[11px] cursor-pointer transition-colors">
                  <Upload className="w-3 h-3 text-[#b58b4a]" />
                  <span>Upload Logo Image</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block font-semibold text-slate-200">Browser Favicon URL</label>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/30 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-[#0e241f] flex items-center justify-center p-2 border border-[#b58b4a]/30 shrink-0">
                {settings?.faviconUrl ? (
                  <img src={settings.faviconUrl} alt="Favicon" className="w-6 h-6 object-contain" />
                ) : (
                  <Building2 className="w-6 h-6 text-[#b58b4a]" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={settings?.faviconUrl || ''}
                  onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
                  placeholder="https://... or /favicon.ico"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 font-mono text-[11px] focus:outline-none focus:border-[#b58b4a]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Announcement Ticker Bar */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#fae7b5] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#b58b4a]" />
              <span>Top Announcement Ticker Bar</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Controls the infinite marquee ticker running along the top of the browser viewport.
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={header?.tickerActive !== false}
              onChange={(e) => handleUpdateHeader('tickerActive', e.target.checked)}
              className="w-4 h-4 rounded text-[#b58b4a] focus:ring-0"
            />
            <span className="text-xs font-semibold text-slate-200">Show Ticker</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">Headquarters Location Text</label>
            <input
              type="text"
              value={header?.tickerLocationText || contact?.location || 'Zainal Mohebi Plaza, Karama, Dubai'}
              onChange={(e) => handleUpdateHeader('tickerLocationText', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">Direct Phone Call Text</label>
            <input
              type="text"
              value={header?.tickerPhoneText || contact?.phone || '+971 4 320 2030'}
              onChange={(e) => handleUpdateHeader('tickerPhoneText', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">Live Agent Palace Call Tag</label>
            <input
              type="text"
              value={header?.tickerAgentCallText || 'See Property Before You Go (Real 4K Inspection)'}
              onChange={(e) => handleUpdateHeader('tickerAgentCallText', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">RERA Broker License Badge</label>
            <input
              type="text"
              value={header?.reraLicense || settings?.reraLicense || 'RERA Regulated Brokerage #19284'}
              onChange={(e) => {
                handleUpdateHeader('reraLicense', e.target.value);
                setSettings({ ...settings, reraLicense: e.target.value });
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
            />
          </div>
        </div>
      </div>

      {/* 3. Official Contact Details & Routing */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-6">
        <h2 className="text-sm font-bold text-[#fae7b5] flex items-center gap-2">
          <Phone className="w-4 h-4 text-[#b58b4a]" />
          <span>Official Corporate Contact Details</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">Company Name</label>
            <input
              type="text"
              value={contact?.company || 'JSG Real Estate LLC'}
              onChange={(e) => handleUpdateContact('company', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">Direct Telephone (Dialer Linked)</label>
            <input
              type="text"
              value={contact?.phone || '+971 4 320 2030'}
              onChange={(e) => handleUpdateContact('phone', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">Official Inquiries Email</label>
            <input
              type="email"
              value={contact?.email || 'enquiries@jsgrealestate.ae'}
              onChange={(e) => handleUpdateContact('email', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">WhatsApp Direct Number</label>
            <input
              type="text"
              value={contact?.whatsapp || '+971 4 320 2030'}
              onChange={(e) => handleUpdateContact('whatsapp', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-slate-300 font-medium">Office Physical Address / Landmark</label>
            <input
              type="text"
              value={contact?.location || 'Suite 2401, Boulevard Plaza Tower 1, Downtown Dubai, UAE'}
              onChange={(e) => handleUpdateContact('location', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
            />
          </div>
        </div>
      </div>

      {/* 4. Action Buttons & Header Labels */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-6">
        <h2 className="text-sm font-bold text-[#fae7b5] flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#b58b4a]" />
          <span>Header Action Buttons & CTA Labels</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">Primary CTA Button</label>
            <input
              type="text"
              value={header?.ctaText || 'Speak With Us'}
              onChange={(e) => handleUpdateHeader('ctaText', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">3D Interactive Map Button</label>
            <input
              type="text"
              value={header?.mapBtnText || '3D Map'}
              onChange={(e) => handleUpdateHeader('mapBtnText', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">Live Agent Video Call Tag</label>
            <input
              type="text"
              value={header?.liveAgentBtnText || 'Live Call with Agent'}
              onChange={(e) => handleUpdateHeader('liveAgentBtnText', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#b58b4a]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
