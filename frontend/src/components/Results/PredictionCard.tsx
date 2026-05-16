// Card showing the predicted nutritional status and confidence

import type { NutritionalStatus } from '../../types';

interface Props {
  predictedClass: NutritionalStatus;
  confidence: number;
}

// Color and label for each nutritional status
const statusConfig: Record<NutritionalStatus, { color: string; bg: string; border: string; label: string }> = {
  normal: { color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', label: 'Normal' },
  stunted: { color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', label: 'Stunted' },
  wasted: { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', label: 'Wasted' },
  underweight: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Underweight' },
  overweight: { color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', label: 'Overweight' },
};

export default function PredictionCard({ predictedClass, confidence }: Props) {
  // Get config for the predicted class (default to normal if unknown)
  const config = statusConfig[predictedClass] || statusConfig.normal;
  const percent = Math.round(confidence * 100);

  return (
    <div className={`rounded-xl border-2 ${config.border} ${config.bg} p-4 sm:p-6`}>
      <h3 className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Predicted Status
      </h3>
      <p className={`text-2xl sm:text-3xl font-bold ${config.color} mb-2`}>{config.label}</p>
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-600">Confidence</span>
          <span className={`font-semibold ${config.color}`}>{percent}%</span>
        </div>
        <div className="w-full bg-white rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              predictedClass === 'normal' ? 'bg-green-500' :
              predictedClass === 'wasted' ? 'bg-red-500' :
              predictedClass === 'underweight' ? 'bg-amber-500' :
              predictedClass === 'stunted' ? 'bg-orange-500' :
              'bg-purple-500'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
