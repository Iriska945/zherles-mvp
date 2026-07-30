'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, Send } from 'lucide-react';

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

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return url || window.location.href;
    }
    return url || 'https://zherles.kz/b2c/passport';
  };

  const currentUrl = getShareUrl();
  const shareText = pinCode ? `${text} (ПИН-код: ${pinCode})` : text;

  // WhatsApp link: https://wa.me/?text=...
  const waMessage = `${shareText} ${currentUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(waMessage)}`;

  // Telegram link: https://t.me/share/url?url=...&text=...
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;

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
      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95"
        title="Поделиться в WhatsApp"
      >
        <span className="font-bold">WhatsApp</span>
      </a>

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

      {/* Native Web Share / Copy Fallback */}
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

      {/* Native Share icon button if supported */}
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
    </div>
  );
}
