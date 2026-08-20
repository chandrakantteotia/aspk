import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Image as ImageIcon,
  Users,
  MessageSquare,
  IndianRupee,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',  path: '/admin',              exact: true, accent: 'text-blue-500',   activeBg: 'bg-blue-50',   activeBorder: 'bg-blue-500' },
  { section: 'Content' },
  { icon: FileText,        label: 'News',        path: '/admin/news',                      accent: 'text-emerald-500', activeBg: 'bg-emerald-50', activeBorder: 'bg-emerald-500' },
  { icon: Calendar,        label: 'Events',      path: '/admin/events',                    accent: 'text-orange-500', activeBg: 'bg-orange-50', activeBorder: 'bg-orange-500' },
  { icon: ImageIcon,       label: 'Gallery',     path: '/admin/gallery',                   accent: 'text-purple-500', activeBg: 'bg-purple-50', activeBorder: 'bg-purple-500' },
  { section: 'People' },
  { icon: Users,           label: 'Members',     path: '/admin/members',                   accent: 'text-cyan-500',   activeBg: 'bg-cyan-50',   activeBorder: 'bg-cyan-500' },
  { icon: MessageSquare,   label: 'Complaints',  path: '/admin/complaints',                accent: 'text-rose-500',   activeBg: 'bg-rose-50',   activeBorder: 'bg-rose-500' },
  { section: 'Finance' },
  { icon: IndianRupee,     label: 'Donations',   path: '/admin/donations',                 accent: 'text-yellow-500', activeBg: 'bg-yellow-50', activeBorder: 'bg-yellow-500' },
  { section: 'System' },
  { icon: Settings,        label: 'Settings',    path: '/admin/settings',                  accent: 'text-slate-500',  activeBg: 'bg-slate-100', activeBorder: 'bg-slate-500' },
];

// ── Sidebar ───────────────────────────────────────────────────
const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed = false, onToggle, className }) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    setShowLogout(false);
    await signOut();
    navigate('/login');
  };

  const initials =
    user?.displayName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    'A';

  return (
    <>
      <aside
        className={cn(
          'relative flex flex-col h-screen shrink-0 sticky top-0 transition-all duration-300 ease-in-out overflow-hidden',
          'bg-white border-r border-slate-100',
          collapsed ? 'w-[72px]' : 'w-64',
          className
        )}
        style={{ boxShadow: '1px 0 12px rgba(0,0,0,0.05)' }}
      >
        {/* Logout confirm — replaces sidebar content in-place */}
        {showLogout ? (
          <div className="flex-1 flex flex-col items-center justify-center p-5">
            <motion.div
              className="w-full bg-red-50 border border-red-100 rounded-xl p-5 text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 260 }}
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-red-100 shadow-sm flex items-center justify-center mx-auto mb-3">
                <LogOut className="text-red-500" size={20} />
              </div>
              <p className="font-display font-bold text-slate-800 text-sm mb-1">Sign Out?</p>
              <p className="text-slate-400 text-xs mb-4 leading-relaxed">You'll be logged out of the admin panel.</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleLogout}
                  className="w-full py-2 bg-red-500 text-white rounded-xl text-xs font-semibold hover:bg-red-600 transition-colors"
                >
                  Yes, Sign Out
                </button>
                <button
                  onClick={() => setShowLogout(false)}
                  className="w-full py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        ) : null}
        {!showLogout && (
          <>
            {/* Logo */}
            <div className={cn(
              'relative h-16 flex items-center shrink-0 px-4 border-b border-slate-100',
              collapsed ? 'justify-center' : 'justify-between'
            )}>
              <AnimatePresence mode="wait">
                {!collapsed ? (
                  <motion.div
                    key="full"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-2.5 min-w-0"
                  >
                    <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-sm">
                      <Shield size={15} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-display font-bold text-slate-800 text-sm leading-none truncate">ASPK4Hapur</p>
                      <p className="text-[10px] text-primary font-semibold mt-0.5 leading-none flex items-center gap-1">
                        <Sparkles size={8} /> Admin Panel
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="icon"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm"
                  >
                    <Shield size={15} className="text-white" />
                  </motion.div>
                )}
              </AnimatePresence>

              {onToggle && !collapsed && (
                <button
                  onClick={onToggle}
                  className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft size={16} />
                </button>
              )}
              {onToggle && collapsed && (
                <button
                  onClick={onToggle}
                  className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-primary text-white shadow-md flex items-center justify-center z-20"
                  aria-label="Expand sidebar"
                >
                  <ChevronRight size={12} />
                </button>
              )}
            </div>

            {/* Nav */}
            <div className={cn(
              'relative flex-1 overflow-y-auto py-3 space-y-0.5',
              collapsed ? 'px-2' : 'px-3',
              '[&::-webkit-scrollbar]:w-1',
              '[&::-webkit-scrollbar-thumb]:bg-slate-200',
              '[&::-webkit-scrollbar-thumb]:rounded-lg'
            )}>
              {navItems.map((item, idx) => {
                if (item.section) {
                  if (collapsed) return <div key={idx} className="h-2" />;
                  return (
                    <div key={idx} className="px-2 pt-4 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em]">
                      {item.section}
                    </div>
                  );
                }

                const Icon = item.icon!;
                return (
                  <NavLink
                    key={idx}
                    to={item.path!}
                    end={item.exact}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) => cn(
                      'group relative flex items-center gap-3 rounded-xl transition-all duration-150 overflow-hidden',
                      collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5',
                      isActive
                        ? cn(item.activeBg, 'text-slate-800')
                        : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-700'
                    )}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active-bar"
                            className={cn('absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full', item.activeBorder)}
                            transition={{ type: 'spring', bounce: 0.25, duration: 0.3 }}
                          />
                        )}
                        <Icon
                          size={18}
                          className={cn(
                            'shrink-0 transition-colors duration-150',
                            isActive ? item.accent : 'text-slate-400 group-hover:text-slate-500'
                          )}
                        />
                        {!collapsed && (
                          <span className={cn(
                            'text-sm font-semibold truncate transition-colors duration-150',
                            isActive ? 'text-slate-800' : 'text-slate-500 group-hover:text-slate-700'
                          )}>
                            {item.label}
                          </span>
                        )}
                        {isActive && collapsed && (
                          <motion.div
                            className={cn('absolute bottom-1.5 left-1/2 -translate-x-1/2 -full', item.activeBorder)}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>

            {/* User footer */}
            <div className="border-t border-slate-100 p-3 shrink-0">
              <div className={cn('flex items-center gap-2.5', collapsed && 'flex-col gap-2')}>
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-xl  flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-primary/10">
                    {profile?.photoURL
                      ? <img src={profile.photoURL} alt="avatar" className="w-full h-full rounded-xl object-cover" />
                      : initials
                    }
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-lg bg-emerald-400 border-2 border-white" />
                </div>
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate leading-tight">
                      {user?.displayName || 'Admin'}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                  </div>
                )}
                <button
                  onClick={() => setShowLogout(true)}
                  title="Sign Out"
                  className={cn(
                    'shrink-0 p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150',
                    collapsed && 'w-full flex justify-center'
                  )}
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default AdminSidebar;
