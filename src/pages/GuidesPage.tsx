import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  Key, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  FileText,
  DollarSign
} from 'lucide-react';

interface GuidesPageProps {
  initialTab?: 'buyers' | 'renters' | 'investors' | 'areas';
  onNavigate: (path: string) => void;
}

export const GuidesPage: React.FC<GuidesPageProps> = ({
  initialTab = 'buyers',
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'buyers' | 'renters' | 'investors' | 'areas'>(initialTab);

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-slate-800 pb-20">
      {/* Top Banner */}
      <div className="bg-[#17362f] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-[#b58b4a]/30">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#b58b4a]/40 text-[#d9bf8c] text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-[#b58b4a]" />
            <span>Dubai Property Insights &amp; Legal Handbook</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#fbfaf7] tracking-tight">
            Comprehensive UAE Real Estate Guides
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Everything an international buyer, tenant, or investor needs to know about Dubai Land Department regulations, RERA tenancy rights, Golden Visa thresholds, and taxation benefits.
          </p>

          {/* Guide Switcher Tabs */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => setActiveTab('buyers')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'buyers' ? 'bg-[#b58b4a] text-[#142621]' : 'bg-white/10 text-white'
              }`}
            >
              Buyer&apos;s Complete Guide
            </button>
            <button
              onClick={() => setActiveTab('renters')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'renters' ? 'bg-[#b58b4a] text-[#142621]' : 'bg-white/10 text-white'
              }`}
            >
              Renter&apos;s Legal Guide
            </button>
            <button
              onClick={() => setActiveTab('investors')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'investors' ? 'bg-[#b58b4a] text-[#142621]' : 'bg-white/10 text-white'
              }`}
            >
              Investor&apos;s Tax &amp; ROI Guide
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {activeTab === 'buyers' && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#b58b4a]">
                Step-by-Step Purchasing Manual
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                How to Buy Property in Dubai as a Foreigner or Expat
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Under Dubai Law No. 7 of 2006, non-residents and foreign nationals can purchase freehold properties with 100% foreign ownership in designated investment zones.
              </p>
            </div>

            <div className="space-y-6 divide-y divide-slate-100">
              <div className="pt-4 space-y-2">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#17362f] text-[#d9bf8c] text-xs flex items-center justify-center font-bold">1</span>
                  Selecting Freehold vs. Leasehold Areas
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed pl-8">
                  Foreign buyers have absolute freehold rights in designated premier communities including Downtown Dubai, Palm Jumeirah, Dubai Hills Estate, Dubai Marina, Business Bay, and Jumeirah Golf Estates. You receive a perpetual Title Deed registered under your individual name or holding company.
                </p>
              </div>

              <div className="pt-4 space-y-2">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#17362f] text-[#d9bf8c] text-xs flex items-center justify-center font-bold">2</span>
                  Contract of Sale (MOU / Form F)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed pl-8">
                  Once your offer is accepted, both buyer and seller execute RERA Form F. The buyer provides a 10% manager’s cheque security deposit held in trust by the authorized RERA broker until transfer day.
                </p>
              </div>

              <div className="pt-4 space-y-2">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#17362f] text-[#d9bf8c] text-xs flex items-center justify-center font-bold">3</span>
                  UAE 10-Year Golden Visa via Property
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed pl-8">
                  If your property acquisition totals <strong>AED 2,000,000 (approx. $545,000 USD)</strong> or more across one or multiple properties (including off-plan properties with approved developers or mortgaged assets), you and your immediate family (spouse and children of any age) qualify for the renewable 10-Year UAE Golden Residency Visa.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#17362f] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-sm font-bold text-[#d9bf8c]">Ready to start your property search?</div>
                <div className="text-xs text-slate-300">Browse verified properties with transparent prices.</div>
              </div>
              <button
                onClick={() => onNavigate('/buy')}
                className="px-6 py-2.5 rounded-xl bg-[#b58b4a] hover:bg-[#d9bf8c] text-[#142621] text-xs font-extrabold cursor-pointer"
              >
                Explore Buy Listings
              </button>
            </div>
          </div>
        )}

        {activeTab === 'renters' && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#b58b4a]">
                RERA Tenancy Regulations
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Tenant Rights &amp; Ejari Registration in Dubai
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Dubai possesses some of the most robust, predictable tenancy protection laws globally governed by the Real Estate Regulatory Agency (RERA).
              </p>
            </div>

            <div className="space-y-6 divide-y divide-slate-100">
              <div className="pt-4 space-y-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  RERA Rental Increase Calculator Caps
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A landlord CANNOT increase rent arbitrarily upon contract renewal. RERA dictates that rent increases are capped strictly according to the official Rental Price Index:
                </p>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5 pt-1">
                  <li>No increase allowed if current rent is up to 10% below market average.</li>
                  <li>Max 5% increase if rent is 11% to 20% below market average.</li>
                  <li>Max 10% increase if rent is 21% to 30% below market average.</li>
                  <li>Max 15% increase if rent is 31% to 40% below market average.</li>
                  <li>Max 20% increase if rent is more than 40% below market average.</li>
                </ul>
              </div>

              <div className="pt-4 space-y-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  90-Day Notice Period Mandate
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Either party wishing to amend any contract terms (including price or number of cheques) MUST notify the other party at least 90 calendar days prior to contract expiration via written notice.
                </p>
              </div>

              <div className="pt-4 space-y-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  Ejari Registration Importance
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every lease contract must be registered into the government Ejari system. Ejari is required for DEWA electricity/water connection, family residence visas, telecom installation, and disputes resolution.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#17362f] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-sm font-bold text-[#d9bf8c]">Looking for an executive rental in Dubai?</div>
                <div className="text-xs text-slate-300">Browse fully furnished and verified rental apartments.</div>
              </div>
              <button
                onClick={() => onNavigate('/rent')}
                className="px-6 py-2.5 rounded-xl bg-[#b58b4a] hover:bg-[#d9bf8c] text-[#142621] text-xs font-extrabold cursor-pointer"
              >
                Browse Rentals
              </button>
            </div>
          </div>
        )}

        {activeTab === 'investors' && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#b58b4a]">
                Global Investor Playbook
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Why Dubai Outperforms London, New York &amp; Singapore
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Dubai provides one of the world’s most tax-efficient, high-yielding, and currency-secure property ecosystems for international family offices and individual wealth builders.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-lg font-black text-[#17362f]">0% Property Tax</div>
                <p className="text-xs text-slate-600">
                  Zero annual property tax, zero capital gains tax on resale profits, and zero personal income tax on rental yields.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-lg font-black text-[#17362f]">USD Currency Peg</div>
                <p className="text-xs text-slate-600">
                  The UAE Dirham has been pegged at a fixed rate of 3.6725 AED to 1 USD since 1997, shielding investments from foreign exchange volatility.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-lg font-black text-[#17362f]">High Net Rental Yields</div>
                <p className="text-xs text-slate-600">
                  Average gross rental yields of 7% - 9% in Dubai, compared to 2.8% in London, 3.1% in Paris, and 3.5% in New York City.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-lg font-black text-[#17362f]">100% Repatriation</div>
                <p className="text-xs text-slate-600">
                  Complete freedom to repatriate capital, returns, and funds internationally through premier international banks without withholding restrictions.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#17362f] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-sm font-bold text-[#d9bf8c]">Consult with a Private Client Advisor</div>
                <div className="text-xs text-slate-300">Customized off-plan portfolio allocations with VIP developer access.</div>
              </div>
              <button
                onClick={() => onNavigate('/find-agent')}
                className="px-6 py-2.5 rounded-xl bg-[#b58b4a] hover:bg-[#d9bf8c] text-[#142621] text-xs font-extrabold cursor-pointer"
              >
                Schedule Private Call
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
