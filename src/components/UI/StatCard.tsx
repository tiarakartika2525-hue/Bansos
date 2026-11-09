import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  colorScheme?: 'blue' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'purple';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  colorScheme = 'blue',
  onClick,
}) => {
  const schemeClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'hover:border-blue-300',
      iconBg: 'bg-blue-600 text-white',
      accent: 'from-blue-600 to-blue-700',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'hover:border-emerald-300',
      iconBg: 'bg-emerald-600 text-white',
      accent: 'from-emerald-600 to-emerald-700',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'hover:border-amber-300',
      iconBg: 'bg-amber-500 text-white',
      accent: 'from-amber-500 to-amber-600',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'hover:border-rose-300',
      iconBg: 'bg-rose-600 text-white',
      accent: 'from-rose-600 to-rose-700',
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'hover:border-indigo-300',
      iconBg: 'bg-indigo-600 text-white',
      accent: 'from-indigo-600 to-indigo-700',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'hover:border-purple-300',
      iconBg: 'bg-purple-600 text-white',
      accent: 'from-purple-600 to-purple-700',
    },
  }[colorScheme];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md ' + schemeClasses.border : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl shadow-sm ${schemeClasses.iconBg}`}>{icon}</div>
      </div>
    </div>
  );
};

