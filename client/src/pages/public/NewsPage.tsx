import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, ArrowRight } from 'lucide-react';
import { getCollection, COLLECTIONS } from '@/firebase/firestore';
import { toast } from 'react-hot-toast';
import PageLoader from '@/components/shared/PageLoader';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  imageUrl: string;
  date: string;
  category: string;
  slug: string;
}

const fallbackNews: NewsArticle[] = [
  { id: '1', title: 'ASPK4Hapur Launches New Digital Manifesto', excerpt: 'The party has introduced a revolutionary digital platform outlining its promises for the upcoming term...', imageUrl: 'https://images.unsplash.com/photo-1541872526845-8c769493a79d?auto=format&fit=crop&w=900&q=80', date: '2025-10-15', category: 'Announcement', slug: 'digital-manifesto-launch' },
  { id: '2', title: 'Youth Wing Organizes Mega Blood Donation Camp', excerpt: 'Over 500 volunteers participated in the district-wide blood donation camp organized this Sunday.', imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=900&q=80', date: '2025-10-10', category: 'Community', slug: 'youth-blood-donation' },
  { id: '3', title: 'Women Empowerment Seminar Draws Huge Crowd', excerpt: 'Leaders discussed the importance of financial independence for women at the town hall meeting.', imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=900&q=80', date: '2025-10-05', category: 'Events', slug: 'women-empowerment-seminar' },
  { id: '4', title: 'City Infrastructure Upgrade Plan Revealed', excerpt: 'A detailed blueprint for repairing roads and improving public transport was shared today.', imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80', date: '2025-09-28', category: 'Development', slug: 'infrastructure-plan' },
  { id: '5', title: 'ASPK4Hapur Membership Crosses 50,000 Mark', excerpt: 'A major milestone achieved as more citizens join the movement for transparent governance.', imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953eb1f5bc?auto=format&fit=crop&w=900&q=80', date: '2025-09-20', category: 'Milestone', slug: 'membership-milestone' },
];

const NewsPage: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>(fallbackNews);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getCollection(COLLECTIONS.NEWS);
        if (data && data.length > 0) {
          setArticles(data as NewsArticle[]);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        toast.error('Failed to load latest news, showing cached articles.');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const featured = articles[0];
  const restArticles = articles.slice(1);

  return (
    <main className="w-full bg-background min-h-screen pb-20 md:pb-28">
      <section className="bg-white py-20 md:py-28 border-b border-slate-100">
        <div className="container-padded text-center space-y-6 max-w-4xl mx-auto">
          <span className="font-semibold tracking-widest uppercase text-sm text-primary">Press & Media</span>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-dark tracking-tight">Latest News</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">Stay updated with our latest initiatives, announcements, and press releases.</p>
        </div>
      </section>

      <section className="container-padded py-20 md:py-28">
        {loading ? (
          <PageLoader className="py-20" />
        ) : (
          <div className="space-y-20">
            {/* Featured Article */}
            {featured && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl overflow-hidden shadow-card border border-slate-100 flex flex-col lg:flex-row group cursor-pointer"
              >
                <div className="lg:w-3/5 overflow-hidden relative min-h-[400px]">
                  <img src={featured.imageUrl} alt={featured.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                </div>
                <div className="lg:w-2/5 p-10 lg:p-16 flex flex-col justify-center bg-white relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="bg-slate-100 text-dark text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider">{featured.category}</span>
                    <div className="flex items-center text-sm text-slate-500 font-medium">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(featured.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <h2 className="text-4xl font-display font-bold text-dark mb-6 group-hover:text-primary transition-colors leading-tight">{featured.title}</h2>
                  <p className="text-slate-600 mb-10 text-lg leading-relaxed">{featured.excerpt}</p>
                  <div className="flex items-center text-primary font-bold group-hover:translate-x-2 transition-transform w-fit">
                    Read Full Article <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {restArticles.map((article, i) => (
                <motion.article 
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden shadow-card border border-slate-100 group flex flex-col cursor-pointer"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-4 left-4 bg-white/95  text-dark text-xs font-bold px-3 py-1 rounded-lg shadow-sm">{article.category}</div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center text-sm text-slate-400 mb-4 font-medium uppercase tracking-wider">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <h3 className="text-2xl font-display font-bold text-dark mb-4 group-hover:text-primary transition-colors line-clamp-3 leading-snug">{article.title}</h3>
                    <div className="flex items-center text-sm font-bold text-dark mt-auto group-hover:text-primary transition-colors uppercase tracking-wider">
                      Read story <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="flex justify-center pt-10">
              <nav className="flex gap-2">
                <button className="w-12 h-12 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 text-slate-500 transition-colors">
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <button className="w-12 h-12 rounded-lg bg-primary text-white font-bold flex items-center justify-center shadow-button">1</button>
                <button className="w-12 h-12 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-700 font-medium transition-colors">2</button>
                <button className="w-12 h-12 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-700 font-medium transition-colors">3</button>
                <button className="w-12 h-12 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </nav>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default NewsPage;
