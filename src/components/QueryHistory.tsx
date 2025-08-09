import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X } from 'lucide-react';
import type { QueryHistoryItem } from '../hooks/useQueryHistory';

interface QueryHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: QueryHistoryItem[];
  activeQueryId: string | null;
  onSelectQuery: (id: string) => void;
}

const QueryHistory: React.FC<QueryHistoryProps> = ({
  isOpen,
  onClose,
  history,
  activeQueryId,
  onSelectQuery,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Query History
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                {history.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No queries yet
                  </p>
                ) : (
                  history.map((item) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => onSelectQuery(item.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        activeQueryId === item.id
                          ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                        {item.query}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {item.timestamp.toLocaleTimeString()}
                      </p>
                    </motion.button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QueryHistory;