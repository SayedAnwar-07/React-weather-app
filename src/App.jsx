import { useState } from "react";
import Navbar from "./components/Navbar";
import { fetchWeatherData } from "./utils/weatherDatas";
import CurrentData from "./components/CurrentData";
import WeeklyForecast from "./components/WeeklyForecast";
import HourlyForecast from "./components/HourlyForecast";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const handleToggle = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };
  const data = fetchWeatherData('Dhaka')
  console.log(data)

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
      <Navbar darkMode={darkMode} onToggle={handleToggle} />

      <main className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        <div className="md:col-span-1"><CurrentData darkMode={darkMode} city={'Dhaka'}/></div>
        <div className="md:col-span-3"><WeeklyForecast darkMode={darkMode} city={'Dhaka'}/></div>
        <div className="md:col-span-1"></div>
        <div className="md:col-span-3"><HourlyForecast darkMode={darkMode} city={'Dhaka'}/></div>
      </main>
    </div>
  );
};

export default App;
