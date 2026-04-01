from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer


def build_preprocessor():
    numeric_features = [
        "temperature",
        "humidity",
        "pressure",
        "wind_speed",
        "cloud_cover"
    ]

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numeric_features)
        ]
    )

    return preprocessor