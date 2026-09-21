import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Sparkles, 
  DollarSign, 
  Percent, 
  Calendar, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight,
  Building2
} from 'lucide-react';

interface MortgageCalculatorPageProps {
  onNavigate: (path: string) => void;
}

export const MortgageCalculatorPage: React.FC<MortgageCalculatorPageProps> = ({ onNavigate }) => {
  const [propertyPrice, setPropertyPrice] = useState<number>(3500000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [loanPeriodYears, setLoanPeriodYears] = useState<number>(25);
  const [interestRate, setInterestRate] = useState<number>(4.25);
  const [borrowerType, setBorrowerType] = useState<'resident' | 'national' | 'non-resident'>('resident');

  // Handle borrower type presets
  const handleBorrowerTypeChange = (type: 'resident' | 'national' | 'non-resident') => {
    setBorrowerType(type);
    if (type === 'national') setDownPaymentPercent(15);
    else if (type === 'resident') setDownPaymentPercent(20);
    else if (type === 'non-resident') setDownPaymentPercent(30);
  };

  // Financial calculations
  const calc = useMemo(() => {
    const downPaymentAmount = (propertyPrice * downPaymentPercent) / 100;
    const loanAmount = propertyPrice - downPaymentAmount;
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanPeriodYears * 12;

    // EMI Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    let monthlyEMI = 0;
    if (monthlyInterestRate > 0) {
      monthlyEMI = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    } else {
      monthlyEMI = loanAmount / numberOfPayments;
    }

    const totalRepayments = monthlyEMI * numberOfPayments;
    const totalInterest = totalRepayments - loanAmount;

    // Upfront acquisition fees in Dubai
    const dldFee = propertyPrice * 0.04; // 4% DLD fee
    const dldAdminFee = 4200; // AED 4,000 + 5% VAT
    const trusteeFee = 4200; // AED 4,000 + 5% VAT
    const mortgageRegFee = (loanAmount * 0.0025) + 290; // 0.25% + AED 290
    const agencyFee = (propertyPrice * 0.02) * 1.05; // 2% + 5% VAT
    const valuationFee = 3150; // Average bank valuation fee with VAT

    const totalUpfrontFees = dldFee + dldAdminFee + trusteeFee + mortgageRegFee + agencyFee + valuationFee;
    const totalCashRequired = downPaymentAmount + totalUpfrontFees;

    return {
      downPaymentAmount,
      loanAmount,
      monthlyEMI: Math.round(monthlyEMI),
      totalInterest: Math.round(totalInterest),
      totalRepayments: Math.round(totalRepayments),
      dldFee,
      dldAdminFee,
      trusteeFee,
      mortgageRegFee: Math.round(mortgageRegFee),
      agencyFee: Math.round(agencyFee),
      valuationFee,
      totalUpfrontFees: Math.round(totalUpfrontFees),
      totalCashRequired: Math.round(totalCashRequired)
    };
  }, [propertyPrice, downPaymentPercent, loanPeriodYears, interestRate]);

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-slate-800 pb-20">
      {/* Top Banner */}
      <div className="bg-[#17362f] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-[#b58b4a]/30">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#b58b4a]/40 text-[#d9bf8c] text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5 text-[#b58b4a]" />
            <span>UAE Central Bank Compliant Mortgage Tool</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#fbfaf7] tracking-tight">
            Dubai Mortgage Calculator &amp; Fee Breakdown
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Calculate your exact monthly EMI repayments, down payment requirements, and official Dubai Land Department (DLD) transfer fees with current 2026 bank rates.
          </p>

          {/* Quick Preset Selector */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => handleBorrowerTypeChange('resident')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                borrowerType === 'resident' ? 'bg-[#b58b4a] text-[#142621]' : 'bg-white/10 text-white'
              }`}
            >
              UAE Expat Resident (20% Down)
            </button>
            <button
              onClick={() => handleBorrowerTypeChange('national')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                borrowerType === 'national' ? 'bg-[#b58b4a] text-[#142621]' : 'bg-white/10 text-white'
              }`}
            >
              UAE National (15% Down)
            </button>
            <button
              onClick={() => handleBorrowerTypeChange('non-resident')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                borrowerType === 'non-resident' ? 'bg-[#b58b4a] text-[#142621]' : 'bg-white/10 text-white'
              }`}
            >
              Non-Resident International (30% Down)
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column (Cols 1-7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Mortgage Parameters
            </h2>

            {/* Property Price Slider & Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-700">Property Purchase Price</span>
                <span className="text-lg font-black text-[#17362f]">AED {propertyPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={800000}
                max={30000000}
                step={50000}
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(parseInt(e.target.value, 10))}
                className="w-full accent-[#b58b4a]"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>AED 800,000</span>
                <span>AED 15,000,000</span>
                <span>AED 30,000,000+</span>
              </div>
            </div>

            {/* Down Payment % Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-700">Down Payment ({downPaymentPercent}%)</span>
                <span className="text-base font-extrabold text-[#b58b4a]">
                  AED {calc.downPaymentAmount.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={15}
                max={50}
                step={5}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(parseInt(e.target.value, 10))}
                className="w-full accent-[#b58b4a]"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>15% (National Min)</span>
                <span>20% (Resident Min)</span>
                <span>50%</span>
              </div>
            </div>

            {/* Loan Tenure & Interest Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Loan Tenure: <span className="text-[#17362f]">{loanPeriodYears} Years</span>
                </label>
                <select
                  value={loanPeriodYears}
                  onChange={(e) => setLoanPeriodYears(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold outline-none"
                >
                  <option value={5}>5 Years</option>
                  <option value={10}>10 Years</option>
                  <option value={15}>15 Years</option>
                  <option value={20}>20 Years</option>
                  <option value={25}>25 Years (Max Term)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Fixed Interest Rate: <span className="text-[#17362f]">{interestRate}%</span>
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="2.5"
                  max="10.0"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold outline-none"
                />
              </div>
            </div>

            {/* Upfront Fees Breakdown Accordion/Card */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-800">
                <span>Total Upfront Acquisition &amp; DLD Fees</span>
                <span className="text-emerald-700">AED {calc.totalUpfrontFees.toLocaleString()}</span>
              </div>

              <div className="divide-y divide-slate-200 text-[11px] text-slate-600">
                <div className="flex justify-between py-1.5">
                  <span>Dubai Land Department (4% of property value)</span>
                  <span className="font-semibold">AED {calc.dldFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>DLD Admin &amp; Knowledge Fees</span>
                  <span className="font-semibold">AED {calc.dldAdminFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>Registration Trustee Fee (+ 5% VAT)</span>
                  <span className="font-semibold">AED {calc.trusteeFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>Mortgage Registration (0.25% of loan + AED 290)</span>
                  <span className="font-semibold">AED {calc.mortgageRegFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>Agency Commission (2% + VAT)</span>
                  <span className="font-semibold">AED {calc.agencyFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>Bank Valuation Fee</span>
                  <span className="font-semibold">AED {calc.valuationFee.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary Column (Cols 8-12) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#17362f] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#b58b4a]/40 space-y-6">
              <div className="text-xs font-bold uppercase tracking-widest text-[#d9bf8c]">
                Monthly Mortgage Repayment
              </div>

              <div>
                <div className="text-4xl sm:text-5xl font-black text-[#fbfaf7] tracking-tight">
                  AED {calc.monthlyEMI.toLocaleString()}
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  Estimated Monthly EMI for {loanPeriodYears} years @ {interestRate}%
                </div>
              </div>

              {/* Total Cash Required Box */}
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2">
                <div className="text-xs font-semibold text-slate-300">Total Upfront Cash Required:</div>
                <div className="text-2xl font-extrabold text-[#d9bf8c]">
                  AED {calc.totalCashRequired.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-300">
                  (Down Payment of AED {calc.downPaymentAmount.toLocaleString()} + DLD &amp; Acquisition Fees)
                </div>
              </div>

              {/* Loan vs Interest Split */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Financed Loan Amount:</span>
                  <span className="font-bold text-white">AED {calc.loanAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Total Lifetime Interest:</span>
                  <span className="font-bold text-[#d9bf8c]">AED {calc.totalInterest.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Total Sum Repaid:</span>
                  <span className="font-bold text-white">AED {calc.totalRepayments.toLocaleString()}</span>
                </div>
              </div>

              {/* Consultation CTA */}
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/find-agent')}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-extrabold text-xs transition-all hover:brightness-110 shadow-lg cursor-pointer text-center"
                >
                  Get Pre-Approved with JSG Banking Partners
                </button>
                <div className="text-[10px] text-center text-slate-400 mt-2">
                  Works with Emirates NBD, FAB, DIB &amp; Mashreq
                </div>
              </div>
            </div>

            {/* Quick Link Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900">
                Compare with Renting?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Discover your exact financial break-even timeline between paying annual rent in Dubai versus buying your own residence.
              </p>
              <button
                onClick={() => onNavigate('/rent/rent-vs-buy')}
                className="text-xs font-bold text-[#17362f] hover:text-[#b58b4a] flex items-center gap-1.5 cursor-pointer"
              >
                <span>Launch Rent vs Buy Financial Analyzer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
