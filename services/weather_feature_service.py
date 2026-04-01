from typing import Dict


def build_feature_vector(payload: Dict) -> Dict:
    return {
        "temperature": payload.get("temperature", 29.0),
        "humidity": payload.get("humidity", 78.0),
        "pressure": payload.get("pressure", 1006.0),
        "wind_speed": payload.get("wind_speed", 14.0),
        "cloud_cover": payload.get("cloud_cover", 82.0),
        "dew_point": payload.get("dew_point", 24.0),
    }