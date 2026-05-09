// Line chart showing all 4 Z-scores with WHO threshold reference lines

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { ZScoreResult } from '../../types';

interface Props {
  zScores: ZScoreResult;
}

export default function GrowthChart({ zScores }: Props) {
  // Z-score data points
  const data = [
    { name: 'WAZ', value: zScores.waz, label: 'Weight-for-Age' },
    { name: 'HAZ', value: zScores.haz, label: 'Height-for-Age' },
    { name: 'WHZ', value: zScores.whz, label: 'Weight-for-Height' },
    { name: 'BAZ', value: zScores.baz, label: 'BMI-for-Age' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Growth Z-Score Overview</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[-4, 4]} />
          <Tooltip
            formatter={(value) => Number(value).toFixed(2)}
            labelFormatter={(label) => {
              const item = data.find((d) => d.name === String(label));
              return item ? item.label : String(label);
            }}
          />
          <Legend />
          {/* WHO threshold reference lines */}
          <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="5 5" label="Median" />
          <ReferenceLine y={-2} stroke="#f97316" strokeDasharray="3 3" label="-2 SD" />
          <ReferenceLine y={-3} stroke="#ef4444" strokeDasharray="3 3" label="-3 SD" />
          <ReferenceLine y={2} stroke="#a855f7" strokeDasharray="3 3" label="+2 SD" />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#059669"
            strokeWidth={3}
            dot={{ r: 6, fill: '#059669', strokeWidth: 2, stroke: '#fff' }}
            name="Z-Score"
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate-500 mt-2 text-center">
        Values between -2 and +2 SD are within the normal range (WHO standards)
      </p>
    </div>
  );
}
