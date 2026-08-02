import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Users, Compass, Smartphone, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ProductExplanation() {
  const { t } = useLanguage();

  const steps = [
    {
      step: 'Шаг 1',
      title: t('explain.step1.title'),
      icon: Users,
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
      iconBg: 'bg-emerald-500 text-white',
      description: t('explain.step1.desc'),
    },
    {
      step: 'Шаг 2',
      title: t('explain.step2.title'),
      icon: Compass,
      badgeColor: 'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-900',
      iconBg: 'bg-blue-600 text-white',
      description: t('explain.step2.desc'),
    },
    {
      step: 'Шаг 3',
      title: t('explain.step3.title'),
      icon: Smartphone,
      badgeColor: 'bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-900',
      iconBg: 'bg-purple-600 text-white',
      description: t('explain.step3.desc'),
    },
  ];

  return (
    <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors duration-205">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('explain.title')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight animate-fade-in">
            {t('explain.heading')}
          </h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
          Модель гиперлокальной кооперации: объединяйте клиентов соседних бизнесов без платного таргетинга.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 relative">
        {steps.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
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
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                    {item.description}
                  </p>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300 dark:text-slate-600">
                  <ArrowRight className="w-5 h-5 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 p-0.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
