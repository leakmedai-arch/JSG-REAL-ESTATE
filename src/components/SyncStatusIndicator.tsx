import React, { useState } from 'react';
import { 
  CheckCircle2, 
  RefreshCw, 
  Database, 
  Server, 
  Smartphone, 
  Monitor, 
  AlertCircle,
  Clock,
  Wifi,
  WifiOff,
  ChevronUp,
  X
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export const SyncStatusIndicator: React.FC = () => {
  const { syncState, contentVersion, lastUpdatedAt, refreshData } = useSiteData();
  const [isOpen, setIsOpen] = useState(false);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setIsManualRefreshing(true);
    await refreshData();
    setTimeout(() => setIsManualRefreshing(false), 600);
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return 'Just now';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 select-none">
      {/* Expanded Popover Details Modal */}
      {isOpen && (
        <div 
          className="mb-3 w-80 sm:w-96 rounded-2xl bg-[#0d221c]/95 backdrop-blur-xl border border-[#b58b4a]/50 text-white p-4 shadow-2xl animate-fadeIn"
          role="dialog"
          aria-label="Central Data Architecture Status"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#b58b4a]/20 border border-[#b58b4a]/50 flex items-center justify-center text-[#d9bf8c]">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide">
                  Central Source of Truth
                </h4>
                <p className="text-[10px] text-[#d9bf8c]">
                  Authoritative Global State v{contentVersion}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Architecture Pipeline Map */}
          <div className="my-3 p-2.5 rounded-xl bg-black/30 border border-white/5 text-[11px] space-y-2">
            <div className="flex items-center justify-between text-stone-300">
              <span className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                <span>Central Database</span>
              </span>
              <span className="text-emerald-400 font-mono font-bold text-[10px]">
                Active (v{contentVersion})
              </span>
            </div>

            <div className="flex items-center justify-between text-stone-300">
              <span className="flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-[#d9bf8c]" />
                <span>Large Desktop / 4K / Projector</span>
              </span>
              <span className="text-stone-400 text-[10px]">Synchronized</span>
            </div>

            <div className="flex items-center justify-between text-stone-300">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#d9bf8c]" />
                <span>Mobile & Tablets</span>
              </span>
              <span className="text-stone-400 text-[10px]">Synchronized</span>
            </div>
          </div>

          {/* Status info */}
          <div className="space-y-1.5 text-[11px] text-stone-300">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-stone-400">
                <Clock className="w-3 h-3" />
                <span>Last Published Sync:</span>
              </span>
              <span className="font-mono text-[#d9bf8c]">{formatTime(lastUpdatedAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-stone-400">
                <Wifi className="w-3 h-3" />
                <span>Real-Time Broadcast:</span>
              </span>
              <span className="text-emerald-400 font-semibold">SSE Connected</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
            <span className="text-[10px] text-stone-400">
              All devices share identical content
            </span>
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isManualRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#0d221c] text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isManualRefreshing ? 'animate-spin' : ''}`} />
              <span>{isManualRefreshing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Collapsed Luxury Badge / Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-[#0d221c]/90 hover:bg-[#0d221c] backdrop-blur-md border border-[#b58b4a]/60 text-white shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
        title="Central Source of Truth Sync Status"
        aria-expanded={isOpen}
      >
        {syncState === 'synced' && (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        )}

        {syncState === 'saving' && (
          <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
        )}

        {syncState === 'saved' && (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        )}

        {syncState === 'offline' && (
          <WifiOff className="w-3 h-3 text-rose-400" />
        )}

        {syncState === 'conflict' && (
          <AlertCircle className="w-3 h-3 text-amber-400" />
        )}

        <div className="flex items-center gap-1.5 text-xs font-semibold">
          {syncState === 'synced' && (
            <>
              <span className="text-stone-200">Live Synced</span>
              <span className="hidden sm:inline font-mono text-[10px] text-[#d9bf8c]">v{contentVersion}</span>
            </>
          )}
          {syncState === 'saving' && (
            <span className="text-amber-300">Publishing...</span>
          )}
          {syncState === 'saved' && (
            <span className="text-emerald-300">Saved Globally</span>
          )}
          {syncState === 'offline' && (
            <span className="text-rose-300">Cached (Offline)</span>
          )}
          {syncState === 'conflict' && (
            <span className="text-amber-300">Sync Required</span>
          )}
        </div>

        <ChevronUp className={`w-3.5 h-3.5 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};
