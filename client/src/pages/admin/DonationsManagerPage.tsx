import React, { useState, useEffect } from 'react';
import {
  getCollection, updateDocument, COLLECTIONS, orderBy as fsOrderBy,
} from '@/firebase/firestore';
import type { Donation } from '@/types';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils';
import { Download, Loader2, IndianRupee, CheckCircle, Clock, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type DonationStatus = 'Pending' | 'Verified' | 'Failed' | 'Refunded';

const statusCfg: Record<DonationStatus, { color: string; bg: string; icon: React.ElementType }> = {
  Pending:  { color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200',  icon: Clock },
  Verified: { color: 'text-green-700',  bg: 'bg-green-50 border-green-200',    icon: CheckCircle },
  Failed:   { color: 'text-red-700',    bg: 'bg-red-50 border-red-200',        icon: XCircle },
  Refunded: { color: 'text-slate-600',  bg: 'bg-slate-100 border-slate-200',   icon: XCircle },
};

const fmtDate = (ts: any): string => {
  if (!ts) return '—';
  try {
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return '—'; }
};

const DonationsManagerPage: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const data = await getCollection<Donation>(COLLECTIONS.DONATIONS, [fsOrderBy('createdAt', 'desc')]);
      setDonations(data);
    } catch {
      toast.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDonations(); }, []);

  const totalVerified = donations
    .filter(d => d.status === 'Verified')
    .reduce((acc, d) => acc + (d.amount ?? 0), 0);

  const handleExport = () => {
    const headers = ['Receipt No', 'Name', 'Email', 'Phone', 'Amount', 'Method', 'Status', 'Date'];
    const rows = donations.map(d => [
      d.receiptNumber ?? d.id ?? '',
      d.name ?? '',
      d.email ?? '',
      d.phone ?? '',
      d.amount ?? 0,
      d.method ?? '',
      d.status ?? '',
      fmtDate(d.createdAt),
    ].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `donations_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('CSV exported');
  };

  const updateStatus = async (id: string, status: DonationStatus) => {
    try {
      setUpdating(id);
      await updateDocument(COLLECTIONS.DONATIONS, id, { status });
      toast.success(`Marked as ${status}`);
      setDonations(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-800">Donations & Finance</h2>
          <p className="text-slate-500 text-sm mt-0.5">Track and manage all incoming donations.</p>
        </div>
        <button
          onClick={handleExport}
          disabled={donations.length === 0}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors disabled:opacity-40"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Total Verified',
            value: formatCurrency(totalVerified),
            icon: IndianRupee,
            color: 'bg-green-50 border-green-200 text-green-700',
          },
          {
            label: 'Total Donations',
            value: donations.length.toString(),
            icon: CheckCircle,
            color: 'bg-blue-50 border-blue-200 text-blue-700',
          },
          {
            label: 'Pending Review',
            value: donations.filter(d => d.status === 'Pending').length.toString(),
            icon: Clock,
            color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={cn('p-5 rounded-2xl border flex items-center gap-4', color)}>
            <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center shrink-0">
              <Icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">{value}</p>
              <p className="text-xs font-medium opacity-70 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-52">
              <Loader2 className="w-7 h-7 text-primary animate-spin" />
            </div>
          ) : donations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-52 gap-3">
              <IndianRupee className="text-slate-200" size={40} />
              <p className="text-slate-400 text-sm">No donations recorded yet.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Donor', 'Amount', 'Method', 'Date', 'Status', 'Action'].map(h => (
                    <th key={h} className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {donations.map(d => {
                  const cfg = statusCfg[d.status as DonationStatus] ?? statusCfg['Pending'];
                  const StatusIcon = cfg.icon;
                  return (
                    <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5">
                        <p className="text-sm font-semibold text-slate-800">{d.name}</p>
                        <p className="text-xs text-slate-400">{d.email}</p>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="text-base font-bold text-slate-800">{formatCurrency(d.amount)}</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="text-sm text-slate-600 capitalize">{d.method}</span>
                      </td>
                      <td className="py-3.5 px-5 text-xs text-slate-400 whitespace-nowrap">{fmtDate(d.createdAt)}</td>
                      <td className="py-3.5 px-5">
                        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border', cfg.bg, cfg.color)}>
                          <StatusIcon size={11} />
                          {d.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <select
                          value={d.status}
                          disabled={updating === d.id}
                          onChange={e => updateStatus(d.id!, e.target.value as DonationStatus)}
                          className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Verified">Verified</option>
                          <option value="Failed">Failed</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationsManagerPage;
