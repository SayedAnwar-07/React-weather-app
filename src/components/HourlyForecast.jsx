import React, { useEffect, useState } from 'react';
import { fetchWeatherHourly } from '../utils/weatherDatas';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FaCloudRain, FaWind } from 'react-icons/fa';

const formatTo12Hour = (timeStr) => {
  const [hour, minute] = timeStr.split(':');
  const hourNum = parseInt(hour, 10);
  const ampm = hourNum >= 12 ? 'PM' : 'AM';
  const formattedHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
  return `${formattedHour}:${minute} ${ampm}`;
};

const HourlyForecast = ({ city }) => {
  const [hourlyData, setHourlyData] = useState([]);

  useEffect(() => {
    const getHourly = async () => {
      const data = await fetchWeatherHourly(city);
      if (data) {
        const formatted = data.map((hour) => ({
          time: formatTo12Hour(hour.time.split(' ')[1]),
          temp: hour.temp_c,
          rain: hour.chance_of_rain,
          wind: hour.wind_kph,
        }));
        setHourlyData(formatted);
      }
    };

    if (city) getHourly();
  }, [city]);

  if (!hourlyData.length) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-10">
        Loading hourly forecast...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={hourlyData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} />
            <YAxis unit="°C" />
            <Tooltip />
            <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={2} name="Temp (°C)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8 text-sm">
        {hourlyData.map((hour) => (
          <div
            key={hour.time}
            className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-md text-center space-y-2"
          >
            <p className="font-semibold text-gray-800 dark:text-white">{hour.time}</p>
            <p className="text-blue-600 dark:text-blue-300">Temp: {hour.temp}°C</p>
            <p className="flex items-center justify-center text-sky-600 dark:text-sky-400">
              <FaCloudRain className="mr-1" />
              {hour.rain}%
            </p>
            <p className="flex items-center justify-center text-gray-600 dark:text-gray-300">
              <FaWind className="mr-1" />
              {hour.wind} kph
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
