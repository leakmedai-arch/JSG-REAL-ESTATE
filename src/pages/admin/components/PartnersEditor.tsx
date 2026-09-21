import React, { useState } from 'react';
import { 
  Building2, 
  Save, 
  Plus, 
  Trash2, 
  ExternalLink,
  RotateCcw
} from 'lucide-react';

interface PartnersEditorProps {
  settings: any;
  setSettings: React.Dispatch<React.SetStateAction<any>>;
  onSave: () => void;
  showNotification: (msg: string) => void;
}

const DEFAULT_PARTNERS = [
  { id: 'partner-emaar', name: 'Emaar Properties', tier: 'Master Developer', logo: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80', url: 'https://properties.emaar.com' },
  { id: 'partner-nakheel', name: 'Nakheel', tier: 'Master Developer', logo: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80', url: 'https://www.nakheel.com' },
  { id: 'partner-meraas', name: 'Meraas', tier: 'Luxury Developer', logo: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=400&q=80', url: 'https://www.meraas.com' },
  { id: 'partner-damac', name: 'Damac Properties', tier: 'Luxury Developer', logo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80', url: 'https://www.damacproperties.com' },
  { id: 'partner-sobha', name: 'Sobha Realty', tier: 'Bespoke Developer', logo: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=400&q=80', url: 'https://www.sobharealty.com' },
  { id: 'partner-omniyat', name: 'Omniyat', tier: 'Ultra-Luxury Developer', logo: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80', url: 'https://www.omniyat.com' },
  { id: 'partner-ellington', name: 'Ellington Properties', tier: 'Design-Led Developer', logo: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=400&q=80', url: 'https://ellingtonproperties.ae' },
  { id: 'partner-danube', name: 'Danube Properties', tier: 'Premier Developer', logo: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80', url: 'https://danubeproperties.ae' }
];

export const PartnersEditor: React.FC<PartnersEditorProps> = ({
  settings,
  setSettings,
  onSave,
  showNotification
}) => {
  const partnersList = settings.developerPartners || DEFAULT_PARTNERS;

  const [newName, setNewName] = useState('');
  const [newTier, setNewTier] = useState('Master Developer');
  const [newLogo, setNewLogo] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleAddPartner = () => {
    if (!newName.trim()) return;
    const newPartner = {
      id: `partner-${Date.now()}`,
      name: newName.trim(),
      tier: newTier.trim(),
      logo: newLogo.trim() || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80',
      url: newUrl.trim() || 'https://www.jsgrealestate.ae'
    };

    setSettings({
      ...settings,
      developerPartners: [...partnersList, newPartner]
    });

    setNewName('');
    setNewLogo('');
    setNewUrl('');
    showNotification('Master Developer partner added.');
  };

  const handleRemovePartner = (id: string) => {
    setSettings({
      ...settings,
      developerPartners: partnersList.filter((p: any) => p.id !== id)
    });
    showNotification('Partner removed.');
  };

  const handleUpdatePartnerField = (id: string, field: string, value: string) => {
    setSettings({
      ...settings,
      developerPartners: partnersList.map((p: any) => 
        p.id === id ? { ...p, [field]: value } : p
      )
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Master Partners & Tier-1 Developers</h1>
          <p className="text-xs text-[#d9bf8c]">
            Manage official developer alliances, strategic partnerships, and logos shown across the portfolio.
          </p>
        </div>
        <button
          type="button"
          onClick={onSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-bold shadow-lg hover:opacity-95 flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Partners</span>
        </button>
      </div>

      {/* Partner Cards List */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#fae7b5] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#b58b4a]" />
            <span>Accredited Developer Partners ({partnersList.length})</span>
          </h2>
          <button
            type="button"
            onClick={() => {
              setSettings({ ...settings, developerPartners: DEFAULT_PARTNERS });
              showNotification('Reset to default developer partners.');
            }}
            className="text-[11px] text-[#d9bf8c] hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {partnersList.map((partner: any) => (
            <div key={partner.id} className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                    onError={(e: any) => {
                      e.target.src = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div>
                    <div className="font-bold text-white text-sm">{partner.name}</div>
                    <span className="text-[10px] text-[#fae7b5] font-semibold">{partner.tier}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePartner(partner.id)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300"
                  title="Remove Partner"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <div>
                  <label className="text-slate-400 text-[10px]">Partner Name</label>
                  <input
                    type="text"
                    value={partner.name}
                    onChange={(e) => handleUpdatePartnerField(partner.id, 'name', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs mt-0.5"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[10px]">Website URL</label>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <input
                      type="text"
                      value={partner.url}
                      onChange={(e) => handleUpdatePartnerField(partner.id, 'url', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono"
                    />
                    <a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Partner Form */}
        <div className="p-4 rounded-2xl bg-black/20 border border-white/5 space-y-3 pt-4">
          <div className="font-bold text-[#fae7b5]">Add New Developer Partner</div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <input
                type="text"
                placeholder="Developer Name (e.g. Aldar)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Tier (e.g. Master Developer)"
                value={newTier}
                onChange={(e) => setNewTier(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Website URL"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs font-mono"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Logo Image URL"
                value={newLogo}
                onChange={(e) => setNewLogo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs font-mono"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddPartner}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#fae7b5] font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-white/10"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Developer Partner</span>
          </button>
        </div>
      </div>
    </div>
  );
};
