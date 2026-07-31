'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, Send, X, Loader2 } from 'lucide-react';

interface ShareButtonsProps {
  title?: string;
  text?: string;
  url?: string;
  pinCode?: string;
  className?: string;
}

export default function ShareButtons({
  title = 'ЖЕРЛЕС — Паспорт района',
  text = 'Получи бонусы и скидки в заведениях нашего района!',
  url,
  pinCode,
  className = '',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return url || window.location.href;
    }
    return url || 'https://zherles.kz/b2c/passport';
  };

  const currentUrl = getShareUrl();
  const shareText = pinCode ? `${text} (ПИН-код: ${pinCode})` : text;
  const waMessage = `${shareText} ${currentUrl}`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(waMessage)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;

  const handleSendGreenApi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setStatus('error');
      setStatusMessage('Введите номер телефона');
      return;
    }

    setStatus('loading');
    setStatusMessage('');

    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.trim(),
          message: waMessage,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setStatusMessage('Сообщение отправлено ✓');
        setTimeout(() => {
          setShowModal(false);
          setStatus('idle');
          setStatusMessage('');
          setPhone('');
        }, 2500);
      } else {
        setStatus('error');
        setStatusMessage(data.error || 'Ошибка — попробуйте ещё раз');
      }
    } catch (err) {
      console.error('Green API call failed:', err);
      setStatus('error');
      setStatusMessage('Ошибка — попробуйте ещё раз');
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: currentUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Native share error:', err);
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      const copyContent = `${shareText}\n${currentUrl}`;
      await navigator.clipboard.writeText(copyContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* WhatsApp Trigger Button */}
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95"
        title="Поделиться в WhatsApp через Green API"
      >
        <span className="font-bold">WhatsApp</span>
      </button>

      {/* Telegram Button */}
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95"
        title="Поделиться в Telegram"
      >
        <Send className="w-3.5 h-3.5" />
        <span className="font-bold">Telegram</span>
      </a>

      {/* Native Web Share / Copy Link Fallback */}
      <button
        type="button"
        onClick={handleCopyLink}
        className={`inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all active:scale-95 ${
          copied
            ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}
        title="Скопировать ссылку"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ссылка скопирована!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>Скопировать</span>
          </>
        )}
      </button>

      {/* Native Share icon button */}
      {typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          type="button"
          onClick={handleNativeShare}
          className="inline-flex items-center justify-center p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all active:scale-95"
          title="Поделиться через мобильное меню"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      )}

      {/* WhatsApp Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl relative animate-in fade-in zoom-in duration-150">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setStatus('idle');
                setStatusMessage('');
              }}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 p-1 bg-slate-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              Отправить в WhatsApp
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Введите номер телефона получателя для отправки сообщения через Green API.
            </p>

            <form onSubmit={handleSendGreenApi} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Номер телефона
                </label>
                <input
                  type="tel"
                  placeholder="+7 (701) 123-45-67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-slate-900"
                  required
                />
              </div>

              {/* Status Alert Banner */}
              {status === 'success' && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Сообщение отправлено ✓</span>
                </div>
              )}

              {status === 'error' && (
                <div className="p-2.5 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold rounded-xl">
                  {statusMessage || 'Ошибка — попробуйте ещё раз'}
                </div>
              )}

              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-1.5"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Отправка...</span>
                    </>
                  ) : (
                    <span>Отправить</span>
                  )}
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all text-center"
                  title="Открыть прямо в приложении WhatsApp"
                >
                  wa.me
                </a>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
