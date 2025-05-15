import React, { useEffect, useState } from 'react';
import { FaCloud, FaTemperatureLow, FaClock, FaMapMarkerAlt, FaSun, FaMoon } from 'react-icons/fa';
import { fetchWeatherData } from '../utils/weatherDatas';

const CurrentData = ({ city }) => {
  const [weather, setWeather] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const getWeather = async () => {
      const data = await fetchWeatherData(city);
      setWeather(data);
    };

    if (city) getWeather();
  }, [city]);

  if (!weather) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-10 transition-colors duration-500">
        Loading weather data...
      </div>
    );
  }

  const {
    current: { cloud, condition, feelslike_c, temp_c },
    location: { country, name, localtime },
  } = weather;

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} 
                    max-w-md mx-auto rounded-3xl p-8 mt-10 shadow-2xl transition-colors duration-700`}>
      {/* Dark mode toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center space-x-2 focus:outline-none"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? (
            <>
              <FaSun className="text-yellow-400" />
              <span className="text-sm">Light Mode</span>
            </>
          ) : (
            <>
              <FaMoon className="text-gray-700" />
              <span className="text-sm">Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Weather Condition */}
      <div className="flex items-center space-x-5">
        <img
          src={condition.icon}
          alt={condition.text}
          className="w-20 h-20 animate-pulse"
          loading="lazy"
        />
        <div>
          <h2 className="text-3xl font-extrabold tracking-wide">{condition.text}</h2>
          <p className="flex items-center space-x-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
            <FaCloud className="inline-block" />
            <span>Cloud Cover: <span className="font-semibold">{cloud}%</span></span>
          </p>
        </div>
      </div>

      {/* Temperature and Location Grid */}
      <div className="grid grid-cols-2 gap-6 mt-8 text-lg font-medium">
        <div className="flex items-center space-x-3 bg-blue-100 dark:bg-blue-800 rounded-xl p-3 shadow-md">
          <FaTemperatureLow className="text-blue-600 dark:text-blue-300 text-2xl" />
          <span>Temp: <span className="font-bold">{temp_c}°C</span></span>
        </div>
        <div className="flex items-center space-x-3 bg-orange-100 dark:bg-orange-800 rounded-xl p-3 shadow-md">
          <FaTemperatureLow className="text-orange-500 dark:text-orange-300 text-2xl" />
          <span>Feels Like: <span className="font-bold">{feelslike_c}°C</span></span>
        </div>
        <div className="flex items-center space-x-3 bg-green-100 dark:bg-green-800 rounded-xl p-3 shadow-md">
          <FaMapMarkerAlt className="text-green-600 dark:text-green-300 text-2xl" />
          <span>{name}, <span className="font-semibold">{country}</span></span>
        </div>
        <div className="flex items-center space-x-3 bg-gray-200 dark:bg-gray-700 rounded-xl p-3 shadow-md">
          <FaClock className="text-gray-700 dark:text-gray-300 text-2xl" />
          <span>{localtime}</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentData;
