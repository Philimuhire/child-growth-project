# Router for POST /api/predict

from fastapi import APIRouter, HTTPException

from ..models.schemas import ChildInput, PredictionResponse
from ..services.ml_service import ml_service


# Router with /api prefix and "prediction" Swagger tag
router = APIRouter(prefix="/api", tags=["prediction"])


# Predict child nutritional status
@router.post("/predict", response_model=PredictionResponse)
async def predict_nutritional_status(child: ChildInput):
    # Reject if the model isn't loaded yet
    if not ml_service.is_loaded:
        raise HTTPException(
            status_code=503,
            detail="ML model not loaded. Please try again later.",
        )

    # Run inference and return the result
    try:
        return ml_service.predict(child)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
