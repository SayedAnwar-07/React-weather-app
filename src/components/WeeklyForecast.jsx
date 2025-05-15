import React, { useEffect, useState } from 'react';
import { fetchWeatherForecast } from '../utils/weatherDatas';
import { FaTemperatureHigh, FaTemperatureLow, FaCloudRain } from 'react-icons/fa';

const WeeklyForecast = ({ city }) => {
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    const getForecast = async () => {
      const data = await fetchWeatherForecast(city);
      setForecast(data);
    };

    if (city) getForecast();
  }, [city]);

  if (!forecast) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-10">
        Loading forecast data...
      </div>
    );
  }

  const { forecast: { forecastday = [] } = {} } = forecast;

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {forecastday.map((day) => (
          <div key={day.date} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-700 dark:text-gray-200">{day.date}</span>
              <img src={day.day.condition.icon} alt={day.day.condition.text} className="w-10 h-10" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{day.day.condition.text}</p>
            <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-300">
              <FaTemperatureHigh />
              <span>Max: {day.day.maxtemp_c}°C</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-orange-500 dark:text-orange-300 mt-1">
              <FaTemperatureLow />
              <span>Min: {day.day.mintemp_c}°C</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-sky-600 dark:text-sky-400 mt-1">
              <FaCloudRain />
              <span>Rain: {day.day.daily_chance_of_rain}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyForecast;
