import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  label?: string;
}

export default function ProgressBar({ value, max, color = '#fb923c', label }: ProgressBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <span style={{ fontFamily: "'Heebo', 'Assistant', sans-serif" }}>{label}</span>
          <span style={{ fontFamily: "'Heebo', 'Assistant', sans-serif" }}>{value}/{max}</span>
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: '5px', background: 'rgba(255,255,255,0.07)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: pct > 0 ? `0 0 8px ${color}55` : 'none',
          }}
        />
      </div>
    </div>
  );
}
