import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Globe, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

const LANGUAGES = [
  {
    code: 'en',
    short: 'EN',
    native: 'English',
    label: 'English',
    description: 'Switch to English language',
    icon: Globe,
  },
  {
    code: 'hi',
    short: 'HI',
    native: 'हिन्दी',
    label: 'Hindi',
    description: 'हिन्दी भाषा में बदलें',
    icon: Type,
  },
];

function getCookie(name: string): string {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
  return '';
}

function getCurrentLanguage(): string {
  const cookie = getCookie('googtrans');
  if (cookie && cookie.includes('/hi')) return 'hi';
  return 'en';
}

function triggerGoogleTranslate(langCode: string) {
  const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
  if (select) {
    select.value = langCode;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    return;
  }
  if (langCode === 'en') {
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
  } else {
    document.cookie = `googtrans=/en/${langCode}; path=/`;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=` + window.location.hostname;
  }
  window.location.reload();
}

interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean;
  upward?: boolean;
  inline?: boolean;
  variant?: 'light' | 'dark';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className, compact = false, upward = false, inline = false, variant = 'light' }) => {
  const [open, setOpen]       = useState(false);
  const [current, setCurrent] = useState('en');

  useEffect(() => {
    const t = setTimeout(() => setCurrent(getCurrentLanguage()), 800);
    return () => clearTimeout(t);
  }, []);

  const currentLang = LANGUAGES.find(l => l.code === current) ?? LANGUAGES[0];

  const switchTo = (code: string) => {
    setOpen(false);
    if (code === current) return;
    setCurrent(code);
    triggerGoogleTranslate(code);
  };

  return (
    <div
      className={cn(inline ? 'w-full' : 'relative', className)}
      onMouseEnter={() => !inline && setOpen(true)}
      onMouseLeave={() => !inline && setOpen(false)}
    >

      {/* ── Trigger ── */}
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          'flex items-center justify-between w-full gap-1 px-3.5 py-2 rounded-lg text-[14px] font-medium transition-colors duration-200',
          variant === 'dark'
            ? (open ? 'text-white bg-white/20 font-semibold' : 'text-white/90 hover:text-white hover:bg-white/10')
            : (open ? 'text-primary bg-primary/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50')
        )}
        aria-label="Switch language"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 opacity-70" />
          {inline ? currentLang.label : currentLang.short}
        </div>
        <ChevronDown className={cn(
          'w-4 h-4 transition-transform duration-200 opacity-60',
          open && (upward && !inline ? 'rotate-0' : 'rotate-180'),
          !open && (upward && !inline ? 'rotate-180' : 'rotate-0')
        )} />
      </button>

      {/* ── Dropdown ── */}
      <AnimatePresence>
        {open && (
          <>
            {!inline && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}

            <motion.div
              initial={inline ? { height: 0, opacity: 0 } : { opacity: 0, y: upward ? -6 : 6, scale: 0.98 }}
              animate={inline ? { height: 'auto', opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={inline ? { height: 0, opacity: 0 } : { opacity: 0, y: upward ? -6 : 6, scale: 0.98 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className={cn(
                inline ? "overflow-hidden mt-1 w-full" : "absolute right-0 w-48 sm:w-52 bg-white/95 -xl rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.15)] border border-slate-200/80 z-50 overflow-hidden",
                !inline && (upward ? "bottom-full mb-2" : "top-full mt-2")
              )}
            >
              <div className={cn(inline ? "border border-slate-100 rounded-xl bg-slate-50/50 flex flex-col" : "relative")}>
                {/* Blue header accent strip */}
                {!inline && (
                  <div className={cn(
                    "h-0.5 w-full bg-[var(--color-primary)] relative z-10",
                    upward ? "order-last" : ""
                  )} />
                )}

                <div className={cn("flex flex-col", !inline && upward && "flex-col-reverse")}>
                  {/* Language options */}
                  <div className="p-1 flex flex-col gap-0.5 bg-white/95">
                    {LANGUAGES.map(lang => {
                      const isActive = current === lang.code;
                      const Icon = lang.icon;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => switchTo(lang.code)}
                          className={cn(
                            "group flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all duration-150 w-full text-left",
                            isActive ? "bg-blue-50/90 text-[var(--color-primary)]" : "hover:bg-blue-50/60 text-slate-700"
                          )}
                        >
                          <div className={cn(
                            'w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors',
                            isActive ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white'
                          )}>
                            <Icon className="w-3 h-3" />
                          </div>

                          <div className="flex-1 flex flex-col min-w-0">
                            <span className="text-[12.5px] font-semibold leading-tight">
                              {lang.native}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate leading-tight">
                              {lang.label}
                            </span>
                          </div>

                          {isActive && (
                            <Check className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  {!inline && (
                    <div className="border-t border-slate-100 bg-slate-50/70 px-3 py-1.5">
                      <p className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-slate-400" />
                        Google Translate
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
