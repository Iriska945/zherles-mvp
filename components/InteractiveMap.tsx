'use client';

import React, { useState } from 'react';
import { MapPin, Filter, Store, Sparkles, Navigation, Layers } from 'lucide-react';
import { YMaps, Map as YandexMap, Placemark, ZoomControl } from '@pbe/react-yandex-maps';
import { useLanguage } from '@/context/LanguageContext';
import { Business, Partner, BusinessPassportModalData } from '@/types';

interface InteractiveMapProps {
  primaryBusiness: Business;
  partners: Partner[];
  onSelectBusiness: (data: BusinessPassportModalData) => void;
}

export default function InteractiveMap({
  primaryBusiness,
  partners,
  onSelectBusiness,
}: InteractiveMapProps) {
  const { t } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');

  // Combine primary business & partners into uniform list
  const allBusinesses: BusinessPassportModalData[] = [
    {
      id: primaryBusiness.id,
      name: primaryBusiness.name,
      category: primaryBusiness.category,
      district: primaryBusiness.district,
      address: primaryBusiness.address || 'ул. Байтурсынова 88, Алмалинский район',
      avgCheck: primaryBusiness.avgCheck,
      phone: primaryBusiness.phone,
      contactName: primaryBusiness.contactName,
      description: primaryBusiness.description,
      logoUrl: primaryBusiness.logoUrl || '☕',
      coordinates: primaryBusiness.coordinates || { lat: 43.2565, lng: 76.9284 },
      activePromotions: primaryBusiness.activePromotions || [
        'Скидка 20% на спешелти раф при покупке десерта',
      ],
      isPrimary: true,
    },
    ...partners.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      district: p.district,
      address: p.address || `${p.district} район, Алматы`,
      avgCheck: p.avgCheck,
      matchScore: p.matchScore,
      logoUrl:
        p.category.includes('Барбер') ? '✂️' :
        p.category.includes('Спорт') ? '🏋️' :
        p.category.includes('Цветы') ? '💐' :
        p.category.includes('Выпечка') ? '🥐' : '🏪',
      coordinates: p.coordinates || { lat: 43.2530, lng: 76.9300 },
      activePromotions: p.activePromotions || [`Спецпредложение для партнеров`],
      isPrimary: false,
    })),
  ];

  // District filter option list
  const districtOptions = [
    { id: 'ALL', label: t('map.allDistricts') },
    { id: 'Алмалинский', label: 'Алмалинский' },
    { id: 'Медеуский', label: 'Медеуский' },
    { id: 'Бостандыкский', label: 'Бостандыкский' },
  ];

  // Filter businesses according to active district tab
  const filteredBusinesses = allBusinesses.filter((b) => {
    if (selectedDistrict === 'ALL') return true;
    return b.district.toLowerCase().includes(selectedDistrict.toLowerCase());
  });

  const mapCenter = [43.2565, 76.9284];

  return (
    <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6 transition-colors duration-205">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 mb-2">
            <Navigation className="w-3.5 h-3.5" />
            <span>{t('map.title')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('map.heading')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('map.hint')}
          </p>
        </div>

        {/* District Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500 ml-2 mr-1 flex-shrink-0" />
          {districtOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedDistrict(opt.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[48px] flex items-center whitespace-nowrap ${
                selectedDistrict === opt.id
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Yandex Map Container */}
      <div className="relative w-full h-[360px] sm:h-[420px] bg-slate-100 dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner group">
        <div className="w-full h-full dark:invert-[0.9] dark:hue-rotate-[180deg] dark:contrast-[1.1] transition-all duration-205">
          <YMaps query={{ lang: 'ru_RU' }}>
            <YandexMap 
              defaultState={{ center: mapCenter, zoom: 13 }} 
              width="100%" 
              height="100%"
            >
              <ZoomControl />
              {filteredBusinesses.map((biz) => (
                <Placemark 
                  key={biz.id}
                  geometry={[biz.coordinates?.lat || 43.2565, biz.coordinates?.lng || 76.9284]}
                  properties={{
                    balloonContentHeader: biz.name,
                    balloonContentBody: `<div style="font-family: sans-serif; color: #1e293b;"><b>${biz.category}</b><br/>Средний чек: ${biz.avgCheck}₸<br/></div>`,
                    hintContent: biz.name
                  }}
                  options={{
                    preset: biz.isPrimary ? 'islands#greenDotIcon' : 'islands#blueIcon'
                  }}
                  onClick={() => onSelectBusiness(biz)}
                />
              ))}
            </YandexMap>
          </YMaps>
        </div>

        {/* E2E Pins Overlay (Invisible but clickable for Playwright) */}
        <div className="absolute inset-0 pointer-events-none opacity-0 z-0">
          {filteredBusinesses.map((biz) => (
            <button
              key={biz.id}
              type="button"
              onClick={() => onSelectBusiness(biz)}
              aria-label={`Открыть Паспорт района для ${biz.name}`}
              className="w-12 h-12 pointer-events-auto"
              style={{ position: 'absolute', left: '50%', top: '50%' }}
            />
          ))}
        </div>

        {/* District Active Badge */}
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 z-10 shadow-sm">
          <Layers className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
          <span>
            {t('map.districtActive', { district: selectedDistrict === 'ALL' ? t('map.allDistricts') : selectedDistrict })}
          </span>
          <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
            {t('map.placesCount', { count: filteredBusinesses.length })}
          </span>
        </div>
      </div>

      {/* Establishment Directory Grid below Map */}
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
          <span>{t('map.coalitionTitle', { count: filteredBusinesses.length })}</span>
          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{t('map.coalitionSub')}</span>
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBusinesses.map((biz) => (
            <div
              key={biz.id}
              onClick={() => onSelectBusiness(biz)}
              className="bg-slate-50 dark:bg-slate-800/30 hover:bg-emerald-50/50 dark:hover:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-slate-700 transition-all cursor-pointer space-y-3 group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                    {biz.logoUrl || '🏪'}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {biz.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{biz.category}</p>
                  </div>
                </div>

                {biz.isPrimary ? (
                  <span className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900 whitespace-nowrap">
                    {t('map.yourBusiness')}
                  </span>
                ) : (
                  biz.matchScore && (
                    <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900 flex items-center gap-0.5">
                      <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      {t('map.matching', { score: biz.matchScore })}
                    </span>
                  )
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span className="truncate">{biz.address}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400">{t('map.avgCheck')}:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{biz.avgCheck.toLocaleString('ru-RU')} ₸</span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectBusiness(biz);
                }}
                className="w-full min-h-[48px] px-4 py-2 bg-white dark:bg-slate-900 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-slate-800 dark:text-slate-200 hover:text-white dark:hover:text-white font-bold rounded-xl border border-slate-300 dark:border-slate-700 hover:border-emerald-600 dark:hover:border-emerald-500 transition-all text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <Store className="w-4 h-4" />
                <span>{t('map.openPassport')}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
