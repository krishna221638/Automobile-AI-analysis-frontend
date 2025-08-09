import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, Settings, Sparkles } from 'lucide-react';

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
    'Show average price by brand',
    'Plot horsepower vs price',
    'Display price distribution histogram',
    'Compare fuel efficiency by fuel type',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors"
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Sparkles className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
        Natural Language Query
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="query"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Enter your analysis request:
          </label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., show average price by brand"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            rows={3}
            disabled={isAnalyzing}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Chart Library:
              </label>
            </div>
            <select
              value={library}
              onChange={(e) => setLibrary(e.target.value as 'plotly' | 'matplotlib')}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              disabled={isAnalyzing}
            >
              <option value="plotly">Plotly</option>
              <option value="matplotlib">Matplotlib</option>
            </select>
          </div>

          <motion.button
            type="submit"
            disabled={!query.trim() || isAnalyzing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all flex items-center space-x-2 shadow-lg"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Analyze</span>
              </>
            )}
          </motion.button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Quick Examples:
        </p>
        <div className="flex flex-wrap gap-2">
          {exampleQueries.map((example, index) => (
            <motion.button
              key={index}
              onClick={() => setQuery(example)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-xs bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-500 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              {example}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ModernQueryInput;