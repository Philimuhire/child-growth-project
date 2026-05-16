// Card displaying a single recommended food

import type { FoodItem } from '../../types';

interface Props {
  food: FoodItem;
}

// Full label for each food category
const categoryLabels: Record<string, string> = {
  protein: 'Protein',
  carbohydrate: 'Carbohydrate',
  fruit: 'Fruit',
  vegetable: 'Vegetable',
  dairy: 'Dairy',
};

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

// Color classes for each food category
const categoryColors: Record<string, string> = {
  protein: 'bg-red-100 text-red-700 border-red-200',
  carbohydrate: 'bg-amber-100 text-amber-700 border-amber-200',
  fruit: 'bg-green-100 text-green-700 border-green-200',
  vegetable: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  dairy: 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function FoodCard({ food }: Props) {
  // Get color class and label, with slate fallback for unknown categories
  const colorClass = categoryColors[food.category] || 'bg-slate-100 text-slate-700 border-slate-200';
  const categoryLabel = categoryLabels[food.category] || 'Other';

  return (
    <div className="border border-slate-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
      {/* Header: food name + category pill */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-semibold text-slate-900 text-sm break-words min-w-0">{food.name}</h4>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-medium border whitespace-nowrap flex-shrink-0 ${colorClass}`}
        >
          {categoryLabel}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-600 line-clamp-2">{food.description}</p>

      {/* Nutrient tags */}
      <div className="flex flex-wrap gap-1 mt-2">
        {food.nutrients.map((nutrient) => (
          <span
            key={nutrient}
            className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full"
          >
            {formatNutrient(nutrient)}
          </span>
        ))}
      </div>
    </div>
  );
}
