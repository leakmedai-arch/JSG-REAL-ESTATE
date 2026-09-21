import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  Send, 
  Users, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Volume2, 
  VolumeX, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { ALL_PROPERTIES } from '../data/realEstateData';
import { Property } from '../types/jsg';

interface LiveShowcasePageProps {
  onNavigate: (path: string) => void;
  onSelectProperty: (property: Property) => void;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isHost?: boolean;
}

export const LiveShowcasePage: React.FC<LiveShowcasePageProps> = ({ onNavigate, onSelectProperty }) => {
  const property = ALL_PROPERTIES.find((p) => p.videoUrl) || ALL_PROPERTIES[0];
  const [muted, setMuted] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'JSG Host (Elena)', text: 'Welcome everyone to the private walkthrough of the Villa Amara on Palm Jumeirah!', time: '12:00', isHost: true },
    { id: '2', sender: 'Marcus (London)', text: 'What is the exact private beach frontage width on this property?', time: '12:01' },
    { id: '3', sender: 'JSG Host (Elena)', text: 'Hello Marcus! It has 45 meters of private beach directly overlooking the Atlantis sunset skyline.', time: '12:02', isHost: true },
    { id: '4', sender: 'Khalid (Riyadh)', text: 'Is the property vacant on transfer or currently leased?', time: '12:03' },
    { id: '5', sender: 'JSG Host (Elena)', text: 'Completely vacant on transfer! Fully brand-new turnkey Italian designer furniture included.', time: '12:04', isHost: true }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [viewerCount, setViewerCount] = useState(148);
  const [bookingSent, setBookingSent] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'You (VIP Guest)',
      text: inputMsg.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');

    // Simulated host reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'JSG Host (Elena)',
          text: 'Thank you for your question! One of our senior advisors is also messaging you on private chat.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isHost: true
        }
      ]);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#0d1f1a] text-slate-100 pb-20">
      {/* Top Bar */}
      <div className="bg-[#17362f]/80 backdrop-blur-md border-b border-[#b58b4a]/30 px-4 sm:px-6 lg:px-8 py-4 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold animate-pulse">
              <Radio className="w-3.5 h-3.5" />
              <span>LIVE BROADCAST</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#d9bf8c] font-semibold">
              <Users className="w-3.5 h-3.5" />
              <span>{viewerCount} Accredited Viewers</span>
            </div>
          </div>

          <button
            onClick={() => setBookingSent(true)}
            className="px-4 py-1.5 rounded-xl bg-[#b58b4a] hover:bg-[#d9bf8c] text-[#142621] text-xs font-extrabold transition-all cursor-pointer shadow"
          >
            Book Private In-Person Viewing
          </button>
        </div>
      </div>

      {/* Main Broadcast Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Video Player Column (Cols 1-8) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-black border border-[#b58b4a]/30 shadow-2xl group">
              {property.videoUrl ? (
                <video
                  src={property.videoUrl}
                  autoPlay
                  loop
                  playsInline
                  muted={muted}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => setMuted(!muted)}
                className="absolute bottom-4 right-4 p-3 rounded-2xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                title={muted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {muted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
              </button>

              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>4K Ultra HD Walkthrough Stream</span>
              </div>
            </div>

            {/* Property Overview Card */}
            <div className="bg-[#17362f] rounded-3xl p-6 border border-[#b58b4a]/30 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#d9bf8c] mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#b58b4a]" />
                    <span>{property.location}</span>
                  </div>
                  <h1 className="text-2xl font-black text-white">{property.title}</h1>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xs text-slate-300">Listing Asking Price</div>
                  <div className="text-2xl font-black text-[#d9bf8c]">
                    AED {property.price.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 py-3 border-y border-white/10 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <Bed className="w-4 h-4 text-[#b58b4a]" />
                  <span>{property.beds} Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-4 h-4 text-[#b58b4a]" />
                  <span>{property.baths} Bathrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize className="w-4 h-4 text-[#b58b4a]" />
                  <span>{property.area.toLocaleString()} sqft</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {property.description}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => onSelectProperty(property)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  View Full Specifications
                </button>
                <button
                  onClick={() => onNavigate('/buy/mortgage-calculator')}
                  className="px-5 py-2.5 rounded-xl bg-[#b58b4a] hover:bg-[#d9bf8c] text-[#142621] text-xs font-extrabold transition-colors cursor-pointer"
                >
                  Calculate Mortgage for this Property
                </button>
              </div>
            </div>
          </div>

          {/* Live Chat Column (Cols 9-12) */}
          <div className="lg:col-span-4 flex flex-col h-[600px] bg-[#142621] rounded-3xl border border-[#b58b4a]/30 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-[#17362f] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Live Inquiry Stream</h3>
              </div>
              <span className="text-[11px] text-[#d9bf8c] font-semibold">Moderated by JSG</span>
            </div>

            {/* Chat message list */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-2xl ${
                    m.isHost
                      ? 'bg-[#17362f] border border-[#b58b4a]/40 text-[#fbfaf7]'
                      : 'bg-white/5 text-slate-200 border border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className={`font-extrabold ${m.isHost ? 'text-[#d9bf8c]' : 'text-slate-300'}`}>
                      {m.sender}
                    </span>
                    <span className="text-slate-400">{m.time}</span>
                  </div>
                  <p className="leading-relaxed">{m.text}</p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input field */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-[#17362f] flex gap-2">
              <input
                type="text"
                placeholder="Ask the presenter a question..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="flex-1 bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-400 outline-none focus:border-[#b58b4a]"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-[#b58b4a] hover:bg-[#d9bf8c] text-[#142621] transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingSent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-4 animate-scaleUp">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-black text-[#17362f]">VIP Viewing Confirmed</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your request for a private chauffeur-driven in-person inspection of <strong>{property.title}</strong> has been received. Our executive concierge will confirm timing within 30 minutes.
            </p>
            <button
              onClick={() => setBookingSent(false)}
              className="w-full py-3 rounded-xl bg-[#17362f] text-[#d9bf8c] font-bold text-xs cursor-pointer hover:bg-[#21483d] transition-colors"
            >
              Back to Live Broadcast
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
