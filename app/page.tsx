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
      <section className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white rounded-2xl p-6 sm:p-10 shadow-lg">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span>Локальный партнерский маркетинг</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Объединяйте заведения, привлекайте соседей — без лишних трат
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Платформа «ЖЕРЛЕС» помогает бизнесам {state.business.district} района объединяться в кросс-маркетинговые маршруты «Көрші». Обменивайтесь клиентами через QR-коды и WhatsApp без установки мобильных приложений.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/b2b/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-800 font-bold rounded-xl shadow hover:bg-emerald-50 transition-all"
            >
              <Store className="w-4 h-4" />
              <span>Кабинет бизнеса</span>
            </Link>
            <Link
              href="/b2c/passport"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white font-bold rounded-xl shadow hover:bg-emerald-400 border border-emerald-400 transition-all"
            >
              <Smartphone className="w-4 h-4" />
              <span>Паспорт района (B2C)</span>
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

      {/* Module Navigation Grid */}
      <section className="grid md:grid-cols-2 gap-6">
        {/* B2B Module Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all space-y-4">
          <div className="flex items-center justify-between">
            <span className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Store className="w-6 h-6" />
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
              B2B Кабинет
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Модуль для Бизнеса</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Онбординг заведения, каталог готовых механик, конструктор акций "Көрші-маршрут", партнерский скоринг и аналитический дашборд с CRM.
          </p>
          <div className="pt-2 grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
            <Link href="/b2b/onboarding" className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-between">
              <span>1. Онбординг</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link href="/b2b/catalog" className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-between">
              <span>2. Каталог акций</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link href="/b2b/campaigns/new" className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-between">
              <span>3. Конструктор</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link href="/b2b/dashboard" className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-between">
              <span>4. Дашборд & CRM</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* B2C Module Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all space-y-4">
          <div className="flex items-center justify-between">
            <span className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Smartphone className="w-6 h-6" />
            </span>
            <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
              B2C Клиент
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Модуль для Гостей</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Мобильный веб-интерфейс "Паспорт района", шеринг акций друзьям в мессенджерах и безопасная гашение бонусов по 4-значному PIN-коду.
          </p>
          <div className="pt-2 grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
            <Link href="/b2c/passport" className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-between">
              <span>Паспорт района</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link href="/b2c/redeem" className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-between">
              <span>Погашение бонуса</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
