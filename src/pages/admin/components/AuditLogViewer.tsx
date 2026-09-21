import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  Search, 
  Filter,
  Calendar,
  User,
  Clock
} from 'lucide-react';

interface AuditLogViewerProps {
  auditLogs: any[];
  showNotification: (msg: string) => void;
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({
  auditLogs,
  showNotification
}) => {
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = 
      (log.action || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.details || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.userEmail || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.ip || '').includes(search);
    
    const matchesFilter = filterAction === 'ALL' || (log.action || '').toUpperCase().includes(filterAction);

    return matchesSearch && matchesFilter;
  });

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `jsg-audit-trail-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('Audit log exported to JSON.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Immutable Administrative Audit Log</h1>
          <p className="text-xs text-[#d9bf8c]">
            Tamper-evident chronological record of all administrative logins, content mutations, and system events.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportJson}
          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#fae7b5] font-bold border border-white/10 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Trail (JSON)</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#142e27] border border-white/10 shadow-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search action, IP, or user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-slate-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-white text-xs"
          >
            <option value="ALL">All Actions</option>
            <option value="LOGIN">Logins & Auth</option>
            <option value="UPDATE">Content Updates</option>
            <option value="RESTORE">System Restores</option>
            <option value="MEDIA">Media Operations</option>
          </select>
          <span className="text-slate-400 text-[11px] whitespace-nowrap ml-2">
            Showing {filteredLogs.length} of {auditLogs.length} events
          </span>
        </div>
      </div>

      {/* Audit Log Entries List */}
      <div className="bg-[#142e27] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
        <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              No audit log records match the current filter.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#b58b4a]/20 text-[#fae7b5] text-[10px] font-bold">
                      {log.action}
                    </span>
                    <span className="font-bold text-white text-xs">{log.details}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-500" />
                      {log.userEmail || 'system'}
                    </span>
                    <span>·</span>
                    <span className="font-mono text-[10px] text-slate-500">{log.ip || '127.0.0.1'}</span>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400 font-mono shrink-0 flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
                  <span className="text-slate-300">{new Date(log.timestamp).toLocaleDateString()}</span>
                  <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
