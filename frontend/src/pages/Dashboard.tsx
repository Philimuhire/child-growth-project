// Landing page

import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { checkHealth } from '../api/client';

export default function Dashboard() {
  const [health, setHealth] = useState<{ status: string; model_loaded: boolean } | null>(null);

  // Check backend health on mount
  useEffect(() => {
    checkHealth()
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Hero section */}
      <div className="text-center mb-10 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
          Child Growth Monitor
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-2">
          AI-powered nutritional assessment and recommendation system for
          under-five children in Rwanda. Using XGBoost machine learning to detect
          malnutrition early and provide actionable dietary guidance.
        </p>
        <Link
          to="/assess"
          className="inline-block mt-6 bg-emerald-600 text-white px-6 sm:px-8 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors no-underline"
        >
          Start Assessment
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
            <span className="text-emerald-600 font-bold text-xl">5</span>
          </div>
          <h3 className="font-semibold text-slate-900">Nutritional Categories</h3>
          <p className="text-sm text-slate-500 mt-1">
            Normal, Stunted, Wasted, Underweight, Overweight
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
            <span className="text-green-600 font-bold text-xl">17</span>
          </div>
          <h3 className="font-semibold text-slate-900">Input Features</h3>
          <p className="text-sm text-slate-500 mt-1">
            Anthropometric, demographic, and derived WHO Z-scores
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 text-center">
          <div className="w-12 h-12 bg-amber-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
            <span className="text-amber-600 font-bold text-xl">15</span>
          </div>
          <h3 className="font-semibold text-slate-900">Local Foods</h3>
          <p className="text-sm text-slate-500 mt-1">
            Rwandan foods mapped to nutritional recommendations
          </p>
        </div>
      </div>

      {/* System status panel */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {/* Compute a simple, user-friendly status from the health check */}
        {(() => {
          const isOperational = health?.status === 'healthy' && health?.model_loaded;
          const isLimited = health?.status === 'healthy' && !health?.model_loaded;
          const dotColor = isOperational
            ? 'bg-green-500'
            : isLimited
            ? 'bg-yellow-500'
            : 'bg-red-500';
          const label = isOperational
            ? 'Running'
            : isLimited
            ? 'Limited'
            : 'Unavailable';
          return (
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${dotColor}`} />
              <span className="text-sm text-slate-700">
                System status: <span className="font-medium">{label}</span>
              </span>
            </div>
          );
        })()}
      </div>

      {/* How It Works section */}
      <div className="mt-10 sm:mt-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              step: '1',
              title: 'Enter Data',
              desc: 'Input child anthropometric and demographic information',
            },
            {
              step: '2',
              title: 'AI Analysis',
              desc: 'XGBoost model computes Z-scores and predicts nutritional status',
            },
            {
              step: '3',
              title: 'View Results',
              desc: 'See classification, confidence scores, and risk assessment',
            },
            {
              step: '4',
              title: 'Get Guidance',
              desc: 'Receive personalized nutrition recommendations with local foods',
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-full mx-auto mb-3 flex items-center justify-center font-bold">
                {item.step}
              </div>
              <h3 className="font-semibold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
