'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { RotateCcw, Check } from 'lucide-react';

export default function ResetDemoButton() {
  const { resetDemo } = useApp();
  const [resetting, setResetting] = useState(false);

  const handleReset = () => {
    setResetting(true);
    resetDemo();
    setTimeout(() => {
      setResetting(false);
    }, 1000);
  };

  return (
    <button
      onClick={handleReset}
      disabled={resetting}
      data-testid="reset-demo-button"
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors shadow-sm active:scale-95 disabled:opacity-50"
      title="Сбросить все данные демо-версии к исходным"
    >
      {resetting ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-600 animate-pulse" />
          <span className="text-green-700">Данные сброшены!</span>
        </>
      ) : (
        <>
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Сбросить демо</span>
        </>
      )}
    </button>
  );
}
