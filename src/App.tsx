import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Loader2, Sparkles, Zap } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  apiService,
  type DatasetInfo,
  type AnalysisResult,
  type ExampleQuery,
} from "./services/api";
import Navbar from "./components/Navbar";
import ModernChartDisplay from "./components/ModernChartDisplay";
import ModernQueryInput from "./components/ModernQueryInput";
import LoadingSkeleton from "./components/LoadingSkeleton";
import QueryHistory from "./components/QueryHistory";
import DatasetPreview from "./components/DatasetPreview";
import ExampleQueries from "./components/ExampleQueries";
import { useQueryHistory } from "./hooks/useQueryHistory";
import { useTheme } from "./hooks/useTheme";
import ErrorBoundary from "./components/ErrorBoundary";
import ConnectionTest from "./components/ConnectionTest";

interface AppState {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  datasetInfo: DatasetInfo | null;
  datasetPreview: any[];
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  exampleQueries: ExampleQuery[];
}

function App() {
  useTheme(); // Initialize theme
  const { history, activeQuery, addQuery, selectQuery, clearHistory } =
    useQueryHistory();
  const [showHistory, setShowHistory] = useState(false);

  const [state, setState] = useState<AppState>({
    isInitialized: false,
    isLoading: false,
    error: null,
    datasetInfo: null,
    datasetPreview: [],
    analysisResult: null,
    isAnalyzing: false,
    exampleQueries: [],
  });

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Check health
      await apiService.healthCheck();

      // Initialize app
      const initResult = await apiService.initialize();
      if (!initResult.success) {
        throw new Error(initResult.error || "Failed to initialize");
      }

      // Get dataset info
      const datasetResult = await apiService.getDatasetInfo();
      if (!datasetResult.success) {
        throw new Error(datasetResult.error || "Failed to load dataset");
      }

      // Get example queries
      const examplesResult = await apiService.getExampleQueries();

      setState((prev) => ({
        ...prev,
        isInitialized: true,
        isLoading: false,
        datasetInfo: datasetResult.info,
        datasetPreview: datasetResult.preview,
        exampleQueries: examplesResult.success ? examplesResult.examples : [],
      }));

      toast.success("🚀 Ready to analyze your data!", {
        style: {
          background: "rgba(34, 197, 94, 0.9)",
          color: "white",
          backdropFilter: "blur(10px)",
        },
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }));
      toast.error("Failed to initialize application", {
        style: {
          background: "rgba(239, 68, 68, 0.9)",
          color: "white",
          backdropFilter: "blur(10px)",
        },
      });
    }
  };

  const handleAnalyzeQuery = async (
    query: string,
    library: "plotly" | "matplotlib"
  ) => {
    setState((prev) => ({
      ...prev,
      isAnalyzing: true,
      error: null,
      analysisResult: null,
    }));

    try {
      const result = await apiService.analyzeQuery(query, library);

      setState((prev) => ({
        ...prev,
        isAnalyzing: false,
        analysisResult: result,
      }));

      if (result.success) {
        addQuery(query, result);
        toast.success("✨ Analysis completed successfully!", {
          style: {
            background: "rgba(34, 197, 94, 0.9)",
            color: "white",
            backdropFilter: "blur(10px)",
          },
        });
      } else {
        toast.error(result.error || "Analysis failed", {
          style: {
            background: "rgba(239, 68, 68, 0.9)",
            color: "white",
            backdropFilter: "blur(10px)",
          },
        });
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isAnalyzing: false,
        error: error instanceof Error ? error.message : "Analysis failed",
      }));
      toast.error("⚠️ Analysis failed", {
        style: {
          background: "rgba(239, 68, 68, 0.9)",
          color: "white",
          backdropFilter: "blur(10px)",
        },
      });
    }
  };

  const handleDownloadData = async () => {
    if (
      !state.analysisResult?.processed_data ||
      !Array.isArray(state.analysisResult.processed_data)
    )
      return;

    try {
      const result = await apiService.downloadData(
        state.analysisResult.processed_data
      );
      if (result.success) {
        // Create and download file
        const blob = new Blob([result.csv_content], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = result.filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast.success("📊 Data exported successfully!", {
          style: {
            background: "rgba(34, 197, 94, 0.9)",
            color: "white",
            backdropFilter: "blur(10px)",
          },
        });
      }
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download failed", {
        style: {
          background: "rgba(239, 68, 68, 0.9)",
          color: "white",
          backdropFilter: "blur(10px)",
        },
      });
    }
  };

  const displayResult = activeQuery?.result || state.analysisResult;

  if (state.isLoading) {
    return (
      <div className="min-h-screen animated-bg">
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center glass rounded-2xl p-12 border border-white/20 backdrop-blur-xl shadow-2xl"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Zap className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Initializing AI Engine
            </h2>
            <p className="text-white/80 text-lg">
              Loading automobile dataset and connecting to Mistral AI...
            </p>
            <div className="mt-6 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-accent-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen animated-bg">
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md glass rounded-2xl p-12 border border-red-500/30 backdrop-blur-xl shadow-2xl"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <AlertCircle className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Initialization Failed
            </h2>
            <p className="text-white/80 mb-6">{state.error}</p>
            <motion.button
              onClick={initializeApp}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg"
            >
              Retry Connection
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-bg">
      <ConnectionTest />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          },
        }}
      />

      <Navbar
        onToggleHistory={() => setShowHistory(!showHistory)}
        onClearHistory={clearHistory}
        historyCount={history.length}
      />

      <QueryHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        activeQueryId={activeQuery?.id || null}
        onSelectQuery={selectQuery}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-8"
        >
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Dataset Info */}
            {state.datasetInfo && (
              <motion.div
                className="glass rounded-2xl shadow-2xl p-6 border border-white/20 backdrop-blur-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <Sparkles className="h-7 w-7 text-white mr-3" />
                    <div className="absolute inset-0 h-7 w-7 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full blur-lg opacity-50 animate-pulse"></div>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Dataset Overview
                  </h3>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      label: "Total Rows",
                      value: state.datasetInfo.rows,
                      color: "from-blue-400 to-purple-500",
                    },
                    {
                      label: "Columns",
                      value: state.datasetInfo.columns,
                      color: "from-green-400 to-blue-500",
                    },
                    {
                      label: "Numeric Fields",
                      value: state.datasetInfo.numeric_columns.length,
                      color: "from-purple-400 to-pink-500",
                    },
                    {
                      label: "Categories",
                      value: state.datasetInfo.categorical_columns.length,
                      color: "from-orange-400 to-red-500",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className={`p-3 rounded-xl bg-gradient-to-r ${item.color} bg-opacity-20 backdrop-blur-sm border border-white/20`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 font-medium">
                          {item.label}:
                        </span>
                        <span className="text-white font-bold text-lg">
                          {item.value.toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Example Queries */}
            <ExampleQueries
              examples={state.exampleQueries}
              onSelectExample={(query) => {
                const event = new CustomEvent("selectExample", {
                  detail: query,
                });
                window.dispatchEvent(event);
              }}
            />

            {/* Dataset Preview */}
            {state.datasetPreview.length > 0 && (
              <DatasetPreview data={state.datasetPreview.slice(0, 5)} />
            )}
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-8"
          >
            {/* Query Input */}
            <ModernQueryInput
              onAnalyze={handleAnalyzeQuery}
              isAnalyzing={state.isAnalyzing}
            />

            {/* Analysis Results */}
            <AnimatePresence mode="wait">
              {state.isAnalyzing ? (
                <LoadingSkeleton key="loading" />
              ) : displayResult ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {/* Success Message */}
                  {displayResult.success && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="glass rounded-2xl p-6 border border-success-500/30 backdrop-blur-xl shadow-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-success-500 to-success-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-lg">
                            Analysis Completed Successfully! ✨
                          </p>
                          <p className="text-success-200 text-sm">
                            Your data visualization is ready to explore
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Chart Specifications */}
                  {displayResult.success && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="glass rounded-2xl shadow-2xl p-6 border border-white/20 backdrop-blur-xl"
                    >
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                        <div className="relative">
                          <Zap className="h-6 w-6 text-white mr-3" />
                          <div className="absolute inset-0 h-6 w-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-lg opacity-50 animate-pulse"></div>
                        </div>
                        Chart Configuration
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          {
                            label: "Chart Type",
                            value: displayResult.analysis.chart,
                            color: "from-blue-400 to-purple-500",
                          },
                          {
                            label: "X-Axis",
                            value: displayResult.analysis.x,
                            color: "from-green-400 to-blue-500",
                          },
                          {
                            label: "Y-Axis",
                            value: displayResult.analysis.y || "N/A",
                            color: "from-purple-400 to-pink-500",
                          },
                          {
                            label: "Aggregation",
                            value: displayResult.analysis.agg || "None",
                            color: "from-orange-400 to-red-500",
                          },
                        ].map((spec, index) => (
                          <motion.div
                            key={spec.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className={`p-4 rounded-xl bg-gradient-to-r ${spec.color} bg-opacity-20 backdrop-blur-sm border border-white/20`}
                          >
                            <span className="text-white/70 text-sm font-medium block mb-1">
                              {spec.label}:
                            </span>
                            <p className="text-white font-bold font-mono">
                              {spec.value}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Chart Display */}
                  <ModernChartDisplay
                    result={displayResult}
                    onDownload={handleDownloadData}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Analysis Error */}
            {state.error && state.isInitialized && !state.isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-6 border border-red-500/30 backdrop-blur-xl shadow-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">
                      Analysis Error
                    </p>
                    <p className="text-red-200">{state.error}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
