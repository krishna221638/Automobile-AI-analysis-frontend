import React from 'react';
import { Car, Moon, Sun, History, Trash2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface NavbarProps {
  onToggleHistory: () => void;
  onClearHistory: () => void;
  historyCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleHistory, onClearHistory, historyCount }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Car className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Automobile Data Insights
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleHistory}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <History className="h-5 w-5" />
              <span className="text-sm">History ({historyCount})</span>
            </button>

            {historyCount > 0 && (
              <button
                onClick={onClearHistory}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Clear History"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;