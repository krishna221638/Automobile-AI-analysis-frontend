import React, { useState, useEffect } from "react";
import { Search, Send, Settings } from "lucide-react";

interface QueryInputProps {
  onAnalyze: (query: string, library: "plotly" | "matplotlib") => void;
  isAnalyzing: boolean;
}

const QueryInput: React.FC<QueryInputProps> = ({ onAnalyze, isAnalyzing }) => {
  const [query, setQuery] = useState("");
  const [library, setLibrary] = useState<"plotly" | "matplotlib">("plotly");

  useEffect(() => {
    const handleSelectExample = (event: any) => {
      setQuery(event.detail);
    };

    window.addEventListener("selectExample", handleSelectExample);
    return () =>
      window.removeEventListener("selectExample", handleSelectExample);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isAnalyzing) {
      onAnalyze(query.trim(), library);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Search className="h-5 w-5 mr-2" />
        Natural Language Query
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="query"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter your analysis request:
          </label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., show average price by brand"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
            disabled={isAnalyzing}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">
                Chart Library:
              </label>
            </div>
            <select
              value={library}
              onChange={(e) =>
                setLibrary(e.target.value as "plotly" | "matplotlib")
              }
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isAnalyzing}
            >
              <option value="plotly">Plotly</option>
              <option value="matplotlib">Matplotlib</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!query.trim() || isAnalyzing}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Analyze</span>
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium mb-1">Example queries:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>"show average price by brand"</li>
          <li>"plot horsepower vs price"</li>
          <li>"display price distribution histogram"</li>
          <li>"compare fuel efficiency by fuel type"</li>
        </ul>
      </div>
    </div>
  );
};

export default QueryInput;
