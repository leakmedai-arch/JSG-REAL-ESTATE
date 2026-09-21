import React, { useState } from 'react';
import { 
  Building2, 
  Sparkles, 
  Calculator, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Upload, 
  Phone, 
  Mail, 
  FileText, 
  Clock, 
  Award, 
  Users,
  DollarSign
} from 'lucide-react';

import { useSiteData } from '../context/SiteDataContext';

interface SellPageProps {
  onNavigate: (path: string) => void;
}

export const SellPage: React.FC<SellPageProps> = ({ onNavigate }) => {
  const { submitLead } = useSiteData();
  // Valuation calculator states
  const [propertyType, setPropertyType] = useState('apartment');
  const [community, setCommunity] = useState('Downtown Dubai');
  const [bedrooms, setBedrooms] = useState(2);
  const [areaSqft, setAreaSqft] = useState(1450);
  const [valuationResult, setValuationResult] = useState<{
    estimatedMin: number;
    estimatedMax: number;
    estimatedYield: string;
    avgRateSqft: number;
  } | null>(null);

  // Listing submission form
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [unitDetails, setUnitDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const calculateValuation = (e: React.FormEvent) => {
    e.preventDefault();
    let baseRate = 1900;
    if (community === 'Palm Jumeirah') baseRate = 4200;
    else if (community === 'Downtown Dubai') baseRate = 2650;
    else if (community === 'Dubai Hills') baseRate = 2200;
    else if (community === 'Dubai Marina') baseRate = 2050;
    else if (community === 'Business Bay') baseRate = 1850;

    if (propertyType === 'villa') baseRate *= 1.15;
    if (propertyType === 'penthouse') baseRate *= 1.35;

    const medianVal = Math.round(areaSqft * baseRate);
    const minVal = Math.round(medianVal * 0.94);
    const maxVal = Math.round(medianVal * 1.08);
    const yieldEst = (propertyType === 'apartment' ? '7.2%' : '6.4%');

    setValuationResult({
      estimatedMin: minVal,
      estimatedMax: maxVal,
      estimatedYield: yieldEst,
      avgRateSqft: baseRate
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerName || !sellerPhone) return;
    try {
      await submitLead({
        name: sellerName,
        email: sellerEmail,
        phone: sellerPhone,
        requirement: `Property Listing Request: ${community}, ${bedrooms} bed ${propertyType}, ${areaSqft} sqft. Details: ${unitDetails}`,
        source: 'Website Seller Valuation Form',
        budget: valuationResult ? `Est: AED ${valuationResult.estimatedMin.toLocaleString()} - ${valuationResult.estimatedMax.toLocaleString()}` : undefined
      });
    } catch (err) {
      console.error('Lead submission note:', err);
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-slate-800 pb-20">
      {/* Top Hero */}
      <div className="bg-[#17362f] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#b58b4a]/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#b58b4a]/40 text-[#d9bf8c] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#b58b4a]" />
              <span>Direct Listing with JSG Real Estate Dubai</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#fbfaf7] tracking-tight leading-tight">
              List Your Property With Dubai&apos;s Prime Advisory
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Reach thousands of pre-qualified international cash buyers and family offices across Europe, the GCC, and Asia. Transparent valuations, zero upfront marketing fees, and full DLD Trustee representation.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#d9bf8c] font-semibold">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Form A Compliant
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#b58b4a]" /> Average 26 Days to Offer
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" /> 18,000+ Active Investors
              </div>
            </div>
          </div>

          {/* Quick Valuation Calculator Widget */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#b58b4a] uppercase tracking-wider mb-2">
              <Calculator className="w-4 h-4" />
              <span>Instant AI Valuation Estimator</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-4">
              What Is Your Property Worth?
            </h3>

            <form onSubmit={calculateValuation} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Community</label>
                <select
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold outline-none"
                >
                  <option value="Downtown Dubai">Downtown Dubai</option>
                  <option value="Palm Jumeirah">Palm Jumeirah</option>
                  <option value="Dubai Hills">Dubai Hills Estate</option>
                  <option value="Dubai Marina">Dubai Marina</option>
                  <option value="Business Bay">Business Bay</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold outline-none"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="penthouse">Penthouse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Bedrooms</label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold outline-none"
                  >
                    <option value={0}>Studio</option>
                    <option value={1}>1 Bedroom</option>
                    <option value={2}>2 Bedrooms</option>
                    <option value={3}>3 Bedrooms</option>
                    <option value={4}>4 Bedrooms</option>
                    <option value={5}>5+ Bedrooms</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">
                  Built-up Area (Sq.Ft): <span className="text-[#17362f]">{areaSqft} sqft</span>
                </label>
                <input
                  type="range"
                  min={500}
                  max={12000}
                  step={50}
                  value={areaSqft}
                  onChange={(e) => setAreaSqft(parseInt(e.target.value, 10))}
                  className="w-full accent-[#b58b4a]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#17362f] hover:bg-[#21483d] text-[#d9bf8c] font-extrabold text-xs transition-colors cursor-pointer shadow-lg mt-2"
              >
                Calculate Valuation
              </button>
            </form>

            {/* Valuation Output Display */}
            {valuationResult && (
              <div className="mt-4 p-4 rounded-2xl bg-[#17362f]/5 border border-[#b58b4a]/30 space-y-2 animate-fadeIn">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Estimated Current Market Value:
                </div>
                <div className="text-xl font-extrabold text-[#17362f]">
                  AED {valuationResult.estimatedMin.toLocaleString()} – {valuationResult.estimatedMax.toLocaleString()}
                </div>
                <div className="flex justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                  <span>Avg Community Rate: <strong>AED {valuationResult.avgRateSqft} / sqft</strong></span>
                  <span>Gross Yield: <strong>{valuationResult.estimatedYield}</strong></span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Direct Listing Submission Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200">
          <div className="text-center max-w-lg mx-auto mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Submit Your Property for Free Valuation
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              One of our senior RERA-licensed advisors will contact you within 2 hours with a comprehensive comparative market analysis (CMA).
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alexander Wright"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#b58b4a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (with Country Code) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+971 50 123 4567"
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#b58b4a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="alexander@example.com"
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#b58b4a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Property Location &amp; Unit Details
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Marina Gate Tower 2, 2 Bedroom corner unit, high floor, rented until October..."
                  value={unitDetails}
                  onChange={(e) => setUnitDetails(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#b58b4a]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#17362f] hover:bg-[#21483d] text-[#d9bf8c] font-extrabold text-sm transition-all shadow-xl cursor-pointer"
              >
                Request Valuation &amp; Listing Advisory
              </button>
            </form>
          ) : (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-emerald-900">Request Received Successfully!</h3>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                Thank you, {sellerName}. A senior JSG portfolio advisor has been assigned to your listing and will call you on {sellerPhone} shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Submit Another Inquiry
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5-Step Dubai Selling Roadmap */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-8">
          The 5-Step Dubai Property Transfer Process
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Listing Agreement (Form A)', desc: 'RERA mandated contract confirming your approved selling price and authorized representation.' },
            { step: '02', title: 'Targeted Marketing', desc: '4K architectural photography, 3D digital walkthroughs, and distribution to VIP buyer network.' },
            { step: '03', title: 'Unified Contract (Form F)', desc: 'Contract of sale signed between buyer and seller, secured with a 10% manager’s cheque deposit.' },
            { step: '04', title: 'Developer NOC', desc: 'Securing the No Objection Certificate confirming all building service charges are fully settled.' },
            { step: '05', title: 'DLD Trustee Office Transfer', desc: 'Simultaneous transfer of title deed at the official trustee office with payout manager’s cheque.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow space-y-2">
              <div className="text-xl font-black text-[#b58b4a] font-mono">{item.step}</div>
              <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
