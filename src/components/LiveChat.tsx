import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Users, Shield, Heart, Flame, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    user: 'Alex_StreamDev',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&auto=format&fit=crop&q=80',
    badge: 'streamer',
    color: 'text-amber-400',
    text: 'Welcome everyone to the stream! Let me know if the audio and 1080p video feed is crisp.',
    timestamp: '12:00'
  },
  {
    id: '2',
    user: 'KoraGamer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&auto=format&fit=crop&q=80',
    badge: 'mod',
    color: 'text-emerald-400',
    text: 'Audio is 10/10! Latency is less than 1 second.',
    timestamp: '12:01'
  },
  {
    id: '3',
    user: 'CyberNaut',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=64&auto=format&fit=crop&q=80',
    badge: 'vip',
    color: 'text-purple-400',
    text: 'The previous website was buffering a lot, but this rebuilt player is super smooth!',
    timestamp: '12:02'
  },
  {
    id: '4',
    user: 'PixelPulse',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&auto=format&fit=crop&q=80',
    badge: 'sub',
    color: 'text-sky-400',
    text: 'Love this layout! So clean and responsive on mobile too.',
    timestamp: '12:03'
  }
];

export const LiveChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState<string>('');
  const [viewerCount, setViewerCount] = useState<number>(1420);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Periodic random chat simulator for realistic live feel
  useEffect(() => {
    const randomComments = [
      { user: 'NovaRider', text: 'This stream player works way better!', badge: 'sub' as const, color: 'text-sky-400' },
      { user: 'EchoWave', text: 'Drop the website link in chat!', badge: undefined, color: 'text-slate-300' },
      { user: 'VibeCheck', text: '🔥 Let’s goooo!!', badge: 'vip' as const, color: 'text-purple-400' },
      { user: 'ZaneCode', text: 'No frame drops at all. Clean encode.', badge: 'mod' as const, color: 'text-emerald-400' },
    ];

    const interval = setInterval(() => {
      const random = randomComments[Math.floor(Math.random() * randomComments.length)];
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      setMessages((prev) => [
        ...prev.slice(-40),
        {
          id: Math.random().toString(36).substring(2, 9),
          user: random.user,
          avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&auto=format&fit=crop&q=80`,
          badge: random.badge,
          color: random.color,
          text: random.text,
          timestamp: timeStr
        }
      ]);

      setViewerCount((v) => v + Math.floor(Math.random() * 5) - 2);
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      user: 'You',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&auto=format&fit=crop&q=80',
      badge: 'streamer',
      color: 'text-amber-400',
      text: inputVal.trim(),
      timestamp: timeStr
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');
  };

  const sendReaction = (emoji: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        user: 'You',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&auto=format&fit=crop&q=80',
        badge: 'streamer',
        color: 'text-amber-400',
        text: emoji,
        timestamp: timeStr
      }
    ]);
  };

  return (
    <div id="live-chat-panel" className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-semibold text-white text-sm">Stream Chat</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-mono text-white font-medium">{viewerCount.toLocaleString()}</span>
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[480px]">
        {messages.map((msg) => (
          <div key={msg.id} className="text-xs leading-relaxed flex items-start gap-2">
            <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
              {msg.badge === 'streamer' && (
                <span className="px-1 py-0.2 bg-amber-500 text-slate-950 rounded font-bold text-[9px] uppercase tracking-wider">
                  Host
                </span>
              )}
              {msg.badge === 'mod' && (
                <span className="px-1 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded font-semibold text-[9px] uppercase">
                  Mod
                </span>
              )}
              {msg.badge === 'vip' && (
                <span className="px-1 py-0.2 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded font-semibold text-[9px] uppercase">
                  VIP
                </span>
              )}
              <span className={`font-semibold ${msg.color}`}>{msg.user}:</span>
            </div>
            <span className="text-slate-200 break-words">{msg.text}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Reaction quick bar */}
      <div className="px-3 py-1.5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-around text-sm">
        <button
          type="button"
          onClick={() => sendReaction('🔥 Hot stream!')}
          className="p-1 hover:bg-slate-800 rounded transition-colors"
          title="Fire"
        >
          🔥
        </button>
        <button
          type="button"
          onClick={() => sendReaction('❤️ GG')}
          className="p-1 hover:bg-slate-800 rounded transition-colors"
          title="Love"
        >
          ❤️
        </button>
        <button
          type="button"
          onClick={() => sendReaction('🎉 GGWP')}
          className="p-1 hover:bg-slate-800 rounded transition-colors"
          title="Party"
        >
          🎉
        </button>
        <button
          type="button"
          onClick={() => sendReaction('🚀 Crisp 1080p')}
          className="p-1 hover:bg-slate-800 rounded transition-colors"
          title="Rocket"
        >
          🚀
        </button>
        <button
          type="button"
          onClick={() => sendReaction('👑 Best quality')}
          className="p-1 hover:bg-slate-800 rounded transition-colors"
          title="Crown"
        >
          👑
        </button>
      </div>

      {/* Input box */}
      <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <input
          id="chat-input"
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Send a live message..."
          className="flex-1 bg-slate-900 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!inputVal.trim()}
          className="p-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 rounded-xl cursor-pointer transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
