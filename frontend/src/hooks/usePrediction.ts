// Hook that handles the predict + recommend flow

import { useState } from 'react';
import type { ChildInput, PredictionResponse, RecommendationResponse } from '../types';
import { submitAssessment, getRecommendations } from '../api/client';

interface PredictionState {
  loading: boolean;
  error: string | null;
  prediction: PredictionResponse | null;
  recommendations: RecommendationResponse | null;
}

export function usePrediction() {
  const [state, setState] = useState<PredictionState>({
    loading: false,
    error: null,
    prediction: null,
    recommendations: null,
  });

  // Run a full assessment
  const predict = async (data: ChildInput) => {
    setState({ loading: true, error: null, prediction: null, recommendations: null });

    try {
      // Get the prediction
      const prediction = await submitAssessment(data);

      // Get recommendations for the predicted class
      const recommendations = await getRecommendations(
        prediction.predicted_class,
        data.age_months,
      );

      setState({ loading: false, error: null, prediction, recommendations });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during prediction';
      setState((prev) => ({ ...prev, loading: false, error: message }));
    }
  };

  // Clear all results
  const reset = () => {
    setState({ loading: false, error: null, prediction: null, recommendations: null });
  };

  return { ...state, predict, reset };
}
