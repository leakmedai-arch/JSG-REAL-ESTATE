import React, { useState } from 'react';
import { 
  MapPin, 
  Building2, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react';

interface AreasBuildingsEditorProps {
  communityImages: Record<string, string>;
  setCommunityImages: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  settings: any;
  setSettings: React.Dispatch<React.SetStateAction<any>>;
  authToken: string;
  onSave: () => void;
  showNotification: (msg: string) => void;
}

const DEFAULT_AREAS = [
  { name: "Downtown Dubai", subtitle: "Luxury apartments · Burj Khalifa & Opera", landmark: "Burj Khalifa & Dubai Mall", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=85" },
  { name: "Dubai Marina", subtitle: "Waterfront living · Yacht Harbour", landmark: "Marina Promenade & Pier 7", image: "https://images.unsplash.com/photo-1523112075569-f39f307e7f07?auto=format&fit=crop&w=1000&q=85" },
  { name: "Palm Jumeirah", subtitle: "Ultra luxury · Beachfront Villas", landmark: "Atlantis The Royal & Boardwalk", image: "https://images.unsplash.com/photo-1534430480872-3498386e7852?auto=format&fit=crop&w=1000&q=85" },
  { name: "Dubai Hills Estate", subtitle: "Family living · Championship Golf", landmark: "Dubai Hills Mall & Golf Club", image: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=1000&q=85" },
  { name: "Business Bay", subtitle: "City living · Canal Front Suites", landmark: "Dubai Water Canal", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85" },
  { name: "Jumeirah", subtitle: "Beachside · Private Enclave Villas", landmark: "Burj Al Arab & Jumeirah Beach", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=85" },
  { name: "Jumeirah Village Circle", subtitle: "Affordable · High-Yield Investment", landmark: "Circle Mall & Community Parks", image: "https://images.unsplash.com/photo-1600566753051-40f0d0f0f3e1?auto=format&fit=crop&w=1000&q=85" },
  { name: "Arabian Ranches", subtitle: "Family villas · Equestrian Community", landmark: "Equestrian & Polo Club", image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=85" }
];

const DEFAULT_BUILDINGS = [
  { id: 'bld-1', name: 'Burj Khalifa Sky Residences', area: 'Downtown Dubai', developer: 'Emaar', type: 'Ultra-Luxury Towers', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80' },
  { id: 'bld-2', name: 'Atlantis The Royal Residences', area: 'Palm Jumeirah', developer: 'Kerzner', type: 'Waterfront Penthouses', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80' },
  { id: 'bld-3', name: 'One Canal Luxury Mansions', area: 'Dubai Water Canal', developer: 'Firas', type: 'Sky Villas', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80' },
  { id: 'bld-4', name: 'Il Primo Opera Grand', area: 'Downtown Dubai', developer: 'Emaar', type: 'Opera District Penthouses', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80' },
  { id: 'bld-5', name: 'Fairway Vistas Parkway', area: 'Dubai Hills Estate', developer: 'Emaar', type: 'Golf Fairway Mansions', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'bld-6', name: 'Bulgari Lighthouse Penthouse', area: 'Jumeirah Bay Island', developer: 'Meraas', type: 'Island Private Estates', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80' }
];

const DEFAULT_PARTNERS = [
  { id: 'partner-emaar', name: 'Emaar Properties', tier: 'Master Developer', logo: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80', url: 'https://properties.emaar.com' },
  { id: 'partner-nakheel', name: 'Nakheel', tier: 'Master Developer', logo: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80', url: 'https://www.nakheel.com' },
  { id: 'partner-meraas', name: 'Meraas', tier: 'Luxury Developer', logo: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=400&q=80', url: 'https://www.meraas.com' },
  { id: 'partner-damac', name: 'Damac Properties', tier: 'Luxury Developer', logo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80', url: 'https://www.damacproperties.com' },
  { id: 'partner-sobha', name: 'Sobha Realty', tier: 'Bespoke Developer', logo: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=400&q=80', url: 'https://www.sobharealty.com' },
  { id: 'partner-omniyat', name: 'Omniyat', tier: 'Ultra-Luxury Developer', logo: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80', url: 'https://www.omniyat.com' }
];

export const AreasBuildingsEditor: React.FC<AreasBuildingsEditorProps> = ({
  communityImages,
  setCommunityImages,
  settings,
  setSettings,
  authToken,
  onSave,
  showNotification
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'areas' | 'buildings' | 'partners'>('areas');

  const areasList = settings?.customAreas || DEFAULT_AREAS;
  const buildingsList = settings?.featuredBuildings || DEFAULT_BUILDINGS;
  const partnersList = settings?.developerPartners || DEFAULT_PARTNERS;

  // New Area States
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaSub, setNewAreaSub] = useState('');
  const [newAreaLandmark, setNewAreaLandmark] = useState('');
  const [newAreaImg, setNewAreaImg] = useState('');

  // New Building States
  const [newBldName, setNewBldName] = useState('');
  const [newBldArea, setNewBldArea] = useState('Downtown Dubai');
  const [newBldDev, setNewBldDev] = useState('Emaar');
  const [newBldImg, setNewBldImg] = useState('');

  // New Partner States
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerTier, setNewPartnerTier] = useState('Master Developer');
  const [newPartnerLogo, setNewPartnerLogo] = useState('');
  const [newPartnerUrl, setNewPartnerUrl] = useState('');

  // Update Area
  const handleUpdateArea = (idx: number, field: string, val: string) => {
    const updated = areasList.map((a: any, i: number) => i === idx ? { ...a, [field]: val } : a);
    setSettings({ ...settings, customAreas: updated });
    if (field === 'image') {
      const areaName = areasList[idx].name;
      setCommunityImages(prev => ({ ...prev, [areaName]: val }));
    }
  };

  const handleAddArea = () => {
    if (!newAreaName.trim()) return;
    const item = {
      name: newAreaName.trim(),
      subtitle: newAreaSub.trim() || 'Luxury residential enclave',
      landmark: newAreaLandmark.trim() || 'Prime Dubai Landmark',
      image: newAreaImg.trim() || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=85'
    };
    setSettings({ ...settings, customAreas: [...areasList, item] });
    setCommunityImages(prev => ({ ...prev, [item.name]: item.image }));
    setNewAreaName('');
    setNewAreaSub('');
    setNewAreaLandmark('');
    setNewAreaImg('');
    showNotification(`Added ${item.name} community`);
  };

  const handleRemoveArea = (idx: number) => {
    const updated = areasList.filter((_: any, i: number) => i !== idx);
    setSettings({ ...settings, customAreas: updated });
    showNotification('Area community removed.');
  };

  // Update Building
  const handleUpdateBuilding = (id: string, field: string, val: string) => {
    const updated = buildingsList.map((b: any) => b.id === id ? { ...b, [field]: val } : b);
    setSettings({ ...settings, featuredBuildings: updated });
  };

  const handleAddBuilding = () => {
    if (!newBldName.trim()) return;
    const newBld = {
      id: `bld-${Date.now()}`,
      name: newBldName.trim(),
      area: newBldArea,
      developer: newBldDev,
      type: 'Luxury Development',
      image: newBldImg.trim() || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'
    };
    setSettings({ ...settings, featuredBuildings: [...buildingsList, newBld] });
    setNewBldName('');
    setNewBldImg('');
    showNotification('Development tower added.');
  };

  const handleRemoveBuilding = (id: string) => {
    setSettings({
      ...settings,
      featuredBuildings: buildingsList.filter((b: any) => b.id !== id)
    });
    showNotification('Building removed.');
  };

  // Update Partner
  const handleUpdatePartner = (id: string, field: string, val: string) => {
    const updated = partnersList.map((p: any) => p.id === id ? { ...p, [field]: val } : p);
    setSettings({ ...settings, developerPartners: updated });
  };

  const handleAddPartner = () => {
    if (!newPartnerName.trim()) return;
    const newP = {
      id: `partner-${Date.now()}`,
      name: newPartnerName.trim(),
      tier: newPartnerTier.trim(),
      logo: newPartnerLogo.trim() || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80',
      url: newPartnerUrl.trim() || 'https://www.jsgrealestate.ae'
    };
    setSettings({ ...settings, developerPartners: [...partnersList, newP] });
    setNewPartnerName('');
    setNewPartnerLogo('');
    setNewUrl('');
    showNotification('Developer partner added.');
  };

  const handleRemovePartner = (id: string) => {
    setSettings({
      ...settings,
      developerPartners: partnersList.filter((p: any) => p.id !== id)
    });
    showNotification('Partner removed.');
  };

  const setNewUrl = (_s: string) => setNewPartnerUrl(_s);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-[#b58b4a]" />
            <span>Areas, Iconic Towers & Master Partners</span>
          </h1>
          <p className="text-xs text-[#d9bf8c]">
            Edit every community name, subtitle, image, landmark, tower, developer logo, and partner link.
          </p>
        </div>
        <button
          type="button"
          onClick={onSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-bold shadow-lg hover:opacity-95 flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Sub navigation tabs */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab('areas')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'areas' ? 'bg-[#b58b4a] text-[#142621]' : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Prime Communities ({areasList.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('buildings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'buildings' ? 'bg-[#b58b4a] text-[#142621]' : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Iconic Towers & Developments ({buildingsList.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('partners')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'partners' ? 'bg-[#b58b4a] text-[#142621]' : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Developer Logos & Partners ({partnersList.length})</span>
        </button>
      </div>

      {/* 1. AREAS SUBTAB */}
      {activeSubTab === 'areas' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {areasList.map((area: any, idx: number) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#142e27] border border-white/10 shadow-lg space-y-3 relative">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-black/30 border border-white/10 flex items-center justify-center font-mono text-[11px] text-[#fae7b5] font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-white text-sm">{area.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveArea(idx)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20"
                    title="Remove Area"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="relative h-28 rounded-xl overflow-hidden border border-white/10 bg-black/30">
                  <img src={area.image} alt={area.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[#fae7b5] text-[11px] font-bold">{area.landmark || 'Key Landmark'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-slate-400 text-[10px]">Community Name</label>
                    <input
                      type="text"
                      value={area.name}
                      onChange={(e) => handleUpdateArea(idx, 'name', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-medium text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 text-[10px]">Key Landmark</label>
                    <input
                      type="text"
                      value={area.landmark || ''}
                      onChange={(e) => handleUpdateArea(idx, 'landmark', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                      placeholder="e.g. Burj Khalifa & Mall"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-slate-400 text-[10px]">Subtitle / Vibe Description</label>
                    <input
                      type="text"
                      value={area.subtitle || ''}
                      onChange={(e) => handleUpdateArea(idx, 'subtitle', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                      placeholder="Luxury apartments · Waterfront living"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-slate-400 text-[10px]">Community Image URL</label>
                    <input
                      type="text"
                      value={area.image}
                      onChange={(e) => handleUpdateArea(idx, 'image', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-[11px] font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Community Form */}
          <div className="p-5 rounded-2xl bg-[#142e27] border border-[#b58b4a]/30 shadow-lg space-y-3">
            <h3 className="font-bold text-[#fae7b5] text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#b58b4a]" />
              <span>Add New Community Enclave</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Community Name (e.g. Dubai Creek Harbour)"
                value={newAreaName}
                onChange={(e) => setNewAreaName(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500"
              />
              <input
                type="text"
                placeholder="Subtitle (e.g. Waterfront living)"
                value={newAreaSub}
                onChange={(e) => setNewAreaSub(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500"
              />
              <input
                type="text"
                placeholder="Landmark (e.g. Creek Tower)"
                value={newAreaLandmark}
                onChange={(e) => setNewAreaLandmark(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={newAreaImg}
                onChange={(e) => setNewAreaImg(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 font-mono text-[11px]"
              />
            </div>
            <button
              type="button"
              onClick={handleAddArea}
              className="px-5 py-2 rounded-xl bg-[#b58b4a] text-[#142621] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Community</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. BUILDINGS SUBTAB */}
      {activeSubTab === 'buildings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {buildingsList.map((bld: any) => (
              <div key={bld.id} className="p-5 rounded-2xl bg-[#142e27] border border-white/10 shadow-lg space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#b58b4a] shrink-0" />
                    <div>
                      <div className="font-bold text-white text-sm">{bld.name}</div>
                      <div className="text-slate-400 text-[11px]">{bld.area} · Developed by {bld.developer}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBuilding(bld.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20"
                    title="Remove Tower"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-slate-400 text-[10px]">Building / Tower Name</label>
                    <input
                      type="text"
                      value={bld.name}
                      onChange={(e) => handleUpdateBuilding(bld.id, 'name', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-medium text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 text-[10px]">Master Developer</label>
                    <input
                      type="text"
                      value={bld.developer}
                      onChange={(e) => handleUpdateBuilding(bld.id, 'developer', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 text-[10px]">Location Area</label>
                    <input
                      type="text"
                      value={bld.area}
                      onChange={(e) => handleUpdateBuilding(bld.id, 'area', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 text-[10px]">Tower Type</label>
                    <input
                      type="text"
                      value={bld.type || ''}
                      onChange={(e) => handleUpdateBuilding(bld.id, 'type', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-slate-400 text-[10px]">Tower Photo URL</label>
                    <input
                      type="text"
                      value={bld.image || ''}
                      onChange={(e) => handleUpdateBuilding(bld.id, 'image', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-[11px] font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Tower Form */}
          <div className="p-5 rounded-2xl bg-[#142e27] border border-[#b58b4a]/30 shadow-lg space-y-3">
            <h3 className="font-bold text-[#fae7b5] text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#b58b4a]" />
              <span>Add Iconic Tower / Building</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Tower Name (e.g. Address Sky View)"
                value={newBldName}
                onChange={(e) => setNewBldName(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500"
              />
              <input
                type="text"
                placeholder="Area (e.g. Downtown Dubai)"
                value={newBldArea}
                onChange={(e) => setNewBldArea(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500"
              />
              <input
                type="text"
                placeholder="Developer (e.g. Emaar)"
                value={newBldDev}
                onChange={(e) => setNewBldDev(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500"
              />
              <input
                type="text"
                placeholder="Tower Image URL"
                value={newBldImg}
                onChange={(e) => setNewBldImg(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 font-mono text-[11px]"
              />
            </div>
            <button
              type="button"
              onClick={handleAddBuilding}
              className="px-5 py-2 rounded-xl bg-[#b58b4a] text-[#142621] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Building</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. PARTNERS SUBTAB */}
      {activeSubTab === 'partners' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {partnersList.map((partner: any) => (
              <div key={partner.id} className="p-5 rounded-2xl bg-[#142e27] border border-white/10 shadow-lg space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-10 h-10 rounded-lg object-cover border border-white/10 bg-white/5"
                    />
                    <div>
                      <div className="font-bold text-white text-sm">{partner.name}</div>
                      <div className="text-[#fae7b5] text-[11px]">{partner.tier}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePartner(partner.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20"
                    title="Remove Partner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-slate-400 text-[10px]">Developer Name</label>
                    <input
                      type="text"
                      value={partner.name}
                      onChange={(e) => handleUpdatePartner(partner.id, 'name', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-medium text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 text-[10px]">Tier Classification</label>
                    <input
                      type="text"
                      value={partner.tier}
                      onChange={(e) => handleUpdatePartner(partner.id, 'tier', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-slate-400 text-[10px]">Developer Logo Image URL</label>
                    <input
                      type="text"
                      value={partner.logo}
                      onChange={(e) => handleUpdatePartner(partner.id, 'logo', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-[11px] font-mono"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-slate-400 text-[10px]">Official Website Link</label>
                    <input
                      type="text"
                      value={partner.url || ''}
                      onChange={(e) => handleUpdatePartner(partner.id, 'url', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-[11px] font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Partner Form */}
          <div className="p-5 rounded-2xl bg-[#142e27] border border-[#b58b4a]/30 shadow-lg space-y-3">
            <h3 className="font-bold text-[#fae7b5] text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#b58b4a]" />
              <span>Add Developer Alliance Partner</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Developer Name (e.g. Aldar Properties)"
                value={newPartnerName}
                onChange={(e) => setNewPartnerName(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500"
              />
              <input
                type="text"
                placeholder="Tier (e.g. Master Developer)"
                value={newPartnerTier}
                onChange={(e) => setNewPartnerTier(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500"
              />
              <input
                type="text"
                placeholder="Logo Image URL"
                value={newPartnerLogo}
                onChange={(e) => setNewPartnerLogo(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 font-mono text-[11px]"
              />
              <input
                type="text"
                placeholder="Website URL"
                value={newPartnerUrl}
                onChange={(e) => setNewPartnerUrl(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 font-mono text-[11px]"
              />
            </div>
            <button
              type="button"
              onClick={handleAddPartner}
              className="px-5 py-2 rounded-xl bg-[#b58b4a] text-[#142621] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Developer</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
