// Horizontal bar chart showing probability of each class

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';

interface Props {
  probabilities: Record<string, number>;
  predictedClass: string;
}

// Color for each class
const classColors: Record<string, string> = {
  normal: '#16a34a',
  stunted: '#ea580c',
  wasted: '#dc2626',
  underweight: '#d97706',
  overweight: '#9333ea',
};

export default function ConfidenceChart({ probabilities, predictedClass }: Props) {
  // Build chart data with capitalized labels and percent values
  const data = Object.entries(probabilities).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: Math.round(value * 100),
    key: name,
  }));

  // Sort highest to lowest
  data.sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Classification Probabilities</h3>
      <ResponsiveContainer width="100%" height={220} minHeight={200}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => `${value}%`} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {/* One Cell per bar with the class color */}
            {data.map((entry) => (
              <Cell
                key={entry.key}
                fill={classColors[entry.key] || '#94a3b8'}
                opacity={entry.key === predictedClass ? 1 : 0.4}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
