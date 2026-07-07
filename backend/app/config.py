# Configuration: paths, API metadata, and CORS settings

import os
from pathlib import Path

# Base directory of the app
BASE_DIR = Path(__file__).resolve().parent

# Folder containing the trained ML model artifacts
ML_ARTIFACTS_DIR = BASE_DIR / "ml_artifacts"

# Paths to individual ML artifact files
MODEL_PATH = ML_ARTIFACTS_DIR / "xgb_model.joblib"
LABEL_ENCODER_PATH = ML_ARTIFACTS_DIR / "label_encoder.joblib"
SCALER_PATH = ML_ARTIFACTS_DIR / "scaler.joblib"
FEATURE_COLUMNS_PATH = ML_ARTIFACTS_DIR / "feature_columns.joblib"

# Paths to static reference data files
WHO_REFERENCE_PATH = BASE_DIR / "data" / "who_reference.json"
RWANDAN_FOODS_PATH = BASE_DIR / "data" / "rwandan_foods.json"

# --- Authentication / database settings ---
# SQLite database file storing user accounts (self-contained, no external service)
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'app.db'}")

# JWT signing settings. In production, set AUTH_SECRET_KEY to a long random value.
JWT_SECRET_KEY = os.getenv("AUTH_SECRET_KEY", "dev-secret-change-me-in-production")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))  # 7 days

# Default account seeded on startup if it doesn't exist yet.
# Override via env vars in production.
DEFAULT_USER_USERNAME = os.getenv("DEFAULT_USER_USERNAME", "FlorenceUwase")
DEFAULT_USER_PASSWORD = os.getenv("DEFAULT_USER_PASSWORD", "Uwafofo@@123")

# API metadata shown in Swagger UI (/docs)
API_TITLE = "Child Growth Monitor API"
API_DESCRIPTION = "AI-powered child growth monitoring and nutrition recommendation system for Rwanda"
API_VERSION = "1.0.0"

# Allowed frontend origins for CORS.
# Add deployed frontend URLs via the ALLOWED_ORIGINS env var (comma-separated).
_DEFAULT_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]
_extra = os.getenv("ALLOWED_ORIGINS", "")
ALLOWED_ORIGINS = _DEFAULT_ORIGINS + [o.strip() for o in _extra.split(",") if o.strip()]
