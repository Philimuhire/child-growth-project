// HTTP client for the FastAPI backend

import axios from 'axios';
import type {
  ChildInput, PredictionResponse, RecommendationResponse, HealthResponse,
  AuthCredentials, TokenResponse, User,
} from '../types';

// In dev, falls back to '/api' so Vite's proxy hits localhost:8000.
// In production, set VITE_API_BASE_URL to the deployed backend (e.g. https://your-api.onrender.com/api).
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

// localStorage key under which the JWT is persisted
export const TOKEN_STORAGE_KEY = 'cgm_auth_token';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the bearer token (if any) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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

// --- Authentication ---

// Create a new account (returns a token so the user is logged in immediately)
export async function register(credentials: AuthCredentials): Promise<TokenResponse> {
  const response = await api.post<TokenResponse>('/auth/register', credentials);
  return response.data;
}

// Log in with username + password
export async function login(credentials: AuthCredentials): Promise<TokenResponse> {
  const response = await api.post<TokenResponse>('/auth/login', credentials);
  return response.data;
}

// Fetch the currently authenticated user (validates the stored token)
export async function getCurrentUser(): Promise<User> {
  const response = await api.get<User>('/auth/me');
  return response.data;
}
