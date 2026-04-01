from typing import List
from models.schemas import FeatureImpact


FRIENDLY_NAMES = {
    "humidity": "humidity",
    "cloud_cover": "cloud cover",
    "pressure_drop": "pressure drop",
    "temperature": "temperature",
    "wind_speed": "wind speed",
    "dew_point": "dew point",
}


def feature_name(name: str) -> str:
    return FRIENDLY_NAMES.get(name, name.replace("_", " "))


def build_narrative(positive: List[FeatureImpact], negative: List[FeatureImpact], target: str) -> str:
    pos_text = ", ".join(feature_name(item.feature) for item in positive[:3])
    neg_text = ", ".join(feature_name(item.feature) for item in negative[:2])

    if positive and negative:
        return (
            f"The model predicts {target} mainly because {pos_text} increased the score, "
            f"while {neg_text} slightly reduced it."
        )
    if positive:
        return f"The model predicts {target} mainly because {pos_text} strongly increased the score."
    if negative:
        return f"The model prediction for {target} was mostly reduced by {neg_text}."
    return f"The model generated a {target} prediction, but feature contribution details were limited."