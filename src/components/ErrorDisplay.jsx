import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Bug } from "lucide-react";

const ErrorDisplay = ({ error, onRetry, onClear }) => {
  const isNetworkError =
    error?.message?.includes("Network") ||
    error?.message?.includes("timeout") ||
    error?.message?.includes("fetch");

  const isAPIError =
    error?.message?.includes("analyze") ||
    error?.message?.includes("chart-data");

  const isUnrelatedQuery =
    error?.message?.includes("unrelated to automobile") ||
    error?.message?.includes("unrelated query") ||
    error?.message?.includes("🚗");

  return (
    <Card className="bg-white border-gray-200 shadow-lg border-orange-200">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="relative mb-6">
          {/* Error icon with animated background */}
          <div className="absolute inset-0 rounded-full bg-orange-100 animate-pulse" />
          <div className="relative z-10 p-4 rounded-full bg-white border border-orange-300 text-orange-600">
            <AlertTriangle className="h-8 w-8" />
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-2 text-gray-900">
          {isUnrelatedQuery
            ? "🚗 Automobile Data Query Required"
            : isNetworkError
            ? "Connection Error"
            : isAPIError
            ? "API Error"
            : "Something went wrong"}
        </h3>

        <p className="text-gray-600 text-center max-w-md mb-6">
          {error?.message ||
            "An unexpected error occurred while processing your request."}
        </p>

        {/* Error suggestions */}
        <div className="w-full max-w-md space-y-3 mb-6">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium text-sm mb-2 flex items-center text-gray-900">
              <Bug className="h-4 w-4 mr-2 text-gray-500" />
              {isUnrelatedQuery
                ? "Try these automobile queries:"
                : "Troubleshooting Tips:"}
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {isUnrelatedQuery && (
                <>
                  <li>• "Show average price by brand"</li>
                  <li>• "Plot horsepower vs price scatter"</li>
                  <li>• "Display fuel efficiency by engine size"</li>
                  <li>• "Compare sedan vs hatchback prices"</li>
                  <li>• "Show most fuel efficient cars"</li>
                </>
              )}
              {isNetworkError && !isUnrelatedQuery && (
                <>
                  <li>• Check your internet connection</li>
                  <li>• Verify the API server is running</li>
                  <li>• Ensure the API endpoint is correct</li>
                </>
              )}
              {isAPIError && !isUnrelatedQuery && (
                <>
                  <li>• Try rephrasing your query</li>
                  <li>• Use simpler language</li>
                  <li>• Check if the data fields exist</li>
                </>
              )}
              {!isNetworkError && !isAPIError && !isUnrelatedQuery && (
                <>
                  <li>• Try refreshing the page</li>
                  <li>• Use a different query</li>
                  <li>• Contact support if issue persists</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-3">
          {onRetry && !isUnrelatedQuery && (
            <Button
              onClick={onRetry}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}

          <Button
            variant="outline"
            onClick={onClear}
            className="border-gray-300 hover:bg-gray-50 text-gray-700"
          >
            {isUnrelatedQuery ? "Ask About Cars" : "Clear Error"}
          </Button>
        </div>

        {/* Error details (for debugging) */}
        {process.env.NODE_ENV === "development" &&
          error?.stack &&
          !isUnrelatedQuery && (
            <details className="mt-6 w-full max-w-md">
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                Show technical details
              </summary>
              <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-auto max-h-32 border border-gray-200">
                {error.stack}
              </pre>
            </details>
          )}
      </CardContent>
    </Card>
  );
};

export default ErrorDisplay;
