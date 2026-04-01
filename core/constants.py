def probability_label(value: float) -> str:
    if value is None:
        return "Unavailable"
    if value >= 75:
        return "High"
    if value >= 45:
        return "Moderate"
    if value >= 20:
        return "Low"
    return "Very Low"


def confidence_label(score: float) -> str:
    if score >= 0.8:
        return "High"
    if score >= 0.6:
        return "Medium"
    return "Low"


RAIN_THRESHOLD = "> 60%"
HEAT_THRESHOLD = "> 40°C (India)"
WIND_THRESHOLD = "> 35 km/h"
CLOUD_THRESHOLD = "> 70%"