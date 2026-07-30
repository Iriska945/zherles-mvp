'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { CampaignTemplate } from '@/types';
import B2BNav from '@/components/B2BNav';
import Link from 'next/link';
import {
  Search,
  Tag,
  Sparkles,
  Rocket,
  Edit3,
  TrendingUp,
  Users,
  Gift,
  Filter,
  CheckCircle,
} from 'lucide-react';

export default function CatalogPage() {
  const { state } = useApp();
  const templates = state.templates || [];
  const business = state.business;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [selectedTag, setSelectedTag] = useState<string>('Все');

  // Extract unique categories and tags
  const categories = useMemo(() => {
    const cats = Array.from(new Set(templates.map((t) => t.category).filter(Boolean)));
    return ['Все', ...cats];
  }, [templates]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    templates.forEach((t) => {
      if (Array.isArray(t.tags)) {
        t.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    return ['Все', ...Array.from(tagSet)];
  }, [templates]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        template.title.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query) ||
        template.recommendedFor.toLowerCase().includes(query) ||
        (template.tags && template.tags.some((tag) => tag.toLowerCase().includes(query)));

      // Category match
      const matchesCategory =
        selectedCategory === 'Все' || template.category === selectedCategory;

      // Tag match
      const matchesTag =
        selectedTag === 'Все' || (template.tags && template.tags.includes(selectedTag));

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [templates, searchQuery, selectedCategory, selectedTag]);

  // Helper to determine if template is recommended for current business
  const isRecommended = (template: CampaignTemplate): boolean => {
    if (!business) return false;
    const bizCategory = business.category.toLowerCase();
    const rec = template.recommendedFor.toLowerCase();
    const bizName = business.name.toLowerCase();

    return (
      rec.includes(bizCategory) ||
      rec.includes(bizName) ||
      (bizCategory.includes('кофейня') && (rec.includes('кофейн') || rec.includes('пекарн'))) ||
      (bizCategory.includes('барбершоп') && rec.includes('барбер')) ||
      (bizCategory.includes('фитнес') && rec.includes('фитнес')) ||
      (bizCategory.includes('цветы') && rec.includes('цветочные'))
    );
  };

  return (
    <div className="space-y-6 pb-12">
      <B2BNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Title Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 text-white rounded-2xl p-6 sm:p-8 shadow-md mb-6 relative overflow-hidden">
          <div className="max-w-3xl space-y-2 relative z-10">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Библиотека проверенных механик</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Каталог готовых акций «Көрші»
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Выберите готовую механику кросс-маркетинга с готовым ROI, адаптированную для заведений в районе{' '}
              <strong>{business?.district || 'Алмалинский'}</strong>.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск акций по названию, нише или тегам..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Total Results Count */}
            <div className="text-xs font-semibold text-slate-500 flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span>
                Найдено шаблонов: <strong className="text-slate-900">{filteredTemplates.length}</strong>
              </span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Категории:
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Filter Buttons */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Теги:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedTag === tag
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Tag className="w-3 h-3 opacity-70" />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Template Cards Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Шаблоны не найдены</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Попробуйте сбросить поисковый запрос или выбрать другие фильтры категорий и тегов.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Все');
                setSelectedTag('Все');
              }}
              className="px-4 py-2 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-xl hover:bg-emerald-100 transition-all"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              const recommended = isRecommended(template);

              return (
                <div
                  key={template.id}
                  className={`bg-white rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between relative shadow-sm hover:shadow-md ${
                    recommended
                      ? 'border-emerald-400 ring-2 ring-emerald-500/20 bg-gradient-to-b from-emerald-50/30 to-white'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Row: Category & Recommendation Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                        {template.category}
                      </span>

                      {recommended && (
                        <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>Рекомендовано для вас</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">
                        {template.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-medium">
                        Для кого: <span className="text-slate-700">{template.recommendedFor}</span>
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {template.description}
                    </p>

                    {/* Key Metrics Box */}
                    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 flex items-center space-x-1.5">
                          <Gift className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Награда:</span>
                        </span>
                        <strong className="text-slate-900 font-semibold text-right">
                          {template.defaultReward}
                        </strong>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 flex items-center space-x-1.5">
                          <Users className="w-3.5 h-3.5 text-blue-600" />
                          <span>Ожидаемый охват:</span>
                        </span>
                        <strong className="text-slate-800 font-semibold">
                          {template.expectedReach}
                        </strong>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 flex items-center space-x-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                          <span>Прогноз ROI:</span>
                        </span>
                        <strong className="text-emerald-700 font-bold">
                          {template.expectedRoi}
                        </strong>
                      </div>
                    </div>

                    {/* Tags */}
                    {template.tags && template.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {template.tags.map((t) => (
                          <span
                            key={t}
                            className="bg-slate-100 text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded-md"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center space-x-2">
                    <Link
                      href={`/b2b/campaigns/new?templateId=${template.id}`}
                      className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl text-center shadow-sm transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Rocket className="w-3.5 h-3.5" />
                      <span>Запустить по шаблону</span>
                    </Link>

                    <Link
                      href={`/b2b/admin?editId=${template.id}`}
                      className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center justify-center space-x-1"
                      title="Редактировать шаблон в админке"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Редактировать</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
