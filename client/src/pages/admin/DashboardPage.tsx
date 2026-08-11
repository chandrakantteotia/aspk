import React, { useEffect, useState } from 'react';
import {
  Users, MessageSquareWarning, UserPlus, IndianRupee,
  Plus, ArrowRight, TrendingUp, Activity, Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '@/components/admin/StatCard';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  getCollection, subscribeToCollection, COLLECTIONS,
  orderBy as fsOrderBy, limit as fsLimit,
} from '@/firebase/firestore';
import type { Complaint, MemberApplication, Donation } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [memberCount, setMemberCount] = useState(0);
  const [pendingApps, setPendingApps] = useState(0);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubComplaints: (() => void) | undefined;

    const load = async () => {
      try {
        // Real-time complaints (latest 5)
        unsubComplaints = subscribeToCollection<Complaint>(
          COLLECTIONS.COMPLAINTS,
          data => setComplaints(data.slice(0, 5)),
          [fsOrderBy('createdAt', 'desc'), fsLimit(5)]
        );

        // Member applications count
        const apps = await getCollection<MemberApplication>(COLLECTIONS.MEMBER_APPLICATIONS);
        setMemberCount(apps.filter(a => a.status === 'Approved').length);
        setPendingApps(apps.filter(a => a.status === 'Pending').length);

        // Donations this month
        const allDonations = await getCollection<Donation>(COLLECTIONS.DONATIONS, [fsOrderBy('createdAt', 'desc')]);
        const now = new Date();
        const thisMonth = allDonations.filter(d => {
          try {
            const date = (d.createdAt as any)?.toDate ? (d.createdAt as any).toDate() : new Date(d.createdAt as any);
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
          } catch { return false; }
        });
        setDonations(thisMonth);
      } catch (e) {
        // Silently fall back to zeros — Firebase might have no data yet
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => unsubComplaints?.();
  }, []);

  const openComplaints = complaints.filter(c => c.status === 'Open' || c.status === 'In Progress').length;
  const donationsTotal = donations.filter(d => d.status === 'Verified').reduce((a, d) => a + (d.amount ?? 0), 0);

  const stats = [
    {
      title: 'Total Members',
      value: memberCount > 0 ? memberCount.toLocaleString() : '—',
      change: pendingApps > 0 ? `${pendingApps} pending` : 'No pending',
      trend: 'up' as const,
      icon: UserPlus,
      color: 'bg-primary text-white',
    },
    {
      title: 'Active Complaints',
      value: openComplaints > 0 ? openComplaints.toString() : '0',
      change: complaints.length > 0 ? `${complaints.length} total` : 'None filed',
      trend: openComplaints > 0 ? 'up' as const : 'neutral' as const,
      icon: MessageSquareWarning,
      color: 'bg-warning text-white',
    },
    {
      title: 'Donations (Month)',
      value: donationsTotal > 0 ? formatCurrency(donationsTotal) : '₹0',
      change: `${donations.length} donations`,
      trend: donationsTotal > 0 ? 'up' as const : 'neutral' as const,
      icon: IndianRupee,
      color: 'bg-accent text-slate-900',
    },
    {
      title: 'Applications',
      value: pendingApps.toString(),
      change: 'awaiting review',
      trend: 'neutral' as const,
      icon: Users,
      color: 'bg-success text-white',
    },
  ];

  const statusColors: Record<string, string> = {
    'Open':        'bg-blue-50 text-blue-700',
    'In Progress': 'bg-orange-50 text-orange-700',
    'Resolved':    'bg-green-50 text-green-700',
    'Closed':      'bg-slate-100 text-slate-600',
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-800">
            Welcome back, {user?.displayName?.split(' ')[0] || 'Admin'} 👋
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Here's what's happening in ASPK4Hapur today.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/news" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
            <Plus size={16} /> New Post
          </Link>
          <Link to="/admin/events" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors">
            Add Event
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-slate-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} delay={i * 0.08} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Complaints — real data */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-display font-bold text-slate-800 flex items-center gap-2">
              <MessageSquareWarning size={18} className="text-rose-500" /> Recent Complaints
            </h3>
            <Link to="/admin/complaints" className="text-sm text-primary hover:text-primary/80 font-semibold flex items-center gap-1">
              View All <ArrowRight size={15} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center h-40"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
            ) : complaints.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-slate-400 text-sm">No complaints yet.</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['ID', 'Citizen', 'Category', 'District', 'Status'].map(h => (
                      <th key={h} className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {complaints.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-5 text-xs font-mono text-slate-400">
                        #{c.complaintId?.slice(-5) || c.id?.slice(0, 5)}
                      </td>
                      <td className="py-3 px-5 text-sm font-medium text-slate-800">{c.name}</td>
                      <td className="py-3 px-5 text-sm text-slate-600 max-w-[120px] truncate">{c.category}</td>
                      <td className="py-3 px-5 text-sm text-slate-500">{c.district || '—'}</td>
                      <td className="py-3 px-5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[c.status] ?? 'bg-slate-100 text-slate-600'}`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Quick Links + Chart */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.4 }}
          className="space-y-4"
        >
          {/* Quick actions */}
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
            <h3 className="font-display font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Activity size={18} className="text-primary" /> Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Review Applications', to: '/admin/members', count: pendingApps, color: 'text-blue-600 bg-blue-50' },
                { label: 'Open Complaints',     to: '/admin/complaints', count: openComplaints, color: 'text-rose-600 bg-rose-50' },
                { label: 'Verify Donations',    to: '/admin/donations', count: donations.filter(d => d.status === 'Pending').length, color: 'text-yellow-600 bg-yellow-50' },
                { label: 'Manage Gallery',      to: '/admin/gallery', count: null, color: 'text-purple-600 bg-purple-50' },
              ].map(({ label, to, count, color }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <span className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">{label}</span>
                  {count !== null && count > 0 && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>{count}</span>
                  )}
                  <ArrowRight size={14} className="text-slate-300 group-hover:text-primary transition-colors ml-auto" />
                </Link>
              ))}
            </div>
          </div>

          {/* Mini chart */}
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
            <h3 className="font-display font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" /> Monthly Donations
            </h3>
            <div className="h-32 flex items-end justify-between gap-1.5">
              {donations.slice(0, 7).map((d, i) => {
                const maxAmt = Math.max(...donations.map(x => x.amount ?? 0), 1);
                const pct = ((d.amount ?? 0) / maxAmt) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="w-full flex items-end justify-center" style={{ height: '100px' }}>
                      <div
                        className="w-full bg-primary/20 hover:bg-primary/40 rounded-t-lg transition-all duration-300 cursor-pointer relative"
                        style={{ height: `${Math.max(pct, 8)}%` }}
                        title={formatCurrency(d.amount)}
                      />
                    </div>
                    <span className="text-[9px] text-slate-400">{i + 1}</span>
                  </div>
                );
              })}
              {donations.length === 0 && (
                <p className="text-xs text-slate-400 w-full text-center self-center">No donations this month</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
