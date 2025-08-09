import React from "react";
import type { ExampleQuery } from "../services/api";
import { Lightbulb, MessageSquare } from "lucide-react";

interface ExampleQueriesProps {
  examples: ExampleQuery[];
  onSelectExample: (query: string) => void;
}

const ExampleQueries: React.FC<ExampleQueriesProps> = ({
  examples,
  onSelectExample,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Lightbulb className="h-5 w-5 mr-2" />
        Example Queries
      </h3>

      <div className="space-y-2">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => onSelectExample(example.query)}
            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
          >
            <div className="flex items-start space-x-2">
              <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700">
                  {example.query}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {example.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExampleQueries;
