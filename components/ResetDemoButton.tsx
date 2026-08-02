'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { RotateCcw, Check } from 'lucide-react';

export default function ResetDemoButton() {
  const { resetDemo } = useApp();
  const { t } = useLanguage();
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    resetDemo();
    try {
      await fetch('/api/demo/reset', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    setTimeout(() => {
      setResetting(false);
    }, 1000);
  };


  return (
    <button
      onClick={handleReset}
      disabled={resetting}
      data-testid="reset-demo-button"
      style={{ minHeight: '48px' }}
      className="inline-flex items-center justify-center gap-2 px-3 h-12 min-h-[48px] text-xs font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-lg transition-colors shadow-sm active:scale-95 disabled:opacity-50"
      title="Сбросить все данные демо-версии к исходным"
    >

      {resetting ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400 animate-pulse" />
          <span className="text-green-700 dark:text-green-400">{t('app.dataResetFeedback')}</span>
        </>
      ) : (
        <>
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t('app.resetDemo')}</span>
        </>
      )}
    </button>
  );
}
