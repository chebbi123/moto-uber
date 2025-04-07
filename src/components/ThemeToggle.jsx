import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleDark } = useTheme();

  return (
    <button
      onClick={toggleDark}
      className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 ease-in-out hover:shadow-md"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-gray-300" />
      ) : (
        <Moon className="h-5 w-5 text-gray-600" />
      )}
    </button>
  );
}