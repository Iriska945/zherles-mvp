'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Store, Smartphone, Users, Zap, Award, Tag, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { state } = useApp();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl"></div>
        <div className="relative max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-emerald-300">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Платформа Көрші-маршрутов</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Взаимный обмен клиентами
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Создавайте совместные акции с соседями в {state.business.district} районе и привлекайте новых гостей без дополнительных затрат.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              href="/b2b/dashboard"
              className="inline-flex items-center justify-center gap-2 h-14 px-8 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all text-sm sm:text-base shadow-lg shadow-emerald-500/30"
            >
              <Store className="w-5 h-5" />
              <span>Перейти в Дашборд</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Ваш бизнес</span>
            <Store className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg font-bold text-slate-900 truncate">{state.business.name}</p>
          <p className="text-xs text-slate-500">{state.business.district} район</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Активных партнеров</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {state.partners.filter((p) => p.status === 'ACTIVE').length}
          </p>
          <p className="text-xs text-slate-500">из {state.partners.length} доступных</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Запущенных акций</span>
            <Tag className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{state.campaigns.length}</p>
          <p className="text-xs text-slate-500">Көрші-маршрутов</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Привлечено клиентов</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{state.clients.length}</p>
          <p className="text-xs text-slate-500">в CRM таблице</p>
        </div>
      </section>

      {/* Navigation Modules (Cleaner Layout) */}
      <section className="grid md:grid-cols-2 gap-6 pt-4">
        {/* B2B Module Box */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all space-y-6 flex flex-col">
          <div className="flex items-center space-x-4">
            <span className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Store className="w-7 h-7" />
            </span>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Бизнес</h2>
              <p className="text-sm text-slate-500 font-medium">Управление маркетингом</p>
            </div>
          </div>
          
          <div className="grid gap-3 flex-1">
            <Link href="/b2b/dashboard" className="p-4 bg-slate-50 hover:bg-emerald-50 rounded-2xl flex items-center justify-between group transition-colors">
              <span className="font-bold text-slate-700 group-hover:text-emerald-700">Дашборд & CRM</span>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
            </Link>
            <Link href="/b2b/catalog" className="p-4 bg-slate-50 hover:bg-emerald-50 rounded-2xl flex items-center justify-between group transition-colors">
              <span className="font-bold text-slate-700 group-hover:text-emerald-700">Каталог акций</span>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
            </Link>
            <Link href="/b2b/settings" className="p-4 bg-slate-50 hover:bg-emerald-50 rounded-2xl flex items-center justify-between group transition-colors">
              <span className="font-bold text-slate-700 group-hover:text-emerald-700">Личный кабинет (Настройки)</span>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
            </Link>
          </div>
        </div>

        {/* B2C Module Box */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all space-y-6 flex flex-col">
          <div className="flex items-center space-x-4">
            <span className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
              <Smartphone className="w-7 h-7" />
            </span>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Клиенты</h2>
              <p className="text-sm text-slate-500 font-medium">Пользовательский опыт</p>
            </div>
          </div>
          
          <div className="grid gap-3 flex-1">
            <Link href="/b2c/passport" className="p-4 bg-slate-50 hover:bg-blue-50 rounded-2xl flex items-center justify-between group transition-colors">
              <span className="font-bold text-slate-700 group-hover:text-blue-700">Паспорт района</span>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
            </Link>
            <Link href="/b2c/redeem" className="p-4 bg-slate-50 hover:bg-blue-50 rounded-2xl flex items-center justify-between group transition-colors">
              <span className="font-bold text-slate-700 group-hover:text-blue-700">Гашение бонусов</span>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
