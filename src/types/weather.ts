export interface LocationInput {
  latitude: number;
  longitude: number;
  city_name?: string;
}

export interface WeatherCondition {
  probability: number | null;
  label: string;
  threshold: string;
  description: string;
}

export interface WeatherSummary {
  data_points: number;
  date_range: string;
  location: string;
  risk_level: string;
  data_quality: string;
}

export interface WeatherData {
  location: {
    latitude: number;
    longitude: number;
    city_name?: string;
  };
  date_range: {
    start_date: string;
    end_date?: string;
  };
  probabilities: {
    rain: WeatherCondition;
    extreme_heat: WeatherCondition;
    high_wind: WeatherCondition;
    cloudy: WeatherCondition;
    good_weather: WeatherCondition;
    summary: WeatherSummary;
  };
  ai_insights?: string;
  data_sources: string[];
  analysis_period: string;
  dataset_mode?: 'IMD' | 'Global' | 'Combined';
}

export interface ComparisonResult {
  location: {
    latitude: number;
    longitude: number;
    city_name?: string;
  };
  probabilities: {
    rain: WeatherCondition;
    extreme_heat: WeatherCondition;
    high_wind: WeatherCondition;
    cloudy: WeatherCondition;
    good_weather: WeatherCondition;
    summary: WeatherSummary;
  };
}

export interface ComparisonSummary {
  best_locations: Record<string, [string, number]>;
  worst_locations: Record<string, [string, number]>;
  total_locations: number;
  comparison_date: string;
}
export interface FeatureImpact {
  feature: string;
  impact: number;
}

export interface XAIExplanation {
  model_name: string;
  model_type: string;
  confidence: string;
  top_positive_drivers: FeatureImpact[];
  top_negative_drivers: FeatureImpact[];
  narrative: string;
}

export interface WeatherDataV2 extends WeatherData {
  xai?: XAIExplanation;
}