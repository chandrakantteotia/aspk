import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Calendar, X, Loader2, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { getCollection, addDocument, updateDocument, deleteDocument, COLLECTIONS } from '@/firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import type { PartyEvent } from '@/types';
import { cn } from '@/lib/utils';

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  type: z.enum(['meeting', 'rally', 'campaign', 'other'] as const),
  date: z.string().min(1, 'Date is required'),
  endDate: z.string().optional(),
  location: z.string().min(2, 'Location is required'),
  address: z.string().min(5, 'Address is required'),
  district: z.string().min(2, 'District is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  registrationOpen: z.boolean(),
  published: z.boolean(),
});

type EventFormData = z.infer<typeof schema>;

const formatDate = (ts: Timestamp | any): string => {
  try {
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return ''; }
};

const EventsManagerPage: React.FC = () => {
  const [events, setEvents] = useState<PartyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EventFormData>({
    resolver: zodResolver(schema),
    defaultValues: { published: false, registrationOpen: true, type: 'meeting' },
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getCollection<PartyEvent>(COLLECTIONS.EVENTS);
      setEvents(data);
    } catch { toast.error('Failed to load events'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEvents(); }, []);

  const openAdd = () => {
    reset({ published: false, registrationOpen: true, type: 'meeting', date: new Date().toISOString().split('T')[0] });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (ev: PartyEvent) => {
    const d = ev.date?.toDate ? ev.date.toDate() : new Date(ev.date as any);
    reset({
      title: ev.title,
      type: (ev.type?.toLowerCase() as any) ?? 'meeting',
      date: d.toISOString().split('T')[0],
      location: ev.location,
      address: ev.address ?? '',
      district: ev.district,
      description: ev.description ?? '',
      imageUrl: ev.imageUrl ?? '',
      registrationOpen: ev.registrationOpen ?? false,
      published: ev.published ?? false,
    });
    setEditingId(ev.id ?? null);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: EventFormData) => {
    try {
      setIsSubmitting(true);
      const docData = {
        ...data,
        date: Timestamp.fromDate(new Date(data.date)),
        slug: data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      };
      if (editingId) {
        await updateDocument(COLLECTIONS.EVENTS, editingId, docData);
        toast.success('Event updated');
      } else {
        await addDocument(COLLECTIONS.EVENTS, docData);
        toast.success('Event created');
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch { toast.error('Failed to save event'); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await deleteDocument(COLLECTIONS.EVENTS, id);
      toast.success('Event deleted');
      fetchEvents();
    } catch { toast.error('Failed to delete'); }
  };

  const typeColors: Record<string, string> = {
    meeting: 'bg-blue-100 text-blue-700',
    rally: 'bg-red-100 text-red-700',
    campaign: 'bg-orange-100 text-orange-700',
    other: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-800">Events Management</h2>
          <p className="text-slate-500 text-sm mt-0.5">Manage party events, rallies, and campaigns.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
          <Plus size={16} /> Add Event
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-48"><Loader2 className="w-7 h-7 text-primary animate-spin" /></div>
          ) : events.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No events found.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Title', 'Type', 'Date', 'Location', 'Status', 'Actions'].map(h => (
                    <th key={h} className={cn('py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider', h === 'Actions' && 'text-right')}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {events.map(ev => (
                  <tr key={ev.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-5 text-sm font-medium text-slate-800 max-w-[220px] truncate">{ev.title}</td>
                    <td className="py-3 px-5">
                      <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize', typeColors[ev.type?.toLowerCase() ?? 'other'] ?? 'bg-gray-100 text-gray-600')}>
                        {ev.type}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-sm text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5"><Calendar size={13} className="text-slate-400" />{formatDate(ev.date)}</div>
                    </td>
                    <td className="py-3 px-5 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5 max-w-[160px] truncate"><MapPin size={13} className="text-slate-400 flex-shrink-0" />{ev.location}</div>
                    </td>
                    <td className="py-3 px-5">
                      <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold', ev.published ? 'bg-success/10 text-green-700' : 'bg-slate-100 text-slate-600')}>
                        {ev.published ? <><Check size={10} className="inline mr-1" />Live</> : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(ev)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"><Edit2 size={15} /></button>
                        <button onClick={() => handleDelete(ev.id!)} className="p-1.5 text-danger hover:bg-danger/10 rounded-lg transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-premium w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-display font-bold text-lg text-slate-800">{editingId ? 'Edit Event' : 'Create Event'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Title</label>
                  <input {...register('title')} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none text-sm" />
                  {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Type</label>
                  <select {...register('type')} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none text-sm bg-white">
                    <option value="meeting">Meeting</option>
                    <option value="rally">Rally</option>
                    <option value="campaign">Campaign</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Date</label>
                  <input type="date" {...register('date')} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none text-sm" />
                  {errors.date && <p className="text-xs text-danger">{errors.date.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Location</label>
                  <input {...register('location')} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none text-sm" />
                  {errors.location && <p className="text-xs text-danger">{errors.location.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">District</label>
                  <input {...register('district')} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none text-sm" />
                  {errors.district && <p className="text-xs text-danger">{errors.district.message}</p>}
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Address</label>
                  <input {...register('address')} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none text-sm" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <textarea {...register('description')} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none text-sm" />
                  {errors.description && <p className="text-xs text-danger">{errors.description.message}</p>}
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Image URL (optional)</label>
                  <input {...register('imageUrl')} placeholder="https://..." className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none text-sm" />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                  <input type="checkbox" {...register('registrationOpen')} className="rounded border-slate-300 text-primary focus:ring-primary" />
                  Open for Registration
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                  <input type="checkbox" {...register('published')} className="rounded border-slate-300 text-primary focus:ring-primary" />
                  Publish
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {isSubmitting && <Loader2 size={15} className="animate-spin" />}
                  {editingId ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManagerPage;
