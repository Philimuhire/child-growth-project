// HTTP client for the FastAPI backend

import axios from 'axios';
import type { ChildInput, PredictionResponse, RecommendationResponse, HealthResponse } from '../types';

// In dev, falls back to '/api' so Vite's proxy hits localhost:8000.
// In production, set VITE_API_BASE_URL to the deployed backend (e.g. https://your-api.onrender.com/api).
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Submit a child assessment and get a prediction
export async function submitAssessment(data: ChildInput): Promise<PredictionResponse> {
  const response = await api.post<PredictionResponse>('/predict', data);
  return response.data;
}

// Fetch nutrition recommendations for a predicted class
export async function getRecommendations(
  predicted_class: string,
  age_months: number,
): Promise<RecommendationResponse> {
  const response = await api.post<RecommendationResponse>('/recommend', {
    predicted_class,
    age_months,
  });
  return response.data;
}

// Check backend health
export async function checkHealth(): Promise<HealthResponse> {
  const response = await api.get<HealthResponse>('/health');
  return response.data;
}
