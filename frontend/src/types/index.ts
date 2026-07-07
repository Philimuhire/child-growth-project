// TypeScript types matching the backend Pydantic schemas

// Categorical input values
export type Sex = 'male' | 'female';
export type WealthIndex = 'poorest' | 'poorer' | 'middle' | 'richer' | 'richest';
export type EducationLevel = 'none' | 'primary' | 'secondary' | 'higher';
export type ResidenceType = 'urban' | 'rural';
export type Region = 'kigali' | 'south' | 'north' | 'east' | 'west';
export type SanitationType = 'improved' | 'unimproved' | 'open_defecation';
export type WaterSource = 'improved' | 'unimproved';
export type YesNo = 'yes' | 'no';

// Output categories
export type NutritionalStatus = 'normal' | 'stunted' | 'wasted' | 'underweight' | 'overweight';
export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

// Districts grouped by province
export const DISTRICTS_BY_REGION: Record<Region, readonly string[]> = {
  kigali: ['gasabo', 'kicukiro', 'nyarugenge'],
  north: ['burera', 'gakenke', 'gicumbi', 'musanze', 'rulindo'],
  south: ['gisagara', 'huye', 'kamonyi', 'muhanga', 'nyamagabe', 'nyanza', 'nyaruguru', 'ruhango'],
  east: ['bugesera', 'gatsibo', 'kayonza', 'kirehe', 'ngoma', 'nyagatare', 'rwamagana'],
  west: ['karongi', 'ngororero', 'nyabihu', 'nyamasheke', 'rubavu', 'rusizi', 'rutsiro'],
};

// Flat list of all 30 districts
export const RWANDA_DISTRICTS = [
  ...DISTRICTS_BY_REGION.kigali,
  ...DISTRICTS_BY_REGION.north,
  ...DISTRICTS_BY_REGION.south,
  ...DISTRICTS_BY_REGION.east,
  ...DISTRICTS_BY_REGION.west,
] as const;

// District type
export type District = string;

// Request body for POST /api/predict
export interface ChildInput {
  age_months: number;
  sex: Sex;
  weight_kg: number;
  height_cm: number;
  wealth_index: WealthIndex;
  mothers_education: EducationLevel;
  residence_type: ResidenceType;
  region: Region;
  district: District;
  sanitation_type: SanitationType;
  water_source: WaterSource;
  currently_breastfeeding: YesNo;
}

// Z-score result with interpretations
export interface ZScoreResult {
  waz: number;
  haz: number;
  whz: number;
  baz: number;
  interpretations: Record<string, string>;
}

// Response from POST /api/predict
export interface PredictionResponse {
  predicted_class: NutritionalStatus;
  confidence: number;
  probabilities: Record<string, number>;
  risk_level: RiskLevel;
  z_scores: ZScoreResult;
}

// A single recommended food
export interface FoodItem {
  name: string;
  local_name: string;
  category: string;
  nutrients: string[];
  description: string;
}

// Response from POST /api/recommend
export interface RecommendationResponse {
  predicted_class: string;
  foods: FoodItem[];
  meal_plan: Record<string, string[]>;
  key_messages: string[];
  priority_nutrients: string[];
}

// Response from GET /api/health
export interface HealthResponse {
  status: string;
  model_loaded: boolean;
}

// --- Authentication ---

// A logged-in user
export interface User {
  id: number;
  username: string;
}

// Credentials sent to POST /api/auth/register and /api/auth/login
export interface AuthCredentials {
  username: string;
  password: string;
}

// Response from register / login
export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}
