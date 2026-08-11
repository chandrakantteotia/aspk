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
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className, compact = false, upward = false, inline = false }) => {
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
    <div className={cn(inline ? 'w-full' : 'relative', className)}>

      {/* ── Trigger ── */}
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          'flex items-center justify-between w-full gap-1 px-3.5 py-2 rounded-lg text-[14px] font-medium transition-colors duration-200',
          open
            ? 'text-primary bg-primary/5'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
              initial={inline ? { height: 0, opacity: 0 } : { opacity: 0, y: upward ? -10 : 10, scale: 0.97 }}
              animate={inline ? { height: 'auto', opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={inline ? { height: 0, opacity: 0 } : { opacity: 0, y: upward ? -10 : 10, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={cn(
                inline ? "overflow-hidden mt-1 w-full" : "absolute right-0 w-64 bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-slate-100/80 z-50",
                !inline && (upward ? "bottom-full mb-3" : "top-full mt-3")
              )}
            >
              <div className={cn(inline ? "border border-slate-100 rounded-xl bg-slate-50/50 flex flex-col" : "relative")}>
                {/* Caret — skip for inline */}
                {!inline && (
                  <div className={cn(
                    "absolute right-4 w-3 h-3 bg-primary rotate-45 rounded-sm",
                    upward ? "-bottom-1.5" : "-top-1.5"
                  )} />
                )}

                {/* Blue header strip — skip for inline */}
                {!inline && (
                  <div className={cn(
                    "h-1 w-full bg-primary relative z-10",
                    upward ? "rounded-b-xl order-last" : "rounded-t-xl"
                  )} />
                )}

                <div className={cn("flex flex-col", !inline && upward && "flex-col-reverse")}>
                  {/* Language options */}
                  <div className="p-2 flex flex-col gap-1 bg-white rounded-t-xl rounded-b-xl">
                    {LANGUAGES.map(lang => {
                      const isActive = current === lang.code;
                      const Icon = lang.icon;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => switchTo(lang.code)}
                          className="group flex items-start gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors w-full text-left"
                        >
                          <div className={cn(
                            'w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-colors',
                            isActive ? 'bg-primary/15' : 'bg-primary/8'
                          )}>
                            <Icon className="w-4 h-4 text-primary" />
                          </div>

                          <div className="flex-1 flex flex-col mt-0.5">
                            <span className="text-[13.5px] font-semibold text-slate-800 leading-none mb-1.5">
                              {lang.native}
                            </span>
                            <span className="text-[11.5px] text-slate-400 leading-tight">
                              {lang.description}
                            </span>
                          </div>

                          {isActive && (
                            <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  {!inline && (
                    <div className={cn(
                      "border-slate-100 bg-slate-50/50 px-5 py-3 rounded-b-xl rounded-t-xl",
                      upward ? "border-b" : "border-t"
                    )}>
                      <p className="text-[12px] font-medium text-slate-400 flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        Powered by Google Translate
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
