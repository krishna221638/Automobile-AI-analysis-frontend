import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
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
  const { history, activeQuery, addQuery, selectQuery, clearHistory } = useQueryHistory();
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
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }));
      toast.error("Failed to initialize application");
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
        toast.success("Analysis completed successfully!");
      } else {
        toast.error(result.error || "Analysis failed");
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isAnalyzing: false,
        error: error instanceof Error ? error.message : "Analysis failed",
      }));
      toast.error("Analysis failed");
    }
  };

  const handleDownloadData = async () => {
    if (!state.analysisResult?.processed_data) return;

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
      }
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download failed");
    }
  };

  const displayResult = activeQuery?.result || state.analysisResult;

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Initializing Application
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Loading automobile dataset and connecting to Mistral AI...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Initialization Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{state.error}</p>
            <motion.button
              onClick={initializeApp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white',
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
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Dataset Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Rows:
                    </span>
                    <span className="ml-2 text-sm text-gray-900 dark:text-white">
                      {state.datasetInfo.rows}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Columns:
                    </span>
                    <span className="ml-2 text-sm text-gray-900 dark:text-white">
                      {state.datasetInfo.columns}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Numeric:
                    </span>
                    <span className="ml-2 text-sm text-gray-900 dark:text-white">
                      {state.datasetInfo.numeric_columns.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Categorical:
                    </span>
                    <span className="ml-2 text-sm text-gray-900 dark:text-white">
                      {state.datasetInfo.categorical_columns.length}
                    </span>
                  </div>
                </div>
              </div>
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
            className="lg:col-span-3 space-y-6"
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
                  className="space-y-6"
                >
                  {/* Success Message */}
                  {displayResult.success && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
                    >
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                        <p className="text-green-800 dark:text-green-200 font-medium">
                          Analysis completed successfully!
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Chart Specifications */}
                  {displayResult.success && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Chart Specifications
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Chart Type:
                          </span>
                          <p className="text-sm text-gray-900 dark:text-white font-mono">
                            {displayResult.analysis.chart}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            X-Axis:
                          </span>
                          <p className="text-sm text-gray-900 dark:text-white font-mono">
                            {displayResult.analysis.x}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Y-Axis:
                          </span>
                          <p className="text-sm text-gray-900 dark:text-white font-mono">
                            {displayResult.analysis.y || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Aggregation:
                          </span>
                          <p className="text-sm text-gray-900 dark:text-white font-mono">
                            {displayResult.analysis.agg || "None"}
                          </p>
                        </div>
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
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
              >
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                  <p className="text-red-800 dark:text-red-200">{state.error}</p>
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
