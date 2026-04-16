import { WeatherDataV2 } from '../types/weather';

interface PredictRequest {
  location: {
    latitude: number;
    longitude: number;
    city_name?: string;
  };
  analysis_period: string;
  features: {
    temperature?: number;
    humidity?: number;
    pressure?: number;
    wind_speed?: number;
    cloud_cover?: number;
    dew_point?: number;
  };
}

export async function predictExplainableWeather(
  payload: PredictRequest
): Promise<WeatherDataV2> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch('http://localhost:8000/api/v2/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch explainable weather prediction: ${text}`);
    }

    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}