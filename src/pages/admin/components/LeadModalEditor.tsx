import React, { useState } from 'react';
import { X, User, Phone, Mail, Calendar, Building2, Send, Clock, CheckCircle2, MessageSquare } from 'lucide-react';

interface LeadModalEditorProps {
  lead: any | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (leadId: string, updates: any) => Promise<void>;
}

export const LeadModalEditor: React.FC<LeadModalEditorProps> = ({
  lead,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [status, setStatus] = useState(lead?.status || 'New');
  const [priority, setPriority] = useState(lead?.priority || 'Medium');
  const [assignedAgent, setAssignedAgent] = useState(lead?.assignedAgent || 'Jasmeet S. Gulati');
  const [newNote, setNewNote] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen || !lead) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates: any = {
        status,
        priority,
        assignedAgent
      };
      if (newNote.trim()) {
        updates.notes = [
          ...(lead.notes || []),
          `[${new Date().toLocaleDateString()} Admin]: ${newNote.trim()}`
        ];
      }
      await onUpdate(lead.id, updates);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#17362f] text-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-[#b58b4a]/30 my-auto animate-fade-in">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#b58b4a]/20 border border-[#b58b4a]/40 flex items-center justify-center text-[#fae7b5]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#fbfaf7]">{lead.name}</h2>
              <p className="text-xs text-[#d9bf8c]">
                Lead Source: {lead.source || 'Website VIP Inquiry'} · Received {new Date(lead.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lead Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Quick Contact Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-black/20 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Direct Telephone / WhatsApp</span>
                <a href={`tel:${lead.phone}`} className="text-sm font-bold text-white hover:text-[#d9bf8c]">
                  {lead.phone}
                </a>
              </div>
            </div>

            {lead.email && (
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Email Address</span>
                  <a href={`mailto:${lead.email}`} className="text-sm font-bold text-white hover:text-[#d9bf8c]">
                    {lead.email}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Inquiry Details */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <span className="font-bold text-[#fae7b5] block">Inquiry Specification</span>
            {lead.interestedProperty && (
              <div className="flex items-center gap-2 text-slate-200">
                <Building2 className="w-4 h-4 text-[#b58b4a]" />
                <span><strong>Target Property:</strong> {lead.interestedProperty}</span>
              </div>
            )}
            {lead.budget && (
              <div className="text-slate-200">
                <strong>Target Budget:</strong> {lead.budget}
              </div>
            )}
            {lead.requirement && (
              <div className="text-slate-300 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                "{lead.requirement}"
              </div>
            )}
          </div>

          {/* CRM Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Pipeline Stage</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#12241f] border border-white/15 text-[#fae7b5] font-bold"
              >
                <option value="New">New Lead</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified VIP</option>
                <option value="Viewing Scheduled">Viewing Scheduled</option>
                <option value="Negotiation">In Negotiation</option>
                <option value="Converted">Converted / Closed</option>
                <option value="Lost">Lost / Archived</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#12241f] border border-white/15 text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent / Hot Buyer</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Assigned Broker</label>
              <input
                type="text"
                value={assignedAgent}
                onChange={(e) => setAssignedAgent(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white"
              />
            </div>
          </div>

          {/* Notes History */}
          <div className="space-y-3">
            <span className="font-bold text-[#fae7b5] block">Internal Broker Notes & Audit</span>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {lead.notes && lead.notes.length > 0 ? (
                lead.notes.map((note: string, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-black/20 border border-white/5 text-slate-300">
                    {note}
                  </div>
                ))
              ) : (
                <div className="text-slate-400 italic">No notes logged yet.</div>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log a client conversation, viewing note, or offer..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
          <a
            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(lead.name)},%20this%20is%20Jasmeet%20S.%20Gulati%20from%20JSG%20Real%20Estate.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold flex items-center gap-1.5 text-xs"
          >
            <span>Open WhatsApp Chat</span>
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-[#b58b4a] hover:bg-[#d9bf8c] text-[#142621] font-bold shadow-md cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Updating Lead...' : 'Save Lead Updates'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
