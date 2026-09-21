import React, { useState } from 'react';
import { X, Upload, Plus, Trash2, Check, Sparkles, Building2 } from 'lucide-react';

interface PropertyModalEditorProps {
  property: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (propData: any) => Promise<void>;
}

export const PropertyModalEditor: React.FC<PropertyModalEditorProps> = ({
  property,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<any>(
    property || {
      title: '',
      type: 'apartment',
      category: 'apartment',
      mode: 'buy',
      price: 3500000,
      location: 'Dubai Marina, Dubai',
      community: 'Dubai Marina',
      building: '',
      developer: 'Select Group',
      beds: 3,
      baths: 3,
      area: 1850,
      plotSize: 0,
      parking: 2,
      furnished: true,
      tag: 'Featured Luxury',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=90',
      galleryImages: [],
      videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      virtualTourUrl: '',
      floorPlanUrl: '',
      referenceNumber: `JSG-${Math.floor(100 + Math.random() * 900)}`,
      assignedAgent: 'Jasmeet S. Gulati',
      isFeatured: true,
      isDldVerified: true,
      description: '',
      features: ['Balcony', 'Panoramic Sea View', 'Concierge Service', 'Swimming Pool']
    }
  );

  const [featureInput, setFeatureInput] = useState('');
  const [galleryInput, setGalleryInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        const token = localStorage.getItem('jsg_admin_token');
        const res = await fetch('/api/admin/media/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            filename: file.name,
            base64Data,
            category: 'Properties'
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (isGallery) {
            setFormData((prev: any) => ({
              ...prev,
              galleryImages: [...(prev.galleryImages || []), data.media.url]
            }));
          } else {
            setFormData((prev: any) => ({
              ...prev,
              image: data.media.url
            }));
          }
        }
      } catch (err) {
        alert('Failed to upload image. Please try again.');
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setFormData((prev: any) => ({
      ...prev,
      features: [...(prev.features || []), featureInput.trim()]
    }));
    setFeatureInput('');
  };

  const removeFeature = (idx: number) => {
    setFormData((prev: any) => ({
      ...prev,
      features: prev.features.filter((_: any, i: number) => i !== idx)
    }));
  };

  const addGalleryImage = () => {
    if (!galleryInput.trim()) return;
    setFormData((prev: any) => ({
      ...prev,
      galleryImages: [...(prev.galleryImages || []), galleryInput.trim()]
    }));
    setGalleryInput('');
  };

  const removeGalleryImage = (idx: number) => {
    setFormData((prev: any) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_: any, i: number) => i !== idx)
    }));
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
      <div className="bg-[#17362f] text-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-[#b58b4a]/30 my-auto animate-fade-in">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#b58b4a]/20 border border-[#b58b4a]/40 flex items-center justify-center text-[#fae7b5]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#fbfaf7]">
                {property ? 'Edit Property Listing' : 'Create New Luxury Property'}
              </h2>
              <p className="text-xs text-[#d9bf8c]">
                Immediate synchronization with website and public search filters
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Top Key Attributes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-semibold text-slate-300">Property Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Palm Jumeirah Signature Waterfront Villa"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:ring-1 focus:ring-[#b58b4a] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Price (AED) *</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-[#fae7b5] font-bold text-sm focus:ring-1 focus:ring-[#b58b4a] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Listing Mode</label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12241f] border border-white/15 text-white"
              >
                <option value="buy">For Sale (Buy)</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Property Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12241f] border border-white/15 text-white"
              >
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="penthouse">Penthouse</option>
                <option value="townhouse">Townhouse</option>
                <option value="land">Plot / Land</option>
                <option value="commercial">Commercial</option>
                <option value="studio">Studio</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12241f] border border-white/15 text-white"
              >
                <option value="active">Active Listing</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
                <option value="off-plan">Off-Plan Pre-Launch</option>
                <option value="draft">Draft (Unpublished)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Highlight Tag</label>
              <input
                type="text"
                value={formData.tag || ''}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder="Featured Luxury / Signature"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white"
              />
            </div>
          </div>

          {/* Location & Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Location / Address *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Dubai Marina, Dubai"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Community</label>
              <input
                type="text"
                value={formData.community}
                onChange={(e) => setFormData({ ...formData, community: e.target.value })}
                placeholder="Palm Jumeirah / Downtown / Dubai Hills"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Master Developer</label>
              <input
                type="text"
                value={formData.developer || ''}
                onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                placeholder="Emaar / Nakheel / Damac / Sobha"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Bedrooms</label>
              <input
                type="number"
                value={formData.beds}
                onChange={(e) => setFormData({ ...formData, beds: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Bathrooms</label>
              <input
                type="number"
                value={formData.baths}
                onChange={(e) => setFormData({ ...formData, baths: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Area (Sqft)</label>
              <input
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Plot Size (Sqft)</label>
              <input
                type="number"
                value={formData.plotSize || 0}
                onChange={(e) => setFormData({ ...formData, plotSize: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Parking Spaces</label>
              <input
                type="number"
                value={formData.parking || 2}
                onChange={(e) => setFormData({ ...formData, parking: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
              />
            </div>
          </div>

          {/* Primary Image & Upload */}
          <div className="space-y-2 p-4 rounded-2xl bg-black/20 border border-white/10">
            <label className="font-semibold text-[#fae7b5] block">Primary Showcase Image</label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                required
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://... or upload image"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white"
              />
              <label className="px-4 py-2.5 rounded-xl bg-[#b58b4a] hover:bg-[#d9bf8c] text-[#142621] font-bold cursor-pointer transition-colors flex items-center gap-2 shrink-0">
                <Upload className="w-4 h-4" />
                <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, false)}
                  className="hidden"
                />
              </label>
            </div>
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="h-28 w-44 object-cover rounded-xl border border-white/10 mt-2"
              />
            )}
          </div>

          {/* Gallery Images */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-300 block">Additional Gallery Images</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
                placeholder="Paste image URL or use file upload button"
                className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
              />
              <button
                type="button"
                onClick={addGalleryImage}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-bold"
              >
                Add URL
              </button>
              <label className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#d9bf8c] font-bold cursor-pointer flex items-center gap-1.5 shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, true)}
                  className="hidden"
                />
              </label>
            </div>
            {formData.galleryImages && formData.galleryImages.length > 0 && (
              <div className="flex gap-2 overflow-x-auto py-2">
                {formData.galleryImages.map((imgUrl: string, idx: number) => (
                  <div key={idx} className="relative group shrink-0">
                    <img
                      src={imgUrl}
                      alt={`Gallery ${idx + 1}`}
                      className="w-16 h-16 object-cover rounded-lg border border-white/15"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video & Virtual Tour Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Live Walkthrough Video Stream (HLS .m3u8 / MP4)</label>
              <input
                type="text"
                value={formData.videoUrl || ''}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">3D Matterport / Virtual Tour URL</label>
              <input
                type="text"
                value={formData.virtualTourUrl || ''}
                onChange={(e) => setFormData({ ...formData, virtualTourUrl: e.target.value })}
                placeholder="https://my.matterport.com/show/?m=..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Full Architectural Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide bespoke architectural details, marble types, views, private elevators, and lifestyle attributes..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white leading-relaxed"
            />
          </div>

          {/* Features List */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-300">Features & Amenities</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="e.g. Private Berthing Access"
                className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 font-bold"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {formData.features?.map((feat: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-[#1b3b33] border border-[#b58b4a]/30 text-[#fae7b5] flex items-center gap-1.5"
                >
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Flags / Badges */}
          <div className="flex flex-wrap gap-6 p-4 rounded-2xl bg-black/20 border border-white/10">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded accent-[#b58b4a] w-4 h-4"
              />
              <span className="font-semibold text-slate-200">Featured on Home Showcase</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isDldVerified}
                onChange={(e) => setFormData({ ...formData, isDldVerified: e.target.checked })}
                className="rounded accent-[#b58b4a] w-4 h-4"
              />
              <span className="font-semibold text-slate-200">DLD / RERA Verified Badge</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.furnished}
                onChange={(e) => setFormData({ ...formData, furnished: e.target.checked })}
                className="rounded accent-[#b58b4a] w-4 h-4"
              />
              <span className="font-semibold text-slate-200">Fully Furnished</span>
            </label>
          </div>

          {/* Footer Submit */}
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-bold shadow-lg hover:opacity-95 cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Publishing Changes...' : property ? 'Update Property' : 'Publish Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
