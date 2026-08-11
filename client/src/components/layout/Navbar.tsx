import React, { useState, useEffect, useRef } from 'react';
import logoImg from '@/images/logo.png';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronDown, UserCircle, LogOut,
  Home, Info, FileText, Users, Image, Newspaper, Calendar, HelpCircle,
  MessageSquare, Heart, Phone, UserPlus, LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/firebase/auth';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

const navLinks = [
  { label: 'Home',      path: '/',             icon: Home },
  { label: 'About',     path: '/about',         icon: Info },
  { label: 'Manifesto', path: '/manifesto',     icon: FileText },
  { label: 'Members',   path: '/party-members', icon: Users },
  { label: 'Gallery',   path: '/gallery',       icon: Image },
  {
    label: 'News & Events',
    icon: Newspaper,
    children: [
      { label: 'Latest News',      path: '/news',   icon: Newspaper, description: 'Party updates and press releases' },
      { label: 'Upcoming Events',  path: '/events', icon: Calendar, description: 'Rallies, meetups and campaigns' },
    ],
  },
  {
    label: 'Citizens',
    icon: UserPlus,
    children: [
      { label: 'File a Complaint', path: '/complaints', icon: MessageSquare, description: 'Submit your grievance online' },
      { label: 'Join the Party',   path: '/join',        icon: UserPlus, description: 'Become an ASPK4Hapur member' },
      { label: 'Donate',           path: '/donate',      icon: Heart, description: 'Support the movement financially' },
      { label: 'Contact Us',       path: '/contact',     icon: Phone, description: 'Get in touch with our team' },
      { label: 'FAQ',              path: '/faq',         icon: HelpCircle, description: 'Frequently asked questions' },
    ],
  },
];

export default function Navbar() {
  const { user, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen]     = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
    setUserMenuOpen(false);
  }, [location]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close search on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  return (
    <>
      <nav
        className="fixed top-0 inset-x-0 z-50 bg-white border-b border-slate-100 py-3"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container-padded">
          <div className="flex items-center justify-between" ref={dropdownRef}>

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="ASPK4Hapur Home">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-white text-xs font-black font-display tracking-tight">A4</span>
              </div>
              <div className="leading-none">
                <span className="font-display font-bold text-[17px] tracking-tight text-slate-900">ASPK</span>
                <span className="font-display text-[17px] tracking-tight text-primary">4Hapur</span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => {
                if (link.children) {
                  const isOpen = activeDropdown === link.label;
                  return (
                    <div key={link.label} className="relative">
                      <button
                        onClick={() => setActiveDropdown(isOpen ? null : link.label)}
                        className={cn(
                          'flex items-center gap-1 px-3.5 py-2 rounded-lg text-[14px] font-medium transition-colors duration-200',
                          isOpen ? 'text-primary bg-primary/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        )}
                      >
                        {link.label}
                        <ChevronDown className={cn(
                          'w-3.5 h-3.5 transition-transform duration-200 opacity-60',
                          isOpen && 'rotate-180'
                        )} />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                            className={cn(
                              "absolute top-full left-0 mt-3 bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-slate-100/80 z-50",
                              link.label === 'Citizens' ? "w-[420px]" : "w-72"
                            )}
                          >
                            {/* Caret */}
                            <div className="absolute -top-1.5 left-6 w-3 h-3 bg-primary rotate-45 rounded-sm" />
                            
                            {/* Header Strip */}
                            <div className="h-1 w-full bg-primary rounded-t-xl relative z-10" />

                            <div className={cn(
                              "p-2",
                              link.label === 'Citizens' ? "grid grid-cols-2 gap-1" : "flex flex-col gap-1"
                            )}>
                              {link.children.map((child, idx) => (
                                <Link
                                  key={child.path}
                                  to={child.path}
                                  className="group flex items-start gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                  <div className="w-8 h-8 rounded-md bg-primary/8 flex items-center justify-center shrink-0">
                                    <child.icon className="w-4 h-4 text-primary" />
                                  </div>
                                  <div className="flex flex-col mt-0.5">
                                    <span className="text-[13.5px] font-semibold text-slate-800 leading-none mb-1.5">{child.label}</span>
                                    <span className="text-[11.5px] text-slate-400 leading-tight">{child.description}</span>
                                  </div>
                                </Link>
                              ))}
                            </div>

                            <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3 rounded-b-xl">
                              <Link 
                                to={link.label === 'Citizens' ? '/join' : '/news'} 
                                className="text-[12px] font-medium text-primary hover:text-primary/80 flex items-center gap-1 w-fit"
                              >
                                Explore all <span aria-hidden="true">&rarr;</span>
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={link.path}
                    to={link.path!}
                    className={({ isActive }) => cn(
                      'relative flex items-center px-3.5 py-2 rounded-lg text-[14px] font-medium transition-colors duration-200',
                      isActive ? 'text-primary bg-primary/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    )}
                  >
                    {({ isActive }) => (
                      <>
                        {link.label}
                        {isActive && (
                          <motion.span
                            layoutId="nav-dot"
                            className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>

            {/* ── Right Actions ── */}
            <div className="flex items-center gap-1">

              {/* Language Switcher */}
              <div className="hidden sm:block px-1">
                <LanguageSwitcher compact />
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px h-5 mx-2 bg-slate-200" />

              {/* User area */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full hover:bg-slate-100 transition-all duration-200"
                    aria-label="User menu"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        className="w-7 h-7 rounded-full object-cover"
                        alt={user.displayName ?? ''}
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-[11px] font-bold">
                        {(user.displayName?.[0] ?? user.email?.[0] ?? 'U').toUpperCase()}
                      </div>
                    )}
                    <ChevronDown className={cn(
                      'w-3 h-3 text-slate-400 transition-transform duration-200',
                      userMenuOpen && 'rotate-180'
                    )} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-slate-100/80 z-50"
                      >
                        {/* Caret */}
                        <div className="absolute -top-1.5 right-4 w-3 h-3 bg-primary rotate-45 rounded-sm" />
                        
                        {/* Header Strip */}
                        <div className="h-1 w-full bg-primary rounded-t-xl relative z-10" />

                        {/* User info */}
                        <div className="px-4 pt-4 pb-3 border-b border-slate-100 flex items-center gap-3">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              className="w-10 h-10 rounded-full object-cover shadow-sm shrink-0"
                              alt={user.displayName ?? ''}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-[14px] font-bold shrink-0">
                              {(user.displayName?.[0] ?? user.email?.[0] ?? 'U').toUpperCase()}
                            </div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <p className="text-[13.5px] font-bold text-slate-900 truncate leading-none mb-1">{user.displayName ?? 'User'}</p>
                            <p className="text-[11.5px] text-slate-500 truncate leading-none">{user.email}</p>
                          </div>
                        </div>

                        <div className="p-2 flex flex-col gap-1">
                          {isAdmin && (
                            <Link
                              to="/admin"
                              className="group flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                              <div className="w-8 h-8 rounded-md bg-primary/8 flex items-center justify-center shrink-0">
                                <LayoutDashboard className="w-4 h-4 text-primary" />
                              </div>
                              <div className="flex flex-col mt-0.5">
                                <span className="text-[13.5px] font-semibold text-slate-800 leading-none mb-1.5">Admin Panel</span>
                                <span className="text-[11.5px] text-slate-400 leading-tight">Manage content</span>
                              </div>
                            </Link>
                          )}
                          
                          <button
                            onClick={handleSignOut}
                            className="group flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors text-left w-full"
                          >
                            <div className="w-8 h-8 rounded-md bg-red-500/10 flex items-center justify-center shrink-0">
                              <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-600 transition-colors" />
                            </div>
                            <div className="flex flex-col mt-0.5">
                              <span className="text-[13.5px] font-semibold text-red-600 leading-none mb-1.5">Sign Out</span>
                              <span className="text-[11.5px] text-red-400/80 leading-tight">Log out securely</span>
                            </div>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13.5px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <UserCircle className="w-4 h-4" />
                  Sign in
                </Link>
              )}

              {/* Join CTA */}
              <Link
                to="/join"
                className="hidden sm:flex items-center px-4 py-2 rounded-full text-[13.5px] font-semibold bg-primary text-white hover:bg-primary/90 shadow-[0_2px_12px_rgba(0,87,255,0.3)] transition-all ml-1"
              >
                Join Us
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg ml-1 text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen ? (
                    <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.12 }}>
                      <X className="w-5 h-5" />
                    </motion.span>
                  ) : (
                    <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.12 }}>
                      <Menu className="w-5 h-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full bg-white lg:hidden flex flex-col shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
                <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                  <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0">
                    <span className="text-white text-[11px] font-black font-display">A4</span>
                  </div>
                  <span className="font-display font-bold text-[16px] text-slate-900">ASPK4Hapur</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
                {navLinks.map(link => {
                  if (link.children) {
                    return (
                      <div key={link.label}>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pt-4 pb-2">
                          {link.label}
                        </p>
                        {link.children.map(child => (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            className={({ isActive }) => cn(
                              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors',
                              isActive
                                ? 'bg-primary/8 text-primary'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            )}
                          >
                            <child.icon className="w-4 h-4 shrink-0" />
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <NavLink
                      key={link.path}
                      to={link.path!}
                      className={({ isActive }) => cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors',
                        isActive
                          ? 'bg-primary/8 text-primary'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      )}
                    >
                      <link.icon className="w-4 h-4 shrink-0" />
                      {link.label}
                    </NavLink>
                  );
                })}
              </nav>

              {/* Drawer footer */}
              <div className="px-4 py-4 border-t border-slate-100 space-y-2.5 shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <LanguageSwitcher compact inline />
                </div>
                <Link
                  to="/join"
                  className="flex items-center justify-center w-full py-2.5 rounded-full text-[14px] font-semibold bg-primary text-white shadow-[0_2px_12px_rgba(0,87,255,0.3)]"
                >
                  Join the Party
                </Link>
                {!user ? (
                  <Link
                    to="/login"
                    className="flex items-center justify-center w-full py-2.5 rounded-full text-[14px] font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Sign in
                  </Link>
                ) : (
                  <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-[14px] font-medium border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


    </>
  );
}
