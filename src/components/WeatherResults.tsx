import React from 'react';
import { WeatherDataV2 } from '../types/weather';

export interface WeatherResultsProps {
  data: WeatherDataV2;
  isComparison?: boolean;
}

type Condition = {
  probability: number | null;
  label: string;
  threshold?: string;
  description: string;
};

const WeatherResults: React.FC<WeatherResultsProps> = ({ data, isComparison = false }) => {
  const { location, probabilities, ai_insights, data_sources, analysis_period, xai } = data;

  const conditions: [string, Condition][] = Object.entries(probabilities).filter(
    ([key]) => key !== 'summary'
  ) as [string, Condition][];

  return (
    <div className={`relative ${isComparison ? 'h-fit' : ''}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl blur-xl"></div>
      <div className="relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent break-words">
                {location.city_name || `${location.latitude.toFixed(2)}°N, ${location.longitude.toFixed(2)}°E`}
              </h3>
              <p className="text-white/70 text-sm font-medium">{analysis_period}</p>
            </div>
          </div>
          <div className="text-right sm:text-right">
            <div className="text-lg sm:text-xl font-bold text-white bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {probabilities.summary.risk_level}
            </div>
            <div className="text-sm text-white/70 font-medium">
              {probabilities.summary.data_quality} Quality
            </div>
          </div>
        </div>

        {/* Probability Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {conditions.map(([key, condition], index: number) => {
            const rawThreshold = condition.threshold || '';
            const annotated = rawThreshold.replace('35°C', '35°C (Global)').replace('40°C', '40°C (India)');
            const cleaned = annotated.replace(/^\s*[>≥]\s*/, '');
            const showThreshold = !isComparison && key !== 'good_weather' && cleaned.trim().length > 0;

            return (
              <div
                key={key}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 transform hover:scale-105 animate-in fade-in-50 relative overflow-hidden group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {key === 'high_wind' && (
                  <div className="absolute top-4 right-4 text-2xl text-white/90">
                    💨
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <h4 className="text-white font-semibold text-lg leading-tight mb-2">
                      {condition.description}
                    </h4>
                    {key === 'rain' && <div className="text-2xl text-white/90 translate-y-1">🌧️</div>}
                    {key === 'cloudy' && <div className="text-2xl text-white/90 translate-y-1">☁️</div>}
                    {key === 'extreme_heat' && <div className="text-2xl text-white/90 translate-y-1">☀️</div>}
                  </div>
                </div>

                <div className="space-y-4">
                  {condition.probability === null ? (
                    <div className="text-white/70 text-sm italic">No data available</div>
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-white bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        {condition.probability.toFixed(2)}%
                      </div>

                      <div className="w-full bg-white/10 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-700 shadow-lg shadow-blue-500/25"
                          style={{ width: `${Math.min(100, Math.max(0, condition.probability))}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between text-white/70 text-xs mt-1">
                        <span className="font-semibold">{condition.label}</span>
                        {showThreshold && <span className="text-white/60">{cleaned}</span>}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Insights */}
        {ai_insights && !isComparison && (
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-6 mb-8 border border-white/10 shadow-lg">
            <h4 className="text-white font-semibold text-lg mb-3">AI Insights</h4>
            <p className="text-white/80 text-sm leading-relaxed">{ai_insights}</p>
          </div>
        )}

        {/* XAI Insights */}
        {xai && !isComparison && (
          <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl p-6 mb-8 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold text-lg">Explainable AI Insights</h4>
              <span className="text-sm text-white/70">
                {xai.model_name} · {xai.confidence} confidence
              </span>
            </div>

            <p className="text-white/80 text-sm leading-relaxed mb-4">
              {xai.narrative}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-white font-medium mb-2">Top Positive Drivers</h5>
                <div className="space-y-2">
                  {xai.top_positive_drivers?.map((item, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm text-white/80 bg-white/5 rounded-lg px-3 py-2"
                    >
                      <span>{item.feature.replace(/_/g, ' ')}</span>
                      <span>+{item.impact}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-white font-medium mb-2">Top Negative Drivers</h5>
                <div className="space-y-2">
                  {xai.top_negative_drivers?.map((item, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm text-white/80 bg-white/5 rounded-lg px-3 py-2"
                    >
                      <span>{item.feature.replace(/_/g, ' ')}</span>
                      <span>{item.impact}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Sources */}
        {!isComparison && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-400 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="text-white font-semibold text-lg">Data Sources</h4>
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
              {data_sources.map((source: string, index: number) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-200 px-4 py-2 rounded-lg text-sm font-medium border border-blue-400/20"
                >
                  {source}
                </span>
              ))}
            </div>

            <div className="text-white/60 text-sm">
              Analysis based on <span className="font-semibold text-white">{probabilities.summary.data_points}</span>{' '}
              data points from <span className="font-semibold text-white">{probabilities.summary.date_range}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherResults;