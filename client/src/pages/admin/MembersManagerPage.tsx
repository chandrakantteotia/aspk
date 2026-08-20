import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Eye, Check, X, Plus, Edit2, Trash2, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { getCollection, updateDocument, addDocument, deleteDocument, COLLECTIONS } from '@/firebase/firestore';
import { uploadContentImage } from '@/firebase/storage';
import type { MemberApplication } from '@/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type AppStatus = 'pending' | 'approved' | 'rejected';

const statusColors: Record<AppStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-success/10 text-green-700',
  rejected: 'bg-danger/10 text-red-700',
};

// ── Leadership Directory Types ───────────────────────────────────────
export interface PartyMember {
  id?: string;
  name: string;
  role: string;
  wing: string;
  bio: string;
  photoUrl: string;
  socials?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    email?: string;
  };
}

const memberSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  role: z.string().min(2, 'Role is required'),
  wing: z.string().min(2, 'Wing is required'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  socials: z.object({
    twitter: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    email: z.string().email('Invalid email').or(z.literal('')),
  }).optional(),
});
type MemberForm = z.infer<typeof memberSchema>;

const WINGS = ['National', 'State', 'District', 'Youth Wing', "Women's Wing"];

const MembersManagerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'applications' | 'directory'>('applications');

  // ── Applications State ──────────────────────────────────────────
  const [applications, setApplications] = useState<MemberApplication[]>([]);
  const [appLoading, setAppLoading] = useState(false);
  const [appFilter, setAppFilter] = useState<AppStatus | 'all'>('all');
  const [selectedApp, setSelectedApp] = useState<MemberApplication | null>(null);
  const [updatingApp, setUpdatingApp] = useState<string | null>(null);

  // ── Directory State ─────────────────────────────────────────────
  const [members, setMembers] = useState<PartyMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<PartyMember | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<MemberForm>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      socials: { twitter: '', facebook: '', instagram: '', email: '' }
    }
  });

  // ── Fetchers ──────────────────────────────────────────────────
  const fetchApps = async () => {
    try {
      setAppLoading(true);
      const data = await getCollection<MemberApplication>(COLLECTIONS.MEMBER_APPLICATIONS);
      setApplications(data);
    } catch { toast.error('Failed to load applications'); }
    finally { setAppLoading(false); }
  };

  const fetchMembers = async () => {
    try {
      setMembersLoading(true);
      const data = await getCollection<PartyMember>(COLLECTIONS.PARTY_MEMBERS);
      setMembers(data);
    } catch { toast.error('Failed to load members'); }
    finally { setMembersLoading(false); }
  };

  useEffect(() => {
    if (activeTab === 'applications') fetchApps();
    else fetchMembers();
  }, [activeTab]);

  // ── Application Actions ───────────────────────────────────────
  const updateStatus = async (id: string, status: AppStatus) => {
    try {
      setUpdatingApp(id);
      await updateDocument(COLLECTIONS.MEMBER_APPLICATIONS, id, { status });
      toast.success(`Application ${status}`);
      fetchApps();
      if (selectedApp?.id === id) setSelectedApp(prev => prev ? { ...prev, status } : null);
    } catch { toast.error('Failed to update'); }
    finally { setUpdatingApp(null); }
  };

  const filteredApps = appFilter === 'all' ? applications : applications.filter(a => a.status === appFilter);
  const formatDate = (ts: any) => {
    try {
      const d = ts?.toDate ? ts.toDate() : new Date(ts);
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return ''; }
  };

  // ── Directory Actions ─────────────────────────────────────────
  const handleOpenModal = (member?: PartyMember) => {
    if (member) {
      setEditingMember(member);
      setPhotoUrl(member.photoUrl || '');
      reset({
        name: member.name,
        role: member.role,
        wing: member.wing,
        bio: member.bio,
        socials: {
          twitter: member.socials?.twitter || '',
          facebook: member.socials?.facebook || '',
          instagram: member.socials?.instagram || '',
          email: member.socials?.email || '',
        }
      });
    } else {
      setEditingMember(null);
      setPhotoUrl('');
      reset({
        name: '', role: '', wing: 'National', bio: '',
        socials: { twitter: '', facebook: '', instagram: '', email: '' }
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const url = await uploadContentImage(file, 'members');
      setPhotoUrl(url);
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const onSaveMember = async (data: MemberForm) => {
    if (!photoUrl) {
      toast.error('Please upload a photo');
      return;
    }
    try {
      const memberData: PartyMember = {
        name: data.name,
        role: data.role,
        wing: data.wing,
        bio: data.bio,
        photoUrl,
        socials: {
          twitter: data.socials?.twitter || '',
          facebook: data.socials?.facebook || '',
          instagram: data.socials?.instagram || '',
          email: data.socials?.email || '',
        }
      };

      if (editingMember?.id) {
        await updateDocument(COLLECTIONS.PARTY_MEMBERS, editingMember.id, memberData as any);
        toast.success('Member updated');
      } else {
        await addDocument(COLLECTIONS.PARTY_MEMBERS, memberData as any);
        toast.success('Member added');
      }
      setIsModalOpen(false);
      fetchMembers();
    } catch {
      toast.error('Failed to save member');
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (confirm('Are you sure you want to delete this member?')) {
      try {
        await deleteDocument(COLLECTIONS.PARTY_MEMBERS, id);
        toast.success('Member deleted');
        fetchMembers();
      } catch {
        toast.error('Failed to delete member');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-800">People Management</h2>
          <p className="text-slate-500 text-sm mt-0.5">Manage join applications and the public party leadership directory.</p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('applications')}
            className={cn('px-4 py-2 text-sm font-semibold rounded-lg transition-colors', activeTab === 'applications' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700')}
          >
            Join Applications
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={cn('px-4 py-2 text-sm font-semibold rounded-lg transition-colors', activeTab === 'directory' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700')}
          >
            Leadership Directory
          </button>
        </div>
      </div>

      {activeTab === 'applications' ? (
        // ── APPLICATIONS TAB ─────────────────────────────────────────
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex justify-end gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
              <button
                key={f}
                onClick={() => setAppFilter(f)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors',
                  appFilter === f ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary/50'
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              {appLoading ? (
                <div className="flex justify-center items-center h-48"><Loader2 className="w-7 h-7 text-primary animate-spin" /></div>
              ) : filteredApps.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No applications found.</div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {['Name', 'Email', 'Phone', 'District', 'Applied', 'Status', 'Actions'].map(h => (
                        <th key={h} className={cn('py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider', h === 'Actions' && 'text-right')}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredApps.map(app => (
                      <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 text-sm font-medium text-slate-800">{app.name}</td>
                        <td className="py-3 px-4 text-sm text-slate-600 max-w-[160px] truncate">{app.email}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{app.phone}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{app.district}</td>
                        <td className="py-3 px-4 text-sm text-slate-500 whitespace-nowrap">{formatDate(app.createdAt)}</td>
                        <td className="py-3 px-4">
                          <span className={cn('px-2.5 py-0.5 rounded-lg text-xs font-semibold capitalize', statusColors[app.status as AppStatus] ?? 'bg-gray-100 text-gray-600')}>
                            {app.status ?? 'pending'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => setSelectedApp(app)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="View Details">
                              <Eye size={15} />
                            </button>
                            {app.status !== 'approved' && (
                              <button onClick={() => updateStatus(app.id!, 'approved')} disabled={updatingApp === app.id} className="p-1.5 text-success hover:bg-success/10 rounded-lg transition-colors" title="Approve">
                                {updatingApp === app.id ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                              </button>
                            )}
                            {app.status !== 'rejected' && (
                              <button onClick={() => updateStatus(app.id!, 'rejected')} disabled={updatingApp === app.id} className="p-1.5 text-danger hover:bg-danger/10 rounded-lg transition-colors" title="Reject">
                                <X size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </motion.div>
      ) : (
        // ── DIRECTORY TAB ────────────────────────────────────────────
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus size={16} /> Add Member
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              {membersLoading ? (
                <div className="flex justify-center items-center h-48"><Loader2 className="w-7 h-7 text-primary animate-spin" /></div>
              ) : members.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mb-3">
                    <Plus size={24} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">No leadership members yet.</p>
                  <p className="text-xs mt-1">Add members to display them on the public Party Members page.</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {['Photo', 'Name', 'Role', 'Wing', 'Actions'].map(h => (
                        <th key={h} className={cn('py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider', h === 'Actions' && 'text-right')}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {members.map(member => (
                      <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <img src={member.photoUrl} alt={member.name} className="w-10 h-10 rounded-lg object-cover shadow-sm" />
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-slate-800">{member.name}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{member.role}</td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">{member.wing}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleOpenModal(member)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
                              <Edit2 size={15} />
                            </button>
                            <button onClick={() => handleDeleteMember(member.id!)} className="p-1.5 text-danger hover:bg-danger/10 rounded-lg transition-colors" title="Delete">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── App Detail Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 bg-dark/50  z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-premium w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white/80  p-5 border-b border-slate-100 flex justify-between items-center z-10">
                <h3 className="font-display font-bold text-lg text-slate-800">Application Details</h3>
                <button onClick={() => setSelectedApp(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-4">
                {[
                  ['Full Name', selectedApp.name],
                  ['Email', selectedApp.email],
                  ['Phone', selectedApp.phone],
                  ['Date of Birth', selectedApp.dob ?? '—'],
                  ['Gender', selectedApp.gender ?? '—'],
                  ['Address', selectedApp.address],
                  ['District', selectedApp.district],
                  ['Pincode', selectedApp.pincode ?? '—'],
                  ['Occupation', selectedApp.occupation ?? '—'],
                  ['Qualification', selectedApp.qualification ?? '—'],
                  ['Application ID', selectedApp.applicationId ?? selectedApp.id ?? '—'],
                  ['Status', selectedApp.status ?? 'pending'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-start gap-4">
                    <span className="text-sm text-slate-500 font-medium flex-shrink-0 w-36">{label}</span>
                    <span className="text-sm text-slate-800 text-right capitalize">{value as string}</span>
                  </div>
                ))}
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => { updateStatus(selectedApp.id!, 'approved'); setSelectedApp(null); }}
                    className="flex-1 py-2.5 bg-success text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => { updateStatus(selectedApp.id!, 'rejected'); setSelectedApp(null); }}
                    className="flex-1 py-2.5 bg-danger text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Member Editor Modal ──────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-dark/50  z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-premium w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center shrink-0">
                <h3 className="font-display font-bold text-lg text-slate-800">{editingMember ? 'Edit Leadership Member' : 'Add Leadership Member'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit(onSaveMember)} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-5 overflow-y-auto space-y-6 flex-1">
                  
                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Photo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-lg bg-slate-100 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                        {uploadingImage ? (
                          <Loader2 className="w-6 h-6 text-primary animate-spin" />
                        ) : photoUrl ? (
                          <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Upload className="w-6 h-6 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                          Choose Image
                        </button>
                        <p className="text-xs text-slate-500 mt-1">1:1 Square aspect ratio recommended. JPG or PNG.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Name *</label>
                      <input {...register('name')} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" placeholder="e.g. Rahul Sharma" />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Role *</label>
                      <input {...register('role')} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" placeholder="e.g. President" />
                      {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Wing *</label>
                    <select {...register('wing')} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm">
                      {WINGS.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                    {errors.wing && <p className="text-red-500 text-xs mt-1">{errors.wing.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Bio *</label>
                    <textarea {...register('bio')} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none" placeholder="Short biography..." />
                    {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-slate-800 mb-3">Social Links (Optional)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Twitter URL</label>
                        <input {...register('socials.twitter')} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="https://twitter.com/..." />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Facebook URL</label>
                        <input {...register('socials.facebook')} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="https://facebook.com/..." />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Instagram URL</label>
                        <input {...register('socials.instagram')} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="https://instagram.com/..." />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Email Address</label>
                        <input {...register('socials.email')} type="email" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="member@aspk4hapur.org" />
                      </div>
                    </div>
                  </div>

                </div>
                <div className="p-5 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-slate-50/50">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting || uploadingImage} className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm">
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    {editingMember ? 'Save Changes' : 'Add Member'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MembersManagerPage;
