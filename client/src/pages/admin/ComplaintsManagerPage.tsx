import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Eye, X, Loader2, ChevronDown,
  Phone, Mail, MapPin, AlertTriangle, CheckCircle, Clock, XCircle,
} from 'lucide-react';
import {
  subscribeToCollection,
  updateDocument,
  COLLECTIONS,
} from '@/firebase/firestore';
import { orderBy } from 'firebase/firestore';
import type { Complaint } from '@/types';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

// ── Status config ──────────────────────────────────────────────
type ComplaintStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

const statusConfig: Record<ComplaintStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  'Open':        { label: 'Open',        color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',   icon: Clock },
  'In Progress': { label: 'In Progress', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', icon: AlertTriangle },
  'Resolved':    { label: 'Resolved',    color: 'text-green-700',  bg: 'bg-green-50 border-green-200',  icon: CheckCircle },
  'Closed':      { label: 'Closed',      color: 'text-slate-600',  bg: 'bg-slate-100 border-slate-200', icon: XCircle },
};

const priorityConfig: Record<string, { color: string; dot: string }> = {
  'Low':    { color: 'text-slate-500',  dot: 'bg-slate-400' },
  'Medium': { color: 'text-blue-600',   dot: 'bg-blue-500' },
  'High':   { color: 'text-orange-600', dot: 'bg-orange-500' },
  'Urgent': { color: 'text-red-600',    dot: 'bg-red-500' },
};

// ── Timestamp formatter ───────────────────────────────────────
const fmtDate = (ts: any): string => {
  if (!ts) return '—';
  try {
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return '—'; }
};

// ── Detail Modal ──────────────────────────────────────────────
interface DetailModalProps {
  complaint: Complaint;
  onClose: () => void;
  onStatusChange: (id: string, status: ComplaintStatus) => Promise<void>;
  onResponseSave: (id: string, response: string) => Promise<void>;
}

const DetailModal: React.FC<DetailModalProps> = ({ complaint, onClose, onStatusChange, onResponseSave }) => {
  const [status, setStatus] = useState<ComplaintStatus>(complaint.status as ComplaintStatus);
  const [response, setResponse] = useState(complaint.response ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onStatusChange(complaint.id!, status);
    await onResponseSave(complaint.id!, response);
    setSaving(false);
    onClose();
  };

  const cfg = statusConfig[status] ?? statusConfig['Open'];
  const pCfg = priorityConfig[complaint.priority] ?? priorityConfig['Low'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-dark/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 22, stiffness: 260 }}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                #{complaint.complaintId}
              </span>
              <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border', cfg.bg, cfg.color)}>
                <cfg.icon size={10} />
                {cfg.label}
              </span>
              <span className={cn('flex items-center gap-1 text-xs font-semibold', pCfg.color)}>
                <span className={cn('w-1.5 h-1.5 rounded-full', pCfg.dot)} />
                {complaint.priority}
              </span>
            </div>
            <h3 className="font-display font-bold text-lg text-slate-800 leading-tight">
              {complaint.category}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Citizen info */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Citizen Info</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 text-sm text-slate-700">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold text-xs">{complaint.name?.[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-semibold">{complaint.name}</p>
                  <p className="text-xs text-slate-400">Complainant</p>
                </div>
              </div>
              {complaint.phone && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone size={14} className="text-slate-400 shrink-0" /> {complaint.phone}
                </div>
              )}
              {complaint.email && (
                <div className="flex items-center gap-2 text-sm text-slate-600 sm:col-span-2">
                  <Mail size={14} className="text-slate-400 shrink-0" /> {complaint.email}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-slate-600 sm:col-span-2">
                <MapPin size={14} className="text-slate-400 shrink-0" />
                {complaint.location}{complaint.district ? `, ${complaint.district}` : ''}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</p>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-4">
              {complaint.description}
            </p>
          </div>

          {/* Dates */}
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <span>Filed: <span className="text-slate-600 font-medium">{fmtDate(complaint.createdAt)}</span></span>
            <span>Updated: <span className="text-slate-600 font-medium">{fmtDate(complaint.updatedAt)}</span></span>
          </div>

          {/* Status update */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Update Status</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(statusConfig) as ComplaintStatus[]).map(s => {
                const c = statusConfig[s];
                const isActive = status === s;
                return (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={cn(
                      'flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-xs font-semibold transition-all',
                      isActive ? `${c.bg} ${c.color} border-current` : 'border-slate-100 text-slate-500 hover:border-slate-200'
                    )}
                  >
                    <c.icon size={16} />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Admin response */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Admin Response</p>
            <textarea
              value={response}
              onChange={e => setResponse(e.target.value)}
              rows={3}
              placeholder="Write your response to the citizen..."
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex gap-3 shrink-0">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────
const ComplaintsManagerPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [filterStatus, setFilterStatus] = useState<ComplaintStatus | 'All'>('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let unsub: (() => void) | undefined;
    try {
      unsub = subscribeToCollection<Complaint>(
        COLLECTIONS.COMPLAINTS,
        data => {
          setComplaints(data);
          setLoading(false);
        },
        [orderBy('createdAt', 'desc')]
      );
    } catch {
      setLoading(false);
    }
    return () => unsub?.();
  }, []);

  const updateStatus = async (id: string, status: ComplaintStatus) => {
    try {
      await updateDocument(COLLECTIONS.COMPLAINTS, id, { status });
      toast.success(`Status updated to "${status}"`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const saveResponse = async (id: string, response: string) => {
    try {
      await updateDocument(COLLECTIONS.COMPLAINTS, id, { response });
    } catch {
      toast.error('Failed to save response');
    }
  };

  const filtered = complaints.filter(c => {
    const matchStatus = filterStatus === 'All' || c.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      c.name?.toLowerCase().includes(q) ||
      c.complaintId?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q) ||
      c.district?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = {
    All: complaints.length,
    Open: complaints.filter(c => c.status === 'Open').length,
    'In Progress': complaints.filter(c => c.status === 'In Progress').length,
    Resolved: complaints.filter(c => c.status === 'Resolved').length,
    Closed: complaints.filter(c => c.status === 'Closed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-800">Complaints Hub</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Manage and respond to citizen complaints in real-time.
          </p>
        </div>
        {/* Stats pills */}
        <div className="flex items-center gap-2">
          {(['All', 'Open', 'In Progress', 'Resolved', 'Closed'] as const).map(s => {
            const cfg = s === 'All' ? null : statusConfig[s as ComplaintStatus];
            const isActive = filterStatus === s;
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s as any)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-bold transition-all border',
                  isActive
                    ? s === 'All'
                      ? 'bg-primary text-white border-primary'
                      : `${cfg?.bg} ${cfg?.color} border-current`
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                )}
              >
                {s} <span className="opacity-60">({counts[s]})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <MessageSquare size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, ID, category..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-56 gap-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-slate-400">Loading complaints...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-56 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <MessageSquare className="text-slate-300" size={26} />
              </div>
              <p className="text-sm text-slate-400 font-medium">
                {search || filterStatus !== 'All' ? 'No matching complaints.' : 'No complaints filed yet.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Complaint ID', 'Citizen', 'Category', 'District', 'Priority', 'Filed On', 'Status', ''].map(h => (
                    <th key={h} className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(c => {
                  const sCfg = statusConfig[c.status as ComplaintStatus] ?? statusConfig['Open'];
                  const pCfg = priorityConfig[c.priority] ?? priorityConfig['Low'];
                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                      onClick={() => setSelected(c)}
                    >
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">
                          #{c.complaintId?.slice(-6) || c.id?.slice(0, 6)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-sm font-medium text-slate-800">{c.name}</p>
                        <p className="text-xs text-slate-400">{c.phone}</p>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-slate-600 max-w-[140px] truncate">{c.category}</td>
                      <td className="py-3.5 px-4 text-sm text-slate-500">{c.district || '—'}</td>
                      <td className="py-3.5 px-4">
                        <span className={cn('flex items-center gap-1.5 text-xs font-bold', pCfg.color)}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', pCfg.dot)} />
                          {c.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400 whitespace-nowrap">{fmtDate(c.createdAt)}</td>
                      <td className="py-3.5 px-4">
                        <span className={cn(
                          'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border',
                          sCfg.bg, sCfg.color
                        )}>
                          <sCfg.icon size={10} />
                          {sCfg.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={e => { e.stopPropagation(); setSelected(c); }}
                          className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <DetailModal
            complaint={selected}
            onClose={() => setSelected(null)}
            onStatusChange={updateStatus}
            onResponseSave={saveResponse}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComplaintsManagerPage;
