'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import B2BNav from '@/components/B2BNav';
import {
  SafeChartContainer,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from '@/components/RechartsWrapper';
import {
  Users,
  Gift,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Search,
  Filter,
  Crown,
  Zap,
  Sparkles,
  UserCheck,
  Building2,
  Calendar,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';

export default function B2BDashboardPage() {
  const { state, updateGreenApiSettings } = useApp();
  const { business, partners, clients, coupons, campaigns, greenApiSettings } = state;

  const [clientSearch, setClientSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Green API State
  const [idInstance, setIdInstance] = useState(greenApiSettings?.idInstance || '');
  const [apiTokenInstance, setApiTokenInstance] = useState(greenApiSettings?.apiTokenInstance || '');
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateGreenApiSettings(idInstance, apiTokenInstance);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // KPI Calculations
  const activePartnersCount = useMemo(() => {
    return (partners || []).filter((p) => p.status === 'ACTIVE').length;
  }, [partners]);

  const issuedCouponsCount = useMemo(() => {
    return (coupons || []).length;
  }, [coupons]);

  const redeemedBonusesCount = useMemo(() => {
    return (coupons || []).filter((c) => c.status === 'REDEEMED').length;
  }, [coupons]);

  const conversionRate = useMemo(() => {
    if (!issuedCouponsCount || issuedCouponsCount === 0) return 0;
    return Math.round((redeemedBonusesCount / issuedCouponsCount) * 100);
  }, [issuedCouponsCount, redeemedBonusesCount]);

  const crossMarketingRevenue = useMemo(() => {
    return (clients || []).reduce((sum, client) => sum + (client.totalSpent || 0), 0);
  }, [clients]);

  // Estimated reach sum
  const totalReach = useMemo(() => {
    const baseReach = 1450;
    const campaignCount = (campaigns || []).length;
    return baseReach + campaignCount * 250;
  }, [campaigns]);

  // Chart 1: Conversions & Redeemed Bonuses Timeline Data (Dynamically aggregated)
  const timelineData = useMemo(() => {
    const dayOrder = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const dayIndexToName = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

    const dayMap: Record<string, { day: string; issued: number; redeemed: number; revenue: number }> = {
      'Пн': { day: 'Пн', issued: 0, redeemed: 0, revenue: 0 },
      'Вт': { day: 'Вт', issued: 0, redeemed: 0, revenue: 0 },
      'Ср': { day: 'Ср', issued: 0, redeemed: 0, revenue: 0 },
      'Чт': { day: 'Чт', issued: 0, redeemed: 0, revenue: 0 },
      'Пт': { day: 'Пт', issued: 0, redeemed: 0, revenue: 0 },
      'Сб': { day: 'Сб', issued: 0, redeemed: 0, revenue: 0 },
      'Вс': { day: 'Вс', issued: 0, redeemed: 0, revenue: 0 },
    };

    const getDayName = (dateStr?: string | null): string | null => {
      if (!dateStr) return null;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return null;
      return dayIndexToName[d.getDay()] || null;
    };

    (coupons || []).forEach((coupon, index) => {
      const campaign = (campaigns || []).find((c) => c.id === coupon.campaignId);

      let issuedDay = getDayName(campaign?.createdAt);
      if (!issuedDay && coupon.id?.startsWith('coup-')) {
        const timestamp = Number(coupon.id.replace('coup-', ''));
        if (!isNaN(timestamp) && timestamp > 0) {
          issuedDay = getDayName(new Date(timestamp).toISOString());
        }
      }
      if (!issuedDay && coupon.redeemedAt) {
        issuedDay = getDayName(coupon.redeemedAt);
      }
      if (!issuedDay) {
        issuedDay = dayOrder[index % dayOrder.length];
      }

      if (issuedDay && dayMap[issuedDay]) {
        dayMap[issuedDay].issued += 1;
      }

      if (coupon.status === 'REDEEMED') {
        const redeemedDay = getDayName(coupon.redeemedAt) || issuedDay;
        if (redeemedDay && dayMap[redeemedDay]) {
          dayMap[redeemedDay].redeemed += 1;
        }
      }
    });

    (clients || []).forEach((client) => {
      const visitDay = getDayName(client.lastVisit);
      if (visitDay && dayMap[visitDay]) {
        dayMap[visitDay].revenue += client.totalSpent || 0;
      }
    });

    return dayOrder.map((day) => dayMap[day]);
  }, [coupons, clients, campaigns]);

  // Chart 2: Revenue breakdown by Partner Data
  const partnerRevenueData = useMemo(() => {
    const revenueMap: Record<string, number> = {};

    (clients || []).forEach((c) => {
      const source = c.acquiredFromPartner || 'Прямой визит';
      revenueMap[source] = (revenueMap[source] || 0) + (c.totalSpent || 0);
    });

    // If map is empty or small, populate with default partner data
    if (Object.keys(revenueMap).length === 0) {
      revenueMap['Барбершоп "ManCave"'] = 15000;
      revenueMap['Фитнес-клуб "FitLife"'] = 5000;
    }

    const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899'];

    return Object.entries(revenueMap).map(([name, value], idx) => ({
      name,
      value,
      color: COLORS[idx % COLORS.length],
    }));
  }, [clients]);

  // CRM Clients Filtered
  const filteredClients = useMemo(() => {
    return (clients || []).filter((client) => {
      const q = clientSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        client.name.toLowerCase().includes(q) ||
        client.phone.toLowerCase().includes(q) ||
        client.acquiredFromPartner.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'ALL' || client.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [clients, clientSearch, statusFilter]);

  // Helper function for status badges
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'VIP':
        return (
          <span className="inline-flex items-center space-x-1 bg-purple-100 text-purple-800 border border-purple-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            <Crown className="w-3 h-3 text-purple-600" />
            <span>VIP Клиент</span>
          </span>
        );
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            <Zap className="w-3 h-3 text-emerald-600" />
            <span>Активный</span>
          </span>
        );
      case 'NEW':
        return (
          <span className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 border border-blue-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            <UserCheck className="w-3 h-3 text-blue-600" />
            <span>Новый</span>
          </span>
        );
      case 'CHURNED':
        return (
          <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-600 border border-slate-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            <span>Отток</span>
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-md">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <B2BNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header section */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>{business?.district || 'Алмалинский'} район</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-3">
              <span>{business?.logoUrl || '☕'}</span>
              <span>Дашборд бизнеса: {business?.name || 'Urban Coffee'}</span>
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Аналитика кросс-маркетинга, выданных купонов и CRM база клиентов в реальном времени.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/b2b/campaigns/new"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all"
            >
              + Создать акцию
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid (Max 4 per row) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Total Reach */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold">Общий охват</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">
              {totalReach.toLocaleString('ru-RU')}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">человек/месяц</p>
          </div>

          {/* KPI 2: Active Partners */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold">Партнеры</span>
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{activePartnersCount}</p>
            <p className="text-[11px] text-slate-500 font-medium">активных заведений</p>
          </div>

          {/* KPI 3: Issued Coupons */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold">Выдано купонов</span>
              <Gift className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{issuedCouponsCount}</p>
            <p className="text-[11px] text-slate-500 font-medium">QR-промокодов</p>
          </div>

          {/* KPI 4: Redeemed Bonuses */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold">Погашено бонусов</span>
              <CheckCircle className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{redeemedBonusesCount}</p>
            <p className="text-[11px] text-slate-500 font-medium">активаций в кассе</p>
          </div>

          {/* KPI 5: Conversion Rate */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold">Конверсия %</span>
              <TrendingUp className="w-4 h-4 text-teal-600" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-600">{conversionRate}%</p>
            <p className="text-[11px] text-slate-500 font-medium">из визита в покупку</p>
          </div>

          {/* KPI 6: Cross-Marketing Revenue */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold">Выручка ₸</span>
              <Wallet className="w-4 h-4 text-emerald-700" />
            </div>
            <p className="text-xl font-extrabold text-slate-900 truncate">
              {crossMarketingRevenue.toLocaleString('ru-RU')} ₸
            </p>
            <p className="text-[11px] text-slate-500 font-medium">от кросс-маркетинга</p>
          </div>
        </div>

        {/* Recharts Analytics Section - Single Column Main Layout */}
        <div className="space-y-6">
          {/* Chart 1: Conversions & Redeemed Bonuses timeline */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Динамика купонов и активаций</span>
                </h3>
                <p className="text-xs text-slate-500">Выдача купонов vs Погашения по дням недели</p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                7 дней
              </span>
            </div>

            <SafeChartContainer height={280}>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIssued" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRedeemed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="day" tickLine={false} axisLine={{ stroke: '#CBD5E1' }} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#FFF',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Area
                    type="monotone"
                    dataKey="issued"
                    name="Выдано купонов"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorIssued)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="redeemed"
                    name="Погашено бонусов"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorRedeemed)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </SafeChartContainer>
          </div>

          {/* Chart 2: Revenue breakdown by Partner */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  <span>Структура выручки по Партнерам</span>
                </h3>
                <p className="text-xs text-slate-500">Доход (₸), принесенный клиентами каждого заведения</p>
              </div>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                Партнеры
              </span>
            </div>

            <SafeChartContainer height={280}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={partnerRevenueData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: '#CBD5E1' }} tick={{ fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000}k ₸`} />
                  <Tooltip
                    formatter={(value: number) => [`${value.toLocaleString('ru-RU')} ₸`, 'Выручка']}
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#FFF',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="value" name="Выручка (₸)" radius={[8, 8, 0, 0]}>
                    {partnerRevenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </SafeChartContainer>
          </div>
        </div>

        {/* CRM Client Table Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>CRM Таблица привелических клиентов</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Клиенты, пришедшие из партнерских акциях «Көрші-маршрут».
              </p>
            </div>

            {/* Search and Status Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  placeholder="Поиск по имени или телефону..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                {['ALL', 'NEW', 'ACTIVE', 'VIP', 'CHURNED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      statusFilter === st
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st === 'ALL' ? 'Все' : st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CRM Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Клиент (Имя & Телефон)</th>
                  <th className="px-4 py-3">Источник (Партнер)</th>
                  <th className="px-4 py-3 text-center">Визиты</th>
                  <th className="px-4 py-3 text-right">Истрачено (₸)</th>
                  <th className="px-4 py-3 text-center">Статус</th>
                  <th className="px-4 py-3 text-right">Последний визит</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      Клиенты не найдены.
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-slate-900">
                        <div>{client.name}</div>
                        <div className="text-[11px] font-normal text-slate-500">{client.phone}</div>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-700">
                        <div className="flex items-center space-x-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{client.acquiredFromPartner}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold text-slate-800">
                        {client.visitCount}
                      </td>
                      <td className="px-4 py-3.5 text-right font-extrabold text-emerald-700">
                        {client.totalSpent.toLocaleString('ru-RU')} ₸
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {renderStatusBadge(client.status)}
                      </td>
                      <td className="px-4 py-3.5 text-right text-slate-500 font-medium">
                        {new Date(client.lastVisit).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Green API Settings Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-emerald-600" />
              <span>Настройки интеграции WhatsApp (Green API)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Введите ваши данные из консоли Green API для отправки сообщений.
            </p>
          </div>
          
          <form onSubmit={handleSaveSettings} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ID Instance</label>
              <input
                type="text"
                value={idInstance}
                onChange={(e) => setIdInstance(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="710722698257"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">API Token Instance</label>
              <input
                type="password"
                value={apiTokenInstance}
                onChange={(e) => setApiTokenInstance(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Ваш токен"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all"
              >
                Сохранить настройки
              </button>
              {settingsSaved && (
                <span className="text-sm text-emerald-600 font-bold flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Сохранено!
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
