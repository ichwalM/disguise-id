'use client';

import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
  bgColor?: string;
}

export default function StatCard({
  icon,
  label,
  value,
  trend,
  bgColor = 'from-emerald-500/10 to-cyan-500/10',
}: StatCardProps) {
  return (
    <div
      className={`bg-gradient-to-br ${bgColor} border border-emerald-500/20 rounded-lg p-6 hover:border-emerald-500/40 transition-all group hover:shadow-lg hover:shadow-emerald-500/10`}
    >
      {/* Icon */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
          {icon}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-semibold ${
              trend.direction === 'up' ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {trend.direction === 'up' ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <span>{trend.percentage}%</span>
          </div>
        )}
      </div>

      {/* Content */}
      <p className="text-zinc-400 text-sm mb-2">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>

      {/* Decorative line */}
      <div className="mt-4 h-1 bg-gradient-to-r from-emerald-500/50 to-cyan-500/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
