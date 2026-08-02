import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
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
    <html>
      <body className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 antialiased flex flex-col transition-colors duration-205">
        <AuthProvider>
          <AppProvider>
            <ThemeProvider>
              <LanguageProvider>
                <Header />
                <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
                  {children}
                </main>
                <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors duration-205">
                  ЖЕРЛЕС MVP © 2026. Платформа локального кросс-маркетинга.
                </footer>
              </LanguageProvider>
            </ThemeProvider>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

