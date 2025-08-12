import React, { useRef } from "react";
// Updated chart.js import for professional usage
import Chart from "chart.js/auto";
import { Bar, Line, Scatter, Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
import { Download, Image as ImageIcon } from "lucide-react";
import type { AnalysisResult } from "../services/api";

interface ModernChartDisplayProps {
  result: AnalysisResult;
  onDownload: () => void;
}

const ModernChartDisplay: React.FC<ModernChartDisplayProps> = ({
  result,
  onDownload,
}) => {
  const chartRef = useRef<any>(null);

  // Get current theme
  const isDark = document.documentElement.classList.contains("dark");

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
            <h3 className="text-xl font-bold text-white mb-2">
              Analysis Error
            </h3>
            <p className="text-red-200">{result.error}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  const downloadChart = () => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "chart.png";
      link.href = url;
      link.click();
    }
  };

  const colorPalette = [
    "rgba(102, 126, 234, 0.8)",
    "rgba(34, 197, 94, 0.8)",
    "rgba(251, 146, 60, 0.8)",
    "rgba(239, 68, 68, 0.8)",
    "rgba(168, 85, 247, 0.8)",
    "rgba(236, 72, 153, 0.8)",
    "rgba(14, 165, 233, 0.8)",
    "rgba(132, 204, 22, 0.8)",
  ];

  const borderColors = [
    "rgba(102, 126, 234, 1)",
    "rgba(34, 197, 94, 1)",
    "rgba(251, 146, 60, 1)",
    "rgba(239, 68, 68, 1)",
    "rgba(168, 85, 247, 1)",
    "rgba(236, 72, 153, 1)",
    "rgba(14, 165, 233, 1)",
    "rgba(132, 204, 22, 1)",
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: "easeInOutQuart" as const,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#ffffff",
          font: {
            size: 14,
            weight: "bold" as const,
          },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: `${
          result.analysis.chart.charAt(0).toUpperCase() +
          result.analysis.chart.slice(1)
        } Visualization`,
        color: "#ffffff",
        font: {
          size: 18,
          weight: "bold" as const,
        },
        padding: 20,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(102, 126, 234, 0.5)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#ffffff",
          font: {
            weight: "bold" as const,
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        border: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
      y: {
        ticks: {
          color: "#ffffff",
          font: {
            weight: "bold" as const,
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        border: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
    },
  };

  const renderChart = () => {
    if (typeof result.chart_data === "string") {
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
          datasets: result.chart_data.data.map(
            (dataset: any, index: number) => ({
              label: dataset.name || `Dataset ${index + 1}`,
              data: dataset.y || dataset.data || [],
              backgroundColor: colorPalette[index % colorPalette.length],
              borderColor: borderColors[index % borderColors.length],
              borderWidth: 3,
              borderRadius: 8,
              borderSkipped: false,
            })
          ),
        };
      } else {
        // Fallback for different data structure
        chartData = {
          labels: ["No Data"],
          datasets: [
            {
              label: "No Data Available",
              data: [0],
              backgroundColor: "rgba(156, 163, 175, 0.8)",
              borderColor: "rgba(156, 163, 175, 1)",
              borderWidth: 3,
            },
          ],
        };
      }
    } catch (error) {
      console.error("Error processing chart data:", error);
      chartData = {
        labels: ["Error"],
        datasets: [
          {
            label: "Data Processing Error",
            data: [0],
            backgroundColor: "rgba(239, 68, 68, 0.8)",
            borderColor: "rgba(239, 68, 68, 1)",
            borderWidth: 3,
          },
        ],
      };
    }

    const ChartComponent = () => {
      switch (result.analysis.chart.toLowerCase()) {
        case "bar":
          return <Bar ref={chartRef} data={chartData} options={chartOptions} />;
        case "line":
          return (
            <Line ref={chartRef} data={chartData} options={chartOptions} />
          );
        case "scatter":
          return (
            <Scatter ref={chartRef} data={chartData} options={chartOptions} />
          );
        case "pie":
        case "doughnut":
          return (
            <Doughnut ref={chartRef} data={chartData} options={chartOptions} />
          );
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
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Automobile Data Visualization</h1>
          <div className="space-x-4">
            <button
              onClick={downloadChart}
              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded shadow"
            >
              <ImageIcon className="h-5 w-5 mr-2" />
              Export PNG
            </button>
          </div>
        </div>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Chart Section */}
        <section className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
          {renderChart()}
        </section>
        {/* Information Section */}
        <section className="space-y-8">
          {/* Summary Section */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">Analysis Summary</h2>
            <p className="text-gray-300 whitespace-pre-line">
              {result.summary}
            </p>
          </div>
          {/* Data Table Section */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Processed Data</h2>
              <button
                onClick={onDownload}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded shadow"
              >
                <Download className="h-5 w-5 mr-2" />
                Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-700">
                  <tr>
                    {result.processed_data &&
                      result.processed_data.length > 0 &&
                      Object.keys(result.processed_data[0]).map((key) => (
                        <th
                          key={key}
                          className="py-3 px-4 border border-gray-600"
                        >
                          {key}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {result.processed_data &&
                    result.processed_data.slice(0, 10).map((row, index) => (
                      <tr
                        key={index}
                        className="border-t border-gray-600 hover:bg-gray-700"
                      >
                        {Object.values(row).map((value, cellIndex) => (
                          <td key={cellIndex} className="py-2 px-4 text-center">
                            {typeof value === "number"
                              ? value.toFixed(2)
                              : String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <footer className="mt-8 text-center text-gray-500">
        <p>© 2025 Automobile Data Analysis with Mistral AI</p>
      </footer>
    </div>
  );
};

export default ModernChartDisplay;
