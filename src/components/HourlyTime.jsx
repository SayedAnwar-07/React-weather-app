import React, { useEffect, useState } from "react";
import { FaCloudRain, FaWind } from "react-icons/fa";
import { fetchWeatherHourly, formatTo12Hour } from "../utils/weatherDatas";
;

const HourlyTime = ({ city }) => {
  const [hourlyData, setHourlyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchWeatherHourly(city);
      if (data) {
        const formatted = data.map((hour) => ({
          time: formatTo12Hour(hour.time.split(" ")[1]),
          temp: hour.temp_c,
          rain: hour.chance_of_rain,
          wind: hour.wind_kph,
        }));
        setHourlyData(formatted);
      }
    };

    if (city) fetchData();
  }, [city]);

  if (!hourlyData.length) {
    return <div className="text-center py-6 text-gray-500 dark:text-gray-300">Loading hourly data...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {hourlyData.map((hour) => (
        <div key={hour.time} className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow text-center space-y-1">
          <p className="font-semibold text-gray-800 dark:text-white">{hour.time}</p>
          <p className="text-blue-600 dark:text-blue-300">Temp: {hour.temp}°C</p>
          <p className="flex justify-center items-center text-sky-600 dark:text-sky-400">
            <FaCloudRain className="mr-1" /> {hour.rain}%
          </p>
          <p className="flex justify-center items-center text-gray-600 dark:text-gray-300">
            <FaWind className="mr-1" /> {hour.wind} kph
          </p>
        </div>
      ))}
    </div>
  );
};

export default HourlyTime;
