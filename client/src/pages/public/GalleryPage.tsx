import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import { getCollection, COLLECTIONS } from '@/firebase/firestore';
import type { GalleryItem } from '@/types';
import { toast } from 'react-hot-toast';
import PageLoader from '@/components/shared/PageLoader';

const categories = ['All', 'Community', 'Youth', 'Service', 'Campaign', 'Women', 'Media'];

const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await getCollection<GalleryItem>(COLLECTIONS.GALLERY);
        if (data && data.length > 0) {
          setImages(data);
        }
      } catch (error) {
        console.error('Error fetching gallery:', error);
        toast.error('Failed to load gallery data.');
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredImages = activeTab === 'All' 
    ? images 
    : images.filter(img => img.category === activeTab);

  const formatDate = (ts: any) => {
    if (!ts) return '';
    try {
      const d = ts.toDate ? ts.toDate() : new Date(ts);
      return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(d);
    } catch {
      return '';
    }
  };

  return (
    <main className="w-full bg-background min-h-screen pb-20 md:pb-28">
      <section className="bg-white py-20 md:py-28 border-b border-slate-100">
        <div className="container-padded text-center max-w-4xl mx-auto space-y-6">
          <span className="font-semibold tracking-widest uppercase text-sm text-primary">Moments</span>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-dark tracking-tight">Photo Gallery</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">Glimpses of our journey towards a better Hapur.</p>
        </div>
      </section>

      <section className="container-padded py-16">
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === cat 
                  ? 'bg-primary text-white shadow-button' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <PageLoader className="py-20" />
        ) : filteredImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <span className="text-3xl">📷</span>
            </div>
            <h3 className="text-2xl font-bold text-dark font-display mb-3">No moments found</h3>
            <p className="text-slate-500 text-lg">We are curating the best moments for our gallery.</p>
          </div>
        ) : (
          <motion.div layout className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
            <AnimatePresence>
              {filteredImages.map((img) => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="relative group rounded-2xl overflow-hidden cursor-pointer break-inside-avoid shadow-sm border border-slate-100"
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img.mediaUrl} alt={img.title} className="w-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-dark text-xs font-bold px-3 py-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    {img.category}
                  </div>
                  <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-6 text-center">
                    <ZoomIn className="w-10 h-10 mb-4 text-white/80" strokeWidth={1.5} />
                    <h3 className="font-display font-bold text-xl">{img.title}</h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/95 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2 bg-white/10 rounded-full z-50">
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative max-w-6xl w-full flex flex-col items-center z-40"
              onClick={e => e.stopPropagation()}
            >
              <img src={selectedImage.mediaUrl} alt={selectedImage.title} className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl" />
              <div className="mt-8 text-center text-white bg-dark/50 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/10">
                <h2 className="text-2xl font-display font-bold mb-2">{selectedImage.title}</h2>
                <div className="flex items-center justify-center gap-3 text-sm text-slate-300 font-medium">
                  <span className="bg-primary/20 text-primary-100 px-3 py-1 rounded-full">{selectedImage.category}</span>
                  {selectedImage.date && (
                    <span>{formatDate(selectedImage.date)}</span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default GalleryPage;
