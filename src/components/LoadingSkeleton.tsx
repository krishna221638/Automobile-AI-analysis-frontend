import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Chart Skeleton */}
      <motion.div 
        className="glass rounded-2xl shadow-2xl p-8 border border-white/20 backdrop-blur-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full animate-pulse"></div>
            <div className="h-8 bg-gradient-to-r from-white/20 to-white/10 rounded-xl w-48 animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-8 bg-gradient-to-r from-white/20 to-white/10 rounded-xl w-24 animate-pulse"></div>
            <div className="h-8 bg-gradient-to-r from-success-400 to-success-500 rounded-xl w-20 animate-pulse"></div>
          </div>
        </div>
        
        <div className="relative">
          <div className="w-full h-96 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl animate-pulse border border-white/10"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="loading-dots">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Summary and Data Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          className="glass rounded-2xl shadow-2xl p-8 border border-white/20 backdrop-blur-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-7 h-7 bg-gradient-to-r from-accent-400 to-warning-400 rounded-full animate-pulse"></div>
            <div className="h-6 bg-gradient-to-r from-white/20 to-white/10 rounded-xl w-32 animate-pulse"></div>
          </div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="h-4 bg-gradient-to-r from-white/20 to-white/10 rounded-lg animate-pulse"
                style={{ width: `${Math.random() * 40 + 60}%` }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              ></motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="glass rounded-2xl shadow-2xl p-8 border border-white/20 backdrop-blur-xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full animate-pulse"></div>
              <div className="h-6 bg-gradient-to-r from-white/20 to-white/10 rounded-xl w-32 animate-pulse"></div>
            </div>
            <div className="h-8 bg-gradient-to-r from-primary-400 to-primary-500 rounded-xl w-20 animate-pulse"></div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
            <div className="bg-white/10 p-4 border-b border-white/10">
              <div className="flex space-x-4">
                {[...Array(4)].map((_, j) => (
                  <div
                    key={j}
                    className="h-4 bg-gradient-to-r from-white/30 to-white/20 rounded flex-1 animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="flex space-x-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  {[...Array(4)].map((_, j) => (
                    <div
                      key={j}
                      className="h-4 bg-gradient-to-r from-white/20 to-white/10 rounded flex-1 animate-pulse"
                    ></div>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;