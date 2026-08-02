'use client';

import React from 'react';
import { Users, Compass, Smartphone, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ProductExplanation() {
  const steps = [
    {
      step: 'Шаг 1',
      title: 'Локальная коалиция',
      icon: Users,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      iconBg: 'bg-emerald-500 text-white',
      description:
        'Неконкурирующие заведения одного микрорайона (кофейня, барбершоп, фитнес, цветы) объединяются в партнерскую сеть без рекламных расходов.',
    },
    {
      step: 'Шаг 2',
      title: 'Запуск Көрші-маршрута',
      icon: Compass,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      iconBg: 'bg-blue-600 text-white',
      description:
        'Бизнесы обмениваются взаимными акциями. Клиент кофейни получает купон со скидкой в салон, а гость салона — подарок в кофейне.',
    },
    {
      step: 'Шаг 3',
      title: 'Паспорт района для жителей',
      icon: Smartphone,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      iconBg: 'bg-purple-600 text-white',
      description:
        'Жители микрорайона получают единый цифровой Паспорт с бонусами и привилегиями, обеспечивая регулярный и лояльный клиентопоток.',
    },
  ];

  return (
    <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Принцип работы ЖЕРЛЕС</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Как работают Көрші-маршруты?
          </h2>
        </div>
        <p className="text-sm text-slate-500 max-w-md">
          Модель гиперлокальной кооперации: объединяйте клиентов соседних бизнесов без платного таргетинга.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 relative">
        {steps.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3.5 rounded-2xl shadow-sm ${item.iconBg}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${item.badgeColor}`}
                  >
                    {item.step}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                    {item.description}
                  </p>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                  <ArrowRight className="w-5 h-5 bg-white rounded-full border border-slate-200 p-0.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
