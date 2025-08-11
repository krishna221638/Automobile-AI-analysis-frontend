import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, Settings, Sparkles, Zap, Brain } from 'lucide-react';

interface ModernQueryInputProps {
  onAnalyze: (query: string, library: 'plotly' | 'matplotlib') => void;
  isAnalyzing: boolean;
}

const ModernQueryInput: React.FC<ModernQueryInputProps> = ({ onAnalyze, isAnalyzing }) => {
  const [query, setQuery] = useState('');
  const [library, setLibrary] = useState<'plotly' | 'matplotlib'>('plotly');

  useEffect(() => {
    const handleSelectExample = (event: any) => {
      setQuery(event.detail);
    };

    window.addEventListener('selectExample', handleSelectExample);
    return () => window.removeEventListener('selectExample', handleSelectExample);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isAnalyzing) {
      onAnalyze(query.trim(), library);
    }
  };

  const exampleQueries = [
    { text: 'Show average price by brand', icon: '📊', color: 'from-blue-400 to-purple-500' },
    { text: 'Plot horsepower vs price', icon: '⚡', color: 'from-green-400 to-blue-500' },
    { text: 'Display price distribution histogram', icon: '📈', color: 'from-purple-400 to-pink-500' },
    { text: 'Compare fuel efficiency by fuel type', icon: '⛽', color: 'from-orange-400 to-red-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl shadow-2xl p-8 border border-white/20 backdrop-blur-xl"
    >
      <motion.div 
        className="flex items-center mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <Brain className="h-8 w-8 text-white mr-3" />
          <div className="absolute inset-0 h-8 w-8 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full blur-lg opacity-50 animate-pulse"></div>
        </div>
        <h2 className="text-2xl font-bold text-white">
          AI-Powered Data Analysis
        </h2>
        <Sparkles className="h-6 w-6 text-yellow-300 ml-2 animate-bounce" />
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label
            htmlFor="query"
            className="block text-lg font-semibold text-white mb-3 flex items-center"
          >
            <Search className="h-5 w-5 mr-2" />
            What would you like to discover?
          </label>
          <div className="relative">
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask me anything about the automobile data... e.g., 'show average price by brand'"
              className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl focus:ring-4 focus:ring-primary-500/50 focus:border-primary-400 resize-none text-white placeholder-white/60 text-lg transition-all duration-300 shadow-lg"
              rows={3}
              disabled={isAnalyzing}
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/20 to-accent-500/20 pointer-events-none opacity-0 transition-opacity duration-300 peer-focus:opacity-100"></div>
          </div>
        </motion.div>

        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Settings className="h-5 w-5 text-white/80" />
              <label className="text-lg font-medium text-white">
                Visualization Engine:
              </label>
            </div>
            <div className="relative">
              <select
                value={library}
                onChange={(e) => setLibrary(e.target.value as 'plotly' | 'matplotlib')}
                className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl px-4 py-2 text-white focus:ring-4 focus:ring-primary-500/50 focus:border-primary-400 transition-all duration-300 appearance-none cursor-pointer"
                disabled={isAnalyzing}
              >
                <option value="plotly" className="bg-gray-800 text-white">Interactive (Plotly)</option>
                <option value="matplotlib" className="bg-gray-800 text-white">Static (Matplotlib)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={!query.trim() || isAnalyzing}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white px-8 py-3 rounded-xl disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-3 shadow-2xl font-semibold text-lg"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                <span>Analyze</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </form>

      <motion.div 
        className="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-lg font-semibold text-white mb-4 flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-yellow-300" />
          Quick Start Examples:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {exampleQueries.map((example, index) => (
            <motion.button
              key={index}
              onClick={() => setQuery(example.text)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={`text-left p-4 rounded-xl bg-gradient-to-r ${example.color} bg-opacity-20 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 group shadow-lg`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                  {example.icon}
                </span>
                <span className="text-white font-medium group-hover:text-white transition-colors duration-300">
                  {example.text}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModernQueryInput;