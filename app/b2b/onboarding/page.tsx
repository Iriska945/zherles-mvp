'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Business } from '@/types';
import B2BNav from '@/components/B2BNav';
import { Store, MapPin, Phone, User, CheckCircle2, ArrowRight, Wallet, Sparkles } from 'lucide-react';
import Link from 'next/link';

const DISTRICTS = [
  'Алмалинский',
  'Медеуский',
  'Бостандыкский',
  'Ауэзовский',
  'Жетысуский',
  'Турксибский',
  'Наурызбайский',
  'Алатауский',
];

const CATEGORIES = [
  'Кофейня & Пекарня',
  'Барбершоп & Мужской уход',
  'Спорт & Фитнес',
  'Цветы & Подарки',
  'Выпечка & Десерты',
  'Ресторан & Кафе',
  'Салон красоты & SPA',
  'Магазин & Ритейл',
  'Развлечения & Досуг',
];

const EMOJI_OPTIONS = ['☕', '💈', '🏋️', '💐', '🥐', '🍕', '💇‍♀️', '🛍️', '🎨', '🍣'];

export default function BusinessOnboardingPage() {
  const { state, updateBusiness } = useApp();

  const [formData, setFormData] = useState<Business>({
    id: state.business?.id || 'biz-001',
    name: state.business?.name || '',
    category: state.business?.category || CATEGORIES[0],
    district: state.business?.district || DISTRICTS[0],
    avgCheck: state.business?.avgCheck || 2500,
    phone: state.business?.phone || '',
    contactName: state.business?.contactName || '',
    description: state.business?.description || '',
    logoUrl: state.business?.logoUrl || '☕',
  });

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (state.business) {
      setFormData(state.business);
    }
  }, [state.business]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'avgCheck' ? parseFloat(value) || 0 : value,
    }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusiness(formData);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      <B2BNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Настройка профиля B2B</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Онбординг & Профиль бизнеса
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Укажите параметры вашего заведения для точного подбора партнеров и настройки акций «Көрші».
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/b2b/catalog"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-all"
            >
              <span>Каталог акций</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {isSaved && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-xl shadow-sm flex items-center space-x-3 transition-all animate-fade-in">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">Профиль бизнеса успешно сохранен!</p>
              <p className="text-xs text-emerald-700">
                Партнерские рекомендации обновлены для района «{formData.district}».
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Store className="w-5 h-5 text-emerald-600" />
                  <span>Основная информация</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Данные видны партнерам при согласовании совместных кросс-маркетинговых кампаний.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Business Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Название бизнеса / заведения <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Например: Urban Coffee"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Категория / Ниша <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Район Алматы <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  >
                    {DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist} район
                      </option>
                    ))}
                  </select>
                </div>

                {/* Average Check */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Средний чек (₸) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="avgCheck"
                      required
                      min={100}
                      step={100}
                      value={formData.avgCheck}
                      onChange={handleChange}
                      placeholder="2500"
                      className="w-full pl-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                      ₸
                    </span>
                  </div>
                </div>

                {/* Logo Emoji */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Иконка / Логотип (Emoji)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      name="logoUrl"
                      maxLength={4}
                      value={formData.logoUrl}
                      onChange={handleChange}
                      className="w-16 text-center py-2 bg-slate-50 border border-slate-200 rounded-xl text-lg font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <div className="flex flex-wrap gap-1">
                      {EMOJI_OPTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, logoUrl: emoji }))}
                          className={`w-12 h-12 min-h-[48px] min-w-[48px] rounded-lg text-base border flex items-center justify-center transition-all ${
                            formData.logoUrl === emoji
                              ? 'bg-emerald-100 border-emerald-500 scale-105'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {emoji}
                        </button>

                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Контактное лицо <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="contactName"
                      required
                      value={formData.contactName}
                      onChange={handleChange}
                      placeholder="Арман Ибраев"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Телефон для связи <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+7 (707) 111-2233"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Описание заведения & концепция
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Опишите ваши ключевые преимущества, атмосферу или особенности..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 min-h-[48px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Сохранить профиль бизнеса</span>
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Card */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full">
                  Предпросмотр B2B карточки
                </span>
                <span className="text-2xl">{formData.logoUrl || '☕'}</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{formData.name || 'Название бизнеса'}</h3>
              <p className="text-xs text-emerald-400 font-medium mb-4 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 inline" />
                <span>{formData.district} район, Алматы</span>
              </p>

              <div className="space-y-2 text-xs text-slate-300 border-t border-slate-700/80 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Категория:</span>
                  <span className="font-semibold text-white">{formData.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Средний чек:</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-0.5">
                    <Wallet className="w-3.5 h-3.5" />
                    {formData.avgCheck ? formData.avgCheck.toLocaleString('ru-RU') : 0} ₸
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Контакт:</span>
                  <span className="font-medium text-white">{formData.contactName || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Телефон:</span>
                  <span className="font-medium text-white">{formData.phone || '—'}</span>
                </div>
              </div>

              {formData.description && (
                <div className="mt-4 pt-3 border-t border-slate-700/80 text-xs text-slate-300 italic">
                  "{formData.description}"
                </div>
              )}
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 text-xs text-emerald-900 space-y-2">
              <h4 className="font-bold flex items-center space-x-1 text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Зачем нужен онбординг?</span>
              </h4>
              <p className="leading-relaxed">
                Алгоритм скоринга «ЖЕРЛЕС» использует район <strong>({formData.district})</strong> и средний чек <strong>({formData.avgCheck} ₸)</strong> для автоматического подбора соседних неконкурирующих заведений с совпадением целевой аудитории от 80%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
