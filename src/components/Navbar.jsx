import { useState } from "react";
import { Sun, Moon, Search } from "lucide-react";

const Navbar = ({ onToggle, darkMode, onSearch }) => {
  const [searchText, setSearchText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      onSearch?.(searchText.trim());
      setSearchText("");
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900 shadow-md">
        <nav className="flex items-center justify-between px-4 py-3 container mx-auto">
        <div className="text-2xl font-bold text-blue-600 dark:text-yellow-400">WeatherApp</div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
            type="text"
            placeholder="Search city..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none"
            />
            <button type="submit" className="p-2 text-blue-600 dark:text-yellow-400">
            <Search />
            </button>
        </form>

        <button onClick={onToggle} className="p-2 rounded-full text-gray-700 dark:text-gray-100">
            {darkMode ? <Sun /> : <Moon />}
        </button>
        </nav>
    </section>
  );
};

export default Navbar;
