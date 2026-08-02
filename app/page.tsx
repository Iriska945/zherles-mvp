'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Store,
  Smartphone,
  Users,
  Zap,
  Award,
  Tag,
  ArrowRight,
  MapPin,
  Sparkles,
  Building2,
} from 'lucide-react';
import ProductExplanation from '@/components/ProductExplanation';
import InteractiveMap from '@/components/InteractiveMap';
import BusinessPassportModal from '@/components/BusinessPassportModal';
import { BusinessPassportModalData } from '@/types';

export default function HomePage() {
  const { state } = useApp();
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessPassportModalData | null>(null);

  const totalBusinessesCount = 1 + (state.partners ? state.partners.length : 0);
  const activePartnersCount = state.partners
    ? state.partners.filter((p) => p.status === 'ACTIVE').length
    : 0;

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Section with Live Count Badge */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative max-w-3xl space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-emerald-300 border border-white/10">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Платформа Көрші-маршрутов</span>
            </div>

            {/* Dynamic Live Counter Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-300 border border-emerald-500/30">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span>LIVE: <strong className="text-white">{totalBusinessesCount} заведений</strong> в коалиции</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Взаимный обмен клиентами
          </h1>

          <p className="text-slate-300 text-base sm:text-xl leading-relaxed max-w-2xl">
            Создавайте совместные акции с соседями в <strong className="text-emerald-400">{state.business.district} районе</strong> и привлекайте новых гостей без затрат на таргетинг.
          </p>

          {/* Actionable Hero Buttons */}
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/b2b/dashboard"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-8 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all text-sm sm:text-base shadow-lg shadow-emerald-500/30"
            >
              <Store className="w-5 h-5" />
              <span>Запустить Көрші-маршрут</span>
            </Link>

            <Link
              href="/b2c/passport"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-8 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all text-sm sm:text-base border border-white/20 backdrop-blur-md"
            >
              <Smartphone className="w-5 h-5 text-blue-400" />
              <span>Паспорт района для жителей</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Key Metrics Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Ваш бизнес</span>
            <Store className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg font-extrabold text-slate-900 truncate">{state.business.name}</p>
          <p className="text-xs text-slate-500">{state.business.district} район</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Партнеров в районе</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{totalBusinessesCount}</p>
          <p className="text-xs text-slate-500">
            {activePartnersCount} активных Көрші-связей
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Запущенных акций</span>
            <Tag className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{state.campaigns.length}</p>
          <p className="text-xs text-slate-500">Көрші-маршрутов</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Привлечено клиентов</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{state.clients.length}</p>
          <p className="text-xs text-slate-500">в CRM базе</p>
        </div>
      </section>

      {/* Product Explanation Block (Requirement 3) */}
      <ProductExplanation />

      {/* Interactive Map Component (Requirement 4) */}
      <InteractiveMap
        primaryBusiness={state.business}
        partners={state.partners || []}
        onSelectBusiness={(biz) => setSelectedBusiness(biz)}
      />

      {/* Distinct Prominent B2B & B2C Banners (Requirement 6) */}
      <section className="grid md:grid-cols-2 gap-6">
        {/* Prominent B2B Entry Banner */}
        <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-8 rounded-3xl shadow-lg border border-emerald-800/50 flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
              <Store className="w-3.5 h-3.5" />
              <span>Для предпринимателей</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Объединяйтесь с соседями по району
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Запустите бесплатный обмен кросс-промоциями. Выберите соседа и обменивайтесь постоянными клиентами без бюджета на маркетинг.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 relative z-10">
            <Link
              href="/b2b/dashboard"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl transition-all text-xs sm:text-sm shadow-md"
            >
              <Store className="w-4 h-4" />
              <span>Перейти в Дашборд</span>
            </Link>

            <Link
              href="/b2b/onboarding"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all text-xs sm:text-sm border border-white/20"
            >
              <span>Подключить бизнес</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Prominent B2C Entry Banner */}
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white p-8 rounded-3xl shadow-lg border border-blue-800/50 flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/30">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Для жителей микрорайона</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Цифровой Паспорт Вашего района
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Откройте для себя скидки, спецпредложения и подарки от проверенных кофеен, салонов и спортивных клубов вашего микрорайона в одном удобном QR-паспорте.
            </p>
          </div>

          <div className="relative z-10">
            <Link
              href="/b2c/passport"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] w-full px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all text-xs sm:text-sm shadow-md"
            >
              <Smartphone className="w-4 h-4" />
              <span>Открыть Паспорт района</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Business Passport Modal (Requirement 5) */}
      <BusinessPassportModal
        data={selectedBusiness}
        onClose={() => setSelectedBusiness(null)}
      />
    </div>
  );
}
