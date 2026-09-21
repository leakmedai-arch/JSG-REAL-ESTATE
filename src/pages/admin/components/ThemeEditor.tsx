import React, { useState } from 'react';
import { 
  Palette, 
  Save, 
  Lock, 
  Check, 
  Code,
  Sparkles,
  Type,
  Layout,
  Maximize2,
  Sliders,
  RotateCcw
} from 'lucide-react';

interface ThemeEditorProps {
  settings: any;
  setSettings: React.Dispatch<React.SetStateAction<any>>;
  onSave: () => void;
  showNotification: (msg: string) => void;
}

const DEFAULT_THEME = {
  deepEmerald: '#142621',
  darkTone: '#0d1e1a',
  trophyGold: '#b58b4a',
  champagneGold: '#d9bf8c',
  warmAlabaster: '#fbf9f4',
  fontFamily: 'Playfair Display',
  fontSizeScale: '100%',
  spacingScale: 'Relaxed',
  cardRadius: '16px',
  buttonStyle: '3D Trophy Gold',
  customCss: ''
};

export const ThemeEditor: React.FC<ThemeEditorProps> = ({
  settings,
  setSettings,
  onSave,
  showNotification
}) => {
  const theme = settings?.theme || DEFAULT_THEME;

  const handleUpdate = (field: string, val: string) => {
    setSettings({
      ...settings,
      theme: {
        ...theme,
        [field]: val
      }
    });
  };

  const handleReset = () => {
    if (!confirm('Reset theme styling to default brand guidelines?')) return;
    setSettings({
      ...settings,
      theme: DEFAULT_THEME
    });
    showNotification('Theme reset to default brand standards.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Palette className="w-6 h-6 text-[#b58b4a]" />
            <span>Theme, Aesthetics & Design System</span>
          </h1>
          <p className="text-xs text-[#d9bf8c]">
            Edit website colors, gold accents, dark mode tones, typography, font size, spacing, card styles, borders and button styles without breaking existing design.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1.5 border border-white/10 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Standards</span>
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-bold shadow-lg hover:opacity-95 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Theme</span>
          </button>
        </div>
      </div>

      {/* 1. Preservation Lock Badge */}
      <div className="p-4 rounded-2xl bg-[#0e241f] border border-[#b58b4a]/40 flex items-start gap-4 shadow-xl">
        <div className="p-2.5 rounded-xl bg-[#b58b4a]/20 text-[#fae7b5] shrink-0">
          <Lock className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="font-bold text-[#fae7b5] text-sm">Pixel-for-Pixel Frontend Preservation Lock: ACTIVE</div>
          <div className="text-slate-300 text-xs leading-relaxed">
            All style tokens adjust safely via CSS variables and system classes, preserving public site responsiveness, 3D turntable, cursor physics, and marquee performance.
          </div>
        </div>
      </div>

      {/* 2. Color Palette Control */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-[#fae7b5] flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#b58b4a]" />
          <span>Brand Colors & Gold Accents</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2.5">
            <div 
              className="h-12 rounded-xl border border-white/20 shadow-inner flex items-center justify-center font-mono text-white text-[11px] font-bold"
              style={{ backgroundColor: theme.deepEmerald || '#142621' }}
            >
              {theme.deepEmerald || '#142621'}
            </div>
            <div>
              <label className="font-bold text-white text-xs block">Deep Emerald (Canvas)</label>
              <input 
                type="text"
                value={theme.deepEmerald || '#142621'}
                onChange={(e) => handleUpdate('deepEmerald', e.target.value)}
                className="w-full mt-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-xs"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2.5">
            <div 
              className="h-12 rounded-xl border border-white/20 shadow-inner flex items-center justify-center font-mono text-[#142621] text-[11px] font-bold"
              style={{ backgroundColor: theme.trophyGold || '#b58b4a' }}
            >
              {theme.trophyGold || '#b58b4a'}
            </div>
            <div>
              <label className="font-bold text-white text-xs block">Trophy Gold (Primary Accent)</label>
              <input 
                type="text"
                value={theme.trophyGold || '#b58b4a'}
                onChange={(e) => handleUpdate('trophyGold', e.target.value)}
                className="w-full mt-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-xs"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2.5">
            <div 
              className="h-12 rounded-xl border border-white/20 shadow-inner flex items-center justify-center font-mono text-[#142621] text-[11px] font-bold"
              style={{ backgroundColor: theme.champagneGold || '#d9bf8c' }}
            >
              {theme.champagneGold || '#d9bf8c'}
            </div>
            <div>
              <label className="font-bold text-white text-xs block">Champagne (Subtle Gold)</label>
              <input 
                type="text"
                value={theme.champagneGold || '#d9bf8c'}
                onChange={(e) => handleUpdate('champagneGold', e.target.value)}
                className="w-full mt-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-xs"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2.5">
            <div 
              className="h-12 rounded-xl border border-black/20 shadow-inner flex items-center justify-center font-mono text-[#142621] text-[11px] font-bold"
              style={{ backgroundColor: theme.warmAlabaster || '#fbf9f4' }}
            >
              {theme.warmAlabaster || '#fbf9f4'}
            </div>
            <div>
              <label className="font-bold text-white text-xs block">Warm Alabaster (Light Canvas)</label>
              <input 
                type="text"
                value={theme.warmAlabaster || '#fbf9f4'}
                onChange={(e) => handleUpdate('warmAlabaster', e.target.value)}
                className="w-full mt-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Typography & Sizing */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-[#fae7b5] flex items-center gap-2">
          <Type className="w-4 h-4 text-[#b58b4a]" />
          <span>Typography & Font Size Scale</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Display Heading Typeface</label>
            <select
              value={theme.fontFamily || 'Playfair Display'}
              onChange={(e) => handleUpdate('fontFamily', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white cursor-pointer"
            >
              <option value="Playfair Display" className="bg-[#142621] text-white">Playfair Display & Cinzel (Royal Luxury)</option>
              <option value="Cinzel" className="bg-[#142621] text-white">Cinzel Classic (Architectural Heritage)</option>
              <option value="Cormorant Garamond" className="bg-[#142621] text-white">Cormorant Garamond (Editorial Elegance)</option>
              <option value="Inter, sans-serif" className="bg-[#142621] text-white">Modern Clean Sans (Minimalist Contemporary)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Global Base Font Scale</label>
            <select
              value={theme.fontSizeScale || '100%'}
              onChange={(e) => handleUpdate('fontSizeScale', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white cursor-pointer"
            >
              <option value="95%" className="bg-[#142621] text-white">Compact (95% - High Information Density)</option>
              <option value="100%" className="bg-[#142621] text-white">Default Standard (100% - Optimized Balance)</option>
              <option value="105%" className="bg-[#142621] text-white">Spacious Large (105% - Ultra Readability)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Spacing, Borders & Buttons */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-[#fae7b5] flex items-center gap-2">
          <Layout className="w-4 h-4 text-[#b58b4a]" />
          <span>Layout Spacing, Card Borders & Button Styles</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Section Spacing</label>
            <select
              value={theme.spacingScale || 'Relaxed'}
              onChange={(e) => handleUpdate('spacingScale', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white cursor-pointer"
            >
              <option value="Relaxed" className="bg-[#142621] text-white">Relaxed (Luxury Expansive Spacing)</option>
              <option value="Balanced" className="bg-[#142621] text-white">Balanced (Medium Executive Spacing)</option>
              <option value="Compact" className="bg-[#142621] text-white">Compact (Tighter Grid Spacing)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Card Corner Curvature</label>
            <select
              value={theme.cardRadius || '16px'}
              onChange={(e) => handleUpdate('cardRadius', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white cursor-pointer"
            >
              <option value="12px" className="bg-[#142621] text-white">Precision Sharp (12px)</option>
              <option value="16px" className="bg-[#142621] text-white">Modern Luxury Standard (16px)</option>
              <option value="24px" className="bg-[#142621] text-white">Curved Soft Pill (24px)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Primary Button Aesthetic</label>
            <select
              value={theme.buttonStyle || '3D Trophy Gold'}
              onChange={(e) => handleUpdate('buttonStyle', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white cursor-pointer"
            >
              <option value="3D Trophy Gold" className="bg-[#142621] text-white">3D Gradient Trophy Gold</option>
              <option value="Gloss Emerald" className="bg-[#142621] text-white">Gloss Deep Emerald with Gold Border</option>
              <option value="Minimal Metallic" className="bg-[#142621] text-white">Minimalist Gold Hairline Metallic</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Custom CSS Injector */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-[#fae7b5] flex items-center gap-2">
          <Code className="w-4 h-4 text-[#b58b4a]" />
          <span>Advanced Custom CSS Rules (Optional)</span>
        </h2>
        <textarea
          rows={3}
          value={theme.customCss || ''}
          onChange={(e) => handleUpdate('customCss', e.target.value)}
          placeholder="/* Custom CSS overrides - e.g. :root { --gold-accent: #b58b4a; } */"
          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-emerald-300 font-mono text-xs leading-relaxed"
        />
      </div>
    </div>
  );
};
