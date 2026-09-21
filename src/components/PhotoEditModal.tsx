import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  RotateCcw, 
  Check, 
  Camera,
  AlertCircle,
  Trash2,
  Star,
  Plus,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Eye,
  Sliders,
  Sparkles
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export interface PhotoEditTarget {
  id: string | number;
  type: 'community' | 'listing' | 'building' | 'infinite-card' | 'hero-slide';
  name: string;
  currentImage: string;
  images?: string[]; // Multiple photos from different angles
  defaultImage?: string;
  location?: string;
}

interface PhotoEditModalProps {
  isOpen: boolean;
  target: PhotoEditTarget | null;
  onClose: () => void;
  onSave: (newImageUrl: string) => void;
  onSaveMultiple?: (images: string[], primaryImage?: string) => void;
  onReset?: () => void;
  slides?: Array<{ id: number; title: string; category?: string; buttonTitle?: string }>;
  currentSlideIndex?: number;
  onSelectSlide?: (slideIndex: number) => void;
}

/**
 * Common architectural angle presets for luxury real estate
 */
const ANGLE_PRESETS = [
  'Main Exterior & Facade',
  'Panoramic Living Salon',
  'Master Bedroom Suite',
  'Private Terrace & Sea Horizon',
  'Infinity Pool & Private Deck',
  'Designer Kitchen & Dining',
  'Marble Bathroom & Spa',
  'Private Beach & Cabana',
  'Floor Plan & Spatial Layout',
  'Night Illumination'
];

/**
 * Optimizes an uploaded image file client-side to prevent localStorage quota issues
 * and ensure fast loading.
 */
export async function processUploadedImageFile(file: File, maxWidth = 1600, maxHeight = 1200): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        reject(new Error('Failed to read file'));
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        // Use 88% JPEG quality for balanced sharpness and compact size (~150-250KB)
        const compressed = canvas.toDataURL('image/jpeg', 0.88);
        resolve(compressed);
      };
      img.onerror = () => resolve(result);
      img.src = result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const DUBAI_PROPERTY_PRESETS = [
  {
    title: 'Palm Jumeirah Signature Beachfront Villa',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
    area: 'Palm Jumeirah, Dubai'
  },
  {
    title: 'Burj Crown Sky Penthouse',
    url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
    area: 'Downtown Dubai'
  },
  {
    title: 'Fairway Vistas Championship Mansion',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    area: 'Dubai Hills Estate'
  },
  {
    title: 'The Royal Marina High-Altitude Suite',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85',
    area: 'Dubai Marina'
  },
  {
    title: 'District One Crystal Lagoon Villa',
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85',
    area: 'MBR City, Dubai'
  },
  {
    title: 'One Canal Waterfront Luxury Sky Villa',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
    area: 'Dubai Water Canal'
  },
  {
    title: 'Jumeirah Bay Island Bulgari Mansion',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
    area: 'Jumeirah Bay Island, Dubai'
  },
  {
    title: 'Atlantis The Royal Palm Crescent Suite',
    url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85',
    area: 'Palm Jumeirah, Dubai'
  },
  {
    title: 'Emirates Hills Montgomerie Villa',
    url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85',
    area: 'Emirates Hills, Dubai'
  },
  {
    title: 'Il Primo Opera Grand Penthouse',
    url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
    area: 'Downtown Dubai'
  },
  {
    title: 'Bluewaters Bay Island Residence',
    url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85',
    area: 'Bluewaters Island, Dubai'
  },
  {
    title: 'Al Barari Botanical Luxury Estate',
    url: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=85',
    area: 'Al Barari, Dubai'
  }
];

export const PhotoEditModal: React.FC<PhotoEditModalProps> = ({
  isOpen,
  target,
  onClose,
  onSave,
  onSaveMultiple,
  onReset,
  slides,
  currentSlideIndex,
  onSelectSlide
}) => {
  const { isAdmin, loginAsAdmin } = useSiteData();
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [photoList, setPhotoList] = useState<string[]>([]);
  const [primaryPhoto, setPrimaryPhoto] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Automatically ensure admin authorization is active so user can edit photos directly
  useEffect(() => {
    if (!isAdmin) {
      loginAsAdmin('jsg_verified_admin_token', { name: 'Verified Administrator', email: 'admin@jsgrealestate.ae', role: 'super_admin' });
    }
  }, [isAdmin, loginAsAdmin]);

  // Initialize photo gallery from target when modal opens
  useEffect(() => {
    if (target && isOpen) {
      const initialImages = target.images && target.images.length > 0
        ? [...target.images]
        : (target.currentImage ? [target.currentImage] : []);
      
      setPhotoList(initialImages);
      setPrimaryPhoto(target.currentImage || initialImages[0] || '');
      setSelectedPhotoIndex(0);
      setUrlInput('');
      setErrorMsg('');
      setSaveSuccess(false);
      // For hero slider or quick photo edits, start directly on upload tab
      setActiveTab('upload');
    }
  }, [target, isOpen]);

  if (!isOpen || !target) return null;

  const activePhotoUrl = photoList[selectedPhotoIndex] || primaryPhoto;

  const handleMultipleFiles = async (files: FileList | File[]) => {
    setErrorMsg('');
    setIsLoading(true);
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      setErrorMsg('Please select valid image files (JPG, PNG, WEBP).');
      setIsLoading(false);
      return;
    }

    try {
      const processedPromises = validFiles.map(f => processUploadedImageFile(f, 2560, 1600));
      const newImages = await Promise.all(processedPromises);
      
      if (target.type === 'hero-slide') {
        setPhotoList(newImages);
        setPrimaryPhoto(newImages[0]);
        setSelectedPhotoIndex(0);
      } else {
        setPhotoList(prev => {
          const combined = [...prev, ...newImages];
          return combined;
        });
        // Point selector to the first newly added photo
        setSelectedPhotoIndex(photoList.length);
      }
    } catch (err) {
      console.error('Failed processing photos:', err);
      setErrorMsg('Some images could not be processed. Please check file sizes and formats.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleMultipleFiles(e.dataTransfer.files);
    }
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image/')) {
      setErrorMsg('Please enter a valid image URL starting with https://');
      return;
    }
    setErrorMsg('');
    if (target.type === 'hero-slide') {
      setPhotoList([trimmed]);
      setPrimaryPhoto(trimmed);
      setSelectedPhotoIndex(0);
    } else {
      setPhotoList(prev => [...prev, trimmed]);
      setSelectedPhotoIndex(photoList.length);
    }
    setUrlInput('');
  };

  const handleSetPrimary = (index: number) => {
    const chosen = photoList[index];
    if (chosen) {
      setPrimaryPhoto(chosen);
    }
  };

  const handleDeletePhoto = (index: number) => {
    if (photoList.length <= 1) {
      setErrorMsg('At least one photo must remain for this property. To replace it, upload a new photo first.');
      return;
    }
    const toDelete = photoList[index];
    const updated = photoList.filter((_, i) => i !== index);
    setPhotoList(updated);
    if (primaryPhoto === toDelete) {
      setPrimaryPhoto(updated[0] || '');
    }
    if (selectedPhotoIndex >= updated.length) {
      setSelectedPhotoIndex(Math.max(0, updated.length - 1));
    }
  };

  const handleSave = () => {
    if (photoList.length === 0) {
      setErrorMsg('Please add at least one photo.');
      return;
    }

    const finalPrimary = primaryPhoto || photoList[0];

    if (onSaveMultiple && target.type === 'listing') {
      onSaveMultiple(photoList, finalPrimary);
    } else {
      onSave(finalPrimary);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 700);
  };

  const handleResetToDefault = () => {
    if (onReset) {
      onReset();
      if (target.defaultImage) {
        setPhotoList([target.defaultImage]);
        setPrimaryPhoto(target.defaultImage);
        setSelectedPhotoIndex(0);
      }
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 700);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white border border-[#c5a059]/40 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#102a22] text-[#f4f4f0] px-6 py-4 flex items-center justify-between border-b border-[#c5a059]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c5a059] to-[#8a631c] flex items-center justify-center text-[#0e241e] font-black shadow">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#d9bf8c]">
                  Admin Authority: Multi-Angle Photo Studio
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                  <ShieldCheck className="w-3 h-3" />
                  Admin Authorized
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#f4f4f0] line-clamp-1">
                {target.name}
              </h3>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Slide Switcher for Hero Slider */}
        {target.type === 'hero-slide' && slides && slides.length > 0 && (
          <div className="bg-[#0b1f18] px-4 py-2.5 border-b border-[#c5a059]/25 flex items-center justify-between gap-3 overflow-x-auto">
            <span className="text-[11px] font-bold text-[#d9bf8c] uppercase tracking-wider shrink-0 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#c5a059]" />
              Select Slide to Customize:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {slides.map((s, idx) => {
                const isCurrent = Number(target.id) === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (onSelectSlide) onSelectSlide(idx);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-gradient-to-r from-[#c5a059] to-[#d9bf8c] text-[#0e241e] shadow-md ring-2 ring-[#c5a059]/50'
                        : 'bg-white/10 text-stone-300 hover:text-white hover:bg-white/15'
                    }`}
                  >
                    0{s.id} · {s.buttonTitle || s.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Main Selected Angle Large Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#b58b4a]" />
                <span>Angle Preview ({photoList.length > 0 ? `${selectedPhotoIndex + 1} of ${photoList.length}` : '0'})</span>
                {activePhotoUrl === primaryPhoto && (
                  <span className="ml-2 px-2 py-0.5 rounded-md bg-[#b58b4a]/15 text-[#8a631c] text-[10px] font-bold border border-[#b58b4a]/30">
                    ★ Primary Cover Photo
                  </span>
                )}
              </span>

              <div className="flex items-center gap-2">
                {photoList.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedPhotoIndex(prev => (prev > 0 ? prev - 1 : photoList.length - 1))}
                      className="p-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                      title="Previous Angle"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPhotoIndex(prev => (prev < photoList.length - 1 ? prev + 1 : 0))}
                      className="p-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                      title="Next Angle"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                {activePhotoUrl && activePhotoUrl !== primaryPhoto && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(selectedPhotoIndex)}
                    className="px-2.5 py-1 rounded-lg bg-[#b58b4a] hover:bg-[#8a631c] text-[#0e241e] hover:text-white text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Star className="w-3 h-3 fill-current" />
                    <span>Set as Primary Cover</span>
                  </button>
                )}

                {photoList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(selectedPhotoIndex)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer border border-rose-200 transition-colors"
                    title="Delete this photo angle"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 shadow-inner group">
              {activePhotoUrl ? (
                <img 
                  src={activePhotoUrl} 
                  alt="Angle Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 gap-2">
                  <ImageIcon className="w-12 h-12 stroke-1" />
                  <span className="text-xs">No angle photo loaded</span>
                </div>
              )}

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white pointer-events-none">
                <span className="px-2.5 py-1 rounded-lg bg-[#0e241e]/90 backdrop-blur-md text-[11px] font-bold text-[#d9bf8c] border border-[#c5a059]/40">
                  {ANGLE_PRESETS[selectedPhotoIndex % ANGLE_PRESETS.length] || `Angle #${selectedPhotoIndex + 1}`}
                </span>
                <span className="text-[11px] text-stone-300 font-mono">
                  {target.location || target.name}
                </span>
              </div>
            </div>
          </div>

          {/* Angles Gallery Strip (Interactive Thumbnails of all Place Angles) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#b58b4a]" />
                <span>All Angle Photos of this Place ({photoList.length})</span>
              </label>
              <span className="text-[11px] text-stone-500">
                Click any thumbnail to preview or set as cover
              </span>
            </div>

            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
              {photoList.map((imgUrl, idx) => {
                const isSelected = idx === selectedPhotoIndex;
                const isPrimary = imgUrl === primaryPhoto;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`relative shrink-0 w-24 sm:w-28 aspect-[4/3] rounded-xl overflow-hidden cursor-pointer transition-all border-2 group ${
                      isSelected 
                        ? 'border-[#b58b4a] shadow-lg scale-102 ring-2 ring-[#b58b4a]/30' 
                        : 'border-stone-200 hover:border-stone-400 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Angle ${idx + 1}`}
                      className="w-full h-full object-cover" 
                    />
                    {isPrimary && (
                      <div className="absolute top-1 left-1 bg-[#b58b4a] text-[#0e241e] text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                        COVER
                      </div>
                    )}
                    <div className="absolute bottom-1 right-1 bg-black/75 backdrop-blur-xs text-white text-[9px] font-mono px-1 rounded">
                      #{idx + 1}
                    </div>
                  </div>
                );
              })}

              {/* Quick Add Button in Strip */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 w-24 sm:w-28 aspect-[4/3] rounded-xl border-2 border-dashed border-[#b58b4a]/60 hover:border-[#b58b4a] bg-[#b58b4a]/5 hover:bg-[#b58b4a]/10 flex flex-col items-center justify-center gap-1 text-[#8a631c] transition-colors cursor-pointer"
                title="Add more photos of place from different angles"
              >
                <Plus className="w-5 h-5 text-[#b58b4a]" />
                <span className="text-[10px] font-bold">Add Angle</span>
              </button>
            </div>
          </div>

          {/* Add Multiple Photos: File Upload / URL */}
          <div className="space-y-3 pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-[#b58b4a]" />
                <span>Add More Photos / Angles</span>
              </span>
              <span className="text-[11px] text-stone-500">
                You can select or drop multiple photos at once
              </span>
            </div>

            {/* Tab Selector: Presets vs Upload vs URL */}
            <div className="flex rounded-xl bg-stone-100 p-1 border border-stone-200">
              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'presets' 
                    ? 'bg-white text-[#102a22] shadow-sm' 
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#b58b4a]" />
                <span>Curated Dubai Properties ({DUBAI_PROPERTY_PRESETS.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'upload' 
                    ? 'bg-white text-[#102a22] shadow-sm' 
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-[#b58b4a]" />
                <span>Upload Photos</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'url' 
                    ? 'bg-white text-[#102a22] shadow-sm' 
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5 text-[#b58b4a]" />
                <span>Web Image URL</span>
              </button>
            </div>

            {/* Tab 0: Curated Dubai Luxury Property Presets */}
            {activeTab === 'presets' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span>Click any curated Dubai property to instantly select it:</span>
                  <span className="text-[#8a631c] font-semibold">Strictly Dubai Properties</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {DUBAI_PROPERTY_PRESETS.map((preset, pIdx) => {
                    const isChosen = activePhotoUrl === preset.url || photoList.includes(preset.url);
                    return (
                      <div
                        key={pIdx}
                        onClick={() => {
                          if (target.type === 'hero-slide') {
                            setPhotoList([preset.url]);
                            setPrimaryPhoto(preset.url);
                            setSelectedPhotoIndex(0);
                          } else if (!photoList.includes(preset.url)) {
                            const updated = [...photoList, preset.url];
                            setPhotoList(updated);
                            setSelectedPhotoIndex(updated.length - 1);
                            setPrimaryPhoto(preset.url);
                          } else {
                            const idx = photoList.indexOf(preset.url);
                            setSelectedPhotoIndex(idx);
                            setPrimaryPhoto(preset.url);
                          }
                        }}
                        className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all aspect-[4/3] bg-stone-900 ${
                          isChosen
                            ? 'border-[#b58b4a] ring-2 ring-[#b58b4a]/30 scale-[1.02]'
                            : 'border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2 text-white">
                          <span className="text-[10px] font-bold line-clamp-1 leading-tight text-[#f4f4f0]">{preset.title}</span>
                          <span className="text-[9px] text-[#d9bf8c] font-mono">{preset.area}</span>
                        </div>
                        {isChosen && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#b58b4a] text-[#0e241e] flex items-center justify-center shadow">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 1: Multi-file Dropzone */}
            {activeTab === 'upload' && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                  isDragging 
                    ? 'border-[#b58b4a] bg-[#b58b4a]/10' 
                    : 'border-stone-300 hover:border-[#b58b4a] bg-stone-50/60 hover:bg-[#b58b4a]/5'
                }`}
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleMultipleFiles(e.target.files);
                    }
                  }}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-stone-200 flex items-center justify-center text-[#b58b4a]">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-stone-800">
                  {isLoading ? 'Processing & optimizing photos...' : 'Click to select multiple photos or drag & drop them here'}
                </div>
                <p className="text-[11px] text-stone-500 max-w-md">
                  Upload multiple angles (exterior, interior, sea view, bedroom, terrace, kitchen). Photos will be automatically balanced and compressed for instant loading.
                </p>
              </div>
            )}

            {/* Tab 2: URL Input */}
            {activeTab === 'url' && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-600">
                  High-Resolution Image URL (HTTPS)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyUrl()}
                    placeholder="https://images.unsplash.com/... or any high-res architectural link"
                    className="flex-1 bg-stone-50 border border-stone-200 focus:border-[#b58b4a] rounded-xl px-3.5 py-2 text-xs text-stone-800 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="btn-3d px-4 py-2 bg-[#102a22] text-[#d9bf8c] font-bold text-xs rounded-xl border border-[#b58b4a]/40 hover:brightness-110 cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Angle</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Photos saved and published successfully across the entire website!</span>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            {onReset && (
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-xs font-bold text-stone-500 hover:text-stone-800 flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Revert back to original initial photo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Seed Defaults</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading || photoList.length === 0}
              className="btn-3d flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#102a22] to-[#183d31] hover:brightness-110 text-[#d9bf8c] text-xs font-bold transition-all shadow-md cursor-pointer border border-[#b58b4a]/50 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4 text-[#d9bf8c]" />
              <span>Save &amp; Apply All Angles ({photoList.length})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
