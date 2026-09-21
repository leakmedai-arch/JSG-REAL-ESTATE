import React, { useState } from 'react';
import { 
  X, 
  PhoneCall, 
  MessageCircle, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  User, 
  Phone, 
  Mail,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface SpeakWithUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpeakWithUsModal: React.FC<SpeakWithUsModalProps> = ({ isOpen, onClose }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    topic: 'Buying Luxury Property',
    preferredTime: 'As Soon As Possible'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      // Auto close after 3 seconds
      setTimeout(() => {
        setFormSubmitted(false);
        onClose();
      }, 2500);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#0e2c23] to-[#071913] border border-[#c5a059]/40 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden z-10 text-[#fdfbf7]">
        {/* Top Gold Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#b58b4a] via-[#d4af37] to-[#e6ca85]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-black/40 hover:bg-black/60 text-stone-300 hover:text-white border border-white/10 transition-all cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center max-w-lg mx-auto mb-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/30 text-[#d9bf8c] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>JSG Private Client Advisory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
              Speak With Our Private Advisors
            </h2>
            <p className="text-sm text-[#e4dbcd] mt-2 leading-relaxed">
              Direct, confidential property consultation with Jasmeet Singh Gulati and senior Dubai luxury portfolio directors.
            </p>
          </div>

          {/* Quick Direct Connect Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-7">
            {/* 1. Direct Phone Call */}
            <a
              href="tel:+97143999999"
              className="group p-4 rounded-2xl bg-[#13382c]/80 hover:bg-[#1a4a3b] border border-[#c5a059]/40 hover:border-[#d4af37] transition-all flex items-center gap-3.5 shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b58b4a] to-[#8c6d33] flex items-center justify-center shrink-0 text-[#0c261e] shadow-md group-hover:scale-105 transition-transform">
                <PhoneCall className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#d9bf8c] uppercase tracking-wider">
                  Direct Line · 24/7
                </div>
                <div className="text-base font-extrabold text-white">
                  +971 4 399 9999
                </div>
                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Senior Advisor Available
                </div>
              </div>
            </a>

            {/* 2. WhatsApp VIP Chat */}
            <a
              href="https://wa.me/971501234567?text=Hello%20JSG%20Real%20Estate%20Advisors%2C%20I%20would%20like%20to%20inquire%20about%20your%20luxury%20properties."
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-2xl bg-[#13382c]/80 hover:bg-[#1a4a3b] border border-emerald-500/40 hover:border-emerald-400 transition-all flex items-center gap-3.5 shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0 text-white shadow-md group-hover:scale-105 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                  WhatsApp VIP Desk
                </div>
                <div className="text-base font-extrabold text-white">
                  Chat With Advisor
                </div>
                <div className="text-[11px] text-stone-300 font-medium mt-0.5">
                  Instant portfolio brochures & videos
                </div>
              </div>
            </a>
          </div>

          {/* Callback / Meeting Request Form */}
          <div className="bg-[#092019]/90 border border-[#c5a059]/30 rounded-2xl p-5 sm:p-6 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#d9bf8c]">
                <Clock className="w-4 h-4 text-[#d4af37]" />
                <span>Or Request an Immediate Callback</span>
              </div>
              <span className="text-[11px] text-stone-400 font-medium">Within 5 Minutes</span>
            </div>

            {formSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white">Request Received</h4>
                <p className="text-xs text-[#e4dbcd] max-w-sm mx-auto">
                  A JSG Senior Luxury Advisor will contact you at <span className="text-[#d9bf8c] font-bold">{formData.phone || '+971 ...'}</span> shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">Your Name</label>
                    <div className="relative flex items-center bg-[#071913] rounded-xl border border-white/15 px-3 py-2">
                      <User className="w-4 h-4 text-[#b58b4a] mr-2" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alexander Vance"
                        className="w-full bg-transparent text-white placeholder-stone-500 text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">Phone Number / WhatsApp</label>
                    <div className="relative flex items-center bg-[#071913] rounded-xl border border-white/15 px-3 py-2">
                      <Phone className="w-4 h-4 text-[#b58b4a] mr-2" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+971 50 000 0000"
                        className="w-full bg-transparent text-white placeholder-stone-500 text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">Topic of Interest</label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full bg-[#071913] rounded-xl border border-white/15 px-3 py-2.5 text-white text-xs outline-none cursor-pointer"
                    >
                      <option value="Buying Luxury Property" className="bg-[#071913]">Buying Luxury Property</option>
                      <option value="Off-Plan Investments" className="bg-[#071913]">Off-Plan Investment Advisory</option>
                      <option value="Selling or Listing" className="bg-[#071913]">Selling / Listing an Asset</option>
                      <option value="Golden Visa & Legal" className="bg-[#071913]">Golden Visa &amp; Legal Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">Preferred Time</label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full bg-[#071913] rounded-xl border border-white/15 px-3 py-2.5 text-white text-xs outline-none cursor-pointer"
                    >
                      <option value="As Soon As Possible" className="bg-[#071913]">Immediately (Next 5 Mins)</option>
                      <option value="Morning (9 AM - 12 PM)" className="bg-[#071913]">Morning (9 AM - 12 PM)</option>
                      <option value="Afternoon (12 PM - 5 PM)" className="bg-[#071913]">Afternoon (12 PM - 5 PM)</option>
                      <option value="Evening (5 PM - 9 PM)" className="bg-[#071913]">Evening (5 PM - 9 PM)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#b58b4a] via-[#d4af37] to-[#b58b4a] hover:brightness-110 text-[#0c261e] shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
                >
                  <span>Connect With Private Advisor</span>
                  <ArrowRight className="w-4 h-4 text-[#0c261e]" />
                </button>
              </form>
            )}
          </div>

          {/* Trust Footer */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-[11px] text-stone-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              Strict Fiduciary Confidentiality
            </span>
            <span>·</span>
            <span>RERA Certified Agency Principal</span>
            <span>·</span>
            <span>Direct Access to Founder Desk</span>
          </div>
        </div>
      </div>
    </div>
  );
};
