'use client';

import React, { useState, useRef } from 'react';
import { Download, Printer, Copy, Check, QrCode, ExternalLink } from 'lucide-react';

export interface QRGeneratorProps {
  value: string;
  size?: number;
  title?: string;
  subtitle?: string;
  className?: string;
  showActions?: boolean;
}

export default function QRGenerator({
  value,
  size = 220,
  title,
  subtitle,
  className = '',
  showActions = true,
}: QRGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // QR Server API fallback URL
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    value
  )}&margin=10`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownloadPNG = async () => {
    setIsDownloading(true);
    try {
      // Fetch image blob or draw to canvas for clean PNG download
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `zherles-qr-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error, fallback to direct download link', error);
      const link = document.createElement('a');
      link.href = qrImageUrl;
      link.target = '_blank';
      link.download = 'zherles-qr-code.png';
      link.click();
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=600,height=700');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Печать QR-кода — ЖЕРЛЕС</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
              text-align: center;
              background-color: #ffffff;
            }
            .qr-card {
              border: 2px solid #10b981;
              border-radius: 20px;
              padding: 30px;
              max-width: 380px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            }
            .brand {
              font-size: 24px;
              font-weight: 800;
              color: #065f46;
              margin-bottom: 4px;
              letter-spacing: 1px;
            }
            .sub {
              font-size: 14px;
              color: #4b5563;
              margin-bottom: 20px;
            }
            img {
              width: 240px;
              height: 240px;
              margin: 0 auto;
              display: block;
              border-radius: 8px;
            }
            .instruction {
              margin-top: 20px;
              font-size: 13px;
              font-weight: 600;
              color: #059669;
              background: #ecfdf5;
              padding: 10px 16px;
              border-radius: 12px;
            }
            .url {
              margin-top: 12px;
              font-size: 11px;
              color: #6b7280;
              word-break: break-all;
            }
          </style>
        </head>
        <body>
          <div class="qr-card">
            <div class="brand">ЖЕРЛЕС</div>
            <div class="sub">${title || 'Көрші-маршрут Акция'}</div>
            <img src="${qrImageUrl}" alt="QR Code" />
            <div class="instruction">Отсканируйте камерой смартфона</div>
            <div class="url">${value}</div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div
      ref={printRef}
      className={`bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center text-center shadow-sm ${className}`}
    >
      {title && (
        <h4 className="text-base font-extrabold text-slate-900 mb-1 flex items-center justify-center space-x-1.5">
          <QrCode className="w-4 h-4 text-emerald-600" />
          <span>{title}</span>
        </h4>
      )}

      {subtitle && <p className="text-xs text-slate-500 mb-4 max-w-xs">{subtitle}</p>}

      {/* QR Code Container */}
      <div className="relative group bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner flex items-center justify-center my-2">
        {/* Render clean QR Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrImageUrl}
          alt={`QR Code: ${value}`}
          width={size}
          height={size}
          className="rounded-xl object-contain transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
        />

        {/* Center branding badge overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-emerald-600/90 text-white font-extrabold text-[10px] px-2 py-1 rounded-md backdrop-blur-sm shadow">
            ЖЕРЛЕС
          </span>
        </div>
      </div>

      <div className="text-[11px] font-mono text-slate-400 mt-1 mb-4 truncate max-w-full px-2">
        {value}
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="w-full grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleDownloadPNG}
            disabled={isDownloading}
            className="inline-flex items-center justify-center space-x-1 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-all disabled:opacity-50"
            title="Скачать QR-код в формате PNG"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Загрузка...' : 'PNG'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center space-x-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
            title="Распечатать флаер с QR-кодом"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Печать</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className={`inline-flex items-center justify-center space-x-1 px-3 py-2 text-xs font-bold rounded-xl transition-all ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Скопировать ссылку на акцию"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Скопировано</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Ссылка</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
