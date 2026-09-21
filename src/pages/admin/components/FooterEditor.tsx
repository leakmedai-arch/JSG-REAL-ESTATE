import React from 'react';
import { 
  Building2, 
  Save, 
  Globe, 
  ShieldCheck, 
  Share2, 
  FileText
} from 'lucide-react';

interface FooterEditorProps {
  settings: any;
  setSettings: React.Dispatch<React.SetStateAction<any>>;
  onSave: () => void;
  showNotification: (msg: string) => void;
}

export const FooterEditor: React.FC<FooterEditorProps> = ({
  settings,
  setSettings,
  onSave,
  showNotification
}) => {
  const footer = settings.footer || {
    description: 'JSG Real Estate is Dubai’s premier luxury advisory firm, representing visionary buyers, family offices, and investors across ultra-prime residential enclaves.',
    copyright: '© 2026 JSG Real Estate LLC. All Rights Reserved.',
    disclaimer: 'All listings subject to RERA regulation and DLD registered escrow procedures. Prices are quoted in AED.'
  };

  const social = settings.socialLinks || {
    instagram: 'https://instagram.com/jsgrealestate',
    linkedin: 'https://linkedin.com/company/jsgrealestate',
    youtube: 'https://youtube.com/@jsgrealestate',
    facebook: 'https://facebook.com/jsgrealestate'
  };

  const handleUpdateFooter = (field: string, value: string) => {
    setSettings({
      ...settings,
      footer: {
        ...footer,
        [field]: value
      }
    });
  };

  const handleUpdateSocial = (platform: string, value: string) => {
    setSettings({
      ...settings,
      socialLinks: {
        ...social,
        [platform]: value
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Footer & Regulatory Disclaimers</h1>
          <p className="text-xs text-[#d9bf8c]">
            Edit footer company profile, copyright notices, RERA compliance statements, and official social handles.
          </p>
        </div>
        <button
          type="button"
          onClick={onSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-bold shadow-lg hover:opacity-95 flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Footer Configuration</span>
        </button>
      </div>

      {/* 1. Footer Biography & Disclaimer */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-[#fae7b5] flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#b58b4a]" />
          <span>Footer Editorial & Legal Disclaimers</span>
        </h2>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Company Bio / Mission Statement</label>
            <textarea
              rows={3}
              value={footer.description}
              onChange={(e) => handleUpdateFooter('description', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Copyright Statement</label>
            <input
              type="text"
              value={footer.copyright}
              onChange={(e) => handleUpdateFooter('copyright', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#b58b4a]" />
              <span>DLD / RERA Regulatory Escrow Disclaimer</span>
            </label>
            <textarea
              rows={2}
              value={footer.disclaimer}
              onChange={(e) => handleUpdateFooter('disclaimer', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* 2. Official Social Media Channels */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-[#fae7b5] flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#b58b4a]" />
          <span>Social Media Channels</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Instagram Profile URL</label>
            <input
              type="text"
              value={social.instagram || ''}
              onChange={(e) => handleUpdateSocial('instagram', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">LinkedIn Company URL</label>
            <input
              type="text"
              value={social.linkedin || ''}
              onChange={(e) => handleUpdateSocial('linkedin', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">YouTube Channel URL</label>
            <input
              type="text"
              value={social.youtube || ''}
              onChange={(e) => handleUpdateSocial('youtube', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Facebook Page URL</label>
            <input
              type="text"
              value={social.facebook || ''}
              onChange={(e) => handleUpdateSocial('facebook', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
