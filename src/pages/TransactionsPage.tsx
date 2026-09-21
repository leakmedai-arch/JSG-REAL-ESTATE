import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  ArrowUpRight, 
  Filter, 
  FileText, 
  Sparkles,
  DollarSign
} from 'lucide-react';
import { DLD_TRANSACTIONS, DLDTransaction } from '../data/realEstateData';

interface TransactionsPageProps {
  initialType?: 'sale' | 'rent';
  onNavigate: (path: string) => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({
  initialType = 'sale',
  onNavigate
}) => {
  const [transactionType, setTransactionType] = useState<'sale' | 'rent'>(initialType);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState('All');

  const filteredTransactions = useMemo(() => {
    return DLD_TRANSACTIONS.filter((tx) => {
      if (tx.type !== transactionType) return false;
      if (selectedCommunity !== 'All' && tx.community !== selectedCommunity) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          tx.property.toLowerCase().includes(q) ||
          tx.community.toLowerCase().includes(q) ||
          tx.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [transactionType, selectedCommunity, searchQuery]);

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-slate-800 pb-20">
      {/* Top Banner */}
      <div className="bg-[#17362f] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-[#b58b4a]/30">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#b58b4a]/40 text-[#d9bf8c] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dubai Land Department Official Open Data</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#fbfaf7] tracking-tight">
                {transactionType === 'sale' ? 'Sold Property Prices (DLD)' : 'Rented Property Prices (Ejari)'}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
                100% transparent historical registry of actual realized property transactions across Dubai. Avoid overpriced listings with real verifiable market benchmarks.
              </p>
            </div>

            {/* Type Switch */}
            <div className="bg-black/30 p-1.5 rounded-2xl border border-white/10 flex items-center gap-1 self-start">
              <button
                type="button"
                onClick={() => setTransactionType('sale')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  transactionType === 'sale' ? 'bg-[#b58b4a] text-[#142621]' : 'text-slate-300 hover:text-white'
                }`}
              >
                Sale Deeds
              </button>
              <button
                type="button"
                onClick={() => setTransactionType('rent')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  transactionType === 'rent' ? 'bg-[#b58b4a] text-[#142621]' : 'text-slate-300 hover:text-white'
                }`}
              >
                Ejari Rentals
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search tower, building or transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-800 outline-none"
            />
          </div>

          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <MapPin className="w-4 h-4 text-[#b58b4a] mr-2 shrink-0" />
            <select
              value={selectedCommunity}
              onChange={(e) => setSelectedCommunity(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-800 outline-none cursor-pointer"
            >
              <option value="All">All Communities</option>
              <option value="Downtown Dubai">Downtown Dubai</option>
              <option value="Palm Jumeirah">Palm Jumeirah</option>
              <option value="Dubai Hills Estate">Dubai Hills Estate</option>
              <option value="Dubai Marina">Dubai Marina</option>
              <option value="Business Bay">Business Bay</option>
            </select>
          </div>

          <button
            onClick={() => onNavigate('/tools/market-reports')}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#17362f] text-[#d9bf8c] text-xs font-bold hover:bg-[#21483d] transition-colors cursor-pointer"
          >
            <span>Quarterly Market Reports</span>
            <ArrowUpRight className="w-4 h-4 text-[#b58b4a]" />
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#17362f] text-white text-[11px] uppercase tracking-wider font-extrabold">
                <tr>
                  <th className="py-4 px-6">Transaction ID</th>
                  <th className="py-4 px-6">Property / Tower</th>
                  <th className="py-4 px-6">Community</th>
                  <th className="py-4 px-6">Area (Sq.Ft)</th>
                  <th className="py-4 px-6">Transacted Price</th>
                  <th className="py-4 px-6">Rate / Sq.Ft</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">{tx.id}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">{tx.property}</td>
                    <td className="py-4 px-6 text-slate-600">{tx.community}</td>
                    <td className="py-4 px-6">{tx.areaSqft.toLocaleString()} sqft</td>
                    <td className="py-4 px-6 font-extrabold text-[#17362f]">
                      AED {tx.price.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 font-bold text-[#b58b4a]">
                      AED {tx.ratePerSqft.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-slate-500">{tx.date}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        {tx.status}
                      </span>
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
