import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { fetchWeatherHourly } from '../utils/weatherDatas';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, 
  WiFog, WiDayCloudy, WiNightClear, WiHumidity 
} from 'react-icons/wi';

const HourlyChart = ({ city, darkMode }) => {
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentHour = new Date().getHours();

  const getWeatherIcon = (condition, isDay = true) => {
    const conditionText = typeof condition === 'string' ? condition.toLowerCase() : '';
    const iconSize = 20;

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
          const chartData = data.slice(currentHour, currentHour + 12).map((hour) => {
            const date = new Date(hour.time);
            const time = date.toLocaleTimeString('en-US', {
              hour: 'numeric',
              hour12: true,
            });

            return {
              time,
              temperature: hour.temp_c,
              rain: hour.chance_of_rain || 0,
              isDay: hour.is_day === 1,
              condition: hour.condition?.text || '',
              conditionText: hour.condition?.text || '',
              timeFull: hour.time
            };
          });
          setHourlyData(chartData);
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
          ? ' text-white' 
          : ' to-white text-gray-800'
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
      
      <div className="h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={hourlyData}>
            <XAxis
              dataKey="time"
              tick={{ fill: darkMode ? '#d1d5db' : '#4B5563', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '8px',
                backdropFilter: 'blur(6px)',
                color: darkMode ? '#fff' : '#111',
                boxShadow: darkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: darkMode ? '#fff' : '#333', fontWeight: 500 }}
              formatter={(value, name) => [`${value}${name === 'temperature' ? '°C' : '%'}`, name === 'temperature' ? 'Temperature' : 'Chance of rain']}
            />
            <Area
              type="monotone"
              dataKey="temperature"
              stroke={darkMode ? '#60A5FA' : '#3B82F6'}
              strokeWidth={3}
              fill="url(#colorTemp)"
              dot={{ r: 4, fill: darkMode ? '#93C5FD' : '#3B82F6', strokeWidth: 2, stroke: darkMode ? '#1E40AF' : '#1D4ED8' }}
            >
              <LabelList
                dataKey="temperature"
                position="top"
                style={{ 
                  fill: darkMode ? '#E5E7EB' : '#374151', 
                  fontSize: 12,
                  fontWeight: 500
                }}
                formatter={(val) => `${val}°`}
              />
            </Area>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={darkMode ? '#3B82F6' : '#60A5FA'} stopOpacity={0.4} />
                <stop offset="95%" stopColor={darkMode ? '#3B82F6' : '#60A5FA'} stopOpacity={0.05} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="relative mt-4">
        <div className="flex overflow-x-auto p-2 gap-2 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-400/50 scrollbar-track-transparent">
          <AnimatePresence>
            {hourlyData.map((hour, idx) => {
              const isCurrentHour = idx === 0;
              const isDay = new Date(hour.timeFull).getHours() > 6 && new Date(hour.timeFull).getHours() < 20;

              return (
                <motion.div
                  key={`${hour.timeFull}-${idx}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className={`flex flex-col items-center min-w-[60px] px-3 py-3 rounded-xl backdrop-blur-sm transition-all ${
                    isCurrentHour
                      ? darkMode
                        ? 'bg-blue-600/20 ring-1 ring-blue-400'
                        : 'bg-blue-500/20 ring-1 ring-blue-500'
                      : darkMode
                        ? 'bg-white/5 hover:bg-white/10'
                        : 'bg-black/5 hover:bg-black/10'
                  }`}
                >
                  <p className={`text-xs mb-1 font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {hour.time}
                  </p>
                  <div className={`mb-1 p-1 rounded-full ${
                    darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                  }`}>
                    {getWeatherIcon(hour.conditionText, isDay)}
                  </div>
                  {hour.rain > 0 && (
                    <div className={`flex items-center gap-1 text-xs ${
                      darkMode ? 'text-blue-300' : 'text-blue-600'
                    }`}>
                      <WiHumidity size={14} />
                      <span>{hour.rain}%</span>
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

export default HourlyChart;