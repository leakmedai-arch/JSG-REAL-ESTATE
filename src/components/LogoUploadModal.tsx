import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Camera, 
  Check, 
  RotateCcw, 
  X, 
  Sparkles, 
  Eye,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface LogoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogoUrl: string;
  isCustomActive: boolean;
  onSaveLogo: (dataUrl: string, filename: string) => Promise<void> | void;
  onResetLogo: () => Promise<void> | void;
}

export const LogoUploadModal: React.FC<LogoUploadModalProps> = ({
  isOpen,
  onClose,
  currentLogoUrl,
  isCustomActive,
  onSaveLogo,
  onResetLogo
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [fileSizeKb, setFileSizeKb] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [previewScale, setPreviewScale] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [previewBg, setPreviewBg] = useState<'emerald' | 'light' | 'dark'>('emerald');
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clipboard paste support (paste image from clipboard)
  React.useEffect(() => {
    if (!isOpen) return;

    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.items) {
        for (let i = 0; i < e.clipboardData.items.length; i++) {
          const item = e.clipboardData.items[i];
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              handleFileProcess(file);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectPreset = (url: string, name: string) => {
    setErrorMsg(null);
    setPreviewUrl(url);
    setSelectedFileName(name);
    setFileSizeKb(120);
  };

  const handleFileProcess = (file: File) => {
    setErrorMsg(null);
    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('Please select a valid image file (PNG, JPG, SVG, WebP, or GIF).');
      return;
    }

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Image file size is too large. Please upload an image under 8MB.');
      return;
    }

    setSelectedFileName(file.name);
    setFileSizeKb(Math.round(file.size / 1024));

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setPreviewUrl(result);
      }
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read image file. Please try another file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleApply = async () => {
    if (!previewUrl) return;
    setIsProcessing(true);
    try {
      await onSaveLogo(previewUrl, selectedFileName || 'custom-logo.png');
      setSuccessToast('Real logo updated successfully!');
      setTimeout(() => {
        setIsProcessing(false);
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to save logo.');
      setIsProcessing(false);
    }
  };

  const handleReset = async () => {
    setIsProcessing(true);
    try {
      await onResetLogo();
      setPreviewUrl(null);
      setSelectedFileName('');
      setSuccessToast('Reset to original 3D Gold Logo!');
      setTimeout(() => {
        setIsProcessing(false);
        onClose();
      }, 700);
    } catch {
      setIsProcessing(false);
    }
  };

  const scaleClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-11 sm:h-12',
    lg: 'h-16 sm:h-18',
    xl: 'h-22 sm:h-24'
  };

  return (
    <div 
      id="logo-upload-modal-backdrop"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="logo-upload-modal-container"
        className="relative w-full max-w-xl bg-[#17211f] border border-[#b58b4a]/40 rounded-3xl p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.65)] text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#b58b4a] to-transparent" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#b58b4a]/20 border border-[#b58b4a]/40 flex items-center justify-center text-[#d9bf8c]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#d9bf8c]">
                  Brand Customization
                </span>
                {isCustomActive && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active Custom Logo
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Upload Your Real Estate Logo
              </h3>
            </div>
          </div>

          <button
            id="logo-modal-close-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status / Success Toast */}
        {successToast && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Drag & Drop Zone */}
        <div className="mt-5 space-y-4">
          <div
            id="logo-dropzone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
              dragActive 
                ? 'border-[#d9bf8c] bg-[#b58b4a]/15 scale-[1.01]' 
                : 'border-white/15 hover:border-[#b58b4a]/60 bg-white/5 hover:bg-white/[0.08]'
            }`}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif"
              onChange={handleInputChange}
              className="hidden"
            />

            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform ${
              dragActive ? 'bg-[#b58b4a] text-[#17362f] scale-110' : 'bg-white/10 text-[#d9bf8c]'
            }`}>
              <UploadCloud className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">
                <span className="text-[#d9bf8c] underline underline-offset-4 hover:text-[#f3e3b6]">Click to browse</span> or drag &amp; drop your logo
              </p>
              <p className="text-xs text-slate-400">
                Supports transparent PNG, SVG, JPG, WebP (Max 8MB)
              </p>
            </div>

            {selectedFileName && (
              <div className="mt-1 px-3 py-1 rounded-lg bg-[#b58b4a]/20 border border-[#b58b4a]/40 text-[#d9bf8c] text-xs font-mono font-medium flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Selected: {selectedFileName} ({fileSizeKb} KB)</span>
              </div>
            )}
          </div>

          {/* Quick Select Original Photos & Assets */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-[#d9bf8c] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#b58b4a]" />
              <span>Or Choose Original Photo &amp; Brand Assets</span>
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => handleSelectPreset('/assets/jsg-logo.png', 'Original High-Res Logo (White/Gold)')}
                className="flex flex-col items-center p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#b58b4a]/50 transition-all cursor-pointer group text-center"
              >
                <div className="h-10 w-full flex items-center justify-center p-1 bg-black/40 rounded-lg mb-1.5">
                  <img src="/assets/jsg-logo.png" alt="Original Logo" className="max-h-full max-w-full object-contain" />
                </div>
                <span className="text-[10px] font-bold text-slate-200 group-hover:text-[#d9bf8c] line-clamp-1">
                  Original Logo
                </span>
                <span className="text-[9px] text-slate-400">High-Res PNG</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('/assets/jsg-logo-transparent.png', 'Original Transparent 3D Emblem')}
                className="flex flex-col items-center p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#b58b4a]/50 transition-all cursor-pointer group text-center"
              >
                <div className="h-10 w-full flex items-center justify-center p-1 bg-[#17362f]/60 rounded-lg mb-1.5">
                  <img src="/assets/jsg-logo-transparent.png" alt="Transparent Emblem" className="max-h-full max-w-full object-contain" />
                </div>
                <span className="text-[10px] font-bold text-slate-200 group-hover:text-[#d9bf8c] line-clamp-1">
                  3D Emblem
                </span>
                <span className="text-[9px] text-slate-400">Transparent</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('/assets/founder.jpg', 'Original Founder & CEO Photo')}
                className="flex flex-col items-center p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#b58b4a]/50 transition-all cursor-pointer group text-center"
              >
                <div className="h-10 w-full flex items-center justify-center p-1 bg-black/40 rounded-lg mb-1.5 overflow-hidden">
                  <img src="/assets/founder.jpg" alt="Founder Photo" className="max-h-full max-w-full object-cover rounded" />
                </div>
                <span className="text-[10px] font-bold text-slate-200 group-hover:text-[#d9bf8c] line-clamp-1">
                  Founder Photo
                </span>
                <span className="text-[9px] text-slate-400">Executive</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#b58b4a]/15 hover:bg-[#b58b4a]/25 border border-[#b58b4a]/40 hover:border-[#b58b4a] transition-all cursor-pointer group text-center"
              >
                <div className="h-10 w-full flex items-center justify-center rounded-lg mb-1.5 text-[#d9bf8c] group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-[#d9bf8c] line-clamp-1">
                  Upload Device
                </span>
                <span className="text-[9px] text-slate-300">Browse Files</span>
              </button>
            </div>
          </div>

          {/* Interactive Live Preview Box */}
          <div className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#d9bf8c] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#b58b4a]" />
                <span>Live Header Preview</span>
              </span>

              {/* Background Theme Switcher for Preview */}
              <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/10 text-[10px]">
                <button
                  type="button"
                  onClick={() => setPreviewBg('emerald')}
                  className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    previewBg === 'emerald' ? 'bg-[#17362f] text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Emerald
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewBg('light')}
                  className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    previewBg === 'light' ? 'bg-[#fbfaf7] text-[#17362f] font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewBg('dark')}
                  className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    previewBg === 'dark' ? 'bg-slate-950 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>

            {/* Simulated Header Container */}
            <div 
              className={`rounded-xl p-4 flex items-center justify-between border transition-all ${
                previewBg === 'emerald'
                  ? 'bg-[#17362f] border-[#b58b4a]/30 shadow-inner'
                  : previewBg === 'light'
                  ? 'bg-[#fbfaf7] border-slate-200 shadow-inner'
                  : 'bg-slate-950 border-white/10 shadow-inner'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <img
                    id="preview-logo-img"
                    src={previewUrl || currentLogoUrl}
                    alt="Logo Preview"
                    className={`${scaleClasses[previewScale]} w-auto object-contain drop-shadow-md`}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-black tracking-wider leading-none ${
                    previewBg === 'light' ? 'text-[#17362f]' : 'text-white'
                  }`}>
                    JSG REAL ESTATE
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-[0.22em] text-[#d9bf8c] mt-0.5">
                    DUBAI · LUXURY PROPERTIES
                  </span>
                </div>
              </div>

              {/* Sample Navigation Link */}
              <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#d9bf8c]">
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-[11px]">
                  Header Preview
                </span>
              </div>
            </div>

            {/* Scale Adjuster */}
            <div className="flex items-center justify-between pt-1 text-xs text-slate-300">
              <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                <Sliders className="w-3 h-3 text-[#b58b4a]" /> Sizing:
              </span>
              <div className="flex items-center gap-1">
                {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPreviewScale(s)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      previewScale === s
                        ? 'bg-[#b58b4a] text-[#17362f]'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
          <div>
            {isCustomActive && (
              <button
                id="reset-to-default-logo-btn"
                type="button"
                onClick={handleReset}
                disabled={isProcessing}
                className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-300 text-slate-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/10"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to 3D Gold Emblem</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="cancel-logo-upload-btn"
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              id="apply-logo-upload-btn"
              type="button"
              onClick={handleApply}
              disabled={!previewUrl || isProcessing}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                previewUrl && !isProcessing
                  ? 'bg-[#b58b4a] hover:bg-[#c49a55] text-[#17362f] shadow-[#b58b4a]/20'
                  : 'bg-white/10 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isProcessing ? 'Applying...' : 'Apply Logo'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
