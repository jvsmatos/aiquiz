import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const getInitialTheme = () => {
        if(localStorage.theme){
            return localStorage.theme === 'dark';
        }
    };

    const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

    useEffect(() => {
        if(isDarkMode){
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }else{
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);
  
    return (
    <button 
    onClick={() => setIsDarkMode(!isDarkMode)} 
    className="fixed top-4 right-4 w-17 h-9 flex items-center bg-gray-300 dark:bg-gray-300 rounded-full p-1 transition-all"
    >
      <span
        className={`absolute bg-white dark:bg-black w-7 h-7 rounded-full shadow-md transform transition-all ${
          isDarkMode ? "translate-x-8" : "translate-x-0"
        }`}
      />
      <Sun className="absolute left-2 w-5 h-5 text-yellow-500 dark:text-gray-600" />
      <Moon className="absolute right-2 w-5 h-5 text-gray-600 dark:text-yellow-400" />
    </button>
  );
}