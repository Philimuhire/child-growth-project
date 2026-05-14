# Rule-based nutrition recommendation engine using locally available Rwandan foods

import json
from ..config import RWANDAN_FOODS_PATH
from ..models.schemas import FoodItem, RecommendationResponse


# Cached food database
_foods_db: list[dict] | None = None


# Load the food database from JSON (cached after first call)
def _load_foods() -> list[dict]:
    global _foods_db
    if _foods_db is None:
        with open(RWANDAN_FOODS_PATH, "r") as f:
            _foods_db = json.load(f)
    return _foods_db


# Priority nutrients for each nutritional condition
CONDITION_NUTRIENTS = {
    "stunted":     ["protein", "calcium", "vitamin_a", "zinc", "iron"],
    "wasted":      ["energy", "protein", "fat", "vitamin_a", "zinc"],
    "underweight": ["energy", "protein", "fat", "iron", "vitamin_a", "zinc"],
    "overweight":  ["fiber", "vitamin_a", "iron", "protein"],
    "normal":      ["protein", "energy", "vitamin_a", "iron", "calcium"],
}


# Health messages displayed for each condition
KEY_MESSAGES = {
    "stunted": [
        "Focus on protein-rich foods such as beans, eggs, and groundnuts to support linear growth.",
        "Include vitamin A-rich foods like sweet potatoes and dark green vegetables daily.",
        "Ensure adequate calcium intake through milk and dairy products.",
        "Feed the child at least 4-5 times per day with nutrient-dense foods.",
        "Continue breastfeeding alongside complementary foods if child is under 2 years.",
    ],
    "wasted": [
        "URGENT: Increase caloric intake with energy-dense foods immediately.",
        "Add groundnut paste or oil to porridge and meals to increase energy density.",
        "Provide frequent small meals (6-8 times daily) as the child may have reduced appetite.",
        "Include protein at every meal - eggs, beans, milk, or groundnuts.",
        "Seek medical attention if the child shows signs of severe acute malnutrition.",
    ],
    "underweight": [
        "Increase both quantity and frequency of meals to at least 5-6 times per day.",
        "Enrich porridge with groundnut paste, milk, or egg to boost calories and protein.",
        "Include animal-source foods (eggs, milk) at least once daily when possible.",
        "Combine beans with maize or other cereals for complete protein.",
        "Monitor weight weekly and seek health facility support if no improvement in 2 weeks.",
    ],
    "overweight": [
        "Increase vegetables and fruits in the child's diet.",
        "Reduce portion sizes of starchy foods like maize porridge and sweet potatoes.",
        "Encourage active play and physical activity appropriate for the child's age.",
        "Avoid adding sugar to porridge or drinks.",
        "Maintain regular meal times and avoid excessive snacking between meals.",
    ],
    "normal": [
        "Maintain the current balanced feeding practices - the child is growing well!",
        "Continue providing a variety of foods from all food groups daily.",
        "Ensure the child eats 3 main meals and 2 snacks per day.",
        "Include fruits and vegetables daily for vitamins and minerals.",
        "Continue regular growth monitoring at the health facility.",
    ],
}


# Filter out foods the child is too young or too old for
def _filter_foods_by_age(foods: list[dict], age_months: int) -> list[dict]:
    return [
        f for f in foods
        if f.get("age_min", 0) <= age_months <= f.get("age_max", 60)
    ]


# Rank foods by relevance to the nutritional condition
def _select_foods_for_condition(condition: str, age_months: int) -> list[FoodItem]:
    all_foods = _load_foods()
    age_appropriate = _filter_foods_by_age(all_foods, age_months)
    priority_nutrients = set(CONDITION_NUTRIENTS.get(condition, []))

    # Score each food by its overlap with priority nutrients
    scored = []
    for food in age_appropriate:
        food_nutrients = set(food.get("nutrients", []))
        score = len(food_nutrients & priority_nutrients)
        scored.append((score, food))

    # Sort by relevance score
    scored.sort(key=lambda x: x[0], reverse=True)

    # For overweight, push pure carbohydrate foods to the bottom
    if condition == "overweight":
        scored = [
            (s, f) for s, f in scored
            if f.get("category") != "carbohydrate" or s > 1
        ] + [
            (s, f) for s, f in scored
            if f.get("category") == "carbohydrate" and s <= 1
        ]

    # Convert to Pydantic FoodItem models
    return [
        FoodItem(
            name=food["name"],
            local_name=food["local_name"],
            category=food["category"],
            nutrients=food["nutrients"],
            description=food.get("description", ""),
        )
        for _, food in scored
    ]


# Build a daily meal plan from the ranked food list
def _generate_meal_plan(
    condition: str, foods: list[FoodItem], age_months: int
) -> dict[str, list[str]]:
    # Children under 6 months: exclusive breastfeeding
    if age_months < 6:
        return {
            "breakfast":   ["Breast milk"],
            "mid_morning": ["Breast milk"],
            "lunch":       ["Breast milk"],
            "afternoon":   ["Breast milk"],
            "dinner":      ["Breast milk"],
        }

    # Group foods by category (English names only)
    food_by_category = {}
    for f in foods:
        food_by_category.setdefault(f.category, []).append(f.name)

    # Pick representatives from each category (with sensible fallbacks)
    proteins = food_by_category.get("protein", ["Beans"])
    carbs    = food_by_category.get("carbohydrate", ["Maize porridge"])
    fruits   = food_by_category.get("fruit", ["Bananas"])
    vegs     = food_by_category.get("vegetable", ["Green vegetables"])
    dairy    = food_by_category.get("dairy", ["Milk"])

    # Compose meals using top and second-ranked foods for variety
    plan = {
        "breakfast": [
            f"{carbs[0]} enriched with {dairy[0] if dairy else proteins[0]}",
        ],
        "mid_morning": [
            fruits[0] if fruits else "Fresh fruit",
        ],
        "lunch": [
            f"{proteins[0]} with {carbs[-1] if len(carbs) > 1 else carbs[0]}",
            vegs[0] if vegs else "Steamed vegetables",
        ],
        "afternoon": [
            f"{dairy[0]}" if dairy else f"Small portion of {proteins[-1] if len(proteins) > 1 else proteins[0]}",
        ],
        "dinner": [
            f"{proteins[-1] if len(proteins) > 1 else proteins[0]} with {vegs[-1] if len(vegs) > 1 else vegs[0]}",
            f"Small portion of {carbs[0]}",
        ],
    }

    # Add breastfeeding note for children under 24 months
    if age_months < 24:
        for meal in plan:
            plan[meal].append("Continue breastfeeding on demand")

    # Condition-specific adjustments
    if condition == "wasted":
        plan["mid_morning"].insert(0, "Energy-dense porridge with groundnut paste")
        plan["afternoon"].insert(0, "Extra snack: mashed banana with groundnut paste")
    elif condition == "overweight":
        plan["mid_morning"] = ["Fresh fruit or vegetable sticks"]
        plan["afternoon"] = ["Small portion of fruit"]

    return plan


# Build the full recommendation response
def get_recommendations(predicted_class: str, age_months: int) -> RecommendationResponse:
    foods = _select_foods_for_condition(predicted_class, age_months)
    meal_plan = _generate_meal_plan(predicted_class, foods, age_months)
    messages = KEY_MESSAGES.get(predicted_class, KEY_MESSAGES["normal"])
    nutrients = CONDITION_NUTRIENTS.get(predicted_class, CONDITION_NUTRIENTS["normal"])

    return RecommendationResponse(
        predicted_class=predicted_class,
        foods=foods,
        meal_plan=meal_plan,
        key_messages=messages,
        priority_nutrients=nutrients,
    )
