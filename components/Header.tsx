'use client';

import React from 'react';
import Link from 'next/link';
import ResetDemoButton from './ResetDemoButton';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage, Language } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { MapPin, Store, Smartphone, UserCheck, Sun, Moon } from 'lucide-react';

export default function Header() {
  const { state } = useApp();
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 w-full overflow-x-hidden transition-colors duration-205">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-6 flex-shrink-0">
          <Link href="/" className="flex items-center space-x-2 min-h-[48px]">
            <span className="bg-emerald-600 dark:bg-emerald-500 text-white font-extrabold text-base sm:text-lg px-2.5 py-1 rounded-lg tracking-wider shadow-sm">
              {t('app.title')}
            </span>
            <span className="hidden sm:inline-block text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              MVP
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{state.business.district} {t('app.districtAlmaty')}</span>
          </div>
        </div>

        <nav className="flex items-center space-x-1 sm:space-x-3">
          <Link
            href="/b2b/dashboard"
            className="flex items-center space-x-1 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-2 sm:px-2.5 py-2.5 min-h-[48px] rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Store className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span className="hidden xs:inline">{t('header.b2b')}</span>
            <span className="xs:hidden">B2B</span>
          </Link>

          <Link
            href="/b2c/passport"
            className="flex items-center space-x-1 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-2 sm:px-2.5 py-2.5 min-h-[48px] rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>{t('header.passport')}</span>
          </Link>

          <Link
            href="/b2c/cabinet"
            className="flex items-center space-x-1 text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 px-2.5 py-2 min-h-[48px] rounded-xl transition-all shadow-sm"
          >
            <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>{user ? user.name.split(' ')[0] : t('header.cabinet')}</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden lg:block" />

          {/* i18n switcher */}
          <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-750">
            {(['ru', 'kk', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 text-[10px] sm:text-xs font-extrabold rounded min-h-[48px] min-w-[40px] transition-all ${
                  language === lang
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 min-h-[48px] min-w-[48px] h-12 w-12 flex items-center justify-center transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          <ResetDemoButton />
        </nav>
      </div>
    </header>
  );
}
