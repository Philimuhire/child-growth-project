// Renders the full nutrition recommendations tab

import type { RecommendationResponse } from '../../types';
import FoodCard from './FoodCard';

interface Props {
  recommendations: RecommendationResponse;
}

// Format a nutrient code for display (e.g. "vitamin_a" -> "Vitamin A")
function formatNutrient(s: string): string {
  return s
    .split('_')
    .map((part) =>
      part.length <= 2
        ? part.toUpperCase()
        : part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join(' ');
}

// Display config for each meal slot: label, suggested time, badge letter, and color
const mealConfig: Record<string, { label: string; time: string; initial: string; color: string }> = {
  breakfast:   { label: 'Breakfast',          time: '7 - 8 AM',   initial: 'B', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  mid_morning: { label: 'Mid-Morning Snack',  time: '10 AM',      initial: 'M', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  lunch:       { label: 'Lunch',              time: '12 - 1 PM',  initial: 'L', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  afternoon:   { label: 'Afternoon Snack',    time: '3 - 4 PM',   initial: 'A', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  dinner:      { label: 'Dinner',             time: '6 - 7 PM',   initial: 'D', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
};

export default function NutritionPlan({ recommendations }: Props) {
  return (
    <div className="space-y-6">
      {/* Key health messages */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Health Messages</h3>
        <div className="space-y-3">
          {recommendations.key_messages.map((message, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg text-sm ${
                message.startsWith('URGENT')
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-blue-50 text-blue-800 border border-blue-100'
              }`}
            >
              {message}
            </div>
          ))}
        </div>
      </div>

      {/* Priority nutrients as pill badges */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Priority Nutrients</h3>
        <div className="flex flex-wrap gap-2">
          {recommendations.priority_nutrients.map((nutrient) => (
            <span
              key={nutrient}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
            >
              {formatNutrient(nutrient)}
            </span>
          ))}
        </div>
      </div>

      {/* Daily meal plan */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-slate-900">Daily Meal Plan</h3>
          <span className="text-xs text-slate-500">Suggested schedule</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(recommendations.meal_plan).map(([meal, items]) => {
            const config = mealConfig[meal] || { label: meal, time: '', initial: '?', color: 'bg-slate-100 text-slate-700 border-slate-200' };
            return (
              <div
                key={meal}
                className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {/* Meal header: badge + name + time */}
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold border ${config.color}`}>
                    {config.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 text-sm">{config.label}</h4>
                    <p className="text-xs text-slate-500">{config.time}</p>
                  </div>
                </div>

                {/* Food items */}
                <ul className="space-y-1.5">
                  {items.map((item, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* List of recommended foods */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recommended Local Foods</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recommendations.foods.map((food) => (
            <FoodCard key={food.name} food={food} />
          ))}
        </div>
      </div>
    </div>
  );
}
