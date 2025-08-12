import React, { useState, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BarChart3, Database, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import our components
import QueryInput from "./components/QueryInput";
import ChartRenderer from "./components/ChartRenderer";
import QueryHistory from "./components/QueryHistory";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorDisplay from "./components/ErrorDisplay";

// Import API functions
import { processQuery } from "./api";

const queryClient = new QueryClient();

// Transform backend result to ChartRenderer format
const transformBackendResult = (backendResult, query) => {
  if (!backendResult.success) {
    return null;
  }

  // Extract data from processed_data based on analysis config
  const { analysis, processed_data } = backendResult;
  const { x, y, agg } = analysis;

  // Transform processed_data into labels and values
  const labels = [];
  const values = [];

  if (processed_data && processed_data.length > 0) {
    processed_data.forEach((row) => {
      labels.push(row[x] || "Unknown");
      values.push(row[y] || 0);
    });
  }

  return {
    config: analysis,
    data: {
      labels,
      values,
    },
    query,
    summary: backendResult.summary,
    dataPoints: backendResult.data_points,
  };
};

const AppContent = () => {
  // State management
  const [currentChart, setCurrentChart] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("analyzing");
  const [error, setError] = useState(null);

  const { toast } = useToast();

  // Quick validation for obviously unrelated queries
  const isQueryRelatedToAutomobiles = (query) => {
    const lowerQuery = query.toLowerCase().trim();

    // List of obvious non-automobile keywords that should be rejected immediately
    const unrelatedKeywords = [
      "weather",
      "food",
      "recipe",
      "cook",
      "climate",
      "temperature",
      "politics",
      "election",
      "president",
      "government",
      "vote",
      "sports",
      "football",
      "soccer",
      "basketball",
      "tennis",
      "music",
      "song",
      "album",
      "concert",
      "artist",
      "band",
      "movie",
      "film",
      "actor",
      "actress",
      "cinema",
      "joke",
      "funny",
      "humor",
      "comedy",
      "travel",
      "vacation",
      "hotel",
      "flight",
      "tourism",
      "health",
      "medicine",
      "doctor",
      "hospital",
      "disease",
      "math",
      "physics",
      "chemistry",
      "biology",
      "science",
      "capital",
      "country",
      "geography",
      "history",
      "programming",
      "code",
      "software",
      "computer",
      "laptop",
      "what is",
      "who is",
      "when is",
      "where is",
      "how to",
    ];

    // Check if query contains obviously unrelated keywords
    const hasUnrelatedKeywords = unrelatedKeywords.some(
      (keyword) =>
        lowerQuery.includes(keyword) &&
        !lowerQuery.includes("car") &&
        !lowerQuery.includes("auto") &&
        !lowerQuery.includes("vehicle") &&
        !lowerQuery.includes("fuel") &&
        !lowerQuery.includes("engine") &&
        !lowerQuery.includes("brand") &&
        !lowerQuery.includes("price")
    );

    if (hasUnrelatedKeywords) {
      return false;
    }

    // If it's a very short query that doesn't mention automobiles, it might be unrelated
    if (
      lowerQuery.length < 10 &&
      !lowerQuery.includes("car") &&
      !lowerQuery.includes("auto") &&
      !lowerQuery.includes("vehicle") &&
      !lowerQuery.includes("brand") &&
      !lowerQuery.includes("price") &&
      !lowerQuery.includes("mpg") &&
      !lowerQuery.includes("fuel") &&
      !lowerQuery.includes("engine")
    ) {
      return false;
    }

    return true; // Assume it's related if it passes basic checks
  };

  // Handle query submission
  const handleQuerySubmit = useCallback(
    async (query) => {
      // Quick client-side validation
      if (!isQueryRelatedToAutomobiles(query)) {
        setError(
          new Error(
            "🚗 This query appears to be unrelated to automobile data. Please ask questions about cars, vehicle specifications, pricing, fuel efficiency, performance, or other automotive topics.\n\nExample queries:\n• Show average price by brand\n• Plot horsepower vs price\n• Display fuel efficiency by engine size"
          )
        );

        toast({
          title: "Unrelated Query",
          description:
            "Please ask questions about automobile data and vehicle specifications.",
          variant: "destructive",
        });

        return;
      }
      setIsLoading(true);
      setError(null);
      setLoadingStage("analyzing");

      try {
        // Stage 1: Analyzing
        setLoadingStage("analyzing");
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate analysis time

        // Stage 2: Fetching data
        setLoadingStage("fetching");
        const result = await processQuery(query);

        // Stage 3: Rendering
        setLoadingStage("rendering");
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate render time

        // Transform backend result to ChartRenderer format
        const transformedResult = transformBackendResult(result, query);

        // Success - update state
        setCurrentChart(transformedResult);

        // Add to history
        const historyItem = {
          id: Date.now(),
          query: query,
          config: result.analysis,
          timestamp: new Date().toISOString(),
          success: true,
        };

        setQueryHistory((prev) => [historyItem, ...prev.slice(0, 9)]); // Keep last 10

        // Success toast
        toast({
          title: "Chart Generated Successfully",
          description: `Created ${result.analysis.chart} chart for: ${query}`,
        });
      } catch (err) {
        console.error("Query processing error:", err);
        setError(err);

        // Add failed query to history
        const historyItem = {
          id: Date.now(),
          query,
          timestamp: new Date().toISOString(),
          success: false,
          error: err.message,
        };

        setQueryHistory((prev) => [historyItem, ...prev.slice(0, 9)]);

        // Error toast
        toast({
          title: "Query Failed",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  // Handle rerunning a query from history
  const handleRerunQuery = useCallback(
    (query) => {
      handleQuerySubmit(query);
    },
    [handleQuerySubmit]
  );

  // Clear query history
  const handleClearHistory = useCallback(() => {
    setQueryHistory([]);
    toast({
      title: "History Cleared",
      description: "Query history has been cleared.",
    });
  }, [toast]);

  // Handle chart download
  const handleChartDownload = useCallback(() => {
    toast({
      title: "Chart Downloaded",
      description: "Your chart has been saved as an image.",
    });
  }, [toast]);

  // Clear error
  const handleClearError = useCallback(() => {
    setError(null);
  }, []);

  // Retry last query
  const handleRetryQuery = useCallback(() => {
    if (queryHistory.length > 0) {
      const lastQuery = queryHistory[0];
      handleQuerySubmit(lastQuery.query);
    }
  }, [queryHistory, handleQuerySubmit]);

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-glass backdrop-blur-glass border-b border-glass">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <BarChart3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Automobile Data Analysis</h1>
                <p className="text-sm text-muted-foreground">
                  Powered by Mistral AI
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Database className="h-4 w-4" />
                <span>Connected</span>
              </div>
              <div className="flex items-center space-x-1">
                <Sparkles className="h-4 w-4" />
                <span>AI Ready</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Query Input */}
          <div className="lg:col-span-3 space-y-6">
            <QueryInput onSubmit={handleQuerySubmit} isLoading={isLoading} />

            {/* Chart Display Area */}
            <div className="min-h-[500px]">
              {isLoading && <LoadingSpinner stage={loadingStage} />}

              {error && !isLoading && (
                <ErrorDisplay
                  error={error}
                  onRetry={handleRetryQuery}
                  onClear={handleClearError}
                />
              )}

              {currentChart && !isLoading && !error && (
                <ChartRenderer
                  chartData={currentChart}
                  onDownload={handleChartDownload}
                />
              )}

              {!currentChart && !isLoading && !error && (
                <div className="flex items-center justify-center h-96 text-center">
                  <div className="space-y-4">
                    <div className="p-6 rounded-full bg-gradient-primary/20 mx-auto w-fit">
                      <BarChart3 className="h-12 w-12 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Welcome to Automobile Data Analysis
                      </h3>
                      <p className="text-muted-foreground max-w-md">
                        Ask questions about your automobile dataset in natural
                        language, and I'll create beautiful visualizations for
                        you.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Query History */}
          <div className="lg:col-span-1">
            <QueryHistory
              history={queryHistory}
              onRerunQuery={handleRerunQuery}
              onClearHistory={handleClearHistory}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-glass bg-glass backdrop-blur-glass">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Powered by Mistral AI • Built with React & Recharts</p>
            <p className="mt-1">
              Ask natural language questions about your automobile data
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
