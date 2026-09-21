import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Calendar, 
  Phone, 
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Building2,
  RefreshCw
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { JSGLogo } from './JSGLogo';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendedPropertyIds?: number[];
  leadCaptured?: boolean;
}

export const AIConciergeWidget: React.FC = () => {
  const { aiSettings, properties, settings, submitLead } = useSiteData();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: aiSettings.welcomeMessage || 'Assalamu Alaikum, hope your day is blessed and prosperous—I am JSGpt, your intelligent property companion, how may I guide your vision today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Check Web Speech API availability
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            handleSend(transcript);
          }
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const speakText = (text: string) => {
    if (isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#`]/g, ''));
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Try to find a warm, natural English voice
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium')));
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!speechSupported || !recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      stopSpeaking();
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Already active
      }
    }
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || loading) return;

    stopSpeaking();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.map(m => ({
        role: m.role === 'user' ? ('user' as const) : ('model' as const),
        text: m.text
      }));
      historyPayload.push({ role: 'user', text: textToSend.trim() });

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          clientContext: { page: window.location.pathname }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.reply || 'Thank you for your inquiry. Our team will assist you.';
        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendedPropertyIds: data.recommendedPropertyIds,
          leadCaptured: data.leadCaptured
        };

        setMessages(prev => [...prev, assistantMsg]);
        speakText(replyText);
      } else {
        throw new Error('Server returned ' + res.status);
      }
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: `We specialize in prime Dubai villas, penthouses, and Golden Visa properties. You can speak with our founder Jasmeet S. Gulati directly via WhatsApp at ${settings.contact.whatsapp} or call ${settings.contact.phone}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!aiSettings.enabled) return null;

  return (
    <>
      {/* Floating Concierge Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <div 
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex flex-col items-end bg-[#17362f]/95 hover:bg-[#17362f] px-4 py-2 rounded-2xl border border-[#b58b4a]/40 shadow-[0_8px_30px_rgba(0,0,0,0.4)] text-right animate-fade-in cursor-pointer transition-all duration-300 max-w-[320px] group"
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[12px] font-bold text-[#fae7b5] tracking-wide">
                JSGpt
              </span>
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#b58b4a]/20 text-[#d9bf8c] font-bold border border-[#b58b4a]/30">
                AI Companion
              </span>
            </div>
            <p className="text-[10px] text-[#fae7b5]/90 italic leading-snug line-clamp-2 text-right">
              &ldquo;Assalamu Alaikum, hope your day is blessed... how may I guide your vision today?&rdquo;
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#17362f] via-[#1f4a40] to-[#b58b4a] text-[#fae7b5] p-0.5 shadow-[0_8px_25px_rgba(181,139,74,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer border border-[#fae7b5]/50 group"
            title="Open JSGpt - JSG Intelligent Property Companion"
          >
            <div className="w-full h-full rounded-full bg-[#17362f]/80 flex items-center justify-center backdrop-blur-none group-hover:bg-transparent transition-colors overflow-hidden p-1">
              <JSGLogo size="xs" theme="dark" showText={false} />
            </div>
            {/* Online Pulse Dot */}
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#142621] rounded-full shadow-sm" />
          </button>
        </div>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[85vh] h-[620px] bg-[#142621] text-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-[#b58b4a]/30 flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#17362f] to-[#122b25] border-b border-white/10 flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#b58b4a]/20 border border-[#b58b4a]/40 flex items-center justify-center text-[#fae7b5] p-1 shadow-sm shrink-0">
                <JSGLogo size="xs" theme="dark" showText={false} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#fae7b5] tracking-wide">JSGpt</h3>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-slate-300">Intelligent Property Companion · JSG Dubai</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Mute TTS Button */}
              <button
                type="button"
                onClick={() => {
                  if (!isMuted) stopSpeaking();
                  setIsMuted(!isMuted);
                }}
                className={`p-2 rounded-xl transition-colors ${isMuted ? 'text-slate-400 hover:text-white' : 'text-[#d9bf8c] hover:bg-white/10'}`}
                title={isMuted ? 'Unmute AI voice' : 'Mute AI voice'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Voice Waveform Indicator */}
          {(isSpeaking || isListening) && (
            <div className="px-4 py-2 bg-[#b58b4a]/15 border-b border-[#b58b4a]/20 flex items-center justify-between text-xs text-[#fae7b5]">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-400 animate-ping' : 'bg-[#fae7b5] animate-pulse'}`} />
                <span className="font-semibold text-[11px]">
                  {isListening ? 'Listening to your voice...' : 'Speaking luxury advisor response...'}
                </span>
              </div>
              {isSpeaking && (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="px-2 py-0.5 text-[10px] font-bold rounded bg-white/10 hover:bg-white/20 text-white"
                >
                  Stop Voice
                </button>
              )}
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-[#b58b4a] to-[#996f2e] text-[#142621] font-medium shadow-md'
                      : 'bg-[#1b342e] border border-white/10 text-slate-100 shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>

                  {/* Lead captured confirmation banner */}
                  {m.leadCaptured && (
                    <div className="mt-2.5 pt-2.5 border-t border-emerald-500/30 flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Priority inquiry logged. A JSG Senior Broker will reach out shortly.</span>
                    </div>
                  )}

                  {/* Recommended Properties quick cards */}
                  {m.recommendedPropertyIds && m.recommendedPropertyIds.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#d9bf8c] block">
                        Matching Active Residences:
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {m.recommendedPropertyIds.map(propId => {
                          const prop = properties.find(p => Number(p.id) === Number(propId));
                          if (!prop) return null;
                          return (
                            <div
                              key={prop.id}
                              className="p-2.5 rounded-xl bg-[#142621]/90 border border-[#b58b4a]/30 flex items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <img
                                  src={prop.image}
                                  alt={prop.title}
                                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                                />
                                <div className="truncate">
                                  <div className="text-[11px] font-bold text-white truncate">{prop.title}</div>
                                  <div className="text-[10px] text-[#fae7b5] font-semibold">AED {prop.price.toLocaleString()}</div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  handleSend(`I would like to schedule a private viewing for "${prop.title}". My details are: `);
                                }}
                                className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-[#b58b4a] hover:bg-[#d9bf8c] text-[#142621] shrink-0 cursor-pointer"
                              >
                                View / Book
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-3 bg-[#1b342e] rounded-2xl max-w-[70%] border border-white/10 text-slate-300">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#fae7b5]" />
                <span className="text-[11px]">Consulting Dubai RERA database...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Prompts */}
          {messages.length < 3 && aiSettings.suggestedQuestions && (
            <div className="px-4 py-2 border-t border-white/5 bg-[#12241f] flex gap-1.5 overflow-x-auto no-scrollbar">
              {aiSettings.suggestedQuestions.slice(0, 3).map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(q)}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[10px] text-[#d9bf8c] whitespace-nowrap border border-white/10 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input & Voice Controls */}
          <div className="p-3 bg-[#12241f] border-t border-white/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              {/* Voice Microphone Toggle */}
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`p-2.5 rounded-2xl transition-all ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                      : 'bg-white/10 text-[#fae7b5] hover:bg-white/20'
                  }`}
                  title={isListening ? 'Stop listening' : 'Speak with microphone'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about properties, mortgages, or request a viewing..."
                className="flex-1 bg-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#b58b4a] border border-white/5"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-2xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-bold hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
