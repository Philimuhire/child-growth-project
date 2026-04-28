# Router for POST /api/recommend

from fastapi import APIRouter, HTTPException

from ..models.schemas import RecommendationInput, RecommendationResponse
from ..models.enums import NutritionalStatus
from ..services.recommendation_service import get_recommendations


# Router with /api prefix and "recommendations" Swagger tag
router = APIRouter(prefix="/api", tags=["recommendations"])


# Get nutrition recommendations for a predicted class
@router.post("/recommend", response_model=RecommendationResponse)
async def get_nutrition_recommendations(data: RecommendationInput):
    # Validate that predicted_class is one of the 5 known classes
    valid_classes = [s.value for s in NutritionalStatus]
    if data.predicted_class not in valid_classes:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid class '{data.predicted_class}'. Must be one of: {valid_classes}",
        )

    # Generate recommendations
    try:
        return get_recommendations(data.predicted_class, data.age_months)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Recommendation generation failed: {str(e)}"
        )
