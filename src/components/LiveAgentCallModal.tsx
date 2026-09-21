import React, { useState, useEffect } from 'react';
import { 
  X, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  MapPin, 
  Volume2, 
  Maximize2,
  Compass,
  Building2,
  CheckCircle2,
  UserCheck
} from 'lucide-react';

interface LiveAgentCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle?: string;
  propertyLocation?: string;
  initialImage?: string;
  propertyPrice?: string;
}

interface PalaceLocation {
  id: string;
  title: string;
  palaceTag: string;
  location: string;
  price: string;
  coords: string;
  angles: {
    main: string;
    grandHall: string;
    terrace: string;
    grounds: string;
  };
}

const PALACE_LOCATIONS: PalaceLocation[] = [
  {
    id: 'palm-palace',
    title: 'Palm Jumeirah Sovereign Beach Palace',
    palaceTag: 'Oceanfront Trophy Palace',
    location: 'Frond N, Palm Jumeirah, Dubai',
    price: 'AED 125,000,000',
    coords: "25°07'15.4\"N 55°08'02.1\"E",
    angles: {
      main: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
      grandHall: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85',
      terrace: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
      grounds: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=85'
    }
  },
  {
    id: 'emirates-hills-manor',
    title: 'Emirates Hills Sovereign Fairway Palace',
    palaceTag: 'Private Golf Sanctuary',
    location: 'Sector E, Emirates Hills, Dubai',
    price: 'AED 98,000,000',
    coords: "25°04'30.8\"N 55°10'15.2\"E",
    angles: {
      main: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85',
      grandHall: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
      terrace: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=85',
      grounds: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85'
    }
  },
  {
    id: 'jumeirah-bay-island',
    title: 'Bvlgari Jumeirah Bay Sovereign Island Estate',
    palaceTag: 'Private Island Marina Palace',
    location: 'Jumeirah Bay Island, Dubai',
    price: 'AED 165,000,000',
    coords: "25°12'22.1\"N 55°14'10.8\"E",
    angles: {
      main: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
      grandHall: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
      terrace: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=85',
      grounds: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=85'
    }
  }
];

export const LiveAgentCallModal: React.FC<LiveAgentCallModalProps> = ({
  isOpen,
  onClose,
  propertyTitle = 'Palm Jumeirah Sovereign Beach Palace',
  propertyLocation = 'Frond N, Palm Jumeirah, Dubai',
  initialImage,
  propertyPrice = 'AED 125,000,000'
}) => {
  const [selectedPalaceId, setSelectedPalaceId] = useState<string>('palm-palace');
  const [callDuration, setCallDuration] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [agentStatus, setAgentStatus] = useState<'connecting' | 'connected'>('connecting');
  const [activeCameraAngle, setActiveCameraAngle] = useState<'main' | 'grandHall' | 'terrace' | 'grounds'>('main');
  const [showLocationMap, setShowLocationMap] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'agent' | 'user'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: "Marhaba! I am Sarah, your licensed JSG Real Estate advisor. I am live on location at the palace right now with our 4K stabilizer gimbal. What areas would you like me to walk you through?",
      time: 'Just now'
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const currentPalace = PALACE_LOCATIONS.find(p => p.id === selectedPalaceId) || PALACE_LOCATIONS[0];
  const activeTitle = propertyTitle || currentPalace.title;
  const activeLocation = propertyLocation || currentPalace.location;
  const activePrice = propertyPrice || currentPalace.price;

  // Call timer
  useEffect(() => {
    if (!isOpen) {
      setCallDuration(0);
      setAgentStatus('connecting');
      return;
    }

    const connectTimer = setTimeout(() => {
      setAgentStatus('connected');
    }, 1000);

    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(connectTimer);
      clearInterval(timer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setMessages(prev => [...prev, { sender: 'user', text: userText, time: 'Now' }]);
    setInputMsg('');

    // Agent live response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'agent',
          text: `Directing the 4K camera to that viewpoint immediately! The estate features bespoke Italian travertine, 4.2m ceiling volume, and direct beach access.`,
          time: 'Now'
        }
      ]);
    }, 900);
  };

  const currentBgImage = initialImage && activeCameraAngle === 'main' 
    ? initialImage 
    : currentPalace.angles[activeCameraAngle];

  return (
    <div 
      id="live-agent-call-modal"
      className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl h-[92vh] max-h-[800px] bg-[#0d221c] border border-[#b58b4a]/50 rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.9)] flex flex-col md:flex-row text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left / Main Video Feed */}
        <div className="relative flex-1 bg-[#091713] flex flex-col justify-between overflow-hidden">
          {/* Active Live Camera Stream Background */}
          <div className="absolute inset-0 z-0">
            <img 
              src={currentBgImage} 
              alt="Live Palace View" 
              className="w-full h-full object-cover transition-all duration-700 filter brightness-95"
              referrerPolicy="no-referrer"
            />
            {/* Live Camera Subtle Scanline & Warm Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d221c] via-transparent to-black/70 pointer-events-none" />
          </div>

          {/* Top Video Header HUD */}
          <div className="relative z-10 p-3.5 sm:p-5 flex items-center justify-between pointer-events-auto">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>LIVE AGENT 4K CALL</span>
              </div>
              <div className="bg-[#0e2922]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold text-[#d9bf8c] border border-[#b58b4a]/30">
                {formatTime(callDuration)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-[#0e2922]/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-semibold text-[#fbfaf7] border border-[#b58b4a]/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />
                <span className="hidden sm:inline">RERA Verified Broker</span>
              </div>
              <button 
                type="button" 
                onClick={onClose}
                className="p-2 rounded-xl bg-[#0e2922]/80 hover:bg-[#14362d] text-white border border-[#b58b4a]/30 transition-colors cursor-pointer"
                title="End Call"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Picture-in-Picture: Agent & Client Feed */}
          <div className="absolute top-16 right-3 sm:top-20 sm:right-4 z-10 flex flex-col gap-2">
            {/* Agent Live Cam PIP */}
            <div className="w-28 sm:w-36 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#b58b4a] shadow-2xl bg-[#091713] relative">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" 
                alt="Licensed Agent Sarah"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 inset-x-0 p-1 bg-gradient-to-t from-black/90 via-[#0e2922]/80 to-transparent text-[10px] font-bold text-center flex items-center justify-center gap-1 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Sarah (Live On Location)</span>
              </div>
            </div>

            {/* Client Selfie Cam Simulation */}
            <div className="w-20 sm:w-24 aspect-[4/3] rounded-xl overflow-hidden border border-[#b58b4a]/40 shadow-xl bg-[#0d221c] relative self-end">
              {isVideoMuted ? (
                <div className="w-full h-full flex items-center justify-center bg-[#091713] text-stone-400">
                  <VideoOff className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-full h-full bg-[#112923] flex items-center justify-center text-[10px] text-[#d9bf8c]">
                  <span>Your Cam</span>
                </div>
              )}
              <div className="absolute bottom-0 inset-x-0 p-0.5 bg-black/70 text-[8px] text-center text-stone-300">
                You
              </div>
            </div>
          </div>

          {/* Bottom Video Controls & Camera Pan Buttons */}
          <div className="relative z-10 p-3 sm:p-5 space-y-2.5 pointer-events-auto">
            {/* Palace Switcher Strip */}
            <div className="bg-[#0e2922]/85 backdrop-blur-md border border-[#b58b4a]/30 rounded-2xl p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#d9bf8c] flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#b58b4a]" /> Live Palace Location:
                </span>
                <select
                  value={selectedPalaceId}
                  onChange={(e) => {
                    setSelectedPalaceId(e.target.value);
                    setActiveCameraAngle('main');
                  }}
                  className="bg-[#17362f] border border-[#b58b4a]/40 rounded-xl px-2.5 py-1 text-xs font-semibold text-white outline-none cursor-pointer"
                >
                  {PALACE_LOCATIONS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#fbfaf7]/80">
                <MapPin className="w-3.5 h-3.5 text-[#b58b4a]" />
                <span className="font-mono text-[#d9bf8c]">{currentPalace.coords}</span>
              </div>
            </div>

            {/* Direct Camera Inspection Angles */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] font-bold text-[#fbfaf7] bg-[#0e2922]/90 px-2.5 py-1 rounded-lg border border-[#b58b4a]/30 flex items-center gap-1">
                <Eye className="w-3 h-3 text-[#d9bf8c]" /> Ask Agent to Walk:
              </span>
              {[
                { id: 'main', label: 'Grand Entrance & Salon' },
                { id: 'grandHall', label: 'Marble Majlis Hall' },
                { id: 'terrace', label: 'Private Beach / Fairway' },
                { id: 'grounds', label: 'Master Suite & Grounds' }
              ].map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setActiveCameraAngle(loc.id as any)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    activeCameraAngle === loc.id
                      ? 'bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#0d221c] border-[#b58b4a] shadow-lg font-black'
                      : 'bg-[#0e2922]/80 hover:bg-[#14362d] text-[#fbfaf7] border-[#b58b4a]/25'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>

            {/* In-Call Audio / Video Action Bar */}
            <div className="flex items-center justify-between bg-[#0e2922]/90 backdrop-blur-xl border border-[#b58b4a]/35 rounded-2xl p-2.5 sm:p-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white truncate max-w-[140px] sm:max-w-none">
                    {activeTitle}
                  </span>
                </div>
              </div>

              {/* Call Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMicMuted(!isMicMuted)}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    isMicMuted 
                      ? 'bg-red-500/20 text-red-400 border-red-500/40' 
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                  }`}
                  title={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsVideoMuted(!isVideoMuted)}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    isVideoMuted 
                      ? 'bg-red-500/20 text-red-400 border-red-500/40' 
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                  }`}
                  title={isVideoMuted ? 'Enable video' : 'Stop video'}
                >
                  {isVideoMuted ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>End Live Call</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right / Live Chat & Palace Notes */}
        <div className="w-full md:w-80 lg:w-96 bg-gradient-to-b from-[#112923] to-[#0c1c18] border-t md:border-t-0 md:border-l border-[#b58b4a]/30 flex flex-col justify-between p-4 sm:p-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#b58b4a]/25">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#d9bf8c]" />
                <h4 className="text-sm font-bold text-white">Live Palace Concierge</h4>
              </div>
              <span className="text-[10px] text-emerald-300 font-mono bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                Connected · 4K
              </span>
            </div>

            {/* Current Palace Details Card */}
            <div className="mt-3 p-3 rounded-2xl bg-[#091713]/80 border border-[#b58b4a]/30 space-y-1 text-xs">
              <div className="text-[10px] uppercase tracking-wider font-bold text-[#b58b4a]">Selected Estate</div>
              <div className="font-extrabold text-white text-sm leading-tight">{activeTitle}</div>
              <div className="flex items-center gap-1 text-[11px] text-[#fbfaf7]/80">
                <MapPin className="w-3 h-3 text-[#d9bf8c]" />
                <span>{activeLocation}</span>
              </div>
              <div className="text-[#d9bf8c] font-bold text-xs pt-1">{activePrice}</div>
            </div>

            <p className="text-[11px] text-[#e8dfd3] mt-2.5 leading-relaxed">
              Ask Sarah to walk toward the beach, inspect marble stonework, or clarify payment schedules live on camera.
            </p>

            {/* Chat message history */}
            <div className="mt-3 space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
              {messages.map((m, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-2xl text-xs space-y-1 ${
                    m.sender === 'agent' 
                      ? 'bg-[#17362f]/80 border border-[#b58b4a]/25 text-[#fbfaf7]' 
                      : 'bg-gradient-to-r from-[#b58b4a]/30 to-[#d9bf8c]/20 border border-[#b58b4a]/50 text-amber-100 ml-4'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-[#d9bf8c]">
                    <span className="font-bold">{m.sender === 'agent' ? 'Sarah (JSG Advisor)' : 'You'}</span>
                    <span>{m.time}</span>
                  </div>
                  <p>{m.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Message input */}
          <form onSubmit={handleSendMessage} className="mt-3 pt-3 border-t border-[#b58b4a]/25">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Ask agent: 'Walk into the master salon...'"
                className="flex-1 bg-[#091713]/80 border border-[#b58b4a]/35 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-[#b58b4a]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] hover:brightness-110 text-[#0d221c] font-black text-xs transition-colors cursor-pointer shadow-md"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
