'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import ShareButtons from '@/components/ShareButtons';
import QRGenerator from '@/components/QRGenerator';
import {
  MapPin,
  Sparkles,
  QrCode,
  CheckCircle2,
  Coffee,
  Scissors,
  Dumbbell,
  Gift,
  Store,
  Tag,
  ArrowRight,
  X,
  CreditCard,
  Building2,
  Clock,
} from 'lucide-react';

interface UnifiedDeal {
  id: string;
  title: string;
  businessName: string;
  category: string;
  reward: string;
  pinCode: string;
  qrCodeUrl: string;
  minSpend?: number;
  expireDate?: string;
  shareMessage?: string;
}

function CategoryIcon({ category }: { category: string }) {
  const cat = category.toLowerCase();
  if (cat.includes('кофе') || cat.includes('десерт') || cat.includes('пекар')) {
    return <Coffee className="w-5 h-5 text-amber-600" />;
  }
  if (cat.includes('барбер') || cat.includes('стрижк') || cat.includes('красот') || cat.includes('уход')) {
    return <Scissors className="w-5 h-5 text-indigo-600" />;
  }
  if (cat.includes('фитнес') || cat.includes('спорт') || cat.includes('тренир')) {
    return <Dumbbell className="w-5 h-5 text-emerald-600" />;
  }
  if (cat.includes('цвет') || cat.includes('подар')) {
    return <Gift className="w-5 h-5 text-rose-600" />;
  }
  return <Store className="w-5 h-5 text-emerald-600" />;
}

function DistrictPassportContent() {
  const { state } = useApp();
  const searchParams = useSearchParams();
  const pinParam = searchParams.get('pin');

  const [selectedDeal, setSelectedDeal] = useState<UnifiedDeal | null>(null);
  const [highlightedPin, setHighlightedPin] = useState<string | null>(pinParam);

  // Combine featured deals from state.districtPassport and active campaigns from state.campaigns
  const deals: UnifiedDeal[] = [];

  // Add featured deals
  if (state.districtPassport?.featuredDeals) {
    state.districtPassport.featuredDeals.forEach((fd) => {
      deals.push({
        id: fd.id,
        title: fd.title,
        businessName: fd.businessName,
        category: fd.category,
        reward: fd.reward,
        pinCode: fd.pinCode,
        qrCodeUrl: fd.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${fd.pinCode}`,
        minSpend: fd.minSpend,
      });
    });
  }

  // Add active campaigns from state.campaigns
  if (state.campaigns) {
    state.campaigns
      .filter((c) => c.status === 'ACTIVE')
      .forEach((c) => {
        const partner = state.partners?.find((p) => c.targetPartnerIds.includes(p.id));
        const partnerName = partner ? partner.name : state.business.name;
        const matchingCoupon = state.coupons?.find((cp) => cp.campaignId === c.id);
        const pinCode = matchingCoupon?.pinCode || '1234';

        // Avoid exact duplicates if already added
        if (!deals.some((d) => d.pinCode === pinCode || d.id === c.id)) {
          deals.push({
            id: c.id,
            title: c.title,
            businessName: partnerName,
            category: partner?.category || state.business.category || 'Партнер района',
            reward: c.rewardText,
            pinCode,
            qrCodeUrl: c.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${pinCode}`,
            minSpend: c.minSpend,
            expireDate: c.expireDate,
            shareMessage: c.shareMessage,
          });
        }
      });
  }

  // Auto-focus / highlight deal if pin query parameter matches
  useEffect(() => {
    if (pinParam) {
      setHighlightedPin(pinParam);
      const matched = deals.find((d) => d.pinCode === pinParam);
      if (matched) {
        setSelectedDeal(matched);
      }
    }
  }, [pinParam]);

  const districtName = state.districtPassport?.districtName || 'Алмалинский район';

  return (
    <div className="max-w-md mx-auto shadow-2xl min-h-screen bg-slate-50 border-x border-slate-200 flex flex-col font-sans pb-24">
      {/* Header */}
      <header className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-800 text-white p-6 rounded-b-3xl shadow-lg relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-emerald-400/20 rounded-full blur-lg pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center space-x-1.5 bg-emerald-800/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide border border-emerald-400/30 text-emerald-100">
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              <span>{districtName}</span>
            </span>
            <span className="text-[11px] font-mono bg-white/15 px-2.5 py-0.5 rounded-md text-emerald-100">
              B2C PASSPORT
            </span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white mb-2 flex items-center gap-2">
            <span>Паспорт района</span>
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </h1>

          <p className="text-xs text-emerald-100 leading-relaxed font-medium">
            Добро пожаловать в единый эко-паспорт района! Пользуйтесь скидками и эксклюзивными бонусами в заведениях вашей локации.
          </p>

          {/* Quick redemption callout */}
          <div className="mt-5 p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-sm shadow">
                PIN
              </div>
              <div>
                <div className="text-xs font-extrabold text-white">Есть PIN-код бонуса?</div>
                <div className="text-[11px] text-emerald-100">Погасите его за пару секунд</div>
              </div>
            </div>
            <Link
              href="/b2c/redeem"
              className="bg-white text-emerald-800 hover:bg-emerald-50 px-3 py-1.5 rounded-xl text-xs font-black transition-all shadow active:scale-95 flex items-center space-x-1"
            >
              <span>Ввести</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4 space-y-4 flex-1">
        {/* URL PIN Banner indicator if parameter was supplied */}
        {highlightedPin && (
          <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-2xl flex items-center justify-between shadow-sm animate-pulse">
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-extrabold text-amber-900">
                Выбран бонус по PIN: <span className="font-mono text-sm underline">{highlightedPin}</span>
              </span>
            </div>
            <button
              onClick={() => setHighlightedPin(null)}
              className="text-amber-700 hover:text-amber-900 text-xs font-bold"
            >
              Сбросить
            </button>
          </div>
        )}

        {/* Section title */}
        <div className="flex items-center justify-between px-1 pt-2">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Активные предложения района ({deals.length})</span>
          </h2>
        </div>

        {/* Active Deals List */}
        <div className="space-y-4">
          {deals.map((deal) => {
            const isHighlighted = highlightedPin === deal.pinCode;

            return (
              <div
                key={deal.id}
                id={`deal-${deal.pinCode}`}
                className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${
                  isHighlighted
                    ? 'border-2 border-emerald-500 ring-4 ring-emerald-100 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Top Badge & Category */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2.5 bg-slate-100 rounded-xl flex items-center justify-center">
                      <CategoryIcon category={deal.category} />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                        {deal.businessName}
                      </h3>
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md inline-block mt-0.5">
                        {deal.category}
                      </span>
                    </div>
                  </div>

                  {isHighlighted && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-1 rounded-full uppercase tracking-wider">
                      Активен
                    </span>
                  )}
                </div>

                {/* Offer details */}
                <div className="bg-emerald-50/70 border border-emerald-100 p-3 rounded-xl mb-3">
                  <div className="text-xs font-black text-emerald-950 mb-1">
                    {deal.title}
                  </div>
                  <div className="text-xs text-emerald-800 font-medium">
                    {deal.reward}
                  </div>
                  {deal.minSpend && (
                    <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center space-x-1">
                      <CreditCard className="w-3 h-3" />
                      <span>При чеке от {deal.minSpend.toLocaleString('ru-RU')} ₸</span>
                    </div>
                  )}
                </div>

                {/* PIN preview block */}
                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3">
                  <div className="text-[11px] text-slate-500 font-medium">
                    ПИН-код для показа кассиру:
                  </div>
                  <div className="font-mono text-sm font-black text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm tracking-wider">
                    {deal.pinCode}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Show QR Modal Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedDeal(deal)}
                      className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>QR / PIN код</span>
                    </button>

                    {/* Redeem page link */}
                    <Link
                      href={`/b2c/redeem?pin=${deal.pinCode}`}
                      className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Погасить</span>
                    </Link>
                  </div>

                  {/* Messenger Share section */}
                  <div className="pt-2">
                    <div className="text-[10px] uppercase font-extrabold text-slate-400 mb-1.5">
                      Поделиться предложением:
                    </div>
                    <ShareButtons
                      title={`Бонус от ${deal.businessName}`}
                      text={deal.shareMessage || `Скидка и бонус от ${deal.businessName}: ${deal.reward}`}
                      pinCode={deal.pinCode}
                      url={`https://zherles.kz/b2c/passport?pin=${deal.pinCode}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-2xl z-40">
        <Link
          href="/b2c/redeem"
          className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-lg transition-all active:scale-98"
        >
          <QrCode className="w-5 h-5" />
          <span>Погасить бонус по PIN-коду</span>
        </Link>
      </div>

      {/* QR Code Modal Overlay */}
      {selectedDeal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedDeal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="text-center">
              <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full mb-2">
                {selectedDeal.businessName}
              </span>
              <h3 className="text-lg font-black text-slate-900 mb-1">
                {selectedDeal.title}
              </h3>
              <p className="text-xs text-slate-600 mb-4">{selectedDeal.reward}</p>

              {/* QR Code Display */}
              <QRGenerator
                value={`https://zherles.kz/b2c/passport?pin=${selectedDeal.pinCode}`}
                title="Покажите QR на кассе"
                subtitle="Кассир отсканирует QR или введет PIN-код"
                size={180}
                showActions={false}
              />

              {/* Prominent PIN Code */}
              <div className="bg-slate-900 text-white p-3.5 rounded-2xl my-4 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                  ПИН-код для гашения
                </div>
                <div className="text-2xl font-mono font-black text-emerald-400 tracking-widest">
                  {selectedDeal.pinCode}
                </div>
              </div>

              {/* Direct Redeem Link */}
              <div className="space-y-3">
                <Link
                  href={`/b2c/redeem?pin=${selectedDeal.pinCode}`}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Перейти к гашению бонуса</span>
                </Link>

                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold mb-1.5">
                    Поделиться этим кодом:
                  </div>
                  <ShareButtons
                    title={`Бонус от ${selectedDeal.businessName}`}
                    text={`Держи бонус по PIN ${selectedDeal.pinCode}: ${selectedDeal.reward}`}
                    pinCode={selectedDeal.pinCode}
                    url={`https://zherles.kz/b2c/passport?pin=${selectedDeal.pinCode}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PassportPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Загрузка Паспорта района...</p>
        </div>
      }
    >
      <DistrictPassportContent />
    </Suspense>
  );
}
