# ML inference service: loads the trained XGBoost model and runs predictions

import numpy as np
import joblib

from ..config import MODEL_PATH, LABEL_ENCODER_PATH, SCALER_PATH, FEATURE_COLUMNS_PATH, ML_ARTIFACTS_DIR
from ..models.schemas import ChildInput, PredictionResponse, ZScoreResult
from ..models.enums import RiskLevel
from .zscore_service import compute_all_zscores


# Default categorical encoding maps (used as fallback)
DEFAULT_CATEGORICAL_ENCODINGS = {
    "sex": {"male": 0, "female": 1},
    "wealth_index": {"poorest": 0, "poorer": 1, "middle": 2, "richer": 3, "richest": 4},
    "mothers_education": {"none": 0, "primary": 1, "secondary": 2, "higher": 3},
    "residence_type": {"urban": 0, "rural": 1},
    "region": {"kigali": 0, "south": 1, "north": 2, "east": 3, "west": 4},
    "sanitation_type": {"improved": 0, "unimproved": 1, "open_defecation": 2},
    "water_source": {"improved": 0, "unimproved": 1},
    "currently_breastfeeding": {"yes": 1, "no": 0},
    "district": {},
}

# Possible class names from the model
CLASS_NAMES = ["normal", "overweight", "stunted", "underweight", "wasted"]


# Service that holds the loaded model and runs predictions
class MLService:
    def __init__(self):
        self.model = None
        self.label_encoder = None
        self.scaler = None
        self.feature_columns = None
        self.categorical_encodings = dict(DEFAULT_CATEGORICAL_ENCODINGS)
        self._loaded = False

    # Load model and preprocessing artifacts from disk
    def load_model(self):
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Model not found at {MODEL_PATH}. Run the training notebook first."
            )

        self.model = joblib.load(MODEL_PATH)
        self.label_encoder = joblib.load(LABEL_ENCODER_PATH)
        self.scaler = joblib.load(SCALER_PATH)

        if FEATURE_COLUMNS_PATH.exists():
            self.feature_columns = joblib.load(FEATURE_COLUMNS_PATH)

        cat_path = ML_ARTIFACTS_DIR / "categorical_encodings.joblib"
        if cat_path.exists():
            self.categorical_encodings = joblib.load(cat_path)

        self._loaded = True

    # True if load_model has been called successfully
    @property
    def is_loaded(self) -> bool:
        return self._loaded

    # Convert a string category to its integer encoding
    def _encode_categorical(self, col: str, value: str, default: int = 0) -> int:
        mapping = self.categorical_encodings.get(col, {})
        return mapping.get(value, default)

    # Build the scaled feature vector for a single child
    def _encode_features(self, child: ChildInput, z_scores: dict) -> np.ndarray:
        features = {
            "age_months": child.age_months,
            "sex": self._encode_categorical("sex", child.sex.value),
            "weight_kg": child.weight_kg,
            "height_cm": child.height_cm,
            "wealth_index": self._encode_categorical("wealth_index", child.wealth_index.value),
            "mothers_education": self._encode_categorical("mothers_education", child.mothers_education.value),
            "residence_type": self._encode_categorical("residence_type", child.residence_type.value),
            "region": self._encode_categorical("region", child.region.value),
            "district": self._encode_categorical("district", child.district),
            "sanitation_type": self._encode_categorical("sanitation_type", child.sanitation_type.value),
            "water_source": self._encode_categorical("water_source", child.water_source.value),
            "currently_breastfeeding": self._encode_categorical(
                "currently_breastfeeding", child.currently_breastfeeding.value
            ),
            "waz": z_scores["waz"],
            "haz": z_scores["haz"],
            "whz": z_scores["whz"],
            "baz": z_scores["baz"],
        }

        # Reorder columns to match training
        if self.feature_columns:
            feature_vector = np.array([[features[col] for col in self.feature_columns]])
        else:
            feature_vector = np.array([list(features.values())])

        # Apply the trained StandardScaler
        feature_vector = self.scaler.transform(feature_vector)
        return feature_vector

    # Run prediction on a single child input
    def predict(self, child: ChildInput) -> PredictionResponse:
        if not self._loaded:
            raise RuntimeError("Model not loaded. Call load_model() first.")

        # Compute the 4 WHO Z-scores
        z_scores = compute_all_zscores(
            age_months=child.age_months,
            sex=child.sex.value,
            weight_kg=child.weight_kg,
            height_cm=child.height_cm,
        )

        # Encode features and run inference
        features = self._encode_features(child, z_scores)
        probabilities = self.model.predict_proba(features)[0]
        predicted_idx = np.argmax(probabilities)

        # Decode predicted class
        class_names = self.label_encoder.classes_
        predicted_class = class_names[predicted_idx]
        confidence = float(probabilities[predicted_idx])

        # Build probabilities dict for the response
        prob_dict = {
            class_names[i]: round(float(probabilities[i]), 4)
            for i in range(len(class_names))
        }

        # Compute risk level
        risk_level = self._compute_risk_level(predicted_class, confidence)

        # Wrap Z-scores in the response model
        z_score_result = ZScoreResult(
            waz=z_scores["waz"],
            haz=z_scores["haz"],
            whz=z_scores["whz"],
            baz=z_scores["baz"],
            interpretations=z_scores["interpretations"],
        )

        return PredictionResponse(
            predicted_class=predicted_class,
            confidence=round(confidence, 4),
            probabilities=prob_dict,
            risk_level=risk_level,
            z_scores=z_score_result,
        )

    # Map (predicted_class, confidence) to a risk level label
    def _compute_risk_level(self, predicted_class: str, confidence: float) -> str:
        if predicted_class == "normal":
            return RiskLevel.LOW.value

        if predicted_class in ("wasted", "underweight") and confidence > 0.7:
            return RiskLevel.CRITICAL.value

        if confidence > 0.5:
            return RiskLevel.HIGH.value

        return RiskLevel.MODERATE.value


# Singleton instance imported by main.py and routers
ml_service = MLService()
