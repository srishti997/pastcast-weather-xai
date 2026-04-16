import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import WeatherForm from './components/WeatherForm';
import WeatherResults from './components/WeatherResults';
import GlobalWeather from './components/GlobalWeather';
import ComparisonView from './components/ComparisonView';
import ComparisonResults from './components/ComparisonResults';
import EnhancedAIChat from './components/EnhancedAIChat';
import ChatbotWidget from './components/ChatbotWidget';
import LoadingScreen from './components/LoadingScreen';

import { LocationInput, WeatherDataV2 } from './types/weather';
import { predictExplainableWeather } from './services/xaiWeatherService';

type DatasetMode = 'IMD' | 'Global' | 'Combined';

function App() {
  const [weatherData, setWeatherData] = useState<WeatherDataV2 | null>(null);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [activeTab, setActiveTab] = useState<'weather' | 'global' | 'comparison' | 'chat'>('weather');
  const [isLoading, setIsLoading] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [showWeatherHighlight, setShowWeatherHighlight] = useState(false);

  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (isAppLoading) {
        setIsAppLoading(false);
        setActiveTab('weather');
        setShowWeatherHighlight(true);

        setTimeout(() => {
          setShowWeatherHighlight(false);
        }, 2000);
      }
    }, 10000);

    return () => clearTimeout(fallbackTimer);
  }, [isAppLoading]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.scroll-animate');
    animateElements.forEach((el) => observer.observe(el));

    return () => {
      animateElements.forEach((el) => observer.unobserve(el));
    };
  }, [activeTab]);

  const handleLoadingComplete = () => {
    setIsAppLoading(false);
    setActiveTab('weather');
    setShowWeatherHighlight(true);

    setTimeout(() => {
      setShowWeatherHighlight(false);
    }, 2000);
  };

  const handleWeatherSubmit = async (
    location: LocationInput,
    startDate: string,
    endDate?: string,
    datasetMode?: DatasetMode
  ) => {
    setIsLoading(true);

    try {
      const data = await predictExplainableWeather({
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          city_name: location.city_name,
        },
        analysis_period: startDate,
        features: {
          temperature: 29.0,
          humidity: 78.0,
          pressure: 1006.0,
          wind_speed: 14.0,
          cloud_cover: 82.0,
          dew_point: 24.0,
        },
      });

      setWeatherData(data);
      setShowComparison(false);
      setActiveTab('weather');
    } catch (error) {
      console.error('Error fetching explainable weather data:', error);
      alert('Failed to fetch explainable weather prediction.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComparisonSubmit = async (
    locations: LocationInput[],
    startDate: string,
    endDate?: string,
    datasetMode?: DatasetMode
  ) => {
    setIsLoading(true);

    try {
      const comparisonPromises = locations.map(async (location) => {
        const response = await fetch('http://localhost:8000/weather/probability', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            location,
            date_range: {
              start_date: startDate,
              end_date: endDate,
            },
            dataset_mode: datasetMode,
          }),
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();
      });

      const comparisonResults = await Promise.all(comparisonPromises);

      const builtComparisonData = {
        locations: comparisonResults.map((result, index) => ({
          location: result.location,
          probabilities: result.probabilities,
          data_quality: result.probabilities.summary.data_quality,
          risk_level: result.probabilities.summary.risk_level,
          name: result.location?.city_name || `Location ${index + 1}`,
        })),
        analysis_period: comparisonResults[0]?.analysis_period || 'Comparison Analysis',
        data_sources: comparisonResults[0]?.data_sources || [],
        comparison_summary: {
          best_locations: getBestLocations(comparisonResults),
          worst_locations: getWorstLocations(comparisonResults),
          overall_risk: calculateOverallRisk(comparisonResults),
        },
      };

      setComparisonData(builtComparisonData);
      setShowComparison(true);
      setActiveTab('comparison');
    } catch (error) {
      console.error('Error fetching comparison data:', error);
      alert('Failed to fetch comparison data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getBestLocations = (results: any[]) => {
    const bestLocations: { [key: string]: string } = {};
    const conditions = ['rain', 'extreme_heat', 'high_wind', 'cloudy', 'good_weather'];

    conditions.forEach((condition) => {
      let bestLocation = '';
      let bestValue = condition === 'good_weather' ? -1 : 999;

      results.forEach((result, index) => {
        const prob = result.probabilities[condition]?.probability;

        if (prob !== null && prob !== undefined) {
          if (condition === 'good_weather') {
            if (prob > bestValue) {
              bestValue = prob;
              bestLocation = result.location?.city_name || `Location ${index + 1}`;
            }
          } else {
            if (prob < bestValue) {
              bestValue = prob;
              bestLocation = result.location?.city_name || `Location ${index + 1}`;
            }
          }
        }
      });

      if (bestLocation) {
        bestLocations[condition] = bestLocation;
      }
    });

    return bestLocations;
  };

  const getWorstLocations = (results: any[]) => {
    const worstLocations: { [key: string]: string } = {};
    const conditions = ['rain', 'extreme_heat', 'high_wind', 'cloudy', 'good_weather'];

    conditions.forEach((condition) => {
      let worstLocation = '';
      let worstValue = condition === 'good_weather' ? 999 : -1;

      results.forEach((result, index) => {
        const prob = result.probabilities[condition]?.probability;

        if (prob !== null && prob !== undefined) {
          if (condition === 'good_weather') {
            if (prob < worstValue) {
              worstValue = prob;
              worstLocation = result.location?.city_name || `Location ${index + 1}`;
            }
          } else {
            if (prob > worstValue) {
              worstValue = prob;
              worstLocation = result.location?.city_name || `Location ${index + 1}`;
            }
          }
        }
      });

      if (worstLocation) {
        worstLocations[condition] = worstLocation;
      }
    });

    return worstLocations;
  };

  const calculateOverallRisk = (results: any[]) => {
    const riskLevels = results.map((result) => result.probabilities.summary.risk_level);

    const riskCounts = riskLevels.reduce((acc, risk) => {
      acc[risk] = (acc[risk] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return Object.keys(riskCounts).reduce((a, b) =>
      riskCounts[a] > riskCounts[b] ? a : b
    );
  };

  if (isAppLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <Header />

      <main className="container mx-auto px-4 py-4 relative z-10">
        <div className="flex justify-center mb-4">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-2 border border-white/10 shadow-xl">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('weather')}
                className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === 'weather'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                } ${showWeatherHighlight ? 'ring-4 ring-blue-400/50 animate-pulse' : ''}`}
              >
                Weather Forecast
              </button>

              <button
                onClick={() => setActiveTab('global')}
                className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === 'global'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Global Weather
              </button>

              <button
                onClick={() => setActiveTab('comparison')}
                className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === 'comparison'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Compare Locations
              </button>

              <button
                onClick={() => setActiveTab('chat')}
                className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === 'chat'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                AI Assistant
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'weather' && (
          <div id="weather-forecast-section" className="space-y-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-400 text-sm">
              ✅ Weather Forecast Tab is Active - Loading screen completed successfully!
            </div>

            {showWeatherHighlight && (
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-md rounded-2xl p-6 border border-blue-400/20 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      Welcome to PastCast Weather Forecast!
                    </h3>
                    <p className="text-white/80 text-sm">
                      Get historical weather probability data for any location and date range.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl">
                <WeatherForm onSubmit={handleWeatherSubmit} isLoading={isLoading} />
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl">
                {weatherData ? (
                  <WeatherResults data={weatherData} />
                ) : (
                  <div className="text-center text-white/70 py-12">
                    <div className="mb-4">
                      <svg className="w-16 h-16 mx-auto text-blue-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-medium">Enter location and date to get weather forecast</p>
                    <p className="text-sm mt-2">Select a location on the map and choose your date range</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'global' && (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl">
            <GlobalWeather />
          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl">
              <ComparisonView onSubmit={handleComparisonSubmit} isLoading={isLoading} />
            </div>

            {showComparison && comparisonData && (
              <div>
                <ComparisonResults data={comparisonData} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl">
            <EnhancedAIChat />
          </div>
        )}
      </main>

      <ChatbotWidget />
    </div>
  );
}

export default App;