import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Sparkles, 
  MapPin, 
  Calendar, 
  CreditCard, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  FileText, 
  Download, 
  CheckCircle2,
  TrendingUp,
  Percent
} from 'lucide-react';
import { DEVELOPERS, OFF_PLAN_PROJECTS, OffPlanProject, Developer } from '../data/realEstateData';
import { DeveloperBrandLogo } from '../components/DeveloperBrandLogo';

interface NewProjectsPageProps {
  initialEmirate?: string;
  initialView?: 'projects' | 'developers';
  onNavigate: (path: string) => void;
}

export const NewProjectsPage: React.FC<NewProjectsPageProps> = ({
  initialEmirate = 'All',
  initialView = 'projects',
  onNavigate
}) => {
  const [selectedEmirate, setSelectedEmirate] = useState(initialEmirate);
  const [activeTab, setActiveTab] = useState<'projects' | 'developers'>(initialView);
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);

  const filteredProjects = useMemo(() => {
    if (selectedEmirate === 'All') return OFF_PLAN_PROJECTS;
    return OFF_PLAN_PROJECTS.filter((p) => p.emirate.toLowerCase().includes(selectedEmirate.toLowerCase()));
  }, [selectedEmirate]);

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-slate-800 pb-20">
      {/* Top Banner */}
      <div className="bg-[#17362f] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-[#b58b4a]/30">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#b58b4a]/40 text-[#d9bf8c] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#b58b4a]" />
            <span>UAE Master Off-Plan Directory · Direct Developer Prices</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#fbfaf7] tracking-tight">
                New Off-Plan Projects in the UAE
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
                Invest directly in high-capital-appreciation master developments across Dubai, Abu Dhabi, and Ras Al Khaimah. Enjoy 0% commission, post-handover payment plans, and 10-Year UAE Golden Visa support.
              </p>
            </div>

            {/* Switch between Projects and Developers */}
            <div className="bg-black/30 p-1.5 rounded-2xl border border-white/10 flex items-center gap-1 self-start">
              <button
                type="button"
                onClick={() => setActiveTab('projects')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'projects' ? 'bg-[#b58b4a] text-[#142621]' : 'text-slate-300 hover:text-white'
                }`}
              >
                Off-Plan Launches
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('developers')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'developers' ? 'bg-[#b58b4a] text-[#142621]' : 'text-slate-300 hover:text-white'
                }`}
              >
                Premier Developers
              </button>
            </div>
          </div>

          {/* Emirate Filter Tabs */}
          {activeTab === 'projects' && (
            <div className="flex flex-wrap gap-2 pt-4">
              {['All', 'Dubai', 'Abu Dhabi', 'Sharjah', 'Ras Al Khaimah'].map((em) => (
                <button
                  key={em}
                  onClick={() => setSelectedEmirate(em)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedEmirate === em
                      ? 'bg-[#b58b4a] text-[#142621] shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {em === 'All' ? 'All Emirates' : em}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {activeTab === 'projects' ? (
          /* Off-Plan Projects Catalog */
          <div className="space-y-8">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Showing <strong>{filteredProjects.length}</strong> official developer launches</span>
              <span className="text-[#17362f] font-bold">Guaranteed Direct Developer Pricing &amp; Zero Agency Commission</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col group"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-[#17362f]/90 backdrop-blur-md text-[#d9bf8c] text-xs font-bold px-3 py-1 rounded-full border border-[#b58b4a]/40 shadow">
                      {project.developer}
                    </div>
                    <div className="absolute top-4 right-4 bg-emerald-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow">
                      {project.emirate}
                    </div>
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md text-[#17362f] text-base font-extrabold px-3.5 py-1.5 rounded-xl shadow">
                      Starting AED {project.startingPrice.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-[#b58b4a]" />
                        <span>{project.location}</span>
                      </div>

                      <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#17362f] transition-colors">
                        {project.title}
                      </h3>

                      <div className="text-xs text-slate-600 font-medium mt-1">
                        {project.units}
                      </div>

                      {/* Highlights */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.highlights.map((h, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium"
                          >
                            ✓ {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Payment Plan & Handover */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Payment Structure</div>
                        <div className="font-extrabold text-slate-800">{project.paymentPlan}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Estimated Handover</div>
                        <div className="font-extrabold text-[#17362f]">{project.handoverDate}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        onClick={() => onNavigate('/find-agent')}
                        className="flex-1 py-3 rounded-xl bg-[#17362f] hover:bg-[#21483d] text-[#d9bf8c] text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
                      >
                        <span>Download Brochure &amp; Floor Plans</span>
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Premier Master Developers Directory */
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900">
                UAE Master Developers Portfolio
              </h2>
              <p className="text-xs text-slate-500">
                JSG Real Estate is an authorized direct tier-1 broker for Dubai and Abu Dhabi’s government-backed and premier private developers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DEVELOPERS.map((dev) => (
                <div
                  key={dev.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-12 w-32 bg-[#0d221c] rounded-xl px-2 py-1.5 border border-[#b58b4a]/30 flex items-center justify-center overflow-hidden shadow">
                        <DeveloperBrandLogo
                          id={dev.id}
                          name={dev.name}
                          logoUrl={dev.logo}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-500">
                        Est. {dev.founded} · {dev.headquarters}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">{dev.name}</h3>
                      <p className="text-xs text-[#b58b4a] font-semibold">{dev.tagline}</p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {dev.description}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400">Total Projects</div>
                        <div className="font-extrabold text-slate-800">{dev.projectsCount}+ Delivered</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Handover Rate</div>
                        <div className="font-extrabold text-emerald-600">{dev.handoverRate}</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-slate-700">Flagship Developments:</div>
                      <div className="flex flex-wrap gap-1">
                        {dev.featuredProjects.map((proj, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {proj}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('/new-projects')}
                    className="w-full py-2.5 rounded-xl bg-[#17362f] hover:bg-[#21483d] text-[#d9bf8c] text-xs font-bold transition-colors cursor-pointer"
                  >
                    View {dev.name} Projects
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
