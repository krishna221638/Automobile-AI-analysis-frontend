import React, { useState, useEffect } from "react";
import {
  Car,
  BarChart3,
  Search,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  apiService,
  type DatasetInfo,
  type AnalysisResult,
  type ExampleQuery,
} from "./services/api";
import ChartDisplay from "./components/ChartDisplay";
import DatasetPreview from "./components/DatasetPreview";
import ExampleQueries from "./components/ExampleQueries";
import QueryInput from "./components/QueryInput";

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
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }));
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
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isAnalyzing: false,
        error: error instanceof Error ? error.message : "Analysis failed",
      }));
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
    }
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Initializing Application
          </h2>
          <p className="text-gray-600">
            Loading automobile dataset and connecting to Mistral AI...
          </p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Initialization Failed
          </h2>
          <p className="text-gray-600 mb-4">{state.error}</p>
          <button
            onClick={initializeApp}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <Car className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Automobile Data Analysis with Mistral AI
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Dataset Info */}
            {state.datasetInfo && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Dataset Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Rows:
                    </span>
                    <span className="ml-2 text-sm text-gray-900">
                      {state.datasetInfo.rows}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Columns:
                    </span>
                    <span className="ml-2 text-sm text-gray-900">
                      {state.datasetInfo.columns}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Numeric:
                    </span>
                    <span className="ml-2 text-sm text-gray-900">
                      {state.datasetInfo.numeric_columns.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Categorical:
                    </span>
                    <span className="ml-2 text-sm text-gray-900">
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
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Query Input */}
            <QueryInput
              onAnalyze={handleAnalyzeQuery}
              isAnalyzing={state.isAnalyzing}
            />

            {/* Analysis Results */}
            {state.analysisResult && (
              <div className="space-y-6">
                {/* Success Message */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <p className="text-green-800 font-medium">
                      Analysis completed successfully!
                    </p>
                  </div>
                </div>

                {/* Chart Specifications */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Chart Specifications
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Chart Type:
                      </span>
                      <p className="text-sm text-gray-900 font-mono">
                        {state.analysisResult.analysis.chart}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        X-Axis:
                      </span>
                      <p className="text-sm text-gray-900 font-mono">
                        {state.analysisResult.analysis.x}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Y-Axis:
                      </span>
                      <p className="text-sm text-gray-900 font-mono">
                        {state.analysisResult.analysis.y || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Aggregation:
                      </span>
                      <p className="text-sm text-gray-900 font-mono">
                        {state.analysisResult.analysis.agg || "None"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chart Display */}
                <ChartDisplay
                  result={state.analysisResult}
                  onDownload={handleDownloadData}
                />
              </div>
            )}

            {/* Analysis Error */}
            {state.error && state.isInitialized && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <p className="text-red-800">{state.error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
