import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { fetchWeatherHourly, formatTo12Hour } from "../utils/weatherDatas";

const HourlyChart = ({ city }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchWeatherHourly(city);
      if (data) {
        const formatted = data.map((hour) => ({
          time: formatTo12Hour(hour.time.split(" ")[1]),
          temp: hour.temp_c,
        }));
        setChartData(formatted);
      }
    };

    if (city) fetchData();
  }, [city]);

  if (!chartData.length) {
    return <div className="text-center py-6 text-gray-500 dark:text-gray-300">Loading chart...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
          <YAxis unit="°C" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="temp"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Temp (°C)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HourlyChart;
