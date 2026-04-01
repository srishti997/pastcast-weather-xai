from typing import Dict, List
from models.schemas import FeatureImpact


def clamp(value: float, min_value: float = 0.0, max_value: float = 100.0) -> float:
    return max(min_value, min(max_value, value))


def infer_weather_scores(features: Dict) -> Dict:
    temperature = float(features.get("temperature", 30))
    humidity = float(features.get("humidity", 60))
    pressure = float(features.get("pressure", 1010))
    wind_speed = float(features.get("wind_speed", 10))
    cloud_cover = float(features.get("cloud_cover", 40))

    pressure_drop = max(0, 1013 - pressure)

    rain_score = (
        0.35 * humidity +
        0.30 * cloud_cover +
        1.20 * pressure_drop +
        0.60 * wind_speed -
        0.25 * temperature
    )

    heat_score = (
        1.80 * temperature +
        0.20 * humidity -
        0.80 * cloud_cover -
        0.30 * wind_speed
    )

    wind_score = (
        4.50 * wind_speed +
        0.10 * cloud_cover
    )

    cloudy_score = (
        0.80 * cloud_cover +
        0.15 * humidity
    )

    good_weather_score = (
        100
        - 0.45 * humidity
        - 0.30 * cloud_cover
        - 1.20 * wind_speed
        - max(0, temperature - 32) * 2
    )

    return {
        "rain": clamp(rain_score / 1.1),
        "extreme_heat": clamp(heat_score),
        "high_wind": clamp(wind_score),
        "cloudy": clamp(cloudy_score),
        "good_weather": clamp(good_weather_score),
    }


def explain_rain(features: Dict) -> Dict[str, List[FeatureImpact]]:
    temperature = float(features.get("temperature", 30))
    humidity = float(features.get("humidity", 60))
    pressure = float(features.get("pressure", 1010))
    wind_speed = float(features.get("wind_speed", 10))
    cloud_cover = float(features.get("cloud_cover", 40))
    pressure_drop = max(0, 1013 - pressure)

    contributions = {
        "humidity": round(humidity * 0.0035, 4),
        "cloud_cover": round(cloud_cover * 0.0030, 4),
        "pressure_drop": round(pressure_drop * 0.0120, 4),
        "wind_speed": round(wind_speed * 0.0060, 4),
        "temperature": round(-temperature * 0.0025, 4),
    }

    positive = [
        FeatureImpact(feature=k, impact=v)
        for k, v in sorted(contributions.items(), key=lambda x: x[1], reverse=True)
        if v > 0
    ]

    negative = [
        FeatureImpact(feature=k, impact=v)
        for k, v in sorted(contributions.items(), key=lambda x: x[1])
        if v < 0
    ]

    return {
        "top_positive_drivers": positive[:3],
        "top_negative_drivers": negative[:2],
    }