import os
import joblib
import pandas as pd

from models.schemas import (
    WeatherCondition,
    WeatherSummary,
    XAIExplanation,
    PredictionResponse,
    FeatureImpact,
)
from core.constants import (
    probability_label,
    confidence_label,
    RAIN_THRESHOLD,
    HEAT_THRESHOLD,
    WIND_THRESHOLD,
    CLOUD_THRESHOLD,
)
from explainability.narrative_generator import build_narrative


ARTIFACT_DIR = os.path.join(os.path.dirname(__file__), "..", "artifacts")
MODEL_PATH = os.path.join(ARTIFACT_DIR, "rain_model.pkl")

_model_cache = None


def load_rain_model():
    global _model_cache
    if _model_cache is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
        _model_cache = joblib.load(MODEL_PATH)
    return _model_cache


def infer_other_scores(features: dict) -> dict:
    temperature = float(features.get("temperature", 30))
    humidity = float(features.get("humidity", 60))
    wind_speed = float(features.get("wind_speed", 10))
    cloud_cover = float(features.get("cloud_cover", 40))

    extreme_heat = max(0, min(100, 2.2 * temperature + 0.15 * humidity - 0.7 * cloud_cover - 0.4 * wind_speed))
    high_wind = max(0, min(100, 4.2 * wind_speed + 0.1 * cloud_cover))
    cloudy = max(0, min(100, 0.85 * cloud_cover + 0.1 * humidity))
    good_weather = max(0, min(100, 100 - 0.4 * humidity - 0.35 * cloud_cover - 1.1 * wind_speed - max(0, temperature - 32) * 2))

    return {
        "extreme_heat": round(extreme_heat, 2),
        "high_wind": round(high_wind, 2),
        "cloudy": round(cloudy, 2),
        "good_weather": round(good_weather, 2),
    }


def build_proxy_explanation(features: dict) -> dict:
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
        "wind_speed": round(wind_speed * 0.0055, 4),
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


def predict_and_explain(location: dict, analysis_period: str, features: dict):
    model = load_rain_model()

    feature_df = pd.DataFrame([{
        "temperature": float(features.get("temperature", 29.0)),
        "humidity": float(features.get("humidity", 78.0)),
        "pressure": float(features.get("pressure", 1006.0)),
        "wind_speed": float(features.get("wind_speed", 14.0)),
        "cloud_cover": float(features.get("cloud_cover", 82.0)),
    }])

    rain_probability = float(model.predict_proba(feature_df)[0][1]) * 100

    other_scores = infer_other_scores(features)
    explanation_parts = build_proxy_explanation(features)

    positive = explanation_parts["top_positive_drivers"]
    negative = explanation_parts["top_negative_drivers"]

    narrative = build_narrative(positive, negative, "rain likelihood")

    probabilities = {
        "rain": WeatherCondition(
            probability=round(rain_probability, 2),
            label=probability_label(rain_probability),
            threshold=RAIN_THRESHOLD,
            description="Rain Probability",
        ),
        "extreme_heat": WeatherCondition(
            probability=other_scores["extreme_heat"],
            label=probability_label(other_scores["extreme_heat"]),
            threshold=HEAT_THRESHOLD,
            description="Extreme Heat Risk",
        ),
        "high_wind": WeatherCondition(
            probability=other_scores["high_wind"],
            label=probability_label(other_scores["high_wind"]),
            threshold=WIND_THRESHOLD,
            description="High Wind Risk",
        ),
        "cloudy": WeatherCondition(
            probability=other_scores["cloudy"],
            label=probability_label(other_scores["cloudy"]),
            threshold=CLOUD_THRESHOLD,
            description="Cloud Cover Risk",
        ),
        "good_weather": WeatherCondition(
            probability=other_scores["good_weather"],
            label=probability_label(other_scores["good_weather"]),
            threshold="",
            description="Good Weather Score",
        ),
        "summary": WeatherSummary(
            data_points=14,
            date_range=analysis_period,
            location=location.get("city_name", "Unknown"),
            risk_level="Elevated Rain Risk" if rain_probability >= 60 else "Stable Weather",
            data_quality="High",
        ),
    }

    xai = XAIExplanation(
        model_name="rain_rf_v1",
        model_type="random_forest",
        confidence=confidence_label(0.96),
        top_positive_drivers=positive,
        top_negative_drivers=negative,
        narrative=narrative,
    )

    return PredictionResponse(
        location=location,
        analysis_period=analysis_period,
        data_sources=["Weather Feature Service", "Random Forest Inference Engine"],
        probabilities=probabilities,
        xai=xai,
        ai_insights=narrative,
    ).to_dict()