import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Check, X, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
  getCollection,
  addDocument,
  updateDocument,
  deleteDocument,
  COLLECTIONS,
} from '@/firebase/firestore';
import type { NewsArticle } from '@/types';
import { cn } from '@/lib/utils';
import { Timestamp } from 'firebase/firestore';

const newsSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.string().min(2, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  summary: z.string().min(10, 'Summary is too short'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  imageUrl: z.string().url('Must be a valid URL'),
  author: z.string().min(2, 'Author is required'),
  published: z.boolean(),
});

type NewsFormData = z.infer<typeof newsSchema>;

const formatDate = (ts: any): string => {
  try {
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
};

const NewsManagerPage: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: { published: false, date: new Date().toISOString().split('T')[0] },
  });

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await getCollection<NewsArticle>(COLLECTIONS.NEWS);
      setArticles(data);
    } catch {
      toast.error('Failed to load news articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNews(); }, []);

  const openAddModal = () => {
    reset({ published: false, date: new Date().toISOString().split('T')[0] });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (article: NewsArticle) => {
    const dateStr = article.date?.toDate
      ? article.date.toDate().toISOString().split('T')[0]
      : new Date(article.date as unknown as string).toISOString().split('T')[0];
    reset({
      title: article.title,
      category: article.category,
      date: dateStr,
      summary: article.summary,
      content: article.content,
      imageUrl: article.imageUrl || '',
      author: article.author,
      published: article.published,
    });
    setEditingId(article.id);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: NewsFormData) => {
    try {
      setIsSubmitting(true);
      const docData = {
        ...data,
        date: Timestamp.fromDate(new Date(data.date)),
        slug: data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        tags: [],
        featured: false,
      };
      if (editingId) {
        await updateDocument(COLLECTIONS.NEWS, editingId, docData);
        toast.success('Article updated successfully');
      } else {
        await addDocument(COLLECTIONS.NEWS, docData);
        toast.success('Article created successfully');
      }
      setIsModalOpen(false);
      fetchNews();
    } catch {
      toast.error('Failed to save article');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await deleteDocument(COLLECTIONS.NEWS, id);
      toast.success('Article deleted');
      fetchNews();
    } catch {
      toast.error('Failed to delete article');
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      await updateDocument(COLLECTIONS.NEWS, id, { published: !currentStatus });
      toast.success(`Article ${!currentStatus ? 'published' : 'unpublished'}`);
      fetchNews();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-800">News Management</h2>
          <p className="text-slate-500 text-sm mt-0.5">Create, edit and manage party news and announcements.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors shadow-sm text-sm font-semibold"
        >
          <Plus size={16} /> Add News
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="w-7 h-7 text-primary animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <p className="text-sm">No news articles found.</p>
              <button onClick={openAddModal} className="mt-3 text-primary text-sm font-semibold hover:underline">
                Add the first article →
              </button>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Title', 'Category', 'Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className={cn(
                      'py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider',
                      h === 'Actions' && 'text-right'
                    )}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(article => (
                  <tr key={article.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-5 text-sm font-medium text-slate-800 max-w-[240px] truncate">{article.title}</td>
                    <td className="py-3 px-5 text-sm text-slate-600">{article.category}</td>
                    <td className="py-3 px-5 text-sm text-slate-500">{formatDate(article.date)}</td>
                    <td className="py-3 px-5">
                      <button
                        onClick={() => togglePublished(article.id, article.published)}
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors border',
                          article.published
                            ? 'bg-success/10 text-green-700 border-success/20 hover:bg-success/20'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        )}
                      >
                        {article.published ? <><Check size={11} /> Published</> : <><X size={11} /> Draft</>}
                      </button>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEditModal(article)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => handleDelete(article.id)} className="p-1.5 text-danger hover:bg-danger/10 rounded-lg transition-colors" title="Delete">
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-dark/50  z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-premium w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-display font-bold text-lg text-slate-800">
                {editingId ? 'Edit Article' : 'Create Article'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Title</label>
                  <input {...register('title')} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none text-sm" />
                  {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Category</label>
                  <input {...register('category')} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none text-sm" />
                  {errors.category && <p className="text-xs text-danger">{errors.category.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Date</label>
                  <input type="date" {...register('date')} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none text-sm" />
                  {errors.date && <p className="text-xs text-danger">{errors.date.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Author</label>
                  <input {...register('author')} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none text-sm" />
                  {errors.author && <p className="text-xs text-danger">{errors.author.message}</p>}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Image URL</label>
                <input {...register('imageUrl')} placeholder="https://..." className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none text-sm" />
                {errors.imageUrl && <p className="text-xs text-danger">{errors.imageUrl.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Summary</label>
                <textarea {...register('summary')} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none text-sm" />
                {errors.summary && <p className="text-xs text-danger">{errors.summary.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Content</label>
                <textarea {...register('content')} rows={5} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none text-sm" />
                {errors.content && <p className="text-xs text-danger">{errors.content.message}</p>}
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="published" {...register('published')} className="rounded border-slate-300 text-primary focus:ring-primary" />
                <label htmlFor="published" className="text-sm font-medium text-slate-700">Publish immediately</label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {isSubmitting && <Loader2 size={15} className="animate-spin" />}
                  {editingId ? 'Save Changes' : 'Create Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsManagerPage;
