import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { PiSunDim } from "react-icons/pi";
import { PiMoonStarsLight } from "react-icons/pi";
import logo from '../../public/logo.png'

const Navbar = ({ onToggle, darkMode, onSearch }) => {
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      onSearch?.(searchText.trim());
      setSearchText("");
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`sticky top-0 z-50 backdrop-blur-lg ${darkMode ? 'bg-gray-900/80' : 'bg-white/80'} shadow-sm`}
    >
      <nav className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent flex justify-center items-center"
        >
          <img src={logo} className="h-10 w-10" alt="" />
          Zephyr
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
            isFocused 
              ? darkMode 
                ? 'ring-2 ring-blue-400 bg-gray-800' 
                : 'ring-2 ring-blue-500 bg-gray-50'
              : darkMode 
                ? 'bg-gray-800' 
                : 'bg-gray-100'
          }`}
        >
          <MapPin 
            className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} 
          />
          <input
            type="text"
            placeholder="Search city..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full sm:w-64 bg-transparent focus:outline-none ${
              darkMode ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'
            }`}
          />
          <motion.button 
            type="submit"
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full ${
              darkMode 
                ? 'text-blue-400 hover:bg-gray-700' 
                : 'text-blue-600 hover:bg-gray-200'
            }`}
          >
            <Search className="h-5 w-5" />
          </motion.button>
        </motion.form>

        <motion.button
          onClick={onToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <PiMoonStarsLight className="h-5 w-5 text-yellow-400" />
          ) : (
            <PiSunDim className="h-5 w-5 text-blue-600" />
          )}
        </motion.button>
      </nav>
    </motion.section>
  );
};

export default Navbar;