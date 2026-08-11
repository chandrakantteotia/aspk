import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { addDocument, COLLECTIONS } from '@/firebase/firestore';
import toast from 'react-hot-toast';
import { analytics } from '@/firebase/analytics';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      await addDocument(COLLECTIONS.NEWSLETTER, { email, active: true });
      analytics.newsletterSubscribe();
      setDone(true);
      setEmail('');
      toast.success('Welcome! You are now subscribed.');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-blue-50 border-t border-blue-100">
      <div className="container-padded">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-primary mb-8 shadow-sm">
            <Mail className="w-8 h-8" />
          </div>
          
          <h2 className="font-display font-bold text-3xl md:text-5xl text-dark mb-6 leading-tight">
            Stay Informed, <br className="hidden md:block" />
            <span className="text-primary">Stay Empowered</span>
          </h2>
          
          <p className="text-gray-600 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Get the latest updates from ASPK4Hapur directly in your inbox.
          </p>

          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex flex-col items-center gap-3 p-8 rounded-2xl bg-white shadow-sm border border-success/20 w-full max-w-md mx-auto"
            >
              <CheckCircle className="w-12 h-12 text-success" />
              <span className="text-xl font-bold text-dark">You're subscribed!</span>
              <span className="text-gray-500">Thank you for joining our community.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4 max-w-lg mx-auto">
              <div className="relative flex-1 w-full">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-dark text-lg placeholder-gray-400 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                  required
                  aria-label="Email address for newsletter"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-white text-lg font-bold hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:pointer-events-none whitespace-nowrap w-full sm:w-auto"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Subscribe <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>
          )}

          <p className="text-sm text-gray-400 mt-8 font-medium">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
