# Enums for all categorical input values accepted by the API

from enum import Enum


# Child's sex
class Sex(str, Enum):
    MALE = "male"
    FEMALE = "female"


# Household wealth quintile
class WealthIndex(str, Enum):
    POOREST = "poorest"
    POORER = "poorer"
    MIDDLE = "middle"
    RICHER = "richer"
    RICHEST = "richest"


# Mother's highest education level
class EducationLevel(str, Enum):
    NONE = "none"
    PRIMARY = "primary"
    SECONDARY = "secondary"
    HIGHER = "higher"


# Type of residence
class ResidenceType(str, Enum):
    URBAN = "urban"
    RURAL = "rural"


# Type of sanitation facility
class SanitationType(str, Enum):
    IMPROVED = "improved"
    UNIMPROVED = "unimproved"
    OPEN_DEFECATION = "open_defecation"


# Type of drinking water source
class WaterSource(str, Enum):
    IMPROVED = "improved"
    UNIMPROVED = "unimproved"


# The 5 provinces of Rwanda
class Region(str, Enum):
    KIGALI = "kigali"
    SOUTH = "south"
    NORTH = "north"
    EAST = "east"
    WEST = "west"


# Districts grouped by province
DISTRICTS_BY_REGION = {
    "kigali": ["gasabo", "kicukiro", "nyarugenge"],
    "north":  ["burera", "gakenke", "gicumbi", "musanze", "rulindo"],
    "south":  ["gisagara", "huye", "kamonyi", "muhanga", "nyamagabe", "nyanza", "nyaruguru", "ruhango"],
    "east":   ["bugesera", "gatsibo", "kayonza", "kirehe", "ngoma", "nyagatare", "rwamagana"],
    "west":   ["karongi", "ngororero", "nyabihu", "nyamasheke", "rubavu", "rusizi", "rutsiro"],
}

# Flat list of all 30 districts
RWANDA_DISTRICTS = [
    d for districts in DISTRICTS_BY_REGION.values() for d in districts
]


# Generic yes/no enum
class YesNo(str, Enum):
    YES = "yes"
    NO = "no"


# The 5 nutritional status categories the model predicts
class NutritionalStatus(str, Enum):
    NORMAL = "normal"
    STUNTED = "stunted"
    WASTED = "wasted"
    UNDERWEIGHT = "underweight"
    OVERWEIGHT = "overweight"


# Risk level shown in the UI
class RiskLevel(str, Enum):
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    CRITICAL = "critical"
