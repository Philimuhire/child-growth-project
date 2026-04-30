// Assessment page with input form and results

import { useState } from 'react';
import ChildInputForm from '../components/Forms/ChildInputForm';
import PredictionCard from '../components/Results/PredictionCard';
import RiskIndicator from '../components/Results/RiskIndicator';
import ZScoreDisplay from '../components/Results/ZScoreDisplay';
import ConfidenceChart from '../components/Charts/ConfidenceChart';
import GrowthChart from '../components/Charts/GrowthChart';
import NutritionPlan from '../components/Recommendations/NutritionPlan';
import { usePrediction } from '../hooks/usePrediction';

type Tab = 'results' | 'recommendations';

export default function AssessmentPage() {
  // Prediction state from the custom hook
  const { loading, error, prediction, recommendations, predict, reset } = usePrediction();
  const [activeTab, setActiveTab] = useState<Tab>('results');

  const hasResults = prediction !== null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Child Nutritional Assessment</h1>
        <p className="text-slate-600 mt-1">
          Enter child data to receive AI-powered nutritional status prediction and dietary recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: input form */}
        <div className="lg:col-span-4">
          <ChildInputForm onSubmit={predict} loading={loading} />

          {hasResults && (
            <button
              onClick={reset}
              className="mt-4 w-full py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Clear Results
            </button>
          )}
        </div>

        {/* Right: results panel (error / empty / loading / results) */}
        <div className="lg:col-span-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 mb-6">
              <p className="font-semibold">Assessment Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {!hasResults && !loading && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-700">No Assessment Yet</h3>
              <p className="text-sm text-slate-500 mt-2">
                Fill in the child's information and click "Run Assessment" to get started.
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <svg className="animate-spin h-10 w-10 text-emerald-600 mx-auto mb-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-700">Analyzing...</h3>
              <p className="text-sm text-slate-500 mt-1">
                Computing Z-scores and running ML prediction
              </p>
            </div>
          )}

          {hasResults && (
            <>
              {/* Tab navigation */}
              <div className="flex gap-1 bg-slate-100 rounded-lg p-1 mb-6">
                <button
                  onClick={() => setActiveTab('results')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'results'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Assessment Results
                </button>
                <button
                  onClick={() => setActiveTab('recommendations')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'recommendations'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Nutrition Recommendations
                </button>
              </div>

              {activeTab === 'results' && (
                <div className="space-y-6">
                  {/* Prediction card and risk indicator */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <PredictionCard
                      predictedClass={prediction.predicted_class}
                      confidence={prediction.confidence}
                    />
                    <RiskIndicator riskLevel={prediction.risk_level} />
                  </div>

                  <ZScoreDisplay zScores={prediction.z_scores} />

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ConfidenceChart
                      probabilities={prediction.probabilities}
                      predictedClass={prediction.predicted_class}
                    />
                    <GrowthChart zScores={prediction.z_scores} />
                  </div>
                </div>
              )}

              {activeTab === 'recommendations' && recommendations && (
                <NutritionPlan recommendations={recommendations} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
