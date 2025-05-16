import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, 
  WiFog, WiDayCloudy, WiNightClear, WiHumidity 
} from 'react-icons/wi';
import { fetchWeatherHourly } from '../utils/weatherDatas';

const HourlyForecast = ({ darkMode, city }) => {
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentHour = new Date().getHours();

  const getWeatherIcon = (condition, isDay = true) => {
    const conditionText = typeof condition === 'string' ? condition.toLowerCase() : '';
    const iconSize = 24;

    if (conditionText.includes('sun') || conditionText.includes('clear')) {
      return isDay 
        ? <WiDaySunny size={iconSize} color="gold" /> 
        : <WiNightClear size={iconSize} color="gold" />;
    } else if (conditionText.includes('cloudy')) {
      return <WiCloudy size={iconSize} color="gray" />;
    } else if (conditionText.includes('overcast') || conditionText.includes('partly cloudy')) {
      return isDay 
        ? <WiDayCloudy size={iconSize} color="gray" /> 
        : <WiCloudy size={iconSize} color="gray" />;
    } else if (conditionText.includes('rain') || conditionText.includes('drizzle')) {
      return <WiRain size={iconSize} color="blue" />;
    } else if (conditionText.includes('snow')) {
      return <WiSnow size={iconSize} color="lightblue" />;
    } else if (conditionText.includes('thunder') || conditionText.includes('storm')) {
      return <WiThunderstorm size={iconSize} color="purple" />;
    } else if (conditionText.includes('fog') || conditionText.includes('mist')) {
      return <WiFog size={iconSize} color="gray" />;
    } else {
      return <WiDayCloudy size={iconSize} color="gray" />;
    }
  };

  useEffect(() => {
    const getHourlyData = async () => {
      setLoading(true);
      try {
        const data = await fetchWeatherHourly(city);
        if (data) {
          const sliced = data.slice(currentHour, currentHour + 12);
          setHourlyData(sliced);
        }
      } finally {
        setLoading(false);
      }
    };

    if (city) getHourlyData();
  }, [city]);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} shadow-sm`}
      >
        <div className="flex flex-col items-center justify-center h-40">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin mb-3"></div>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading hourly forecast...</p>
        </div>
      </motion.div>
    );
  }

  if (!hourlyData.length) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800/50 text-gray-300' : 'bg-white/50 text-gray-600'} shadow-sm`}
      >
        <p className="text-center py-10">Enter a city to see hourly forecast</p>
      </motion.div>
    );
  }

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Hourly Forecast</h2>
        <div className={`text-sm px-3 py-1 rounded-full ${
          darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
        }`}>
          Next 12 hours
        </div>
      </div>
      
      <div className="relative">
        <div className="flex overflow-x-auto p-8 gap-3 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-400/50 scrollbar-track-transparent">
          <AnimatePresence>
            {hourlyData.map((hour, idx) => {
              const isCurrentHour = idx === 0;
              const time = format(new Date(hour.time), 'ha');
              const isDay = new Date(hour.time).getHours() > 6 && new Date(hour.time).getHours() < 20;

              return (
                <motion.div
                  key={`${hour.time}-${idx}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className={`flex flex-col items-center min-w-[80px] px-4 py-4 rounded-xl backdrop-blur-sm transition-all ${
                    isCurrentHour
                      ? darkMode
                        ? 'bg-blue-600/20 ring-1 ring-blue-400'
                        : 'bg-blue-500/20 ring-1 ring-blue-500'
                      : darkMode
                        ? 'bg-white/5 hover:bg-white/10'
                        : 'bg-black/5 hover:bg-black/10'
                  }`}
                >
                  <p className={`text-sm mb-2 font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {time}
                  </p>
                  <div className={`mb-2 p-2 rounded-full ${
                    darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                  }`}>
                    {getWeatherIcon(hour.condition.text, isDay)}
                  </div>
                  <p className="text-lg font-bold">
                    {Math.round(hour.temp_c)}°
                  </p>
                  {hour.chance_of_rain > 0 && (
                    <div className={`mt-1 flex items-center gap-1 text-xs ${
                      darkMode ? 'text-blue-300' : 'text-blue-600'
                    }`}>
                      <WiHumidity size={16} />
                      <span>{hour.chance_of_rain}%</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default HourlyForecast;
