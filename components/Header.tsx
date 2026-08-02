'use client';

import React from 'react';
import Link from 'next/link';
import ResetDemoButton from './ResetDemoButton';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { MapPin, Store, Smartphone, UserCheck } from 'lucide-react';

export default function Header() {
  const { state } = useApp();
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-6 flex-shrink-0">
          <Link href="/" className="flex items-center space-x-2 min-h-[48px]">
            <span className="bg-emerald-600 text-white font-extrabold text-base sm:text-lg px-2.5 py-1 rounded-lg tracking-wider shadow-sm">
              ЖЕРЛЕС
            </span>
            <span className="hidden sm:inline-block text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              MVP
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{state.business.district} район, Алматы</span>
          </div>
        </div>

        <nav className="flex items-center space-x-1 sm:space-x-3">
          <Link
            href="/b2b/dashboard"
            className="flex items-center space-x-1 text-xs sm:text-sm font-medium text-slate-700 hover:text-emerald-600 px-2 sm:px-2.5 py-2.5 min-h-[48px] rounded-md hover:bg-slate-50 transition-colors"
          >
            <Store className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="hidden xs:inline">B2B Бизнес</span>
            <span className="xs:hidden">B2B</span>
          </Link>

          <Link
            href="/b2c/passport"
            className="flex items-center space-x-1 text-xs sm:text-sm font-medium text-slate-700 hover:text-emerald-600 px-2 sm:px-2.5 py-2.5 min-h-[48px] rounded-md hover:bg-slate-50 transition-colors"
          >
            <Smartphone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Паспорт</span>
          </Link>

          <Link
            href="/b2c/cabinet"
            className="flex items-center space-x-1 text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-2 min-h-[48px] rounded-xl transition-all shadow-sm"
          >
            <UserCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{user ? user.name.split(' ')[0] : 'Кабинет'}</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <ResetDemoButton />
        </nav>
      </div>
    </header>
  );
}
