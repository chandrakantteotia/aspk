import React from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, MessageSquare, Share2, Play, CheckCircle2 } from 'lucide-react';
import partyLogo from '@/images/logo.png';

// Local project images
import gallery1 from '@/images/gallery-1.jpeg';
import gallery2 from '@/images/gallery-2.jpeg';
import gallery3 from '@/images/gallery-3.jpeg';
import gallery4 from '@/images/gallery-4.jpeg';
import heroJoin from '@/images/herojoin.png';

// Sample Facebook Posts
const FB_POSTS = [
  {
    id: 1,
    time: '2 hours ago',
    text: 'जन सेवा ही हमारा धर्म है। हापुड़ के विकास और हर नागरिक के अधिकारों की सुरक्षा के लिए आज जनसंपर्क अभियान के दौरान नागरिकों से संवाद किया।',
    likes: 1240,
    comments: 184,
    shares: 95,
    views: '12K',
  },
  {
    id: 2,
    time: 'Yesterday at 4:15 PM',
    text: 'आजाद समाज पार्टी (कांशीराम) हापुड़ द्वारा युवाओं के लिए निःशुल्क रोजगार व कौशल मार्गदर्शन शिविर का आयोजन किया गया।',
    likes: 2150,
    comments: 310,
    shares: 142,
    views: '24K',
  },
  {
    id: 3,
    time: 'August 9, 2026',
    text: 'ग्रामीण क्षेत्रों में स्वास्थ्य सेवाओं की बेहतरी और किसानों की समस्याओं के त्वरित निस्तारण हेतु अधिकार दिवस का आयोजन।',
    likes: 1890,
    comments: 245,
    shares: 110,
    views: '18K',
  },
  {
    id: 4,
    time: 'August 7, 2026',
    text: 'हापुड़ शहर में प्राथमिक विद्यालयों की स्थिति सुधारने और बच्चों की बेहतर शिक्षा के लिए पार्टी प्रतिनिधिमंडल ने ज्ञापन सौंपा।',
    likes: 1430,
    comments: 198,
    shares: 88,
    views: '15K',
  },
  {
    id: 5,
    time: 'August 5, 2026',
    text: 'पर्यावरण संरक्षण हेतु वृक्षारोपण अभियान का आयोजन किया गया। अधिक से अधिक पौधे लगाकर हापुड़ को स्वच्छ व हरा-भरा बनाने का संकल्प।',
    likes: 2780,
    comments: 412,
    shares: 215,
    views: '32K',
  },
  {
    id: 6,
    time: 'August 3, 2026',
    text: 'जन समस्या निवारण शिविर में नागरिकों की शिकायतों को दर्ज कर अधिकारियों से सीधे वार्ता की गई। जनहित हमारी सर्वोच्च प्राथमिकता।',
    likes: 3120,
    comments: 520,
    shares: 340,
    views: '40K',
  },
];

// Sample Tweets
const TWEETS = [
  {
    id: 1,
    date: 'Aug 10, 2026',
    text: 'शिक्षा, स्वास्थ्य और सम्मान - हर नागरिक का संवैधानिक अधिकार है। हापुड़ में परिवर्तन की लहर जन-जन के सहयोग से आगे बढ़ रही है। #ASPK4Hapur #JanSeva',
    retweets: 240,
    likes: 1120,
  },
  {
    id: 2,
    date: 'Aug 08, 2026',
    text: 'युवाओं को अवसर और रोजगार की गारंटी हमारी प्राथमिकता है। हापुड़ के हर ब्लॉक में यूथ लीडरशिप समिट का आयोजन किया जा रहा है।',
    retweets: 310,
    likes: 1450,
  },
  {
    id: 3,
    date: 'Aug 06, 2026',
    text: 'महिलाओं के सशक्तिकरण और सुरक्षा के लिए संकल्पबद्ध। स्वयं सहायता समूहों को सीधे वित्तीय और प्रशासनिक सहायता प्रदान की जा रही है।',
    retweets: 150,
    likes: 820,
  },
  {
    id: 4,
    date: 'Aug 04, 2026',
    text: 'किसानों की सिंचाई समस्याओं और फसल के उचित दाम के लिए विधानसभा स्तर पर आवाज उठाई जा रही है। किसान कल्याण ही देश का कल्याण।',
    retweets: 420,
    likes: 1890,
  },
  {
    id: 5,
    date: 'Aug 02, 2026',
    text: 'पारदर्शी शासन और त्वरित जनसुनवाई व्यवस्था से ही जनविश्वास बढ़ता है। हापुड़ में हर नागरिक की बात सुनी जाएगी।',
    retweets: 280,
    likes: 1290,
  },
  {
    id: 6,
    date: 'Jul 30, 2026',
    text: 'स्वच्छ हापुड़, स्वस्थ हापुड़ अभियान में जुड़ने के लिए सभी पार्टी कार्यकर्ताओं व नागरिकों का हार्दिक आभार। #CleanHapur',
    retweets: 390,
    likes: 1670,
  },
];

// Instagram post thumbnails (12 grid items)
const INSTA_POSTS = [
  { img: gallery1, type: 'video' },
  { img: gallery2, type: 'photo' },
  { img: gallery3, type: 'video' },
  { img: gallery4, type: 'video' },
  { img: heroJoin, type: 'photo' },
  { img: gallery1, type: 'photo' },
  { img: gallery2, type: 'video' },
  { img: gallery3, type: 'photo' },
  { img: gallery4, type: 'photo' },
  { img: heroJoin, type: 'video' },
  { img: gallery1, type: 'video' },
  { img: gallery2, type: 'photo' },
];

export default function SocialMediaFeedSection() {
  /** Seamless boundary-aware scroll handler: scrolls card feed when in-bounds, passes to window at boundaries */
  const handleFeedWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const isScrollingDown = e.deltaY > 0;
    const isAtBottom = Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) <= 4;
    const isAtTop = el.scrollTop === 0;

    if ((isScrollingDown && isAtBottom) || (!isScrollingDown && isAtTop)) {
      window.scrollBy({ top: e.deltaY, behavior: 'auto' });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50/60 border-b border-slate-200/60 relative">
      <div className="container-padded">
        
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Follow Us On Social Media
          </h2>
          <div className="w-16 h-1 bg-[var(--color-primary)] mx-auto mt-3 rounded-lg" />
        </div>

        {/* 3 Column Social Feeds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-start">

          {/* ── CARD 1: Facebook Feed Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/80 flex flex-col h-[540px] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 aspect-square border border-slate-200 bg-white">
                  <img src={partyLogo} alt="Facebook Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">Aazad Samaj Party - Kansh...</h3>
                    <svg className="w-4 h-4 text-blue-600 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <p className="text-[11px] text-slate-400">1,536,334 followers</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mb-3 shrink-0">
              <a
                href="https://www.facebook.com/vkshirish"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#1877F2] hover:bg-blue-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Follow Page</span>
              </a>
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-1 transition-colors">
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>

            {/* Scrollable Facebook Posts Feed with Wheel Forwarding */}
            <div
              onWheel={handleFeedWheel}
              className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1.5 scroll-smooth touch-pan-y [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-track]:rounded-lg [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-lg hover:[&::-webkit-scrollbar-thumb]:bg-[var(--color-primary)]"
            >
              {FB_POSTS.map(post => (
                <a key={post.id} href="https://www.facebook.com/vkshirish" target="_blank" rel="noopener noreferrer" className="block bg-slate-50/80 rounded-xl p-3 border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 aspect-square border border-slate-200 bg-white">
                      <img src={partyLogo} alt="Party Logo" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">Aazad Samaj Party - Kanshi Ram</p>
                      <span className="text-[10px] text-slate-400">{post.time}</span>
                    </div>
                  </div>
                  <p className="text-[11.5px] text-slate-700 leading-relaxed mb-2 font-medium">
                    {post.text}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200/60">
                    <span className="flex items-center gap-1 text-blue-600 font-semibold"><ThumbsUp className="w-3.5 h-3.5" /> {post.views}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3 text-slate-400" /> {post.likes}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3 text-slate-400" /> {post.comments}</span>
                      <span className="flex items-center gap-1"><Share2 className="w-3 h-3 text-slate-400" /> {post.shares}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

          </motion.div>

          {/* ── CARD 2: X / Twitter Feed Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/80 flex flex-col h-[540px] overflow-hidden"
          >
            {/* Profile Header */}
            <div className="flex items-start gap-3 pb-3 border-b border-slate-100 shrink-0">
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 aspect-square border border-slate-200 bg-white">
                <img src={partyLogo} alt="X Profile" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900 truncate">Aazad Samaj Party ...</h3>
                <p className="text-xs text-slate-500 font-medium">@AzadSamajParty</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-600 mt-1 font-semibold">
                  <span><strong>7,697</strong> Posts</span>
                  <span><strong>228,842</strong> Followers</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="my-2.5 text-[11.5px] text-slate-600 leading-tight shrink-0">
              <p>Official Twitter Account Of Aazad Samaj Party - Kanshi Ram.</p>
              <a href="http://aazadsamajpartyk.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block truncate mt-0.5 font-medium">
                http://aazadsamajpartyk.org
              </a>
            </div>

            {/* X Follow Button */}
            <a
              href="https://x.com/VKShirish?s=20"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#0F1419] hover:bg-black text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors mb-3 shadow-sm shrink-0"
            >
              <span>𝕏 Follow</span>
            </a>

            {/* Scrollable Tweets List with Wheel Forwarding */}
            <div
              onWheel={handleFeedWheel}
              className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1.5 scroll-smooth touch-pan-y [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-track]:rounded-lg [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-lg hover:[&::-webkit-scrollbar-thumb]:bg-[var(--color-primary)]"
            >
              {TWEETS.map(tweet => (
                <a key={tweet.id} href="https://x.com/VKShirish?s=20" target="_blank" rel="noopener noreferrer" className="block bg-slate-50 rounded-xl p-3.5 border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-lg overflow-hidden shrink-0 aspect-square border border-slate-200 bg-white">
                        <img src={partyLogo} alt="X Logo" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[11.5px] font-bold text-slate-800 leading-tight">Aazad Samaj Party - Kanshi Ram</p>
                        <p className="text-[10px] text-slate-400">@AzadSamajParty</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-700">𝕏</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mb-1.5 font-medium">{tweet.date}</span>
                  <p className="text-[11.5px] text-slate-700 leading-relaxed font-medium mb-2">
                    {tweet.text}
                  </p>
                  <div className="flex items-center gap-4 text-[10.5px] text-slate-400 font-semibold pt-1 border-t border-slate-200/60">
                    <span>🔁 {tweet.retweets} Retweets</span>
                    <span>❤️ {tweet.likes} Likes</span>
                  </div>
                </a>
              ))}
            </div>

          </motion.div>

          {/* ── CARD 3: Instagram Feed Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/80 flex flex-col h-[540px] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg p-0.5  shrink-0 aspect-square overflow-hidden">
                  <img src={partyLogo} alt="Instagram Profile" className="w-full h-full rounded-lg object-cover bg-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="text-sm font-bold text-slate-900">azadsamajpartyk</h3>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">Aazad Samaj Party - Kanshi Ram</p>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">1.4m followers • 7,133 posts</p>
                </div>
              </div>

              {/* Instagram Icon */}
              <a href="https://www.instagram.com/virendra.shirish_aspk?igsi=MTl6d3J4eTB0MTVjaQ==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg className="w-6 h-6 text-pink-600 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>

            {/* Scrollable Grid of Instagram Posts with Wheel Forwarding */}
            <div
              onWheel={handleFeedWheel}
              className="grid grid-cols-2 gap-2 my-3 flex-1 min-h-0 overflow-y-auto scroll-smooth touch-pan-y [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-track]:rounded-lg [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-lg hover:[&::-webkit-scrollbar-thumb]:bg-[var(--color-primary)] pr-1.5"
            >
              {INSTA_POSTS.map((item, i) => (
                <a
                  key={i}
                  href="https://www.instagram.com/virendra.shirish_aspk?igsi=MTl6d3J4eTB0MTVjaQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square rounded-xl overflow-hidden group border border-slate-100 shadow-sm block"
                >
                  <img
                    src={item.img}
                    alt={`Insta post ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  {item.type === 'video' && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-lg bg-black/60  flex items-center justify-center">
                      <Play className="w-2.5 h-2.5 text-white fill-white ml-0.5" />
                    </div>
                  )}
                </a>
              ))}
            </div>

            {/* Follow Instagram Button */}
            <a
              href="https://www.instagram.com/virendra.shirish_aspk?igsi=MTl6d3J4eTB0MTVjaQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="w-full  text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-opacity hover:opacity-95 shadow-sm shrink-0"
            >
              <span>Follow on Instagram</span>
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
