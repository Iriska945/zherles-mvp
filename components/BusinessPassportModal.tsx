'use client';

import React from 'react';
import Link from 'next/link';
import { X, MapPin, Tag, Sparkles, Store, Smartphone, CheckCircle2, Phone, User } from 'lucide-react';
import { BusinessPassportModalData } from '@/types';

interface BusinessPassportModalProps {
  data: BusinessPassportModalData | null;
  onClose: () => void;
}

export default function BusinessPassportModal({ data, onClose }: BusinessPassportModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!data) return null;


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden space-y-6 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Закрыть модальное окно"
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header Section */}
        <div className="flex items-start gap-4 pr-10">
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-3xl shadow-sm">
            {data.logoUrl || '☕'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                {data.category}
              </span>
              {data.isPrimary ? (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-md">
                  Ваш бизнес
                </span>
              ) : (
                data.matchScore && (
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Совместимость {data.matchScore}%
                  </span>
                )
              )}
            </div>
            <h2 id="modal-title" className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {data.name}
            </h2>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{data.address || `${data.district} район, Алматы`}</span>
            </p>
          </div>
        </div>

        {/* Quick Stats Box */}
        <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <div className="space-y-0.5">
            <span className="text-xs text-slate-500 font-medium">Средний чек</span>
            <p className="text-lg font-extrabold text-slate-900">
              {data.avgCheck.toLocaleString('ru-RU')} ₸
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-slate-500 font-medium">Микрорайон</span>
            <p className="text-sm font-bold text-slate-800 truncate">{data.district} район</p>
          </div>
          {data.contactName && (
            <div className="space-y-0.5 col-span-2 pt-2 border-t border-slate-200/60 flex items-center gap-2 text-xs text-slate-600">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Контактное лицо: <strong>{data.contactName}</strong></span>
              {data.phone && <span className="text-slate-400">({data.phone})</span>}
            </div>
          )}
        </div>

        {/* Description if present */}
        {data.description && (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            {data.description}
          </p>
        )}

        {/* Active Promotions List */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-600" />
            <span>Активные Көрші-акции ({data.activePromotions?.length || 1})</span>
          </h3>

          <div className="space-y-2">
            {(data.activePromotions && data.activePromotions.length > 0
              ? data.activePromotions
              : ['Специальная партнёрская бонусная программа района']
            ).map((promo, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/80 text-xs sm:text-sm font-medium text-emerald-950"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{promo}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons - min 48px height for accessibility */}
        <div className="grid sm:grid-cols-2 gap-3 pt-2">
          <Link
            href={`/b2b/dashboard`}
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-500 transition-all text-xs sm:text-sm shadow-md shadow-emerald-600/20 text-center"
          >
            <Store className="w-4 h-4" />
            <span>Запустить Көрші-маршрут</span>
          </Link>

          <Link
            href="/b2c/passport"
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-all text-xs sm:text-sm shadow-md shadow-blue-600/20 text-center"
          >
            <Smartphone className="w-4 h-4" />
            <span>Забрать бонус в Паспорте</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
