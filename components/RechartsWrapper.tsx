'use client';

import React, { useEffect, useState } from 'react';
import {
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
} from 'recharts';

export {
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
};

interface SafeChartContainerProps {
  children: React.ReactNode;
  height?: number | string;
  className?: string;
  loadingText?: string;
}

/**
 * SafeChartContainer guards Recharts rendering against SSR hydration mismatches in Next.js App Router.
 * Renders a clean loading skeleton on server render and initial hydration, then renders the chart on client mount.
 */
export function SafeChartContainer({
  children,
  height = 300,
  className = '',
  loadingText = 'Загрузка диаграммы...',
}: SafeChartContainerProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
        className={`w-full flex items-center justify-center bg-slate-50/80 border border-slate-100 rounded-xl text-slate-400 text-sm font-medium animate-pulse ${className}`}
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>{loadingText}</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default SafeChartContainer;
