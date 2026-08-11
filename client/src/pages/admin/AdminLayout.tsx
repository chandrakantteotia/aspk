import React, { useState, useEffect, Suspense } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuth } from '@/contexts/AuthContext';
import { firebaseServicesEnabled } from '@/firebase/config';
import { Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import PageLoader from '@/components/shared/PageLoader';

// Full-screen auth loader
const AuthLoader: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] to-[#0d1529] flex flex-col items-center justify-center gap-4">
    <motion.div
      className="relative"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
    >
      <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
        <Shield className="w-8 h-8 text-primary" />
      </div>
    </motion.div>
    <p className="text-white/60 text-sm font-medium">Verifying admin access...</p>
  </div>
);

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/news': 'News Management',
  '/admin/events': 'Events Management',
  '/admin/gallery': 'Gallery Management',
  '/admin/members': 'Members Directory',
  '/admin/complaints': 'Complaints Hub',
  '/admin/donations': 'Donations & Finance',
  '/admin/settings': 'Website Settings',
};

const AdminLayout: React.FC = () => {
  const { user, profile, isAdmin, loading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  // Auto-collapse on small screens
  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(false);
      }
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (loading) return <AuthLoader />;

  if (firebaseServicesEnabled && (!user || (!isAdmin && profile?.role !== 'admin' && profile?.role !== 'editor'))) {
    toast.error('Unauthorized — admin access required.');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const pageTitle = pageTitles[location.pathname] ?? 'Admin Panel';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0
        transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <AdminSidebar
          collapsed={sidebarCollapsed && !mobileMenuOpen}
          onToggle={() => setSidebarCollapsed(c => !c)}
          className={mobileMenuOpen ? 'w-64' : ''}
        />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <AdminHeader
          onMenuClick={() => setMobileMenuOpen(true)}
          title={pageTitle}
        />

        <main className="flex-1 overflow-y-auto
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-thumb]:bg-slate-200
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-track]:bg-transparent
        ">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto min-h-full"
            >
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Subtle footer bar */}
        <div className="h-8 shrink-0 border-t border-slate-100 bg-white/60 backdrop-blur-sm flex items-center px-6 gap-4">
          <span className="text-[10px] text-slate-400">ASPK4Hapur Admin</span>
          <span className="text-[10px] text-slate-300">•</span>
          <span className="text-[10px] text-slate-400">v2.0.0</span>
          <span className="ml-auto text-[10px] text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            Live
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
