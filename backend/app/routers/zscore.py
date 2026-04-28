# Router for POST /api/zscore

from fastapi import APIRouter, HTTPException

from ..models.schemas import ZScoreInput, ZScoreResult
from ..services.zscore_service import compute_all_zscores


# Router with /api prefix and "z-scores" Swagger tag
router = APIRouter(prefix="/api", tags=["z-scores"])


# Calculate the 4 WHO Z-scores from age, sex, weight, and height
@router.post("/zscore", response_model=ZScoreResult)
async def calculate_zscores(data: ZScoreInput):
    try:
        result = compute_all_zscores(
            age_months=data.age_months,
            sex=data.sex.value,
            weight_kg=data.weight_kg,
            height_cm=data.height_cm,
        )
        return ZScoreResult(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Z-score computation failed: {str(e)}")
