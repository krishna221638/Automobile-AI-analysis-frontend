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
import { Download, Image as ImageIcon, FileText } from 'lucide-react';
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

  if (!result.success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6"
      >
        <p className="text-red-800 dark:text-red-200">Error: {result.error}</p>
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
        },
      },
      title: {
        display: true,
        text: `${result.analysis.chart.charAt(0).toUpperCase() + result.analysis.chart.slice(1)} Chart`,
        color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
      },
    },
    scales: {
      x: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
        },
      },
      y: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
        },
      },
    },
  };

  const renderChart = () => {
    if (typeof result.chart_data === 'string') {
      // Matplotlib base64 image
      return (
        <img
          src={result.chart_data}
          alt="Generated Chart"
          className="w-full h-auto max-w-4xl mx-auto rounded-lg"
        />
      );
    }

    // Chart.js compatible data
    const chartData = {
      labels: result.chart_data.data[0]?.x || [],
      datasets: result.chart_data.data.map((dataset: any, index: number) => ({
        label: dataset.name || `Dataset ${index + 1}`,
        data: dataset.y || dataset.data || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 2,
      })),
    };

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <ImageIcon className="h-5 w-5 mr-2" />
            Generated Visualization
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {result.data_points} data points
            </span>
            <button
              onClick={downloadChart}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
            >
              <ImageIcon className="h-4 w-4" />
              <span>PNG</span>
            </button>
          </div>
        </div>

        <div className="w-full h-96">
          {renderChart()}
        </div>
      </div>

      {/* Summary and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors"
        >
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Chart Summary
          </h4>
          <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {result.summary}
          </div>
        </motion.div>

        {/* Processed Data */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Processed Data
            </h4>
            <button
              onClick={onDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  {Object.keys(result.processed_data[0] || {}).map((key) => (
                    <th
                      key={key}
                      className="text-left py-2 px-1 font-medium text-gray-700 dark:text-gray-300"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.processed_data.slice(0, 10).map((row, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                    {Object.values(row).map((value, cellIndex) => (
                      <td key={cellIndex} className="py-1 px-1 text-gray-600 dark:text-gray-400">
                        {typeof value === 'number'
                          ? value.toFixed(2)
                          : String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {result.processed_data.length > 10 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Showing 10 of {result.processed_data.length} rows
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ModernChartDisplay;