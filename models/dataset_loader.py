import numpy as np
import pandas as pd


def generate_weather_dataset(n_samples: int = 5000) -> pd.DataFrame:
    np.random.seed(42)

    temperature = np.random.uniform(20, 42, n_samples)
    humidity = np.random.uniform(30, 100, n_samples)
    pressure = np.random.uniform(980, 1025, n_samples)
    wind_speed = np.random.uniform(0, 40, n_samples)
    cloud_cover = np.random.uniform(0, 100, n_samples)

    pressure_drop = 1013 - pressure

    # Rain logic (hidden pattern)
    rain_prob = (
        0.4 * humidity +
        0.35 * cloud_cover +
        1.5 * pressure_drop +
        0.5 * wind_speed -
        0.3 * temperature
    )

    rain_prob = (rain_prob - rain_prob.min()) / (rain_prob.max() - rain_prob.min())
    rain = (rain_prob > 0.5).astype(int)

    df = pd.DataFrame({
        "temperature": temperature,
        "humidity": humidity,
        "pressure": pressure,
        "wind_speed": wind_speed,
        "cloud_cover": cloud_cover,
        "rain": rain
    })

    return df