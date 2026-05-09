# Pydantic schemas for API request and response bodies

from pydantic import BaseModel, Field, field_validator, model_validator
from .enums import (
    Sex, WealthIndex, EducationLevel, ResidenceType,
    SanitationType, WaterSource, Region, YesNo,
    RWANDA_DISTRICTS, DISTRICTS_BY_REGION,
)


# Request body for POST /api/predict
class ChildInput(BaseModel):
    # Anthropometric measurements
    age_months: int = Field(ge=0, le=60, description="Child's age in months (0-60)")
    sex: Sex = Field(description="Child's sex")
    weight_kg: float = Field(gt=0, le=30, description="Weight in kilograms")
    height_cm: float = Field(gt=30, le=130, description="Height/length in centimeters")

    # Demographic and socioeconomic data
    wealth_index: WealthIndex = Field(description="Household wealth index")
    mothers_education: EducationLevel = Field(description="Mother's education level")
    residence_type: ResidenceType = Field(description="Urban or rural residence")
    region: Region = Field(description="Province / region in Rwanda")
    district: str = Field(description="District in Rwanda (30 official districts)")
    sanitation_type: SanitationType = Field(description="Type of sanitation facility")
    water_source: WaterSource = Field(description="Type of water source")

    # Feeding context
    currently_breastfeeding: YesNo = Field(description="Is the child currently breastfeeding?")

    # Validate that district is one of the 30 official Rwandan districts
    @field_validator("district")
    @classmethod
    def _validate_district(cls, v: str) -> str:
        v_norm = v.strip().lower()
        if v_norm not in RWANDA_DISTRICTS:
            raise ValueError(f"Unknown district '{v}'. Must be one of: {', '.join(RWANDA_DISTRICTS)}")
        return v_norm

    # Validate that the district belongs to the chosen region
    @model_validator(mode="after")
    def _validate_district_in_region(self) -> "ChildInput":
        valid_districts = DISTRICTS_BY_REGION[self.region.value]
        if self.district not in valid_districts:
            raise ValueError(
                f"District '{self.district}' does not belong to region '{self.region.value}'. "
                f"Valid districts for {self.region.value}: {', '.join(valid_districts)}"
            )
        return self

    # Example payload shown in Swagger UI
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "age_months": 24,
                    "sex": "male",
                    "weight_kg": 10.5,
                    "height_cm": 82.0,
                    "wealth_index": "middle",
                    "mothers_education": "primary",
                    "residence_type": "rural",
                    "region": "south",
                    "district": "huye",
                    "sanitation_type": "improved",
                    "water_source": "improved",
                    "currently_breastfeeding": "yes",
                }
            ]
        }
    }


# Request body for POST /api/zscore
class ZScoreInput(BaseModel):
    age_months: int = Field(ge=0, le=60)
    sex: Sex
    weight_kg: float = Field(gt=0, le=30)
    height_cm: float = Field(gt=30, le=130)


# Response body containing the 4 WHO Z-scores
class ZScoreResult(BaseModel):
    waz: float = Field(description="Weight-for-Age Z-score")
    haz: float = Field(description="Height-for-Age Z-score")
    whz: float = Field(description="Weight-for-Height Z-score")
    baz: float = Field(description="BMI-for-Age Z-score")
    interpretations: dict[str, str] = Field(description="Human-readable interpretation of each Z-score")


# Response body for POST /api/predict
class PredictionResponse(BaseModel):
    predicted_class: str
    confidence: float
    probabilities: dict[str, float]
    risk_level: str
    z_scores: ZScoreResult


# A single recommended food item
class FoodItem(BaseModel):
    name: str
    local_name: str
    category: str
    nutrients: list[str]
    description: str


# Response body for POST /api/recommend
class RecommendationResponse(BaseModel):
    predicted_class: str
    foods: list[FoodItem]
    meal_plan: dict[str, list[str]]
    key_messages: list[str]
    priority_nutrients: list[str]


# Request body for POST /api/recommend
class RecommendationInput(BaseModel):
    predicted_class: str
    age_months: int = Field(ge=0, le=60)


# Response body for GET /api/health
class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
