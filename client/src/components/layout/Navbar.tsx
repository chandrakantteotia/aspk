import React, { useState, useEffect, useRef } from 'react';
import logoImg from '@/images/logo.png';
import footerLogo from '@/images/footerlogo.png';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronDown, UserCircle, LogOut,
  Home, Info, FileText, Users, Image, Newspaper, Calendar, HelpCircle,
  MessageSquare, Heart, Phone, UserPlus, LayoutDashboard, Search,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/firebase/auth';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

const navLinks = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'About', path: '/about', icon: Info },
  { label: 'Manifesto', path: '/manifesto', icon: FileText },
  { label: 'Members', path: '/party-members', icon: Users },
  { label: 'Gallery', path: '/gallery', icon: Image },
  {
    label: 'News & Events',
    icon: Newspaper,
    children: [
      { label: 'Latest News', path: '/news', icon: Newspaper, description: 'Party updates and press releases' },
      { label: 'Upcoming Events', path: '/events', icon: Calendar, description: 'Rallies, meetups and campaigns' },
    ],
  },
  {
    label: 'Citizens',
    icon: UserPlus,
    children: [
      { label: 'File a Complaint', path: '/complaints', icon: MessageSquare, description: 'Submit your grievance online' },
      { label: 'Join the Party', path: '/join', icon: UserPlus, description: 'Become an ASPK4Hapur member' },
      { label: 'Donate', path: '/donate', icon: Heart, description: 'Support the movement financially' },
      { label: 'Contact Us', path: '/contact', icon: Phone, description: 'Get in touch with our team' },
      { label: 'FAQ', path: '/faq', icon: HelpCircle, description: 'Frequently asked questions' },
    ],
  },
];

export default function Navbar() {
  const { user, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isSolidHeader = scrolled || !isHome;

  // Track scroll position for transparent to solid header background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        isSolidHeader
          ? "bg-[#0004A3] shadow-lg border-b border-blue-900/40"
          : "bg-gradient-to-b from-black/75 via-black/40 to-transparent"
      )}
    >
      {/* ── Top Utility Header ── */}
      <div
        className={cn(
          "text-white text-xs py-1.5 transition-colors duration-300",
          isSolidHeader ? "bg-[#0004A3]" : "bg-transparent"
        )}
      >
        <div className="container-padded flex items-center justify-end gap-3 sm:gap-5 text-[12px] sm:text-[12.5px] font-medium">
          <Link
            to="/contact"
            className="hidden sm:flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-white" />
            <span>Contact Us</span>
          </Link>

          <Link
            to="/manifesto"
            className="hidden sm:flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-white" />
            <span>Party Manifesto</span>
          </Link>

          <Link
            to="/donate"
            className="flex items-center gap-1 bg-white hover:bg-white/90 text-[#0004A3] font-bold px-3 py-1 rounded-full text-[11.5px] transition-all shadow-sm"
          >
            <Heart className="w-3.5 h-3.5 fill-[#0004A3] text-[#0004A3]" />
            <span>Donate Now</span>
          </Link>

          {/* Language Switcher in top header section after Donate button */}
          <div className="pl-1 border-l border-white/20">
            <LanguageSwitcher compact variant="dark" />
          </div>
        </div>
      </div>

      {/* ── Main Navigation Header ── */}
      <nav
        className={cn(
          "text-white py-2.5 transition-colors duration-300",
          isSolidHeader ? "bg-[#0004A3]" : "bg-transparent"
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container-padded">
          <div className="flex items-center justify-between" ref={dropdownRef}>

            {/* ── Logo ── */}
            <Link to="/" className="relative flex items-center shrink-0 group py-1" aria-label="ASPK4Hapur Home">
              {/* Desktop Logo (Original logo.png) */}
              <img
                src={logoImg}
                alt="ASPK4Hapur Desktop Logo"
                style={{ height: '78px', width: 'auto', maxHeight: '85px' }}
                className="hidden sm:block object-contain shrink-0 -mt-8 sm:-mt-9 filter drop-shadow-lg transition-transform duration-200 group-hover:scale-105"
              />
              {/* Phone / Mobile View Logo (footerlogo.png + ASPK4HAPUR Text) */}
              <div className="flex items-center gap-2 sm:hidden">
                <img
                  src={footerLogo}
                  alt="ASPK4Hapur Mobile Logo"
                  className="h-8 w-auto max-h-9 object-contain shrink-0 filter drop-shadow-md"
                />
                <span className="font-display font-black text-lg tracking-tight text-white drop-shadow-sm">
                  ASPK4HAPUR
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => {
                if (link.children) {
                  const isOpen = activeDropdown === link.label;
                  return (
                    <div
                      key={link.label}
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(link.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button
                        onClick={() => setActiveDropdown(isOpen ? null : link.label)}
                        className={cn(
                          'flex items-center gap-1 px-3.5 py-2 rounded-lg text-[14px] font-medium transition-colors duration-200',
                          isOpen ? 'text-white bg-white/20 font-semibold' : 'text-white/90 hover:text-white hover:bg-white/10'
                        )}
                      >
                        {link.label}
                        <ChevronDown className={cn(
                          'w-3.5 h-3.5 transition-transform duration-200 text-white/80',
                          isOpen && 'rotate-180'
                        )} />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.98 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className={cn(
                              "absolute top-full mt-2.5 bg-white/95 backdrop-blur-xl text-slate-900 rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.15)] border border-slate-200/80 z-50 overflow-hidden",
                              link.label === 'Citizens' ? "right-0 w-[300px] sm:w-[330px]" : "left-0 w-60"
                            )}
                          >
                            {/* Top Accent Strip */}
                            <div className="h-0.5 w-full bg-[#0004A3]" />

                            <div className="p-1.5 flex flex-col gap-0.5">
                              {link.children.map((child) => (
                                <Link
                                  key={child.path}
                                  to={child.path}
                                  className="group flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50/70 transition-all duration-150"
                                >
                                  <div className="w-7 h-7 rounded-md bg-[#0004A3]/10 flex items-center justify-center shrink-0 group-hover:bg-[#0004A3] transition-colors">
                                    <child.icon className="w-3.5 h-3.5 text-[#0004A3] group-hover:text-white transition-colors" />
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-[13px] font-semibold text-slate-800 leading-tight group-hover:text-[#0004A3] transition-colors">{child.label}</span>
                                    <span className="text-[10.5px] text-slate-400 truncate leading-tight mt-0.5">{child.description}</span>
                                  </div>
                                </Link>
                              ))}
                            </div>

                            <div className="border-t border-slate-100 bg-slate-50/70 px-3.5 py-2 flex items-center justify-between">
                              <Link
                                to={link.label === 'Citizens' ? '/join' : '/news'}
                                className="text-[11.5px] font-bold text-[#0004A3] hover:underline flex items-center gap-1"
                              >
                                View all <span aria-hidden="true">&rarr;</span>
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
                      'relative flex items-center px-3.5 py-2 rounded-lg text-[14px] font-medium transition-colors duration-200 text-white/90 hover:text-white hover:bg-white/10',
                      isActive && 'text-white bg-white/20 font-semibold'
                    )}
                  >
                    {({ isActive }) => (
                      <>
                        {link.label}
                        {isActive && (
                          <motion.span
                            layoutId="nav-dot"
                            className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-yellow-300"
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



              {/* User area */}
              {user ? (
                <div
                  className="relative"
                  onMouseEnter={() => setUserMenuOpen(true)}
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full hover:bg-white/10 transition-all duration-200 text-white"
                    aria-label="User menu"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        className="w-7 h-7 rounded-full object-cover"
                        alt={user.displayName ?? ''}
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-white text-primary flex items-center justify-center text-[11px] font-bold">
                        {(user.displayName?.[0] ?? user.email?.[0] ?? 'U').toUpperCase()}
                      </div>
                    )}
                    <ChevronDown className={cn(
                      'w-3 h-3 text-white/80 transition-transform duration-200',
                      userMenuOpen && 'rotate-180'
                    )} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 top-full mt-2.5 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.15)] border border-slate-200/80 z-50 overflow-hidden"
                      >
                        {/* Top Accent Strip */}
                        <div className="h-0.5 w-full bg-[#0004A3]" />

                        {/* User info */}
                        <div className="px-3.5 pt-3 pb-2.5 border-b border-slate-100 flex items-center gap-2.5">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              className="w-8 h-8 rounded-full object-cover shadow-sm shrink-0"
                              alt={user.displayName ?? ''}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#0004A3] flex items-center justify-center text-white text-[12px] font-bold shrink-0">
                              {(user.displayName?.[0] ?? user.email?.[0] ?? 'U').toUpperCase()}
                            </div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <p className="text-[13px] font-bold text-slate-900 truncate leading-tight">{user.displayName ?? 'User'}</p>
                            <p className="text-[10.5px] text-slate-400 truncate leading-tight">{user.email}</p>
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
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13.5px] font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <UserCircle className="w-4 h-4 text-white" />
                  Sign in
                </Link>
              )}

              {/* Join CTA */}
              <Link
                to="/join"
                className="hidden sm:flex items-center px-4 py-2 rounded-full text-[13.5px] font-bold bg-white text-[#0004A3] hover:bg-white/90 shadow-md transition-all ml-1"
              >
                Join Us
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg ml-1 text-white hover:bg-white/10 transition-colors"
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
              <div className="flex items-center justify-between px-5 py-4 bg-[#0004A3] text-white border-b border-blue-900/30 shrink-0">
                <Link to="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
                  <img
                    src={footerLogo}
                    alt="ASPK4Hapur Logo"
                    className="h-9 w-auto max-h-10 object-contain shrink-0 drop-shadow"
                  />
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
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


    </header>
  );
}
