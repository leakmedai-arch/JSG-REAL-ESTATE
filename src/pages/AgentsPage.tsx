import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Award, 
  Building2, 
  Search,
  MessageSquare
} from 'lucide-react';
import { JSG_AGENTS, Agent } from '../data/realEstateData';

interface AgentsPageProps {
  onNavigate: (path: string) => void;
}

export const AgentsPage: React.FC<AgentsPageProps> = ({ onNavigate }) => {
  const [searchLanguage, setSearchLanguage] = useState('All');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [contactSuccess, setContactSuccess] = useState(false);

  const filteredAgents = JSG_AGENTS.filter((agent) => {
    if (searchLanguage === 'All') return true;
    return agent.languages.includes(searchLanguage);
  });

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-slate-800 pb-20">
      {/* Top Banner */}
      <div className="bg-[#17362f] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-[#b58b4a]/30">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#b58b4a]/40 text-[#d9bf8c] text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-[#b58b4a]" />
            <span>RERA Licensed Prime Real Estate Advisors</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#fbfaf7] tracking-tight">
            Meet the JSG Private Client Advisory Team
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Our multi-lingual advisors specialize in Dubai’s ultra-prime residential, commercial, and off-plan sectors. Operating with strict fiduciary integrity and discretion.
          </p>

          {/* Language filter */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-[#d9bf8c] font-bold mr-2">Filter by Language:</span>
            {['All', 'English', 'Arabic', 'French', 'Russian', 'German'].map((lang) => (
              <button
                key={lang}
                onClick={() => setSearchLanguage(lang)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  searchLanguage === lang ? 'bg-[#b58b4a] text-[#142621]' : 'bg-white/10 text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#17362f]/90 backdrop-blur-md text-[#d9bf8c] text-[10px] font-bold px-3 py-1 rounded-full border border-[#b58b4a]/40 shadow flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>{agent.licenseNumber}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-bold px-3 py-1 rounded-xl shadow">
                    {agent.experience}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">{agent.name}</h3>
                    <div className="text-xs font-semibold text-[#b58b4a]">{agent.role}</div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">Specialties:</div>
                    <div className="flex flex-wrap gap-1">
                      {agent.specialties.map((spec, i) => (
                        <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">Languages:</div>
                    <div className="text-xs font-semibold text-slate-800">
                      {agent.languages.join(' · ')}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400">Active Listings</div>
                      <div className="font-extrabold text-slate-900">{agent.activeListings} Properties</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Verified Deals</div>
                      <div className="font-extrabold text-emerald-600">{agent.totalDeals}+ Closed</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-2">
                <a
                  href={`https://wa.me/${agent.whatsapp}?text=Hello%20${encodeURIComponent(agent.name)}%2C%20I%20would%20like%20to%20enquire%20about%20luxury%20properties%20in%20Dubai.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp {agent.name.split(' ')[0]}</span>
                </a>

                <a
                  href={`tel:${agent.phone}`}
                  className="w-full py-2.5 rounded-xl bg-[#17362f] hover:bg-[#21483d] text-[#d9bf8c] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#b58b4a]" />
                  <span>Direct Call: {agent.phone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
