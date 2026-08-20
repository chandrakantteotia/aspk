import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* Abstract Graphic */}
        <div className="relative mb-8 flex justify-center">
          <h1 className="text-[120px] font-display font-extrabold text-slate-100 leading-none select-none tracking-tighter">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/80  px-6 py-2.5 rounded-xl shadow-sm border border-slate-100">
              <span className="text-xl font-bold text-slate-800">Page Not Found</span>
            </div>
          </div>
        </div>
        
        <p className="text-slate-500 mb-8 leading-relaxed">
          The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors font-medium text-sm shadow-[0_2px_12px_rgba(0,87,255,0.3)]"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
