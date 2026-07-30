'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import B2BNav from '@/components/B2BNav';
import QRGenerator from '@/components/QRGenerator';
import { Campaign } from '@/types';
import {
  PlusCircle,
  QrCode,
  ExternalLink,
  Users,
  Gift,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  X,
  Smartphone,
  Tag,
  ShieldCheck,
  PauseCircle,
  PlayCircle,
} from 'lucide-react';

export default function CampaignsOverviewPage() {
  const { state } = useApp();
  const { campaigns = [], partners = [], coupons = [], business } = state;

  const [selectedQrCampaign, setSelectedQrCampaign] = useState<Campaign | null>(null);

  // Summary Metrics calculations
  const activeCount = campaigns.filter((c) => c.status === 'ACTIVE').length;
  const totalIssuedCoupons = coupons.length;
  const totalRedeemedCoupons = coupons.filter((c) => c.status === 'REDEEMED').length;
  const conversionRate =
    totalIssuedCoupons > 0
      ? ((totalRedeemedCoupons / totalIssuedCoupons) * 100).toFixed(1)
      : '0.0';

  // Helper to map partner IDs to Partner names
  const getPartnerNames = (partnerIds: string[]) => {
    if (!partnerIds || partnerIds.length === 0) return ['Все партнёры района'];
    return partnerIds.map((id) => {
      const p = partners.find((item) => item.id === id);
      return p ? p.name : id;
    });
  };

  return (
    <div className="space-y-6 pb-16">
      <B2BNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header & CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-1 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Районный кросс-маркетинг</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Акции «Көрші-маршрут»
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Активные и прошедшие кампании взаимного притока клиентов в районе{' '}
              <strong>{business.district}</strong>.
            </p>
          </div>

          <Link
            href="/b2b/campaigns/new"
            className="inline-flex items-center justify-center space-x-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-sm transition-all whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Создать новую акцию</span>
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Metric 1 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Активных акций
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {activeCount}
            </div>
            <p className="text-[11px] text-slate-400">Из {campaigns.length} общих кампаний</p>
          </div>

          {/* Metric 2 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Выдано купонов
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Tag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {totalIssuedCoupons}
            </div>
            <p className="text-[11px] text-slate-400">Сгенерировано для клиентов</p>
          </div>

          {/* Metric 3 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Использовано бонусов
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Gift className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
              {totalRedeemedCoupons}
            </div>
            <p className="text-[11px] text-slate-400">Погашено на кассах партнеров</p>
          </div>

          {/* Metric 4 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Конверсия погашения
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {conversionRate}%
            </div>
            <p className="text-[11px] text-slate-400">Средний показатель по району</p>
          </div>
        </div>

        {/* Campaigns Grid Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <span>Список кампаний</span>
            <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              {campaigns.length}
            </span>
          </h2>
        </div>

        {/* Empty state */}
        {campaigns.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto text-emerald-600">
              <PlusCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Нет активных акций</h3>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
              Запустите первую акцию «Көрші-маршрут», чтобы начать бесплатный обмен клиентами с соседними заведениями.
            </p>
            <Link
              href="/b2b/campaigns/new"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-emerald-700 transition-all shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Создать первую акцию</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaigns.map((campaign) => {
              const partnerNames = getPartnerNames(campaign.targetPartnerIds);
              const campaignCoupons = coupons.filter((c) => c.campaignId === campaign.id);
              const redeemedCount = campaignCoupons.filter((c) => c.status === 'REDEEMED').length;
              const campaignConv =
                campaignCoupons.length > 0
                  ? ((redeemedCount / campaignCoupons.length) * 100).toFixed(0)
                  : '0';

              const isPast =
                campaign.expireDate && new Date(campaign.expireDate).getTime() < Date.now();
              const statusLabel =
                campaign.status === 'ACTIVE'
                  ? isPast
                    ? 'ЗАВЕРШЕНА'
                    : 'АКТИВНА'
                  : campaign.status === 'PAUSED'
                  ? 'НА ПАУЗЕ'
                  : campaign.status;

              return (
                <div
                  key={campaign.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    {/* Top Status & Title */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                          {campaign.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            Создана:{' '}
                            {new Date(campaign.createdAt || Date.now()).toLocaleDateString('ru-RU')}
                          </span>
                        </p>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-xs font-extrabold px-3 py-1 rounded-full border whitespace-nowrap ${
                          statusLabel === 'АКТИВНА'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : statusLabel === 'НА ПАУЗЕ'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    {/* Reward Details Box */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
                      <div className="text-xs font-bold text-slate-800 flex items-start space-x-2">
                        <Gift className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{campaign.rewardText}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/60 text-slate-600">
                        <div>
                          Мин. чек:{' '}
                          <strong className="text-slate-900">{campaign.minSpend} ₸</strong>
                        </div>
                        <div>
                          Действует до:{' '}
                          <strong className="text-slate-900">
                            {campaign.expireDate
                              ? new Date(campaign.expireDate).toLocaleDateString('ru-RU')
                              : `${campaign.durationDays} дн.`}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Target Partners Badges */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Партнёры акции ({partnerNames.length}):
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {partnerNames.map((name, i) => (
                          <span
                            key={i}
                            className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-lg border border-emerald-200/70 inline-flex items-center space-x-1"
                          >
                            <Users className="w-3 h-3 text-emerald-600" />
                            <span>{name}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Coupon Performance Stats */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Купонов</div>
                        <div className="text-sm font-extrabold text-slate-800">
                          {campaignCoupons.length}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Погашено</div>
                        <div className="text-sm font-extrabold text-emerald-600">
                          {redeemedCount}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Конверсия</div>
                        <div className="text-sm font-extrabold text-blue-600">{campaignConv}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedQrCampaign(campaign)}
                      className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Показать QR-код</span>
                    </button>

                    <Link
                      href={`/b2c/passport?campaignId=${campaign.id}`}
                      className="py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center justify-center space-x-1"
                      title="Просмотреть в Паспорте B2C"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                      <span>Паспорт B2C</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* QR Code Modal Dialog */}
        {selectedQrCampaign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4 border border-slate-200">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedQrCampaign(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="pr-8">
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  QR-код акции «Көрші-маршрут»
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  {selectedQrCampaign.title}
                </h3>
              </div>

              {/* Embedded QR Generator */}
              <QRGenerator
                value={`https://zherles.kz/b2c/passport?campaignId=${selectedQrCampaign.id}`}
                size={200}
                title={selectedQrCampaign.title}
                subtitle={selectedQrCampaign.rewardText}
                showActions={true}
              />

              {/* Action buttons inside modal */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                <Link
                  href={`/b2c/passport?campaignId=${selectedQrCampaign.id}`}
                  className="inline-flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 font-bold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Открыть вид B2C Паспорт</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setSelectedQrCampaign(null)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
