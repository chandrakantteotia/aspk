import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCollection, COLLECTIONS, where, orderBy, limit } from '@/firebase/firestore';
import { firebaseServicesEnabled } from '@/firebase/config';
import type { NewsArticle } from '@/types';
import { formatDate, truncate } from '@/lib/utils';
import gallery1 from '@/images/gallery-1.jpeg';
import gallery2 from '@/images/gallery-2.jpeg';
import gallery3 from '@/images/gallery-3.jpeg';
import gallery4 from '@/images/gallery-4.jpeg';

const fallbackNews: NewsArticle[] = [
  {
    id: '1',
    title: 'Youth leadership summit to be held across state this month',
    slug: 'youth-leadership-summit',
    category: 'Announcement',
    date: { toDate: () => new Date('2026-08-06') } as any,
    summary: 'A state-wide leadership summit will bring together youth wing delegates, entrepreneurs, and educators to shape the future agenda.',
    content: '',
    imageUrl: gallery1,
    author: 'ASPK4Hapur',
    published: true,
    featured: false,
    tags: ['youth', 'leadership'],
    createdAt: {} as any,
    updatedAt: {} as any,
  },
  {
    id: '2',
    title: 'Volunteer service drive expands healthcare support in rural clusters',
    slug: 'volunteer-healthcare-drive',
    category: 'News',
    date: { toDate: () => new Date('2026-08-02') } as any,
    summary: 'Field teams are coordinating blood donation camps, medical screenings, and patient transport assistance in underserved areas.',
    content: '',
    imageUrl: gallery2,
    author: 'ASPK4Hapur',
    published: true,
    featured: false,
    tags: ['healthcare', 'volunteer'],
    createdAt: {} as any,
    updatedAt: {} as any,
  },
  {
    id: '3',
    title: 'Clean Hapur Initiative launched with massive community participation',
    slug: 'clean-hapur-initiative',
    category: 'Event',
    date: { toDate: () => new Date('2026-07-28') } as any,
    summary: 'Thousands of citizens joined hands for the cleanliness drive across major wards in the city.',
    content: '',
    imageUrl: gallery3,
    author: 'ASPK4Hapur',
    published: true,
    featured: false,
    tags: ['environment', 'community'],
    createdAt: {} as any,
    updatedAt: {} as any,
  },
  {
    id: '4',
    title: 'New district outreach model announced for village-first governance',
    slug: 'new-district-outreach-model',
    category: 'Press Release',
    date: { toDate: () => new Date('2026-08-09') } as any,
    summary: 'ASPK4Hapur introduced a field-led program to improve local issue resolution, public feedback, and transparent reporting across all districts.',
    content: '',
    imageUrl: gallery4,
    author: 'ASPK4Hapur',
    published: true,
    featured: true,
    tags: ['governance', 'outreach'],
    createdAt: {} as any,
    updatedAt: {} as any,
  },
];

function FeaturedNewsCard({ article }: { article: NewsArticle }) {
  const date = article.date?.toDate ? formatDate(article.date.toDate()) : '';
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group grid md:grid-cols-2 gap-8 items-center bg-white rounded-xl p-4 pr-8 shadow-card border border-border/50 mb-12 hover:shadow-premium transition-all duration-300"
    >
      <div className="relative aspect-[4/3] md:aspect-square overflow-hidden rounded-xl">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90  rounded-full text-[11px] font-bold uppercase tracking-widest text-primary">
          {article.category}
        </div>
      </div>
      
      <div className="py-6">
        <div className="flex items-center gap-2 text-sm text-muted mb-4 font-medium">
          <Calendar className="w-4 h-4" />
          {date}
        </div>
        <h3 className="font-display font-bold text-2xl md:text-3xl text-ink leading-tight mb-4 group-hover:text-primary transition-colors">
          <Link to={`/news/${article.slug}`}>
            {article.title}
          </Link>
        </h3>
        <p className="prose-body mb-8">
          {truncate(article.summary, 180)}
        </p>
        <Link
          to={`/news/${article.slug}`}
          className="inline-flex items-center gap-2 text-[15px] font-medium text-primary hover:gap-3 transition-all"
        >
          Read Full Story
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.article>
  );
}

function SmallNewsCard({ article, index }: { article: NewsArticle; index: number }) {
  const date = article.date?.toDate ? formatDate(article.date.toDate()) : '';
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-border/50 hover:shadow-card hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 px-2 py-1 bg-white/90  rounded-md text-[10px] font-bold uppercase tracking-widest text-dark">
          {article.category}
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="text-[13px] text-muted font-medium mb-3">
          {date}
        </div>
        <h4 className="font-display font-bold text-lg text-ink leading-snug mb-3 group-hover:text-primary transition-colors flex-1">
          <Link to={`/news/${article.slug}`}>
            {article.title}
          </Link>
        </h4>
        <p className="text-[14px] text-muted line-clamp-2 mb-4">
          {article.summary}
        </p>
      </div>
    </motion.article>
  );
}

export default function NewsSection() {
  const remoteDataEnabled = firebaseServicesEnabled;
  const query = useQuery({
    queryKey: ['news', 'home'],
    queryFn: () => getCollection<NewsArticle>(COLLECTIONS.NEWS, [
      where('published', '==', true),
      orderBy('date', 'desc'),
      limit(4),
    ]).catch(() => fallbackNews),
    placeholderData: fallbackNews,
    enabled: remoteDataEnabled,
  });

  const news = remoteDataEnabled ? (query.data ?? fallbackNews) : fallbackNews;
  const isLoading = remoteDataEnabled ? query.isLoading : false;

  const displayNews = news.slice(0, 3);

  return (
    <section className="py-16 sm:py-24 md:py-32 bg-white" aria-labelledby="news-heading">
      <div className="container-padded">
        
        <div className="mb-8 sm:mb-12 md:mb-16">
          <span className="section-label block mb-4">Latest Updates</span>
          <h2 id="news-heading" className="editorial-heading">
            News & <span className="font-serif italic text-primary">Announcements</span>
          </h2>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-12">
            <div className="h-[400px] bg-gray-100 rounded-xl" />
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-100 rounded-xl" />)}
            </div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {displayNews.map((article, i) => (
                <SmallNewsCard key={article.id} article={article} index={i} />
              ))}
            </div>

            <div className="flex justify-end">
              <Link
                to="/news"
                className="inline-flex items-center gap-2 text-[15px] font-medium text-ink hover:text-primary transition-colors border-b border-ink/20 hover:border-primary pb-1"
              >
                View All News
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
