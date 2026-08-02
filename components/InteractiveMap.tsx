'use client';

import React, { useState } from 'react';
import { MapPin, Filter, Store, Sparkles, Navigation, Layers } from 'lucide-react';
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
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
    { id: 'ALL', label: 'Все районы' },
    { id: 'Алмалинский', label: 'Алмалинский' },
    { id: 'Медеуский', label: 'Медеуский' },
    { id: 'Бостандыкский', label: 'Бостандыкский' },
  ];

  // Filter businesses according to active district tab
  const filteredBusinesses = allBusinesses.filter((b) => {
    if (selectedDistrict === 'ALL') return true;
    return b.district.toLowerCase().includes(selectedDistrict.toLowerCase());
  });

  // Calculate pin position on map viewbox (in percentages)
  // Almaty bounding box: Lat (43.2350 - 43.2650), Lng (76.9150 - 76.9650)
  const getPinPosition = (coords?: { lat: number; lng: number }) => {
    if (!coords) return { x: 50, y: 50 };
    const minLat = 43.2350;
    const maxLat = 43.2650;
    const minLng = 76.9150;
    const maxLng = 76.9650;

    const x = Math.min(Math.max(((coords.lng - minLng) / (maxLng - minLng)) * 75 + 12, 10), 90);
    const y = Math.min(Math.max(((maxLat - coords.lat) / (maxLat - minLat)) * 75 + 12, 10), 90);

    return { x, y };
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
            <Navigation className="w-3.5 h-3.5" />
            <span>Интерактивная карта Алматы</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Локальные партнеры микрорайона
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Кликните на пин или карточку заведения, чтобы открыть его <strong className="text-slate-800">Паспорт района</strong>.
          </p>
        </div>

        {/* District Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-400 ml-2 mr-1 flex-shrink-0" />
          {districtOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedDistrict(opt.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[48px] flex items-center whitespace-nowrap ${
                selectedDistrict === opt.id
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Vector Map Container */}
      <div className="relative w-full h-[360px] sm:h-[420px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-inner group">
        {/* District SVG Map Illustration */}
        <svg
          className="w-full h-full object-cover opacity-60"
          viewBox="0 0 1000 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="1000" height="600" fill="url(#grid)" />

          {/* District Regions */}
          {/* Almaly District */}
          <path
            d="M150 120 L550 100 L580 350 L120 380 Z"
            fill="rgba(16, 185, 129, 0.15)"
            stroke="rgba(16, 185, 129, 0.4)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <text x="320" y="240" fill="rgba(16, 185, 129, 0.6)" fontSize="18" fontWeight="bold">
            АЛМАЛИНСКИЙ РАЙОН
          </text>

          {/* Medeu District */}
          <path
            d="M550 100 L920 80 L900 480 L580 350 Z"
            fill="rgba(59, 130, 246, 0.12)"
            stroke="rgba(59, 130, 246, 0.4)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <text x="680" y="240" fill="rgba(59, 130, 246, 0.6)" fontSize="18" fontWeight="bold">
            МЕДЕУСКИЙ РАЙОН
          </text>

          {/* Bostandyk District */}
          <path
            d="M120 380 L580 350 L560 560 L80 540 Z"
            fill="rgba(168, 85, 247, 0.12)"
            stroke="rgba(168, 85, 247, 0.4)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <text x="300" y="470" fill="rgba(168, 85, 247, 0.6)" fontSize="18" fontWeight="bold">
            БОСТАНДЫКСКИЙ РАЙОН
          </text>

          {/* Main Avenues / Streets */}
          <line x1="80" y1="280" x2="920" y2="250" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
          <text x="100" y="272" fill="rgba(255,255,255,0.4)" fontSize="11">пр. Абая</text>

          <line x1="450" y1="80" x2="420" y2="560" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
          <text x="430" y="100" fill="rgba(255,255,255,0.4)" fontSize="11">ул. Байтурсынова</text>

          <line x1="720" y1="80" x2="700" y2="540" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
          <text x="730" y="100" fill="rgba(255,255,255,0.4)" fontSize="11">пр. Достык</text>
        </svg>

        {/* District Active Badge */}
        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>Район: <strong className="text-white">{selectedDistrict === 'ALL' ? 'Алматы (Все)' : selectedDistrict}</strong></span>
          <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
            {filteredBusinesses.length} мест
          </span>
        </div>

        {/* Interactive Map Pins Layer */}
        <div className="absolute inset-0">
          {filteredBusinesses.map((biz) => {
            const pos = getPinPosition(biz.coordinates);
            const isHovered = hoveredId === biz.id;

            return (
              <div
                key={biz.id}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin"
                onMouseEnter={() => setHoveredId(biz.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Pin Tooltip */}
                <div
                  className={`aria-tooltip absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-slate-900 text-white p-3 rounded-xl shadow-2xl border border-slate-700 min-w-[200px] pointer-events-none transition-all duration-200 z-30 ${
                    isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{biz.logoUrl || '🏪'}</span>
                    <div>
                      <h4 className="font-bold text-xs text-white leading-tight">{biz.name}</h4>
                      <p className="text-[10px] text-emerald-400 font-medium">{biz.category}</p>
                    </div>
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-300">
                    <span>Средний чек: <strong>{biz.avgCheck.toLocaleString('ru-RU')} ₸</strong></span>
                    {biz.matchScore && (
                      <span className="text-emerald-400 font-bold">★ {biz.matchScore}%</span>
                    )}
                  </div>
                </div>

                {/* Pin Button - Meets min 48px touch target requirement */}
                <button
                  type="button"
                  onClick={() => onSelectBusiness(biz)}
                  aria-label={`Открыть Паспорт района для ${biz.name}`}
                  className={`min-h-[48px] min-w-[48px] p-1.5 rounded-full flex items-center justify-center transition-all transform hover:scale-115 shadow-xl relative ${
                    biz.isPrimary
                      ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/40 animate-pulse'
                      : 'bg-white text-slate-900 border-2 border-emerald-500 hover:bg-emerald-50'
                  }`}
                >
                  <span className="text-base sm:text-lg select-none">{biz.logoUrl || '📍'}</span>

                  {/* Pulsing ring */}
                  <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-20 group-hover/pin:animate-ping pointer-events-none" />
                </button>

                {/* Business Title Marker Label underneath Pin */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-slate-900/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white whitespace-nowrap shadow-md border border-slate-700/80 pointer-events-none">
                  {biz.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Establishment Directory Grid below Map */}
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-slate-900 flex items-center justify-between">
          <span>Заведения в коалиции ({filteredBusinesses.length})</span>
          <span className="text-xs font-normal text-slate-500">Нажмите для подробного паспорта</span>
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBusinesses.map((biz) => (
            <div
              key={biz.id}
              onClick={() => onSelectBusiness(biz)}
              className="bg-slate-50 hover:bg-emerald-50/50 p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer space-y-3 group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                    {biz.logoUrl || '🏪'}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {biz.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">{biz.category}</p>
                  </div>
                </div>

                {biz.isPrimary ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 whitespace-nowrap">
                    Ваш бизнес
                  </span>
                ) : (
                  biz.matchScore && (
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      {biz.matchScore}%
                    </span>
                  )
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{biz.address}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <span className="text-slate-500">Средний чек:</span>
                  <span className="font-bold text-slate-900">{biz.avgCheck.toLocaleString('ru-RU')} ₸</span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectBusiness(biz);
                }}
                className="w-full min-h-[48px] px-4 py-2 bg-white hover:bg-emerald-600 text-slate-800 hover:text-white font-bold rounded-xl border border-slate-300 hover:border-emerald-600 transition-all text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <Store className="w-4 h-4" />
                <span>Открыть Паспорт заведения</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
