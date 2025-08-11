import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Scatter, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { Download, Image as ImageIcon, FileText, TrendingUp, BarChart3, Activity } from 'lucide-react';
import type { AnalysisResult } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ModernChartDisplayProps {
  result: AnalysisResult;
  onDownload: () => void;
}

const ModernChartDisplay: React.FC<ModernChartDisplayProps> = ({ result, onDownload }) => {
  const chartRef = useRef<any>(null);
  
  // Get current theme
  const isDark = document.documentElement.classList.contains('dark');

  if (!result.success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 border border-red-500/30 backdrop-blur-xl"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">⚠️</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Analysis Error</h3>
            <p className="text-red-200">{result.error}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  const downloadChart = () => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'chart.png';
      link.href = url;
      link.click();
    }
  };

  const colorPalette = [
    'rgba(102, 126, 234, 0.8)',
    'rgba(34, 197, 94, 0.8)',
    'rgba(251, 146, 60, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(168, 85, 247, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(14, 165, 233, 0.8)',
    'rgba(132, 204, 22, 0.8)',
  ];

  const borderColors = [
    'rgba(102, 126, 234, 1)',
    'rgba(34, 197, 94, 1)',
    'rgba(251, 146, 60, 1)',
    'rgba(239, 68, 68, 1)',
    'rgba(168, 85, 247, 1)',
    'rgba(236, 72, 153, 1)',
    'rgba(14, 165, 233, 1)',
    'rgba(132, 204, 22, 1)',
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffffff',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: `${result.analysis.chart.charAt(0).toUpperCase() + result.analysis.chart.slice(1)} Visualization`,
        color: '#ffffff',
        font: {
          size: 18,
          weight: 'bold' as const,
        },
        padding: 20,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(102, 126, 234, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#ffffff',
          font: {
            weight: 'bold' as const,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        border: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
      y: {
        ticks: {
          color: '#ffffff',
          font: {
            weight: 'bold' as const,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        border: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
    },
  };

  const renderChart = () => {
    if (typeof result.chart_data === 'string') {
      // Matplotlib base64 image
      return (
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          src={result.chart_data}
          alt="Generated Chart"
          className="w-full h-auto max-w-4xl mx-auto rounded-2xl shadow-2xl"
        />
      );
    }

    // Chart.js compatible data
    let chartData;
    
    try {
      // Handle different data structures from backend
      if (result.chart_data?.data && Array.isArray(result.chart_data.data)) {
        chartData = {
          labels: result.chart_data.data[0]?.x || [],
          datasets: result.chart_data.data.map((dataset: any, index: number) => ({
            label: dataset.name || `Dataset ${index + 1}`,
            data: dataset.y || dataset.data || [],
            backgroundColor: colorPalette[index % colorPalette.length],
            borderColor: borderColors[index % borderColors.length],
            borderWidth: 3,
            borderRadius: 8,
            borderSkipped: false,
          })),
        };
      } else {
        // Fallback for different data structure
        chartData = {
          labels: ['No Data'],
          datasets: [{
            label: 'No Data Available',
            data: [0],
            backgroundColor: 'rgba(156, 163, 175, 0.8)',
            borderColor: 'rgba(156, 163, 175, 1)',
            borderWidth: 3,
          }],
        };
      }
    } catch (error) {
      console.error('Error processing chart data:', error);
      chartData = {
        labels: ['Error'],
        datasets: [{
          label: 'Data Processing Error',
          data: [0],
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 3,
        }],
      };
    }

    const ChartComponent = () => {
      switch (result.analysis.chart.toLowerCase()) {
        case 'bar':
          return <Bar ref={chartRef} data={chartData} options={chartOptions} />;
        case 'line':
          return <Line ref={chartRef} data={chartData} options={chartOptions} />;
        case 'scatter':
          return <Scatter ref={chartRef} data={chartData} options={chartOptions} />;
        case 'pie':
        case 'doughnut':
          return <Doughnut ref={chartRef} data={chartData} options={chartOptions} />;
        default:
          return <Bar ref={chartRef} data={chartData} options={chartOptions} />;
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-96"
      >
        <ChartComponent />
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Chart */}
      <motion.div 
        className="glass rounded-2xl shadow-2xl p-8 border border-white/20 backdrop-blur-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-8">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <TrendingUp className="h-8 w-8 text-white" />
              <div className="absolute inset-0 h-8 w-8 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full blur-lg opacity-50 animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-bold text-white">
              Data Visualization
            </h3>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
              <BarChart3 className="h-5 w-5 text-white" />
              <span className="text-white font-medium">
                {result.data_points} data points
              </span>
            </div>
            <motion.button
              onClick={downloadChart}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 shadow-lg font-medium"
            >
              <ImageIcon className="h-4 w-4" />
              <span>Export PNG</span>
            </motion.button>
          </motion.div>
        </div>

        {renderChart()}
      </motion.div>

      {/* Summary and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl shadow-2xl p-8 border border-white/20 backdrop-blur-xl"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="relative">
              <FileText className="h-7 w-7 text-white" />
              <div className="absolute inset-0 h-7 w-7 bg-gradient-to-r from-accent-400 to-warning-400 rounded-full blur-lg opacity-50 animate-pulse"></div>
            </div>
            <h4 className="text-xl font-bold text-white">
              Analysis Summary
            </h4>
          </div>
          <div className="text-white/90 whitespace-pre-line leading-relaxed bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            {result.summary}
          </div>
        </motion.div>

        {/* Processed Data */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl shadow-2xl p-8 border border-white/20 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Activity className="h-7 w-7 text-white" />
                <div className="absolute inset-0 h-7 w-7 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full blur-lg opacity-50 animate-pulse"></div>
              </div>
              <h4 className="text-xl font-bold text-white">
                Data Table
              </h4>
            </div>
            <motion.button
              onClick={onDownload}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 shadow-lg font-medium"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </motion.button>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-white/10">
                  <tr>
                    {result.processed_data && result.processed_data.length > 0 && Object.keys(result.processed_data[0]).map((key) => (
                      <th
                        key={key}
                        className="text-left py-4 px-4 font-bold text-white border-b border-white/10"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.processed_data && result.processed_data.slice(0, 10).map((row, index) => (
                    <motion.tr 
                      key={index} 
                      className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                    >
                      {Object.values(row).map((value, cellIndex) => (
                        <td key={cellIndex} className="py-3 px-4 text-white/80 font-medium">
                          {typeof value === 'number'
                            ? value.toFixed(2)
                            : String(value)}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {result.processed_data && result.processed_data.length > 10 && (
              <div className="p-4 bg-white/5 border-t border-white/10">
                <p className="text-sm text-white/60 text-center">
                  Showing 10 of {result.processed_data.length} rows
                </p>
              </div>
            )}
            
            {(!result.processed_data || result.processed_data.length === 0) && (
              <div className="p-8 text-center">
                <p className="text-white/60">
                  No processed data available
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ModernChartDisplay;