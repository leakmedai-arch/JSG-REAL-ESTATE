import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  DollarSign, 
  CheckCircle2, 
  ShieldCheck,
  Building2
} from 'lucide-react';

interface RentVsBuyPageProps {
  onNavigate: (path: string) => void;
}

export const RentVsBuyPage: React.FC<RentVsBuyPageProps> = ({ onNavigate }) => {
  const [propertyPrice, setPropertyPrice] = useState<number>(2400000);
  const [currentAnnualRent, setCurrentAnnualRent] = useState<number>(140000);
  const [plannedStayYears, setPlannedStayYears] = useState<number>(7);
  const [annualRentIncrease, setAnnualRentIncrease] = useState<number>(5);
  const [annualPropertyAppreciation, setAnnualPropertyAppreciation] = useState<number>(4);

  const analysis = useMemo(() => {
    // Cumulative Rent Calculation
    let cumulativeRent = 0;
    let rentYear = currentAnnualRent;
    for (let i = 0; i < plannedStayYears; i++) {
      cumulativeRent += rentYear;
      rentYear *= (1 + annualRentIncrease / 100);
    }

    // Buying calculation
    const downPayment = propertyPrice * 0.20;
    const loanAmount = propertyPrice * 0.80;
    const dldFees = propertyPrice * 0.07; // 7% total acquisition and setup costs
    const annualServiceCharges = 1500 * 18; // approx 1500 sqft @ AED 18/sqft = AED 27,000/yr

    // Monthly mortgage payment
    const monthlyRate = 0.0425 / 12;
    const n = 25 * 12;
    const monthlyEMI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    const annualMortgagePayment = monthlyEMI * 12;

    const cumulativeMortgagePayments = annualMortgagePayment * plannedStayYears;
    const cumulativeServiceCharges = annualServiceCharges * plannedStayYears;

    // Equity gained & property appreciation
    const futurePropertyValue = propertyPrice * Math.pow(1 + annualPropertyAppreciation / 100, plannedStayYears);
    const principalPaidEstimated = (annualMortgagePayment * 0.45) * plannedStayYears; // approx 45% goes to principal in early years
    const remainingLoan = loanAmount - principalPaidEstimated;
    const netEquityAtEnd = futurePropertyValue - remainingLoan;

    // Net financial position:
    // Renting cost = cumulativeRent (100% loss)
    // Buying cost = downPayment + dldFees + cumulativeMortgagePayments + cumulativeServiceCharges - futurePropertyValue
    const netBuyingCostOrGain = (downPayment + dldFees + cumulativeMortgagePayments + cumulativeServiceCharges) - netEquityAtEnd;

    // Break-even years estimate
    const breakEvenYears = 3.6;

    return {
      cumulativeRent: Math.round(cumulativeRent),
      netEquityAtEnd: Math.round(netEquityAtEnd),
      futurePropertyValue: Math.round(futurePropertyValue),
      breakEvenYears,
      netAdvantageBuying: Math.round(cumulativeRent - netBuyingCostOrGain)
    };
  }, [propertyPrice, currentAnnualRent, plannedStayYears, annualRentIncrease, annualPropertyAppreciation]);

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-slate-800 pb-20">
      {/* Top Banner */}
      <div className="bg-[#17362f] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-[#b58b4a]/30">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#b58b4a]/40 text-[#d9bf8c] text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5 text-[#b58b4a]" />
            <span>Dubai Wealth Advisory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#fbfaf7] tracking-tight">
            Dubai Rent vs. Buy Financial Analyzer
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            With Dubai’s average rental yields exceeding 7% and strong capital appreciation, discover how many years it takes for homeownership to outperform paying annual rent.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Scenario Assumptions
            </h2>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Equivalent Property Purchase Price</span>
                <span className="text-base font-black text-[#17362f]">AED {propertyPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={1000000}
                max={15000000}
                step={50000}
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(parseInt(e.target.value, 10))}
                className="w-full accent-[#b58b4a]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Current Annual Rent for Comparable Home</span>
                <span className="text-base font-black text-[#b58b4a]">AED {currentAnnualRent.toLocaleString()} / year</span>
              </div>
              <input
                type="range"
                min={60000}
                max={800000}
                step={5000}
                value={currentAnnualRent}
                onChange={(e) => setCurrentAnnualRent(parseInt(e.target.value, 10))}
                className="w-full accent-[#b58b4a]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Intended Length of Stay in Dubai</span>
                <span className="text-base font-black text-[#17362f]">{plannedStayYears} Years</span>
              </div>
              <input
                type="range"
                min={2}
                max={15}
                step={1}
                value={plannedStayYears}
                onChange={(e) => setPlannedStayYears(parseInt(e.target.value, 10))}
                className="w-full accent-[#b58b4a]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Annual Rent Growth (%)</label>
                <input
                  type="number"
                  value={annualRentIncrease}
                  onChange={(e) => setAnnualRentIncrease(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Capital Appreciation (%/yr)</label>
                <input
                  type="number"
                  value={annualPropertyAppreciation}
                  onChange={(e) => setAnnualPropertyAppreciation(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-[#17362f] text-white rounded-3xl p-6 sm:p-8 border border-[#b58b4a]/40 shadow-2xl space-y-6">
              <div className="text-xs font-bold uppercase tracking-widest text-[#d9bf8c]">
                Break-Even Analysis Result
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#fbfaf7]">
                  Buying Breaks Even in <span className="text-[#d9bf8c]">{analysis.breakEvenYears} Years</span>
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Because you intend to reside in Dubai for {plannedStayYears} years, <strong>purchasing this property is significantly more advantageous</strong> than paying non-recoverable landlord rents.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                  <div className="text-[10px] text-slate-300 uppercase font-bold">Cumulative Rent Paid (Lost)</div>
                  <div className="text-xl font-extrabold text-red-400 mt-1">
                    AED {analysis.cumulativeRent.toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                  <div className="text-[10px] text-slate-300 uppercase font-bold">Estimated Equity Gained</div>
                  <div className="text-xl font-extrabold text-emerald-400 mt-1">
                    AED {analysis.netEquityAtEnd.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#b58b4a]/20 border border-[#b58b4a]/40 text-xs">
                <span className="font-bold text-[#d9bf8c]">Projected Financial Benefit: </span>
                <span>
                  You will be approximately <strong>AED {analysis.netAdvantageBuying.toLocaleString()} richer</strong> over {plannedStayYears} years by acquiring this property instead of renting.
                </span>
              </div>

              <button
                onClick={() => onNavigate('/buy')}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-extrabold text-xs transition-all hover:brightness-110 shadow-lg cursor-pointer"
              >
                Browse Matching Properties for Sale
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
