import React from "react";
import { Car, Moon, Sun, History, Trash2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";

interface NavbarProps {
  onToggleHistory: () => void;
  onClearHistory: () => void;
  historyCount: number;
}

const Navbar: React.FC<NavbarProps> = ({
  onToggleHistory,
  onClearHistory,
  historyCount,
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass sticky top-0 z-50 border-b border-white/20 backdrop-blur-xl"
    >
      <div className="max-w-7xl bg-black mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative">
              <Car className="h-8 w-8 text-white drop-shadow-lg" />
              <div className="absolute inset-0 h-8 w-8 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full blur-lg opacity-50 animate-pulse"></div>
            </div>
            <h1 className="text-xl font-bold text-white drop-shadow-lg">
              <span className="gradient-text bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Automobile Data Insights
              </span>
            </h1>
            <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
          </motion.div>

          <div className="flex items-center space-x-2">
            <motion.button
              onClick={onToggleHistory}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-white hover:from-primary-500/30 hover:to-secondary-500/30 transition-all duration-300 backdrop-blur-sm border border-white/20 shadow-lg"
            >
              <History className="h-5 w-5" />
              <span className="text-sm font-medium">History</span>
              <motion.span
                className="bg-gradient-to-r from-accent-400 to-warning-400 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg"
                animate={{ scale: historyCount > 0 ? [1, 1.1, 1] : 1 }}
                transition={{
                  duration: 0.5,
                  repeat: historyCount > 0 ? Infinity : 0,
                  repeatDelay: 2,
                }}
              >
                {historyCount}
              </motion.span>
            </motion.button>

            {historyCount > 0 && (
              <motion.button
                onClick={onClearHistory}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-2 rounded-xl bg-gradient-to-r from-error-500/20 to-warning-500/20 text-white hover:from-error-500/30 hover:to-warning-500/30 transition-all duration-300 backdrop-blur-sm border border-white/20 shadow-lg"
                title="Clear History"
              >
                <Trash2 className="h-5 w-5" />
              </motion.button>
            )}

            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05, y: -2, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl bg-gradient-to-r from-warning-500/20 to-accent-500/20 text-white hover:from-warning-500/30 hover:to-accent-500/30 transition-all duration-300 backdrop-blur-sm border border-white/20 shadow-lg"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <motion.div
                animate={{ rotate: isDark ? 0 : 180 }}
                transition={{ duration: 0.5 }}
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
