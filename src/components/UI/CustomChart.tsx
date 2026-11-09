import React, { useState } from 'react';

interface BarData {
  label: string;
  value: number;
  color?: string;
  sublabel?: string;
}

interface BarChartProps {
  data: BarData[];
  title?: string;
  height?: number;
  valueSuffix?: string;
}

export const SimpleBarChart: React.FC<BarChartProps> = ({
  data,
  title,
  height = 240,
  valueSuffix = ' KPM',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  const defaultColors = [
    '#2563eb', // blue-600
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#06b6d4', // cyan-500
    '#f97316', // orange-500
    '#6366f1', // indigo-500
  ];

  return (
    <div className="w-full bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
      {title && (
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
          <span className="text-xs text-slate-500">Total: {data.reduce((a, b) => a + b.value, 0)}</span>
        </div>
      )}

      <div style={{ height: `${height}px` }} className="flex items-end gap-3 pt-6 pb-2 px-2">
        {data.map((item, index) => {
          const heightPercent = Math.max((item.value / maxValue) * 100, item.value > 0 ? 8 : 2);
          const barColor = item.color || defaultColors[index % defaultColors.length];
          const isHovered = hoveredIdx === index;

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-10 z-20 bg-slate-900 text-white text-xs py-1 px-2.5 rounded shadow-lg whitespace-nowrap pointer-events-none transition-all">
                  <div className="font-semibold">{item.label}</div>
                  <div className="text-slate-300">
                    {item.value} {valueSuffix}
                  </div>
                </div>
              )}

              {/* Bar Value above bar */}
              <span className={`text-[11px] font-semibold mb-1 transition-colors ${isHovered ? 'text-blue-600' : 'text-slate-600'}`}>
                {item.value}
              </span>

              {/* The Bar */}
              <div
                className="w-full max-w-[48px] rounded-t-md transition-all duration-300 group-hover:opacity-90 group-hover:scale-y-105 origin-bottom"
                style={{
                  height: `${heightPercent}%`,
                  backgroundColor: barColor,
                  boxShadow: isHovered ? `0 4px 12px ${barColor}55` : 'none',
                }}
              />

              {/* Label */}
              <div className="mt-2 text-center w-full">
                <span
                  className="block text-[11px] font-medium text-slate-700 truncate max-w-full"
                  title={item.label}
                >
                  {item.label}
                </span>
                {item.sublabel && (
                  <span className="block text-[10px] text-slate-400 truncate">{item.sublabel}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const SimpleDonutChart: React.FC<{
  data: { label: string; value: number; color?: string }[];
  title?: string;
  centerText?: string;
  centerSubtext?: string;
}> = ({ data, title, centerText, centerSubtext }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  let cumulativeAngle = 0;
  const slices = data.map((item, idx) => {
    const angle = (item.value / total) * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;
    return {
      ...item,
      color: item.color || defaultColors[idx % defaultColors.length],
      startAngle,
      angle,
      percent: Math.round((item.value / total) * 100),
    };
  });

  return (
    <div className="w-full bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
      {title && (
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
          <span className="text-xs text-slate-500">Total: {total}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-2">
        {/* SVG Donut */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
            {slices.map((slice, i) => {
              const strokeDasharray = `${(slice.angle / 360) * 251.2} 251.2`;
              const strokeDashoffset = -((slice.startAngle / 360) * 251.2);
              return (
                <circle
                  key={i}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth="16"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 hover:opacity-85"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-lg font-bold text-slate-800">{centerText || total}</span>
            <span className="text-[10px] text-slate-500">{centerSubtext || 'Total KPM'}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 min-w-[140px]">
          {slices.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-700 font-medium truncate max-w-[110px]">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                <span>{item.value}</span>
                <span className="text-[10px] text-slate-400 font-normal">({item.percent}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

