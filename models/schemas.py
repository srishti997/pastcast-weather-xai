from dataclasses import dataclass, asdict
from typing import List, Dict, Optional


@dataclass
class FeatureImpact:
    feature: str
    impact: float


@dataclass
class WeatherCondition:
    probability: Optional[float]
    label: str
    threshold: str
    description: str


@dataclass
class WeatherSummary:
    data_points: int
    date_range: str
    location: str
    risk_level: str
    data_quality: str


@dataclass
class XAIExplanation:
    model_name: str
    model_type: str
    confidence: str
    top_positive_drivers: List[FeatureImpact]
    top_negative_drivers: List[FeatureImpact]
    narrative: str


@dataclass
class PredictionResponse:
    location: Dict
    analysis_period: str
    data_sources: List[str]
    probabilities: Dict
    xai: XAIExplanation
    ai_insights: str

    def to_dict(self):
        return asdict(self)