// Display the 4 WHO Z-scores with bars and interpretations

import type { ZScoreResult } from '../../types';

interface Props {
  zScores: ZScoreResult;
}

// Short and full labels for each Z-score
const zScoreLabels: Record<string, { label: string; full: string }> = {
  waz: { label: 'WAZ', full: 'Weight-for-Age' },
  haz: { label: 'HAZ', full: 'Height-for-Age' },
  whz: { label: 'WHZ', full: 'Weight-for-Height' },
  baz: { label: 'BAZ', full: 'BMI-for-Age' },
};

// Pick a color based on the Z-score value
function getZScoreColor(value: number): string {
  if (value < -3) return 'text-red-600';
  if (value < -2) return 'text-orange-600';
  if (value > 3) return 'text-red-600';
  if (value > 2) return 'text-purple-600';
  return 'text-green-600';
}

// Map a Z-score [-6, +6] to a 0-100 bar position percentage
function getBarPosition(value: number): number {
  const clamped = Math.max(-6, Math.min(6, value));
  return ((clamped + 6) / 12) * 100;
}

export default function ZScoreDisplay({ zScores }: Props) {
  const entries = ['waz', 'haz', 'whz', 'baz'] as const;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Z-Score Results</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {entries.map((key) => {
          const value = zScores[key];
          const info = zScoreLabels[key];
          const interpretation = zScores.interpretations[key];

          return (
            <div key={key} className="border border-slate-100 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase">
                    {info.label}
                  </span>
                  <p className="text-xs text-slate-500">{info.full}</p>
                </div>
                <span className={`text-2xl font-bold ${getZScoreColor(value)}`}>
                  {value > 0 ? '+' : ''}{value.toFixed(2)}
                </span>
              </div>

              {/* Z-score bar with colored zones and a marker dot */}
              <div className="relative h-2 bg-slate-100 rounded-full mt-3 mb-2">
                <div className="absolute left-0 h-full w-1/6 bg-red-100 rounded-l-full" />
                <div className="absolute left-[16.67%] h-full w-[8.33%] bg-orange-100" />
                <div className="absolute right-0 h-full w-1/6 bg-purple-100 rounded-r-full" />
                <div className="absolute right-[16.67%] h-full w-[8.33%] bg-purple-50" />
                <div className="absolute left-1/4 h-full w-1/2 bg-green-100" />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-800 rounded-full border-2 border-white shadow transition-all"
                  style={{ left: `${getBarPosition(value)}%`, transform: 'translate(-50%, -50%)' }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-6</span>
                <span>-2</span>
                <span>0</span>
                <span>+2</span>
                <span>+6</span>
              </div>

              <p className="text-xs text-slate-600 mt-2">{interpretation}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
