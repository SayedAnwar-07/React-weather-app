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
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
      <Navbar darkMode={darkMode} onToggle={handleToggle} onSearch={handleSearch} />

      <main className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
        <div className="md:col-span-1">
          <CurrentData darkMode={darkMode} city={city} />
        </div>
        <div className="md:col-span-3">
          <WeeklyForecast darkMode={darkMode} city={city} />
        </div>
        <div className="md:col-span-1">
          <HourlyTime darkMode={darkMode} city={city} />
        </div>
        <div className="md:col-span-3">
          <HourlyChart darkMode={darkMode} city={city} />
        </div>
      </main>
    </div>
  );
};

export default App;
