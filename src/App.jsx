import { useState } from "react";
import Navbar from "./components/Navbar";
import CurrentData from "./components/CurrentData";
import WeeklyForecast from "./components/WeeklyForecast";
import HourlyChart from "./components/HourlyChart";
import HourlyTime from "./components/HourlyTime";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [city, setCity] = useState("Dhaka");

  const handleToggle = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleSearch = (searchCity) => {
    setCity(searchCity);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <Navbar darkMode={darkMode} onToggle={handleToggle} onSearch={handleSearch} />

      <main className="container mx-auto p-4 lg:p-6">
        {/* Top Row - Current Weather */}
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className={`rounded-2xl p-6 shadow-lg ${darkMode ? "bg-gradient-to-br from-gray-800 to-gray-900" : "bg-gradient-to-br from-blue-50 to-white"}`}>
              <CurrentData darkMode={darkMode} city={city} />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className={`rounded-2xl p-6 h-full shadow-lg ${darkMode ? "bg-gradient-to-br from-gray-800 to-gray-900" : "bg-gradient-to-br from-blue-50 to-white"}`}>
              <HourlyTime darkMode={darkMode} city={city} />
            </div>
          </div>
        </div>

        {/* Bottom Row - Forecast and Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className={`rounded-2xl p-6 shadow-lg ${darkMode ? "bg-gradient-to-br from-gray-800 to-gray-900" : "bg-gradient-to-br from-blue-50 to-white"}`}>
              <WeeklyForecast darkMode={darkMode} city={city} />
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className={`rounded-2xl p-6 shadow-lg ${darkMode ? "bg-gradient-to-br from-gray-800 to-gray-900" : "bg-gradient-to-br from-blue-50 to-white"}`}>
              <HourlyChart darkMode={darkMode} city={city} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;