import { useEffect, useState } from 'react';
import { 
  FiThermometer, 
  FiDroplet, 
  FiWind, 
  FiSun, 
  FiCloud, 
  FiNavigation,
  FiClock,
  FiCalendar
} from 'react-icons/fi';
import { fetchWeatherData } from '../utils/weatherDatas';
import { motion, AnimatePresence } from 'framer-motion';

const CurrentData = ({ city, darkMode }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getWeather = async () => {
      setLoading(true);
      try {
        const data = await fetchWeatherData(city);
        setWeather(data);
      } finally {
        setLoading(false);
      }
    };
    if (city) getWeather();
  }, [city]);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex items-center justify-center h-64 rounded-3xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}
      >
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin mb-3"></div>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Fetching weather...</p>
        </div>
      </motion.div>
    );
  }

  if (!weather) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex items-center justify-center h-64 rounded-3xl ${darkMode ? 'bg-gray-800/50 text-gray-300' : 'bg-gray-100/50 text-gray-600'}`}
      >
        <p>Enter a city to see weather data</p>
      </motion.div>
    );
  }

  const {
    current: { 
      temp_c, 
      feelslike_c, 
      humidity, 
      wind_kph, 
      wind_dir, 
      pressure_mb, 
      uv, 
      cloud, 
      condition 
    },
    location: { 
      country, 
      name, 
      localtime 
    },
  } = weather;

  const parsedTime = new Date(localtime);
  const formattedDate = parsedTime.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });
  const formattedTime = parsedTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // Weather card component for metrics
  const WeatherCard = ({ icon, title, value, unit, color }) => (
    <motion.div 
      whileHover={{ scale: 1.03 }}
      className={`flex flex-col items-center p-4 rounded-2xl backdrop-blur-sm ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}
    >
      <div className={`text-2xl mb-2 ${color}`}>{icon}</div>
      <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
      <p className="text-lg font-semibold">
        {value} <span className="text-sm opacity-80">{unit}</span>
      </p>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`mx-auto p-6 rounded-3xl transition-all duration-300
        ${darkMode
          ? 'text-white'
          : 'text-gray-800'
        }`}
    >
      {/* Location and Date */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FiNavigation className={`text-lg ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h2 className="text-xl font-bold">{name}, {country}</h2>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <FiCalendar className="opacity-70" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiClock className="opacity-70" />
              <span>{formattedTime}</span>
            </div>
          </div>
        </div>
        
        <div className={`mt-3 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium ${
          darkMode ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-100 text-blue-800'
        }`}>
          {condition.text}
        </div>
      </div>

      {/* Main Weather Display */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex items-center">
          <img 
            src={condition.icon} 
            alt={condition.text} 
            className="w-24 h-24" 
          />
          <div className="text-5xl font-light ml-2">
            {temp_c}°
            <span className="text-2xl opacity-80">C</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
          <WeatherCard 
            icon={<FiThermometer />} 
            title="Feels Like" 
            value={feelslike_c} 
            unit="°C" 
            color={darkMode ? 'text-orange-300' : 'text-orange-500'} 
          />
          <WeatherCard 
            icon={<FiDroplet />} 
            title="Humidity" 
            value={humidity} 
            unit="%" 
            color={darkMode ? 'text-blue-300' : 'text-blue-500'} 
          />
          <WeatherCard 
            icon={<FiWind />} 
            title="Wind" 
            value={wind_kph} 
            unit="km/h" 
            color={darkMode ? 'text-green-300' : 'text-green-500'} 
          />
          <WeatherCard 
            icon={<FiCloud />} 
            title="Clouds" 
            value={cloud} 
            unit="%" 
            color={darkMode ? 'text-gray-300' : 'text-gray-500'} 
          />
        </div>
      </div>

      {/* Additional Weather Data */}
      <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl ${
        darkMode ? 'bg-white/5' : 'bg-black/5'
      }`}>
        <div className="flex items-center gap-2">
          <FiSun className={`text-lg ${darkMode ? 'text-yellow-300' : 'text-yellow-500'}`} />
          <div>
            <p className="text-xs opacity-70">UV Index</p>
            <p className="font-medium">{uv}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FiWind className={`text-lg ${darkMode ? 'text-green-300' : 'text-green-500'}`} />
          <div>
            <p className="text-xs opacity-70">Wind Direction</p>
            <p className="font-medium">{wind_dir}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FiThermometer className={`text-lg ${darkMode ? 'text-red-300' : 'text-red-500'}`} />
          <div>
            <p className="text-xs opacity-70">Pressure</p>
            <p className="font-medium">{pressure_mb} mb</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CurrentData;