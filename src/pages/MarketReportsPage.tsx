import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Download, 
  Building2, 
  PieChart, 
  BarChart3, 
  ShieldCheck, 
  ArrowUpRight, 
  CheckCircle2 
} from 'lucide-react';

interface MarketReportsPageProps {
  onNavigate: (path: string) => void;
}

export const MarketReportsPage: React.FC<MarketReportsPageProps> = ({ onNavigate }) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-slate-800 pb-20">
      {/* Top Banner */}
      <div className="bg-[#17362f] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-[#b58b4a]/30">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#b58b4a]/40 text-[#d9bf8c] text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 text-[#b58b4a]" />
            <span>Quarterly Intelligence &amp; Data Analytics</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#fbfaf7] tracking-tight">
                Dubai Real Estate Market Reports 2026
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
                Comprehensive data on transaction volume records, capital appreciation by prime community, gross rental yield rankings, and foreign direct investment trends.
              </p>
            </div>

            <button
              onClick={handleDownload}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-extrabold text-xs transition-all hover:brightness-110 shadow-xl flex items-center gap-2 cursor-pointer self-start"
            >
              <Download className="w-4 h-4" />
              <span>{downloaded ? 'Downloaded Q3 Report (PDF)' : 'Download Full Q3 Report'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-10">
        {/* Core Market Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total H1 2026 Volume</div>
            <div className="text-2xl font-black text-[#17362f]">AED 184.2 Billion</div>
            <div className="text-xs text-emerald-600 font-bold">↑ +21.4% year-on-year</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Dubai Rental Yield</div>
            <div className="text-2xl font-black text-[#b58b4a]">7.4% Gross</div>
            <div className="text-xs text-slate-500">World-leading global metro yield</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Prime Capital Appreciation</div>
            <div className="text-2xl font-black text-[#17362f]">+14.8% YoY</div>
            <div className="text-xs text-emerald-600 font-bold">Led by Palm &amp; Downtown</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mortgage vs Cash Split</div>
            <div className="text-2xl font-black text-slate-900">42% / 58%</div>
            <div className="text-xs text-slate-500">Strong high-net-worth liquidity</div>
          </div>
        </div>

        {/* Community Yield & Price Ranking Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Top Dubai Communities: Pricing &amp; Yield Benchmark
              </h2>
              <p className="text-xs text-slate-500">DLD validated benchmark data for Q3 2026</p>
            </div>
            <span className="text-xs text-[#b58b4a] font-bold">Updated September 2026</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-200">
                <tr>
                  <th className="pb-3">Community</th>
                  <th className="pb-3">Average Rate / Sq.Ft</th>
                  <th className="pb-3">1-Year Capital Growth</th>
                  <th className="pb-3">Gross Rental Yield</th>
                  <th className="pb-3">Investor Liquidity</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {[
                  { name: 'Downtown Dubai', rate: 'AED 2,650', growth: '+13.2%', yield: '7.1%', liquidity: 'Ultra High' },
                  { name: 'Palm Jumeirah', rate: 'AED 4,200', growth: '+18.6%', yield: '6.2%', liquidity: 'High' },
                  { name: 'Dubai Hills Estate', rate: 'AED 2,100', growth: '+15.4%', yield: '7.8%', liquidity: 'Ultra High' },
                  { name: 'Dubai Marina', rate: 'AED 1,950', growth: '+11.0%', yield: '8.2%', liquidity: 'Ultra High' },
                  { name: 'Business Bay', rate: 'AED 1,850', growth: '+12.5%', yield: '8.4%', liquidity: 'High' },
                  { name: 'Dubai Creek Harbour', rate: 'AED 2,050', growth: '+16.1%', yield: '7.6%', liquidity: 'Rapid Growth' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3.5 font-bold text-slate-900">{row.name}</td>
                    <td className="py-3.5 font-semibold text-slate-800">{row.rate}</td>
                    <td className="py-3.5 font-bold text-emerald-600">{row.growth}</td>
                    <td className="py-3.5 font-black text-[#b58b4a]">{row.yield}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                        {row.liquidity}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <button
                        onClick={() => onNavigate('/buy')}
                        className="text-[#17362f] hover:text-[#b58b4a] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Listings</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
