# FastAPI entry point. Run with: uvicorn app.main:app --reload

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import API_TITLE, API_DESCRIPTION, API_VERSION, ALLOWED_ORIGINS
from .models.schemas import HealthResponse
from .services.ml_service import ml_service
from .routers import predict, zscore, recommend

logger = logging.getLogger(__name__)


# Runs once on app startup
@asynccontextmanager
async def lifespan(app: FastAPI):
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

# Register the three API routers
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
