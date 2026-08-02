'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  UserCheck,
  LogOut,
  Award,
  Gift,
  History,
  QrCode,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Lock,
  Phone,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';

export default function PersonalCabinetPage() {
  const { user, cabinetData, isAuthenticated, isLoading, login, register, logout } = useAuth();

  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Register form state
  const [regPhone, setRegPhone] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmittingLogin(true);

    const res = await login(loginPhone, loginPassword);
    setIsSubmittingLogin(false);

    if (!res.success) {
      setLoginError(res.error || 'Ошибка при входе');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setIsSubmittingReg(true);

    const res = await register({
      phone: regPhone,
      name: regName,
      email: regEmail,
      password: regPassword,
    });
    setIsSubmittingReg(false);

    if (!res.success) {
      setRegError(res.error || 'Ошибка при регистрации');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full mb-4" />
        <p className="text-sm text-slate-500 font-medium">Загрузка данных личного кабинета...</p>
      </div>
    );
  }

  // --- UNAUTHENTICATED GUEST VIEW ---
  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto py-6 px-4 font-sans">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white text-center relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <UserCheck className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-black tracking-tight mb-1">
              Личный кабинет Көрші
            </h1>
            <p className="text-xs text-emerald-100 max-w-xs mx-auto leading-relaxed">
              Накапливайте бонусы, поднимайте уровень и получайте повышенную скидку в заведениях Алматы
            </p>
          </div>

          {/* Auth Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1.5">
            <button
              type="button"
              onClick={() => {
                setAuthTab('login');
                setLoginError('');
              }}
              className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition-all ${
                authTab === 'login'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Вход
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthTab('register');
                setRegError('');
              }}
              className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition-all ${
                authTab === 'register'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Регистрация
            </button>
          </div>

          {/* TAB 1: LOGIN FORM */}
          {authTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Телефон или Email
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="phone"
                    required
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="+7 (701) 000-00-00"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Пароль
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingLogin}
                className="w-full h-12 min-h-[48px] bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50"
              >
                {isSubmittingLogin ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Войти</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER FORM */}
          {authTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4">
              {regError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                  <span>{regError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Номер телефона *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="phone"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+7 (701) 123-45-67"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ваше имя *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Арман Батыр"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email (необязательно)
                </label>
                <input
                  type="email"
                  name="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="arman@example.kz"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Пароль *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Придумайте пароль"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start space-x-2 text-[11px] text-amber-800">
                <Gift className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <span>При регистрации на ваш счет автоматически зачисляется <strong>+200 баллов</strong> в качестве приветственного бонуса!</span>
              </div>

              <button
                type="submit"
                disabled={isSubmittingReg}
                className="w-full h-12 min-h-[48px] bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50"
              >
                {isSubmittingReg ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Создать аккаунт</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // --- LOGGED-IN AUTHENTICATED USER CABINET VIEW ---
  const tierInfo = cabinetData?.tierInfo || {
    currentTier: user.tier || 'Сосед-Новичок',
    nextTier: 'Активный Көрші',
    pointsToNextTier: 300,
    progressPercentage: 40,
    discountRate: user.discountRate || 5,
  };

  const bonusBalance = cabinetData?.bonusBalance ?? user.bonusBalance ?? 200;
  const activeCoupons = cabinetData?.activeCoupons || [];
  const transactions = cabinetData?.recentTransactions || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans py-4 px-2 sm:px-4">
      {/* 1. Header Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md flex-shrink-0">
            {user.name ? user.name.charAt(0).toUpperCase() : 'К'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-slate-900">{user.name}</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {tierInfo.currentTier}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{user.phone}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="h-11 min-h-[44px] px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 self-start md:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Выйти</span>
        </button>
      </div>

      {/* 2. Tier Progress & Bonus Counter Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tier Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  Уровень лояльности
                </span>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-black rounded-xl border border-emerald-500/30">
                Скидка {tierInfo.discountRate}%
              </span>
            </div>

            <div className="text-2xl font-black text-white mb-1">
              {tierInfo.currentTier}
            </div>

            {tierInfo.nextTier ? (
              <p className="text-xs text-slate-400">
                До уровня <strong className="text-emerald-300">{tierInfo.nextTier}</strong> осталось{' '}
                <strong className="text-white">{tierInfo.pointsToNextTier}</strong> баллов
              </p>
            ) : (
              <p className="text-xs text-emerald-400 font-bold">
                Максимальный статус района достигнут! 🎉
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-6 space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-slate-400">
              <span>Прогресс</span>
              <span>{tierInfo.progressPercentage}%</span>
            </div>
            <div className="w-full bg-slate-700/60 rounded-full h-3 p-0.5 border border-slate-600/40 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${tierInfo.progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bonus Balance Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              <Gift className="w-4 h-4 text-amber-500" />
              <span>Баланс бонусов</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-black text-slate-900">{bonusBalance}</span>
              <span className="text-sm font-bold text-slate-500">баллов</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              1 балл = 1 ₸ при гашении купонов в партнерах района
            </p>
          </div>

          <Link
            href="/b2c/redeem"
            className="w-full h-12 min-h-[48px] bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 active:scale-98"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Погасить новый купон (+500 баллов)</span>
          </Link>
        </div>
      </div>

      {/* 3. Active Coupons Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <QrCode className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-extrabold text-slate-900">
              Ваши активные купоны
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {activeCoupons.length} купона(ов)
          </span>
        </div>

        {activeCoupons.length === 0 ? (
          <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Gift className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">
              У вас пока нет активных купонов. Перейдите в Паспорт района для получения скидок!
            </p>
            <Link
              href="/b2c/passport"
              className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-600 hover:underline mt-2"
            >
              <span>Открыть Паспорт района</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-emerald-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {coupon.partnerName}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md">
                      АКТИВЕН
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900">
                    {coupon.rewardText}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <div className="text-xs">
                    <span className="text-slate-400">PIN: </span>
                    <strong className="font-mono text-slate-900 bg-white px-2 py-1 rounded-md border border-slate-200">
                      {coupon.pinCode}
                    </strong>
                  </div>
                  <Link
                    href={`/b2c/redeem?pin=${coupon.pinCode}`}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                  >
                    Погасить
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Transaction History */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <History className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-extrabold text-slate-900">
            История операций и бонусов
          </h2>
        </div>

        {transactions.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            История начислений пока пуста
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">{tx.description}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {new Date(tx.createdAt).toLocaleString('ru-RU')}
                  </div>
                </div>
                <div
                  className={`text-sm font-black ${
                    tx.amount >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {tx.amount >= 0 ? `+${tx.amount}` : tx.amount} б.
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
