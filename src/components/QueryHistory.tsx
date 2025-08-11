import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Sparkles, History } from 'lucide-react';
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 glass shadow-2xl z-50 overflow-y-auto border-l border-white/20"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <History className="h-7 w-7 text-white" />
                    <div className="absolute inset-0 h-7 w-7 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full blur-lg opacity-50 animate-pulse"></div>
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Query History
                  </h2>
                  <Sparkles className="h-5 w-5 text-yellow-300 animate-bounce" />
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-xl bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              <div className="space-y-4">
                {history.length === 0 ? (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-white/60 text-lg">No queries yet</p>
                    <p className="text-white/40 text-sm mt-2">Your analysis history will appear here</p>
                  </motion.div>
                ) : (
                  history.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 20, x: 20 }}
                      animate={{ opacity: 1, y: 0, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => onSelectQuery(item.id)}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                        activeQueryId === item.id
                          ? 'bg-gradient-to-r from-primary-500/30 to-accent-500/30 border-primary-400/50 shadow-lg shadow-primary-500/20'
                          : 'bg-white/5 backdrop-blur-sm border-white/20 hover:border-white/40 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-3 h-3 rounded-full mt-2 ${
                          activeQueryId === item.id 
                            ? 'bg-gradient-to-r from-primary-400 to-accent-400 animate-pulse' 
                            : 'bg-white/30'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium line-clamp-2 mb-2">
                            {item.query}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-white/60 text-xs">
                              {item.timestamp.toLocaleTimeString()}
                            </p>
                            {item.result.success && (
                              <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-success-400 rounded-full"></div>
                                <span className="text-success-300 text-xs font-medium">
                                  {item.result.data_points} points
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))
                )}
              </div>

              {history.length > 0 && (
                <motion.div 
                  className="mt-8 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center space-x-2 text-white/70 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Keeping your last {history.length} queries</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QueryHistory;