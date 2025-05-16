import React, { useEffect, useState } from 'react';
import { fetchWeatherForecast } from '../utils/weatherDatas';
import { 
  WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, 
  WiFog, WiDayCloudy, WiNightClear, WiHumidity 
} from 'react-icons/wi';
import { motion, AnimatePresence } from 'framer-motion';

const WeeklyForecast = ({ city, darkMode }) => {
  const [forecast, setForecast] = useState(null);
  const [activeTab, setActiveTab] = useState('7 Days');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getForecast = async () => {
      setLoading(true);
      try {
        const data = await fetchWeatherForecast(city);
        setForecast(data);
      } finally {
        setLoading(false);
      }
    };

    if (city) getForecast();
  }, [city]);
  const getWeatherIcon = (condition, isDay = true) => {
    const conditionText = condition.text.toLowerCase();
    const iconSize = 28;

    const weatherConditions = [
      {
      matches: ['sunny', 'clear'],
      dayIcon: <WiDaySunny size={iconSize} color="gold" />,
      nightIcon: <WiNightClear size={iconSize} color="gold" />
    },
    {
      matches: ['cloudy'],
      icon: <WiCloudy size={iconSize} color="gray" />
    },
    {
      matches: ['overcast', 'partly cloudy'],
      dayIcon: <WiDayCloudy size={iconSize} color="gray" />,
      nightIcon: <WiCloudy size={iconSize} color="gray" />
    },
    {
      matches: ['rain', 'drizzle', 'showers'],
      icon: <WiRain size={iconSize} color="blue" />
    },
    {
      matches: ['snow', 'blizzard', 'flurries'],
      icon: <WiSnow size={iconSize} color="lightblue" />
    },
    {
      matches: ['thunder', 'storm', 'lightning'],
      icon: <WiThunderstorm size={iconSize} color="purple" />
    },
    {
      matches: ['fog', 'mist', 'haze', 'smoke'],
      icon: <WiFog size={iconSize} color="gray" />
    },
    {
      matches: ['windy', 'breezy'],
      icon: <WiCloudy size={iconSize} color="gray" />
    },
    {
      matches: ['hail', 'sleet'],
      icon: <WiSnow size={iconSize} color="lightblue" />
    }
    ];

    const matchedCondition = weatherConditions.find(condition => 
      condition.matches.some(match => conditionText.includes(match))
    );

    if (matchedCondition) {
      if (matchedCondition.icon) {
        return matchedCondition.icon;
      }
      return isDay ? matchedCondition.dayIcon : matchedCondition.nightIcon;
    }

    return <WiDayCloudy size={iconSize} />;
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} shadow-sm`}
      >
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin mb-3"></div>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading forecast data...</p>
        </div>
      </motion.div>
    );
  }

  if (!forecast) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800/50 text-gray-300' : 'bg-white/50 text-gray-600'} shadow-sm`}
      >
        <div className="flex items-center justify-center h-64">
          <p>Enter a city to see forecast data</p>
        </div>
      </motion.div>
    );
  }

  const { forecast: { forecastday = [] } = {} } = forecast;
  const daysToShow = activeTab === '7 Days' ? 7 : 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-6 transition-all duration-300 ${
        darkMode 
          ? 'text-white' 
          : 'text-gray-800'
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold">Weekly Forecast</h2>
        
        <div className={`flex p-1 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          {['7 Days', '10 Days'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab 
                  ? darkMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-500 text-white'
                  : darkMode 
                    ? 'text-gray-300 hover:bg-gray-600' 
                    : 'text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        <AnimatePresence>
          {forecastday.slice(0, daysToShow).map((day) => {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const formattedDate = `${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
            
            return (
              <motion.div 
                key={day.date}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.02 }}
                className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                  darkMode 
                    ? 'hover:bg-gray-700/50' 
                    : 'hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-4 w-1/3">
                  <div className={`p-2 rounded-full ${
                    darkMode 
                      ? 'bg-blue-900/30 text-blue-300' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {getWeatherIcon(day.day.condition)}
                  </div>
                  <div>
                    <p className="font-medium">{dayName}</p>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>{formattedDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`text-right ${
                    darkMode ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    <span className="font-bold">{day.day.maxtemp_c}°</span>
                  </div>
                  <div className={`text-right ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <span>{day.day.mintemp_c}°</span>
                  </div>
                </div>
                
                <div className="hidden md:flex items-center gap-2 w-1/3 justify-end">
                  <WiHumidity size={20} className={
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  } />
                  <span className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>{day.day.avghumidity}%</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default WeeklyForecast;