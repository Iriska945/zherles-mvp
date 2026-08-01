'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import B2BNav from '@/components/B2BNav';
import { Settings, Building2, MapPin, Tag, Image as ImageIcon, CheckCircle, Zap } from 'lucide-react';

export default function B2BSettingsPage() {
  const { state, updateBusiness, updateGreenApiSettings } = useApp();
  const { business, greenApiSettings } = state;

  // Profile State
  const [name, setName] = useState(business?.name || '');
  const [district, setDistrict] = useState(business?.district || '');
  const [category, setCategory] = useState(business?.category || '');
  const [logoUrl, setLogoUrl] = useState(business?.logoUrl || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Green API State
  const [idInstance, setIdInstance] = useState(greenApiSettings?.idInstance || '');
  const [apiTokenInstance, setApiTokenInstance] = useState(greenApiSettings?.apiTokenInstance || '');
  const [greenApiSaved, setGreenApiSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (business) {
      updateBusiness({
        ...business,
        name,
        district,
        category,
        logoUrl,
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    }
  };

  const handleSaveGreenApi = (e: React.FormEvent) => {
    e.preventDefault();
    updateGreenApiSettings(idInstance, apiTokenInstance);
    setGreenApiSaved(true);
    setTimeout(() => setGreenApiSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      <B2BNav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Личный кабинет
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Настройки вашего профиля и интеграций
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span>Профиль бизнеса</span>
              </h2>
            </div>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Название заведения</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span>Категория</span>
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Район</span>
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Логотип (Emoji или URL)</span>
                </label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all"
                >
                  Сохранить профиль
                </button>
                {profileSaved && (
                  <span className="text-sm text-emerald-600 font-bold flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Сохранено!
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Green API Settings */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-emerald-600" />
                <span>Интеграция WhatsApp</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Данные Green API для отправки сообщений клиентам.
              </p>
            </div>
            
            <form onSubmit={handleSaveGreenApi} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ID Instance</label>
                <input
                  type="text"
                  value={idInstance}
                  onChange={(e) => setIdInstance(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                  placeholder="710722698257"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">API Token Instance</label>
                <input
                  type="password"
                  value={apiTokenInstance}
                  onChange={(e) => setApiTokenInstance(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                  placeholder="Ваш токен"
                  required
                />
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all"
                >
                  Сохранить настройки
                </button>
                {greenApiSaved && (
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
    </div>
  );
}
