import React from "react";
import { Database, Eye } from "lucide-react";

interface DatasetPreviewProps {
  data: any[];
}

const DatasetPreview: React.FC<DatasetPreviewProps> = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  const columns = data[0] ? Object.keys(data[0]) : [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Eye className="h-5 w-5 mr-2" />
        Dataset Preview
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {columns.map((column) => (
                <th
                  key={column}
                  className="text-left py-2 px-1 font-medium text-gray-700 dark:text-gray-300"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                {columns.map((column) => (
                  <td key={column} className="py-1 px-1 text-gray-600 dark:text-gray-400">
                    {typeof row[column] === "number"
                      ? row[column].toFixed(2)
                      : String(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
        <Database className="h-3 w-3 mr-1" />
        <span>Showing first {data.length} rows</span>
      </div>
    </div>
  );
};

export default DatasetPreview;
