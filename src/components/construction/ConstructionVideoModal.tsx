import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Film, 
  Link as LinkIcon, 
  Check, 
  AlertCircle, 
  RotateCcw,
  Play,
  Pause,
  Video
} from 'lucide-react';

interface ConstructionVideoModalProps {
  isOpen: boolean;
  currentVideoUrl: string;
  onClose: () => void;
  onApplyVideo: (videoUrl: string, file?: File) => Promise<void>;
  onResetToDefault: () => Promise<void>;
}

export const ConstructionVideoModal: React.FC<ConstructionVideoModalProps> = ({
  isOpen,
  currentVideoUrl,
  onClose,
  onApplyVideo,
  onResetToDefault
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentVideoUrl);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|webm|mov|m4v)$/i)) {
      setStatusMessage({ type: 'error', text: 'Please select a valid video file (MP4, WebM, or MOV).' });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    setStatusMessage({
      type: 'info',
      text: `Selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB). Click "Apply Video" below to save.`
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('/')) {
      setStatusMessage({ type: 'error', text: 'Please provide a valid video URL starting with https:// or /' });
      return;
    }
    setPreviewUrl(trimmed);
    setSelectedFile(null);
    setStatusMessage({ type: 'info', text: 'Video URL loaded. Click "Apply Video" below to confirm.' });
  };

  const handleSaveAndApply = async () => {
    setIsProcessing(true);
    setStatusMessage(null);
    try {
      if (selectedFile) {
        await onApplyVideo(previewUrl, selectedFile);
      } else {
        await onApplyVideo(previewUrl);
      }
      setStatusMessage({ type: 'success', text: 'Video successfully updated!' });
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      console.error('Failed applying video:', err);
      setStatusMessage({ type: 'error', text: err?.message || 'Failed to apply video. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = async () => {
    setIsProcessing(true);
    try {
      await onResetToDefault();
      setPreviewUrl('/construction.mp4');
      setSelectedFile(null);
      setStatusMessage({ type: 'success', text: 'Restored official high-resolution construction video.' });
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Failed to reset video.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const togglePreviewPlay = () => {
    if (!videoPreviewRef.current) return;
    if (videoPreviewRef.current.paused) {
      videoPreviewRef.current.play();
      setIsPlaying(true);
    } else {
      videoPreviewRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-[#0f1d19] border border-[#c5a059]/40 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#142621] px-6 py-4 flex items-center justify-between border-b border-[#c5a059]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c5a059] to-[#8a631c] flex items-center justify-center text-[#0e241e] shadow">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#d9bf8c]">
                Scroll Video Studio
              </span>
              <h3 className="font-serif text-lg font-bold text-white leading-snug">
                Upload Architectural Construction Video
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Active Preview Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-400">
              <span className="flex items-center gap-1.5 text-[#d9bf8c]">
                <Video className="w-4 h-4" />
                <span>Live Video Preview</span>
              </span>
              <span className="text-[11px] text-stone-400">
                Responsive to Scroll Experience
              </span>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-[#c5a059]/30 aspect-video group flex items-center justify-center shadow-inner">
              <video
                ref={videoPreviewRef}
                src={previewUrl}
                playsInline
                muted
                loop
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-cover"
              />

              {/* Play/Pause Overlay Control */}
              <button
                type="button"
                onClick={togglePreviewPlay}
                className="absolute inset-0 bg-black/30 hover:bg-black/20 flex items-center justify-center transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#142621]/90 border border-[#c5a059] text-[#c5a059] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </div>
              </button>

              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-mono text-[#d9bf8c] border border-white/10">
                {selectedFile ? `${selectedFile.name}` : (previewUrl === '/construction.mp4' ? 'Official Master Construction Video' : previewUrl)}
              </div>
            </div>
          </div>

          {/* Source Tabs */}
          <div className="flex border-b border-stone-800">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'upload'
                  ? 'border-[#c5a059] text-[#d9bf8c]'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Video File (MP4, WebM, MOV)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'url'
                  ? 'border-[#c5a059] text-[#d9bf8c]'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              Direct Video URL
            </button>
          </div>

          {/* Tab 1: Upload File */}
          {activeTab === 'upload' && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                isDragging 
                  ? 'border-[#c5a059] bg-[#c5a059]/10' 
                  : 'border-[#c5a059]/30 hover:border-[#c5a059] bg-[#142621]/40 hover:bg-[#142621]/70'
              }`}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="video/mp4,video/webm,video/quicktime,video/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-2xl bg-[#142621] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] shadow-lg">
                <Upload className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">
                  Drag &amp; drop your construction video here, or <span className="text-[#d9bf8c] underline">Browse Files</span>
                </p>
                <p className="text-xs text-stone-400">
                  Supports MP4, WebM, and MOV up to 100MB. Video responds continuously to forward and backward scroll.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Direct URL */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-stone-300">
                Enter hosted video stream URL (HTTPS):
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/construction-footage.mp4"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-[#c5a059]/30 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-4 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d9bf8c] text-[#0e241e] font-bold text-xs cursor-pointer shadow transition-all"
                >
                  Load Preview
                </button>
              </div>
              <p className="text-[11px] text-stone-400">
                You can enter any direct MP4 link or hosted CDN asset.
              </p>
            </div>
          )}

          {/* Status Message */}
          {statusMessage && (
            <div className={`p-3 rounded-xl flex items-center gap-2 text-xs font-medium ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200' 
                : statusMessage.type === 'error'
                ? 'bg-rose-950/60 border border-rose-500/40 text-rose-200'
                : 'bg-amber-950/60 border border-amber-500/40 text-amber-200'
            }`}>
              {statusMessage.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#142621] px-6 py-4 border-t border-[#c5a059]/30 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-white/5 text-xs font-semibold transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default Footage</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-300 hover:text-white text-xs font-semibold hover:bg-white/5 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAndApply}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c5a059] to-[#d9bf8c] text-[#0e241e] font-bold text-xs shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Saving Video...</span>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Apply Video</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
