'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useApp } from '@/context/AppContext';
import { CampaignTemplate } from '@/types';
import B2BNav from '@/components/B2BNav';
import { useSearchParams } from 'next/navigation';
import {
  Plus,
  Trash2,
  Edit,
  Search,
  Settings,
  X,
  CheckCircle,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';

function AdminContent() {
  const { state, addTemplate, deleteTemplate, updateTemplate } = useApp();
  const templates = state.templates || [];
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CampaignTemplate | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'Кросс-промо',
    description: '',
    recommendedFor: '',
    defaultReward: '',
    expectedReach: '',
    expectedRoi: '',
    tagsInput: '',
  });

  // Check if editId is in search params
  useEffect(() => {
    const editId = searchParams.get('editId');
    if (editId) {
      const target = templates.find((t) => t.id === editId);
      if (target) {
        handleOpenEditModal(target);
      }
    }
  }, [searchParams, templates]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenCreateModal = () => {
    setEditingTemplate(null);
    setFormData({
      title: '',
      category: 'Кросс-промо',
      description: '',
      recommendedFor: '',
      defaultReward: '',
      expectedReach: '500+ клиентов/мес',
      expectedRoi: '+30% повторных визитов',
      tagsInput: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (template: CampaignTemplate) => {
    setEditingTemplate(template);
    setFormData({
      title: template.title,
      category: template.category,
      description: template.description,
      recommendedFor: template.recommendedFor,
      defaultReward: template.defaultReward,
      expectedReach: template.expectedReach,
      expectedRoi: template.expectedRoi,
      tagsInput: template.tags ? template.tags.join(', ') : '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTemplate(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tagsArray = formData.tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (editingTemplate) {
      // Update existing template
      const updated: CampaignTemplate = {
        ...editingTemplate,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        recommendedFor: formData.recommendedFor,
        defaultReward: formData.defaultReward,
        expectedReach: formData.expectedReach,
        expectedRoi: formData.expectedRoi,
        tags: tagsArray,
      };
      updateTemplate(updated);
      showToast('success', `Шаблон «${updated.title}» успешно обновлен`);
    } else {
      // Create new template
      const newTemplate: CampaignTemplate = {
        id: `tmpl-${Date.now()}`,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        recommendedFor: formData.recommendedFor,
        defaultReward: formData.defaultReward,
        expectedReach: formData.expectedReach,
        expectedRoi: formData.expectedRoi,
        tags: tagsArray.length > 0 ? tagsArray : ['Новое'],
      };
      addTemplate(newTemplate);
      showToast('success', `Новый шаблон «${newTemplate.title}» добавлен в базу`);
    }

    handleCloseModal();
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Вы уверены, что хотите удалить шаблон «${title}»?`)) {
      deleteTemplate(id);
      showToast('success', `Шаблон «${title}» удален`);
    }
  };

  // Filter templates for table
  const filteredTemplates = templates.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.recommendedFor.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      <B2BNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toast Notification */}
        {notification && (
          <div
            className={`p-4 rounded-xl shadow-md border flex items-center space-x-3 mb-6 transition-all ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            <span className="text-sm font-semibold">{notification.message}</span>
          </div>
        )}

        {/* Header section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
              <Settings className="w-3.5 h-3.5 text-slate-600" />
              <span>Панель администрирования</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Управление шаблонами акций (CRUD)
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Создавайте, редактируйте и удаляйте шаблоны механик. Изменения автоматически сохраняются в LocalStorage.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleOpenCreateModal}
              className="px-4 h-12 min-h-[48px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить новый шаблон</span>
            </button>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию или нише..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="text-xs font-medium text-slate-500 flex items-center space-x-2">
            <span>Всего шаблонов: <strong className="text-slate-900">{templates.length}</strong></span>
          </div>
        </div>

        {/* Admin CRUD Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Название шаблона</th>
                  <th className="px-4 py-3.5">Категория</th>
                  <th className="px-4 py-3.5">Рекомендовано для</th>
                  <th className="px-4 py-3.5">Награда по умолчанию</th>
                  <th className="px-4 py-3.5">Охват & ROI</th>
                  <th className="px-4 py-3.5">Теги</th>
                  <th className="px-6 py-3.5 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTemplates.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-400 text-sm">
                      Шаблоны не найдены.
                    </td>
                  </tr>
                ) : (
                  filteredTemplates.map((template) => (
                    <tr key={template.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white max-w-xs">
                        <div>{template.title}</div>
                        <div className="text-[11px] font-normal text-slate-500 line-clamp-1 mt-0.5">
                          {template.description}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md font-semibold text-[11px]">
                          {template.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-700 max-w-xs">
                        {template.recommendedFor}
                      </td>
                      <td className="px-4 py-4 font-semibold text-emerald-700">
                        {template.defaultReward}
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-600">
                        <div>{template.expectedReach}</div>
                        <div className="text-purple-600 font-semibold">{template.expectedRoi}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {template.tags &&
                            template.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]"
                              >
                                #{tag}
                              </span>
                            ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(template)}
                            className="p-2 h-12 min-h-[48px] min-w-[48px] text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors inline-flex items-center justify-center"
                            title="Редактировать"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(template.id, template.title)}
                            className="p-2 h-12 min-h-[48px] min-w-[48px] text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors inline-flex items-center justify-center"
                            title="Удалить"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}


              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Create / Edit Template */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4 mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <span>{editingTemplate ? 'Редактировать шаблон' : 'Создать новый шаблон акции'}</span>
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Название шаблона <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Например: Утренний кофе + Скидка на стрижку"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Категория <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Кросс-промо">Кросс-промо</option>
                    <option value="Здоровье">Здоровье</option>
                    <option value="Праздники">Праздники</option>
                    <option value="Лояльность">Лояльность</option>
                    <option value="Красота">Красота</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Рекомендовано для ниш <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.recommendedFor}
                    onChange={(e) => setFormData({ ...formData, recommendedFor: e.target.value })}
                    placeholder="Кофейни, Барбершопы"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Описание механики <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Опишите, как работает акция и какую выгоду получает клиент..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Награда по умолчанию <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.defaultReward}
                  onChange={(e) => setFormData({ ...formData, defaultReward: e.target.value })}
                  placeholder="Скидка 20% + Бесплатный кофе"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ожидаемый охват
                  </label>
                  <input
                    type="text"
                    value={formData.expectedReach}
                    onChange={(e) => setFormData({ ...formData, expectedReach: e.target.value })}
                    placeholder="500+ клиентов/мес"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Прогноз ROI
                  </label>
                  <input
                    type="text"
                    value={formData.expectedRoi}
                    onChange={(e) => setFormData({ ...formData, expectedRoi: e.target.value })}
                    placeholder="+35% повторных визитов"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Теги (через запятую)
                </label>
                <input
                  type="text"
                  value={formData.tagsInput}
                  onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
                  placeholder="Кофе, Стрижка, Район"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  {editingTemplate ? 'Сохранить изменения' : 'Создать шаблон'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-12 text-center text-slate-500 font-medium animate-pulse">
          Загрузка панели администрирования...
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
