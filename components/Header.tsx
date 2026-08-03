'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ResetDemoButton from './ResetDemoButton';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage, Language } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { MapPin, Store, Smartphone, UserCheck, Sun, Moon, Menu, X } from 'lucide-react';

export default function Header() {
  const { state } = useApp();
  const { user } = useAuth();
  const { language, setLanguage, t, tc } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/b2b/dashboard', icon: Store, label: t('header.b2b'), shortLabel: 'B2B' },
    { href: '/b2c/passport', icon: Smartphone, label: t('header.passport') },
    { href: '/b2c/cabinet', icon: UserCheck, label: user ? user.name.split(' ')[0] : t('header.cabinet'), highlight: true },
  ];

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 w-full transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Left: Logo + District */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <Link href="/" className="flex items-center space-x-2 min-h-[48px]" onClick={() => setMobileMenuOpen(false)}>
            <span className="bg-emerald-600 dark:bg-emerald-500 text-white font-extrabold text-sm sm:text-lg px-2 sm:px-2.5 py-1 rounded-lg tracking-wider shadow-sm">
              {t('app.title')}
            </span>
            <span className="hidden sm:inline-block text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              MVP
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{tc(state.business.district)} {t('app.districtAlmaty')}</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-1.5 text-sm font-medium px-3 py-2.5 min-h-[48px] rounded-xl transition-colors ${
                  link.highlight
                    ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 font-bold shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* i18n switcher — desktop */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            {(['ru', 'kk', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2.5 py-1.5 text-xs font-extrabold rounded min-h-[36px] min-w-[36px] transition-all ${
                  language === lang
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Theme switcher — desktop */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <ResetDemoButton />
        </nav>

        {/* Mobile: Theme + Hamburger */}
        <div className="flex md:hidden items-center space-x-1.5">
          {/* Quick nav icons — mobile */}
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl transition-colors ${
                  link.highlight
                    ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon className="w-5 h-5" />
              </Link>
            );
          })}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-4 animate-in slide-in-from-top-2">
          {/* Mobile nav links */}
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 min-h-[48px] rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* i18n + theme row */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            {/* Language switcher — mobile */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              {(['ru', 'kk', 'en'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3.5 py-2 text-xs font-extrabold rounded-lg min-h-[44px] min-w-[44px] transition-all ${
                    language === lang
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              {/* Theme switcher — mobile */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              <ResetDemoButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
