# FastAPI entry point. Run with: uvicorn app.main:app --reload

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import (
    API_TITLE, API_DESCRIPTION, API_VERSION, ALLOWED_ORIGINS,
    DEFAULT_USER_USERNAME, DEFAULT_USER_PASSWORD,
)
from .database import init_db, SessionLocal
from .models.schemas import HealthResponse
from .services import auth_service
from .services.ml_service import ml_service
from .routers import predict, zscore, recommend, auth

logger = logging.getLogger(__name__)


# Runs once on app startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create the user-accounts database tables if they don't exist yet
    try:
        init_db()
        logger.info("User database initialized")

        # Seed the default account if it isn't already present
        db = SessionLocal()
        try:
            if auth_service.ensure_user(db, DEFAULT_USER_USERNAME, DEFAULT_USER_PASSWORD):
                logger.info(f"Seeded default user '{DEFAULT_USER_USERNAME.lower()}'")
        finally:
            db.close()
    except Exception as e:
        logger.error(f"Failed to initialize user database: {e}")

    # Load the trained ML model into memory
    try:
        ml_service.load_model()
        logger.info("ML model loaded successfully")
    except FileNotFoundError as e:
        logger.warning(f"ML model not found: {e}. Prediction endpoint will be unavailable.")
    except Exception as e:
        logger.error(f"Failed to load ML model: {e}")
    yield


# Create the FastAPI app
app = FastAPI(
    title=API_TITLE,
    description=API_DESCRIPTION,
    version=API_VERSION,
    lifespan=lifespan,
)

# Allow the React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register the API routers
app.include_router(auth.router)
app.include_router(predict.router)
app.include_router(zscore.router)
app.include_router(recommend.router)


# Health check endpoint
@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        model_loaded=ml_service.is_loaded,
    )
