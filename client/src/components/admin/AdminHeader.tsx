import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminHeaderProps {
  onMenuClick: () => void;
  title?: string;
}

const searchItems = [
  { title: 'Dashboard', path: '/admin', type: 'Page' },
  { title: 'News Management', path: '/admin/news', type: 'Page' },
  { title: 'Events Management', path: '/admin/events', type: 'Page' },
  { title: 'Gallery Management', path: '/admin/gallery', type: 'Page' },
  { title: 'Members Directory', path: '/admin/members', type: 'Page' },
  { title: 'Complaints Hub', path: '/admin/complaints', type: 'Page' },
  { title: 'Donations & Finance', path: '/admin/donations', type: 'Page' },
  { title: 'Website Settings', path: '/admin/settings', type: 'Page' },
];

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick, title = 'Dashboard' }) => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasNotif] = useState(true);

  const filteredSearch = searchItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(path);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const initials =
    user?.displayName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() ||
    user?.email?.[0].toUpperCase() ||
    'A';

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-4 sm:px-6
      bg-white/80 backdrop-blur-xl border-b border-slate-100/80 sticky top-0 z-30
      shadow-[0_1px_0_0_rgba(0,0,0,0.04)]"
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-slate-800 text-lg leading-tight">
              {title}
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 leading-none hidden sm:block">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Search — desktop */}
        <div className="hidden md:flex relative">
          <AnimatePresence mode="wait">
            {searchOpen ? (
              <motion.div
                key="search-open"
                initial={{ width: 40, opacity: 0 }}
                animate={{ width: 260, opacity: 1 }}
                exit={{ width: 40, opacity: 0 }}
                className="flex items-center relative"
              >
                <div className="relative w-full">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search pages..."
                    className="w-full pl-9 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={14} />
                  </button>
                  
                  {/* Search Dropdown */}
                  {searchQuery && (
                    <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-premium border border-slate-100 overflow-hidden z-50">
                      {filteredSearch.length > 0 ? (
                        <div className="py-2">
                          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Navigation</div>
                          {filteredSearch.map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSelect(item.path)}
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors flex items-center justify-between"
                            >
                              <span>{item.title}</span>
                              <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{item.type}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-slate-500">
                          No results found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="search-closed"
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Notification bell */}
        <button className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors">
          <Bell size={18} />
          {hasNotif && (
            <motion.span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
        </button>

        {/* Divider */}
        <div className="h-7 w-px bg-slate-100 mx-1 hidden sm:block" />

        {/* User avatar */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-slate-700 leading-tight">
              {user?.displayName?.split(' ')[0] || 'Admin'}
            </p>
            <p className="text-[10px] text-slate-400 leading-none">Administrator</p>
          </div>
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-primary/20">
              {profile?.photoURL
                ? <img src={profile.photoURL} alt="avatar" className="w-full h-full rounded-xl object-cover" />
                : initials
              }
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
