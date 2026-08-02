'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import B2BNav from '@/components/B2BNav';
import QRGenerator from '@/components/QRGenerator';
import { Partner, Campaign } from '@/types';
import {
  Check,
  Square,
  CheckSquare,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Share2,
  Smartphone,
  Gift,
  QrCode,
  Calendar,
  DollarSign,
  Store,
  Users,
  Target,
  Rocket,
  ShieldCheck,
  Scissors,
  Coffee,
  Dumbbell,
  Flower2,
  Utensils,
} from 'lucide-react';

function getCategoryIcon(category: string) {
  const cat = category.toLowerCase();
  if (cat.includes('барбер') || cat.includes('стриж')) return Scissors;
  if (cat.includes('кофе') || cat.includes('напит')) return Coffee;
  if (cat.includes('спорт') || cat.includes('фитнес')) return Dumbbell;
  if (cat.includes('цвет') || cat.includes('подар')) return Flower2;
  if (cat.includes('выпеч') || cat.includes('десерт') || cat.includes('еда')) return Utensils;
  return Store;
}

function CampaignWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId');

  const { state, addCampaign } = useApp();
  const { business, partners, templates } = state;

  // Step management: 1 = Partner Selection, 2 = Rewards & Conditions, 3 = Message & QR Preview
  const [step, setStep] = useState<number>(1);

  // Form state
  const [selectedPartnerIds, setSelectedPartnerIds] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [rewardText, setRewardText] = useState('');
  const [minSpend, setMinSpend] = useState<number>(2000);
  const [durationDays, setDurationDays] = useState<number>(30);
  const [shareMessage, setShareMessage] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Auto-select partners or pre-fill from template on mount
  useEffect(() => {
    // Select active partners by default
    if (partners && partners.length > 0 && selectedPartnerIds.length === 0) {
      const activeIds = partners.map((p) => p.id);
      setSelectedPartnerIds(activeIds);
    }

    if (templateId && templates) {
      const template = templates.find((t) => t.id === templateId);
      if (template) {
        setTitle(`Көрші-Маршрут: ${template.title}`);
        setRewardText(template.defaultReward || template.description);
        setShareMessage(
          `Привет! Лови Паспорт ${business?.district || 'Алмалинского'} района со спецпредложением: ${
            template.defaultReward
          }!`
        );
      }
    } else if (!title) {
      setTitle(`Көрші-Маршрут: Локальное кросс-промо`);
      setRewardText(`Скидка 15% у наших партнеров района`);
      setShareMessage(
        `Привет! Лови мой Паспорт ${business?.district || 'Алмалинского'} района со скидкой 15%!`
      );
    }
  }, [templateId, templates, partners, business]);

  // Toggle partner selection
  const togglePartner = (id: string) => {
    setSelectedPartnerIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const selectAllPartners = () => {
    if (partners) {
      setSelectedPartnerIds(partners.map((p) => p.id));
    }
  };

  const deselectAllPartners = () => {
    setSelectedPartnerIds([]);
  };

  // Step 1 -> Step 2 validation
  const handleProceedToStep2 = () => {
    if (selectedPartnerIds.length === 0) {
      setValidationError('Пожалуйста, выберите хотя бы одного партнёра по району.');
      return;
    }
    setValidationError(null);
    setStep(2);
  };

  // Step 2 -> Step 3 validation
  const handleProceedToStep3 = () => {
    if (!title.trim()) {
      setValidationError('Укажите название акции.');
      return;
    }
    if (!rewardText.trim()) {
      setValidationError('Опишите бонус или условие награды.');
      return;
    }
    setValidationError(null);
    setStep(3);
  };

  // Final submit campaign creation
  const handleCreateCampaign = () => {
    const campaignId = `cmp-${Date.now()}`;
    const expireDate = new Date(Date.now() + durationDays * 86400000)
      .toISOString()
      .split('T')[0];

    const passportTargetUrl = `https://zherles.kz/b2c/passport?campaignId=${campaignId}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
      passportTargetUrl
    )}`;

    const newCampaign: Campaign = {
      id: campaignId,
      title: title.trim(),
      sourceBusinessId: business.id || 'biz-001',
      targetPartnerIds: selectedPartnerIds,
      rewardText: rewardText.trim(),
      minSpend: Number(minSpend) || 0,
      durationDays: Number(durationDays) || 30,
      expireDate,
      qrCodeUrl,
      shareMessage: shareMessage.trim(),
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    addCampaign(newCampaign);
    router.push('/b2b/campaigns');
  };

  // Calculated helper values for preview
  const selectedPartners = (partners || []).filter((p) =>
    selectedPartnerIds.includes(p.id)
  );

  const previewCampaignId = `cmp-draft`;
  const passportPreviewUrl = `/b2c/passport?campaignId=${previewCampaignId}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Wizard Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Мастер создания Көрші-маршрута</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Создание новой кросс-акции «Көрші-маршрут»
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Объединитесь с бизнесами района {business.district} для обмена целевым трафиком клиентов.
        </p>
      </div>

      {/* Stepper Navigation */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-8">
        <div className="grid grid-cols-3 gap-2 text-center">
          {/* Step 1 Pill */}
          <button
            onClick={() => setStep(1)}
            className={`flex flex-col sm:flex-row items-center justify-center min-h-[48px] space-y-1 sm:space-y-0 sm:space-x-2 p-3 rounded-xl transition-all ${
              step === 1
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : step > 1
                ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
                : 'bg-slate-50 text-slate-400 font-medium'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                step === 1
                  ? 'bg-white text-emerald-700'
                  : step > 1
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              1
            </span>
            <span className="text-xs sm:text-sm">1. Партнёры ({selectedPartnerIds.length})</span>
          </button>

          {/* Step 2 Pill */}
          <button
            onClick={() => {
              if (selectedPartnerIds.length > 0) setStep(2);
            }}
            disabled={selectedPartnerIds.length === 0}
            className={`flex flex-col sm:flex-row items-center justify-center min-h-[48px] space-y-1 sm:space-y-0 sm:space-x-2 p-3 rounded-xl transition-all ${
              step === 2
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : step > 2
                ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
                : 'bg-slate-50 text-slate-400 font-medium opacity-80'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                step === 2
                  ? 'bg-white text-emerald-700'
                  : step > 2
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              2
            </span>
            <span className="text-xs sm:text-sm">2. Награды & Условия</span>
          </button>

          {/* Step 3 Pill */}
          <button
            onClick={() => {
              if (selectedPartnerIds.length > 0 && title && rewardText) setStep(3);
            }}
            disabled={selectedPartnerIds.length === 0 || !title || !rewardText}
            className={`flex flex-col sm:flex-row items-center justify-center min-h-[48px] space-y-1 sm:space-y-0 sm:space-x-2 p-3 rounded-xl transition-all ${
              step === 3
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'bg-slate-50 text-slate-400 font-medium opacity-80'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                step === 3 ? 'bg-white text-emerald-700' : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </span>
            <span className="text-xs sm:text-sm">3. Превью & QR</span>
          </button>
        </div>
      </div>

      {/* Validation Error Alert */}
      {validationError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs sm:text-sm font-semibold mb-6 flex items-center space-x-2 animate-shake">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>{validationError}</span>
        </div>
      )}

      {/* STEP 1: PARTNER SELECTION */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span>Шаг 1: Выбор партнёров по району</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Рекомендованные бизнесы района <strong>{business.district}</strong> с высоким уровнем совместной аудитории.
                </p>
              </div>

              {/* Select all / Deselect buttons */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={selectAllPartners}
                  className="px-3 py-1.5 min-h-[48px] inline-flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg transition-all"
                >
                  Выбрать всех
                </button>
                <button
                  type="button"
                  onClick={deselectAllPartners}
                  className="px-3 py-1.5 min-h-[48px] inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition-all"
                >
                  Снять все
                </button>
              </div>
            </div>

            {/* Partners Grid */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {partners.map((partner) => {
                const isSelected = selectedPartnerIds.includes(partner.id);
                const CatIcon = getCategoryIcon(partner.category);

                return (
                  <div
                    key={partner.id}
                    onClick={() => togglePartner(partner.id)}
                    className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 flex items-start space-x-4 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/40 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {/* Checkbox indicator */}
                    <div className="pt-0.5">
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300" />
                      )}
                    </div>

                    {/* Partner Content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-base font-bold text-slate-900">{partner.name}</h3>
                          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-0.5">
                            <CatIcon className="w-3.5 h-3.5 text-slate-400" />
                            <span>{partner.category}</span>
                          </div>
                        </div>

                        {/* Match score badge */}
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>{partner.matchScore}% совпадение</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                          📍 {partner.district} район
                        </span>
                        <span className="text-slate-500">
                          Средний чек: <strong className="text-slate-800">{partner.avgCheck} ₸</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Footer Step 1 */}
          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => router.push('/b2b/catalog')}
              className="px-4 h-12 min-h-[48px] inline-flex items-center justify-center text-slate-600 hover:text-slate-900 text-xs sm:text-sm font-semibold rounded-xl"
            >
              Отмена
            </button>


            <button
              type="button"
              onClick={handleProceedToStep2}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
            >
              <span>Далее: Условия & Награды</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: REWARDS & CONDITIONS */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Gift className="w-5 h-5 text-emerald-600" />
                <span>Шаг 2: Настройка наград и условий акции</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Задайте привлекательный оффер для клиентов и параметры кросс-скидки.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campaign Title */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Название Көрші-акции *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Например: Көрші-Маршрут: Утренний кофе + Стрижка"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Reward Description */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Описание бонуса / подарка *
                </label>
                <textarea
                  rows={2}
                  value={rewardText}
                  onChange={(e) => setRewardText(e.target.value)}
                  placeholder="Например: Скидка 20% на первую стрижку при предъявлении чека кофейни"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Minimum Spend */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Минимальный чек в вашем заведении (₸)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-slate-400 font-semibold text-xs">₸</span>
                  <input
                    type="number"
                    value={minSpend}
                    onChange={(e) => setMinSpend(Number(e.target.value))}
                    min={0}
                    step={500}
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400">Сумма покупки для активации бонуса</p>
              </div>

              {/* Duration Days */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Срок действия акции (в днях)
                </label>
                <select
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={7}>7 дней (1 неделя)</option>
                  <option value={14}>14 дней (2 недели)</option>
                  <option value={30}>30 дней (1 месяц)</option>
                  <option value={60}>60 дней (2 месяца)</option>
                  <option value={90}>90 дней (3 месяца)</option>
                </select>
                <p className="text-[11px] text-slate-400">
                  Дата окончания:{' '}
                  <strong>
                    {new Date(Date.now() + durationDays * 86400000).toLocaleDateString('ru-RU')}
                  </strong>
                </p>
              </div>

              {/* Sharing Message Template */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Шаблон сообщения для клиентов (WhatsApp / Telegram)
                </label>
                <textarea
                  rows={3}
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                  placeholder="Сообщение, которое клиенты будут пересылать друг другу..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Action Footer Step 2 */}
          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Назад: Партнёры</span>
            </button>

            <button
              type="button"
              onClick={handleProceedToStep3}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
            >
              <span>Далее: Превью & QR</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: MESSAGE & QR PREVIEW */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* WhatsApp Live Preview Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Превью WhatsApp-сообщения</span>
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  Live View
                </span>
              </div>

              {/* Phone Mockup Window */}
              <div className="bg-slate-800 rounded-2xl p-4 shadow-inner">
                {/* Phone status bar */}
                <div className="bg-emerald-700 text-white text-xs px-4 py-2.5 rounded-t-xl font-bold flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{business.name}</span>
                  </div>
                  <span className="text-[10px] font-normal opacity-80">Чат акции</span>
                </div>

                {/* Chat Bubble Body */}
                <div className="bg-[#efeae2] p-4 rounded-b-xl space-y-3 min-h-[220px]">
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 max-w-[90%] space-y-3">
                    <p className="text-xs text-slate-800 leading-relaxed font-medium">
                      {shareMessage}
                    </p>

                    <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 space-y-1">
                      <div className="text-[11px] font-bold text-emerald-900 uppercase">
                        🎁 {rewardText}
                      </div>
                      <div className="text-[10px] text-emerald-700">
                        Условие: Чек от {minSpend} ₸ в {business.name}
                      </div>
                    </div>

                    <div className="pt-1">
                      <a
                        href={passportPreviewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-emerald-700 underline block truncate"
                      >
                        https://zherles.kz/b2c/passport?campaignId=cmp-draft
                      </a>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Откроет Районный Паспорт с QR-кодом
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 text-right">12:34 ✓✓</div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                <div className="font-bold text-slate-700">Выбранные партнёры ({selectedPartners.length}):</div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedPartners.map((p) => (
                    <span key={p.id} className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                      {p.name} ({p.category})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Dynamic QR Code Renderer */}
            <div className="space-y-4">
              <QRGenerator
                value={`https://zherles.kz/b2c/passport?campaignId=cmp-${Date.now()}`}
                size={220}
                title={title}
                subtitle={`Отсканируйте для мгновенного получения бонуса в заведениях района ${business.district}`}
                showActions={true}
              />

              {/* Target Passport Info */}
              <div className="bg-emerald-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center space-x-2 text-xs font-extrabold text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Мгновенный запуск сети</span>
                </div>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  После публикации акция будет сгенерирована и появится в районном Паспорте B2C. Партнёры смогут считывать 4-значные PIN-коды клиентов.
                </p>
                <div className="text-xs font-semibold text-emerald-200 border-t border-emerald-800/80 pt-2 flex items-center justify-between">
                  <span>Срок активности:</span>
                  <span>{durationDays} дней (до {new Date(Date.now() + durationDays * 86400000).toLocaleDateString('ru-RU')})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer Step 3 */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Назад: Условия</span>
            </button>

            <button
              type="button"
              onClick={handleCreateCampaign}
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Rocket className="w-5 h-5" />
              <span>Запустить акцию «Көрші-маршрут»</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CampaignWizardPage() {
  return (
    <div className="space-y-6">
      <B2BNav />
      <Suspense fallback={<div className="p-8 text-center text-slate-500 font-semibold">Загрузка мастера создания акций...</div>}>
        <CampaignWizardContent />
      </Suspense>
    </div>
  );
}
