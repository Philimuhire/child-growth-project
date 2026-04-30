// Panel showing the risk level with color and description

import type { RiskLevel } from '../../types';

interface Props {
  riskLevel: RiskLevel;
}

// Color, label, and description for each risk level
const riskConfig: Record<RiskLevel, { color: string; bg: string; label: string; description: string }> = {
  low: {
    color: 'text-green-700',
    bg: 'bg-green-100',
    label: 'Low Risk',
    description: 'Child is growing well. Continue regular monitoring.',
  },
  moderate: {
    color: 'text-yellow-700',
    bg: 'bg-yellow-100',
    label: 'Moderate Risk',
    description: 'Some nutritional concerns detected. Follow dietary recommendations.',
  },
  high: {
    color: 'text-orange-700',
    bg: 'bg-orange-100',
    label: 'High Risk',
    description: 'Significant nutritional concern. Seek guidance from a health worker.',
  },
  critical: {
    color: 'text-red-700',
    bg: 'bg-red-100',
    label: 'Critical Risk',
    description: 'Urgent attention needed. Visit a health facility immediately.',
  },
};

export default function RiskIndicator({ riskLevel }: Props) {
  const config = riskConfig[riskLevel];

  return (
    <div className={`rounded-xl ${config.bg} p-5`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-3 h-3 rounded-full ${
          riskLevel === 'low' ? 'bg-green-500' :
          riskLevel === 'moderate' ? 'bg-yellow-500' :
          riskLevel === 'high' ? 'bg-orange-500' :
          'bg-red-500 animate-pulse'
        }`} />
        <span className={`text-lg font-bold ${config.color}`}>{config.label}</span>
      </div>
      <p className="text-sm text-slate-600">{config.description}</p>
    </div>
  );
}
