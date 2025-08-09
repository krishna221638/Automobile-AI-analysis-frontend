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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Lightbulb className="h-5 w-5 mr-2" />
        Example Queries
      </h3>

      <div className="space-y-2">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => onSelectExample(example.query)}
            className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
          >
            <div className="flex items-start space-x-2">
              <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300">
                  {example.query}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
