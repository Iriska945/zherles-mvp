'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Store, BookOpen, Settings, PlusCircle, Target } from 'lucide-react';

export default function B2BNav() {
  const pathname = usePathname();

  const links = [
    { href: '/b2b/dashboard', label: 'Дашборд & CRM', icon: LayoutDashboard },
    { href: '/b2b/campaigns', label: 'Мои акции', icon: Target },
    { href: '/b2b/onboarding', label: 'Профиль бизнеса', icon: Store },
    { href: '/b2b/catalog', label: 'Каталог акций', icon: BookOpen },
    { href: '/b2b/admin', label: 'Управление шаблонами', icon: Settings },
  ];

  return (
    <div className="bg-white border-b border-slate-200 mb-6 -mt-2 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between overflow-x-auto py-2.5 scrollbar-none">
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center space-x-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:block shrink-0 ml-4">
            <Link
              href="/b2b/campaigns/new"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Создать Көрші-акцию</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
