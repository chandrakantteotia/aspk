import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { getCollection, addDocument, deleteDocument, COLLECTIONS } from '@/firebase/firestore';
import { uploadContentImage } from '@/firebase/storage';
import type { GalleryItem } from '@/types';
import toast from 'react-hot-toast';

const GalleryManagerPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const data = await getCollection(COLLECTIONS.GALLERY);
      setItems(data as GalleryItem[]);
    } catch (error) {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGallery(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadContentImage(file, 'gallery');
      await addDocument(COLLECTIONS.GALLERY, {
        title: file.name,
        type: 'Photo' as const,
        mediaUrl: url,
        thumbnailUrl: url,
        category: 'general',
        description: '',
        featured: false,
        order: 0,
        tags: [],
      });
      toast.success('Image uploaded');
      fetchGallery();
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this image?')) {
      await deleteDocument(COLLECTIONS.GALLERY, id);
      toast.success('Deleted');
      fetchGallery();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gallery Management</h2>
        <div>
          <label className="cursor-pointer bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm hover:bg-primary/90">
            {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
            Upload Image
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="relative group rounded-xl overflow-hidden shadow-sm aspect-square bg-slate-100">
              <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => handleDelete(item.id!)} className="bg-danger text-white p-2 rounded-full hover:bg-danger/80">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-slate-500 bg-white rounded-xl">
              <ImageIcon size={48} className="mb-4 text-slate-300" />
              <p>No images in gallery</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GalleryManagerPage;
