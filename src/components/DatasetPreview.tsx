import React from "react";
import { Database, Eye } from "lucide-react";

interface DatasetPreviewProps {
  data: any[];
}

const DatasetPreview: React.FC<DatasetPreviewProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Eye className="h-5 w-5 mr-2" />
        Dataset Preview
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="border-b">
              {columns.map((column) => (
                <th
                  key={column}
                  className="text-left py-2 px-1 font-medium text-gray-700"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-gray-100">
                {columns.map((column) => (
                  <td key={column} className="py-1 px-1 text-gray-600">
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

      <div className="mt-3 flex items-center text-xs text-gray-500">
        <Database className="h-3 w-3 mr-1" />
        <span>Showing first {data.length} rows</span>
      </div>
    </div>
  );
};

export default DatasetPreview;
