import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize2, AlertCircle, RefreshCw, Radio, CheckCircle, ShieldAlert } from 'lucide-react';
import { ParsedStream } from '../types';

interface StreamPlayerProps {
  stream: ParsedStream;
  streamTitle?: string;
  isLive?: boolean;
}

export const StreamPlayer: React.FC<StreamPlayerProps> = ({
  stream,
  streamTitle = 'Live Broadcast',
  isLive = true
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showUnmutePrompt, setShowUnmutePrompt] = useState<boolean>(true);
  const [qualityLevel, setQualityLevel] = useState<string>('Auto (1080p)');

  // Handle HLS and standard video sources
  useEffect(() => {
    setHasError(false);
    setErrorMessage('');
    setShowUnmutePrompt(true);

    if (stream.type === 'hls' && stream.streamUrl && videoRef.current) {
      const video = videoRef.current;

      if (Hls.isSupported()) {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }

        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 60,
        });
        hlsRef.current = hls;

        hls.loadSource(stream.streamUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {
            // Autoplay blocked by browser policy
            video.muted = true;
            setIsMuted(true);
            video.play().catch(() => {});
          });
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                setHasError(true);
                setErrorMessage('Stream network error: Source might be offline, blocked by CORS, or mixed-content HTTP.');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                setHasError(true);
                setErrorMessage('Fatal stream error encountered.');
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native Safari HLS
        video.src = stream.streamUrl;
        video.play().catch(() => {
          video.muted = true;
          setIsMuted(true);
        });
      } else {
        setHasError(true);
        setErrorMessage('HLS video playback is not supported in this browser environment.');
      }
    } else if (stream.type === 'video' && stream.streamUrl && videoRef.current) {
      const video = videoRef.current;
      video.src = stream.streamUrl;
      video.play().catch(() => {
        video.muted = true;
        setIsMuted(true);
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [stream]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    setShowUnmutePrompt(false);
  };

  const toggleFullscreen = () => {
    const el = document.getElementById('player-container');
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const retryPlayback = () => {
    setHasError(false);
    if (stream.type === 'hls' && hlsRef.current && stream.streamUrl) {
      hlsRef.current.loadSource(stream.streamUrl);
      hlsRef.current.startLoad();
    } else if (videoRef.current && stream.streamUrl) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div
      id="player-container"
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center group"
    >
      {/* Live Badge Overlay */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        {isLive && (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-red-600/90 backdrop-blur-md text-white font-bold text-xs rounded-full uppercase tracking-wider shadow-lg animate-pulse">
            <Radio className="w-3.5 h-3.5" /> Live
          </span>
        )}
        <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-slate-300 font-mono text-xs rounded-full border border-slate-700/50">
          {stream.type.toUpperCase()}
        </span>
      </div>

      {/* Quality indicator on top right */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-emerald-400 font-medium text-xs rounded-full border border-emerald-500/30 flex items-center gap-1.5">
          <CheckCircle className="w-3 h-3" /> Ultra Low Latency
        </span>
      </div>

      {/* Unmute banner for browser autoplay compliance */}
      {showUnmutePrompt && isMuted && (stream.type === 'hls' || stream.type === 'video') && (
        <button
          type="button"
          onClick={toggleMute}
          className="absolute top-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-full shadow-2xl cursor-pointer transition-transform hover:scale-105"
        >
          <VolumeX className="w-4 h-4" /> Sound is Muted (Browser Autoplay Rule) — Click to Unmute
        </button>
      )}

      {/* Video Content: HLS or Direct Video */}
      {(stream.type === 'hls' || stream.type === 'video') && (
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          playsInline
          autoPlay
          muted={isMuted}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      {/* YouTube Embed */}
      {stream.type === 'youtube' && stream.embedUrl && (
        <iframe
          src={stream.embedUrl}
          title={streamTitle}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}

      {/* Twitch Embed */}
      {stream.type === 'twitch' && stream.embedUrl && (
        <iframe
          src={stream.embedUrl}
          title={streamTitle}
          className="w-full h-full border-0"
          allowFullScreen
        />
      )}

      {/* Kick Embed */}
      {stream.type === 'kick' && stream.embedUrl && (
        <iframe
          src={stream.embedUrl}
          title={streamTitle}
          className="w-full h-full border-0"
          allowFullScreen
        />
      )}

      {/* Generic Website / Iframe Preview */}
      {stream.type === 'iframe' && stream.embedUrl && (
        <div className="w-full h-full relative">
          <iframe
            src={stream.embedUrl}
            title={streamTitle}
            className="w-full h-full border-0 bg-white"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
          {stream.warning && (
            <div className="absolute bottom-4 left-4 right-4 z-20 p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Notice regarding external site preview:</p>
                <p>{stream.warning}</p>
                <p className="mt-1 text-slate-300">{stream.suggestedFix}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Overlay */}
      {hasError && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center">
          <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/30 text-red-400 mb-3">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h4 className="text-white font-semibold text-base mb-1">Playback Failed</h4>
          <p className="text-slate-400 text-xs max-w-md mb-4">{errorMessage}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={retryPlayback}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg border border-slate-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Stream
            </button>
          </div>
        </div>
      )}

      {/* Video Controls (for HLS and HTML5) */}
      {(stream.type === 'hls' || stream.type === 'video') && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <span className="text-xs font-mono text-slate-300">Live 1080p60</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
