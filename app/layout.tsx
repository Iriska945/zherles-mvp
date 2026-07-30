import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'ЖЕРЛЕС — Кросс-маркетинг локального бизнеса',
  description: 'Платформа совместных акций и обмена клиентами для локальных заведений Алматы',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-slate-50 min-h-screen text-slate-900 antialiased flex flex-col">
        <AppProvider>
          <Header />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
            ЖЕРЛЕС MVP © 2026. Платформа локального кросс-маркетинга.
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
