# WHO Child Growth Standards Z-score computation using the LMS method
#
# Formula:
#   Z = ((value/M)^L - 1) / (L * S)   when L != 0
#   Z = ln(value/M) / S               when L == 0

import json
import math

from ..config import WHO_REFERENCE_PATH


# Cached WHO reference data
_who_data: dict | None = None


# Load the WHO reference JSON (cached after first call)
def load_who_reference() -> dict:
    global _who_data
    if _who_data is None:
        with open(WHO_REFERENCE_PATH, "r") as f:
            _who_data = json.load(f)
    return _who_data


# Look up (L, M, S) parameters with linear interpolation between table rows
def _get_lms(indicator: str, sex: str, index_value: float) -> tuple[float, float, float]:
    data = load_who_reference()
    key = f"{indicator}_{sex}"
    table = data.get(key, [])

    if not table:
        raise ValueError(f"No WHO reference data for {key}")

    # wfh tables are keyed by height; all others by age
    index_field = "height" if indicator == "wfh" else "age"

    prev_entry = None
    for entry in table:
        # Exact match
        if abs(entry[index_field] - index_value) < 0.01:
            return entry["L"], entry["M"], entry["S"]
        if entry[index_field] <= index_value:
            prev_entry = entry
        elif prev_entry is not None:
            # Linear interpolation between prev_entry and current entry
            t = (index_value - prev_entry[index_field]) / (entry[index_field] - prev_entry[index_field])
            L = prev_entry["L"] + t * (entry["L"] - prev_entry["L"])
            M = prev_entry["M"] + t * (entry["M"] - prev_entry["M"])
            S = prev_entry["S"] + t * (entry["S"] - prev_entry["S"])
            return L, M, S

    # Fallback: use the boundary row
    if prev_entry:
        return prev_entry["L"], prev_entry["M"], prev_entry["S"]
    return table[0]["L"], table[0]["M"], table[0]["S"]


# Compute Z-score from a measurement and its LMS parameters
def compute_zscore(value: float, L: float, M: float, S: float) -> float:
    if M <= 0 or S <= 0:
        return 0.0

    if abs(L) < 0.001:
        # Log-normal special case when L is approximately zero
        z = math.log(value / M) / S
    else:
        # Standard Box-Cox form
        z = (((value / M) ** L) - 1) / (L * S)

    # Clamp to WHO convention [-6, +6]
    return max(-6.0, min(6.0, round(z, 2)))


# Weight-for-Age Z-score
def compute_waz(age_months: int, sex: str, weight_kg: float) -> float:
    L, M, S = _get_lms("wfa", sex, float(age_months))
    return compute_zscore(weight_kg, L, M, S)


# Height-for-Age Z-score
def compute_haz(age_months: int, sex: str, height_cm: float) -> float:
    L, M, S = _get_lms("lhfa", sex, float(age_months))
    return compute_zscore(height_cm, L, M, S)


# Weight-for-Height Z-score (indexed by height, not age)
def compute_whz(sex: str, height_cm: float, weight_kg: float) -> float:
    L, M, S = _get_lms("wfh", sex, height_cm)
    return compute_zscore(weight_kg, L, M, S)


# BMI-for-Age Z-score
def compute_baz(age_months: int, sex: str, weight_kg: float, height_cm: float) -> float:
    height_m = height_cm / 100.0
    bmi = weight_kg / (height_m ** 2)
    L, M, S = _get_lms("bfa", sex, float(age_months))
    return compute_zscore(bmi, L, M, S)


# Compute all 4 Z-scores plus their plain-language interpretations
def compute_all_zscores(
    age_months: int, sex: str, weight_kg: float, height_cm: float
) -> dict:
    waz = compute_waz(age_months, sex, weight_kg)
    haz = compute_haz(age_months, sex, height_cm)
    whz = compute_whz(sex, height_cm, weight_kg)
    baz = compute_baz(age_months, sex, weight_kg, height_cm)

    interpretations = {
        "waz": _interpret_waz(waz),
        "haz": _interpret_haz(haz),
        "whz": _interpret_whz(whz),
        "baz": _interpret_baz(baz),
    }

    return {
        "waz": waz, "haz": haz, "whz": whz, "baz": baz,
        "interpretations": interpretations,
    }


# Interpret WAZ value
def _interpret_waz(z: float) -> str:
    if z < -3: return "Severely underweight"
    elif z < -2: return "Moderately underweight"
    elif z <= 2: return "Normal weight-for-age"
    else: return "Above normal weight-for-age"


# Interpret HAZ value
def _interpret_haz(z: float) -> str:
    if z < -3: return "Severely stunted"
    elif z < -2: return "Moderately stunted"
    elif z <= 2: return "Normal height-for-age"
    else: return "Above normal height-for-age"


# Interpret WHZ value
def _interpret_whz(z: float) -> str:
    if z < -3: return "Severely wasted"
    elif z < -2: return "Moderately wasted"
    elif z <= 2: return "Normal weight-for-height"
    else: return "Possible risk of overweight"


# Interpret BAZ value
def _interpret_baz(z: float) -> str:
    if z < -3: return "Severely wasted"
    elif z < -2: return "Moderately wasted"
    elif z <= 1: return "Normal BMI-for-age"
    elif z <= 2: return "At risk of overweight"
    elif z <= 3: return "Overweight"
    else: return "Obese"
