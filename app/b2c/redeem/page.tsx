'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { BonusCoupon } from '@/types';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  KeyRound,
  RotateCcw,
  Clock,
  Building2,
  Gift,
  Phone,
  UserCheck,
  Delete,
} from 'lucide-react';

function RedeemContent() {
  const { redeemBonus } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pinParam = searchParams.get('pin') || '';

  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [resultState, setResultState] = useState<'IDLE' | 'SUCCESS' | 'ALREADY_REDEEMED' | 'NOT_FOUND'>('IDLE');
  const [redeemedResult, setRedeemedResult] = useState<{
    coupon?: BonusCoupon;
    error?: string;
    redeemedAt?: string;
  } | null>(null);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Pre-fill pin code from search params if present
  useEffect(() => {
    if (pinParam && pinParam.length === 4) {
      const pinDigits = pinParam.split('');
      setDigits(pinDigits);
    }
  }, [pinParam]);

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length === 0) {
      const updated = [...digits];
      updated[index] = '';
      setDigits(updated);
      setResultState('IDLE');
      return;
    }

    // Handle single digit or pasted string
    if (cleaned.length === 1) {
      const updated = [...digits];
      updated[index] = cleaned;
      setDigits(updated);
      setResultState('IDLE');

      // Auto-focus next input
      if (index < 3) {
        inputRefs[index + 1].current?.focus();
      }
    } else if (cleaned.length === 4) {
      // User pasted full 4 digits
      setDigits(cleaned.split(''));
      setResultState('IDLE');
      inputRefs[3].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleKeypadPress = (digit: string) => {
    // Find first empty index
    const emptyIndex = digits.findIndex((d) => d === '');
    if (emptyIndex !== -1) {
      handleDigitChange(emptyIndex, digit);
    }
  };

  const handleKeypadBackspace = () => {
    // Find last filled index
    for (let i = 3; i >= 0; i--) {
      if (digits[i] !== '') {
        const updated = [...digits];
        updated[i] = '';
        setDigits(updated);
        setResultState('IDLE');
        inputRefs[i].current?.focus();
        break;
      }
    }
  };

  const handleKeypadClear = () => {
    setDigits(['', '', '', '']);
    setResultState('IDLE');
    setRedeemedResult(null);
    inputRefs[0].current?.focus();
  };

  const pinCode = digits.join('');
  const isComplete = pinCode.length === 4;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isComplete) return;

    try {
      const apiRes = await fetch('/api/b2c/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinCode }),
      });
      const data = await apiRes.json();
      if (data.success) {
        setRedeemedResult({
          coupon: data.coupon,
          redeemedAt: data.redeemedAt,
        });
        setResultState('SUCCESS');
        redeemBonus(pinCode);
      } else if (data.redeemedAt || (data.error && data.error.includes('уже'))) {
        setRedeemedResult({
          coupon: data.coupon,
          error: data.error,
          redeemedAt: data.redeemedAt,
        });
        setResultState('ALREADY_REDEEMED');
      } else {
        setRedeemedResult({ error: data.error });
        setResultState('NOT_FOUND');
      }
    } catch (err) {
      const res = redeemBonus(pinCode);
      setRedeemedResult(res);

      if (res.success) {
        setResultState('SUCCESS');
      } else if (res.redeemedAt || (res.error && res.error.includes('уже'))) {
        setResultState('ALREADY_REDEEMED');
      } else {
        setResultState('NOT_FOUND');
      }
    }
  };


  const handleResetForm = () => {
    setDigits(['', '', '', '']);
    setResultState('IDLE');
    setRedeemedResult(null);
    inputRefs[0].current?.focus();
  };

  // Helper to format ISO timestamp
  const formatTimestamp = (isoString?: string) => {
    if (!isoString) return 'Неизвестно';
    try {
      const date = new Date(isoString);
      return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="max-w-md mx-auto shadow-2xl min-h-screen bg-slate-50 border-x border-slate-200 flex flex-col font-sans">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 px-4 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <Link
          href="/b2c/passport"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Паспорт района</span>
        </Link>
        <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-1">
          <KeyRound className="w-4 h-4 text-emerald-600" />
          <span>Гашение бонуса</span>
        </div>
      </header>

      {/* Main Body */}
      <main className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Title Banner */}
          <div className="text-center pt-2">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight mb-1">
              Ввод 4-значного PIN-кода
            </h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Введите PIN-код для гашения купона или предъявите его на кассе партнера
            </p>
          </div>

          {/* SUCCESS STATE DISPLAY */}
          {resultState === 'SUCCESS' && redeemedResult?.coupon && (
            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-5 shadow-lg space-y-4 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center space-x-3 pb-3 border-b border-emerald-200">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-black text-emerald-950">
                    Бонус успешно погашен!
                  </h2>
                  <p className="text-xs text-emerald-700 font-semibold">
                    Статус: Подтверждено в системе
                  </p>
                </div>
              </div>

              {/* Global Points Notification */}
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-start space-x-3">
                <Gift className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-amber-900 mb-0.5">Визит засчитан!</div>
                  <div className="text-[11px] text-amber-700 leading-tight">Ваш визит добавлен в глобальную бонусную систему Zherles. Вы на шаг ближе к новому уровню и повышенной скидке!</div>
                </div>
              </div>

              {/* Coupon details */}
              <div className="space-y-2.5 text-xs text-slate-700 bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-emerald-100">
                <div className="flex items-start space-x-2">
                  <Gift className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[11px] text-slate-400 font-bold block uppercase">
                      Награда / Наименование:
                    </span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {redeemedResult.coupon.rewardText}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1 border-t border-slate-100">
                  <Building2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <span className="text-[11px] text-slate-400 font-bold block uppercase">
                      Партнер заведения:
                    </span>
                    <span className="font-bold text-slate-800">
                      {redeemedResult.coupon.partnerName}
                    </span>
                  </div>
                </div>

                {redeemedResult.coupon.customerPhone && (
                  <div className="flex items-center space-x-2 pt-1 border-t border-slate-100">
                    <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div>
                      <span className="text-[11px] text-slate-400 font-bold block uppercase">
                        Телефон клиента:
                      </span>
                      <span className="font-mono font-medium text-slate-800">
                        {redeemedResult.coupon.customerPhone}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2 pt-1 border-t border-slate-100">
                  <UserCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <span className="text-[11px] text-slate-400 font-bold block uppercase">
                      Погашено сотрудником:
                    </span>
                    <span className="font-semibold text-slate-800">
                      {redeemedResult.coupon.redeemedByStaff || 'Кассир (Автоматически)'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1 border-t border-slate-100">
                  <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <span className="text-[11px] text-slate-400 font-bold block uppercase">
                      Точное время гашения:
                    </span>
                    <span className="font-mono text-emerald-800 font-bold">
                      {formatTimestamp(redeemedResult.redeemedAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full h-12 min-h-[48px] px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow active:scale-98 flex items-center justify-center space-x-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Погасить еще один бонус</span>
                </button>
                <Link
                  href="/b2c/passport"
                  className="w-full h-12 min-h-[48px] px-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl transition-all flex items-center justify-center"
                >
                  Вернуться в Паспорт района
                </Link>
              </div>
            </div>
          )}

          {/* RE-REDEMPTION BLOCKED STATE DISPLAY */}
          {resultState === 'ALREADY_REDEEMED' && (
            <div className="bg-red-50 border-2 border-red-500 rounded-3xl p-5 shadow-lg space-y-4 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center space-x-3 pb-3 border-b border-red-200">
                <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-black text-red-950">
                    Ошибка: Бонус уже использован!
                  </h2>
                  <p className="text-xs text-red-700 font-semibold">
                    Повторное использование PIN-кода заблокировано
                  </p>
                </div>
              </div>

              <div className="bg-white/90 p-4 rounded-2xl border border-red-100 text-xs space-y-3">
                <p className="text-slate-700 leading-relaxed font-medium">
                  Этот PIN-код (<span className="font-mono font-bold text-red-700">{pinCode}</span>) был успешно погашен ранее и не может быть использован второй раз.
                </p>

                <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                  <span className="text-[11px] text-red-800 font-extrabold block uppercase mb-0.5">
                    Точное время первого гашения:
                  </span>
                  <div className="font-mono text-sm font-black text-red-900 flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-red-600" />
                    <span>{formatTimestamp(redeemedResult?.redeemedAt)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full h-12 min-h-[48px] px-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl transition-all shadow active:scale-98 flex items-center justify-center space-x-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Попробовать другой PIN-код</span>
                </button>
                <Link
                  href="/b2c/passport"
                  className="w-full h-12 min-h-[48px] px-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl transition-all flex items-center justify-center"
                >
                  Вернуться в Паспорт района
                </Link>
              </div>
            </div>
          )}

          {/* NOT FOUND / INVALID PIN STATE */}
          {resultState === 'NOT_FOUND' && (
            <div className="bg-amber-50 border-2 border-amber-400 rounded-3xl p-5 shadow-lg space-y-4 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center space-x-3 pb-3 border-b border-amber-200">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-black text-amber-950">
                    Код бонуса не найден
                  </h2>
                  <p className="text-xs text-amber-800 font-semibold">
                    Проверьте 4-значный PIN-код
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-700 bg-white/90 p-3.5 rounded-2xl border border-amber-100 font-medium">
                {redeemedResult?.error || 'PIN-код не существует или введен с ошибкой. Попробуйте еще раз.'}
              </p>

              <button
                type="button"
                onClick={handleResetForm}
                className="w-full h-12 min-h-[48px] px-4 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl transition-all shadow active:scale-98 flex items-center justify-center space-x-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Попробовать снова</span>
              </button>
            </div>
          )}

          {/* DIGIT INPUT FORM (Visible during IDLE state) */}
          {resultState === 'IDLE' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 4 Digit Boxes */}
              <div className="flex items-center justify-center space-x-3 my-4">
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={inputRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className={`w-14 h-16 text-center text-2xl font-mono font-black rounded-2xl border-2 transition-all shadow-sm outline-none ${
                      digit
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-4 ring-emerald-100'
                        : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100'
                    }`}
                  />
                ))}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isComplete}
                className={`w-full h-12 min-h-[48px] px-4 rounded-2xl font-black text-sm transition-all shadow-lg flex items-center justify-center space-x-2 ${
                  isComplete
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-98'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Погасить бонус</span>
              </button>

              {/* Numeric Keypad for touch screens */}
              <div className="pt-4 border-t border-slate-200">
                <div className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-wider mb-3">
                  Цифровая клавиатура
                </div>
                <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleKeypadPress(num)}
                      className="h-12 min-h-[48px] bg-white hover:bg-emerald-50 text-slate-900 font-mono font-extrabold text-xl rounded-xl border border-slate-200 shadow-sm active:bg-emerald-100 transition-all"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleKeypadClear}
                    className="h-12 min-h-[48px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl border border-slate-200 flex items-center justify-center transition-all"
                  >
                    Сброс
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('0')}
                    className="h-12 min-h-[48px] bg-white hover:bg-emerald-50 text-slate-900 font-mono font-extrabold text-xl rounded-xl border border-slate-200 shadow-sm active:bg-emerald-100 transition-all"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={handleKeypadBackspace}
                    className="h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 flex items-center justify-center transition-all"
                    title="Стереть"
                  >
                    <Delete className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-[11px] text-slate-400 font-medium">
          ЖЕРЛЕС MVP &bull; Паспорт района Алматы
        </div>
      </main>
    </div>
  );
}

export default function RedeemPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Загрузка формы гашения...</p>
        </div>
      }
    >
      <RedeemContent />
    </Suspense>
  );
}
