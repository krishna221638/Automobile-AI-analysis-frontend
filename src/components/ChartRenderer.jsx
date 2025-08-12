import React, { useRef } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp } from "lucide-react";
import html2canvas from "html2canvas";

const ChartRenderer = ({ chartData, onDownload }) => {
  const chartRef = useRef(null);
  const { config, data, query } = chartData;

  // Chart colors from our design system
  const chartColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  // Transform data for Recharts format
  const transformDataForChart = () => {
    if (!data || !data.labels || !data.values) return [];

    return data.labels.map((label, index) => ({
      name: label,
      value: data.values[index],
      x: data.values[index], // For scatter plots
      y: data.values[index],
    }));
  };

  const chartDataFormatted = transformDataForChart();

  // Handle chart download
  const handleDownload = async () => {
    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current, {
          backgroundColor: "transparent",
          scale: 2,
        });

        const link = document.createElement("a");
        link.download = `chart-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();

        if (onDownload) onDownload();
      } catch (error) {
        console.error("Error downloading chart:", error);
      }
    }
  };

  // Custom tooltip styling
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-blue-600">
            {`${config.y || "Value"}: ${payload[0]?.value?.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Render appropriate chart based on config
  const renderChart = () => {
    const commonProps = {
      data: chartDataFormatted,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    switch (config.chart) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#374151" fontSize={12} />
            <YAxis stroke="#374151" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartDataFormatted.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        );

      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#374151" fontSize={12} />
            <YAxis stroke="#374151" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={chartColors[0]}
              strokeWidth={3}
              dot={{ fill: chartColors[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: chartColors[0], strokeWidth: 2 }}
            />
          </LineChart>
        );

      case "scatter":
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" dataKey="x" stroke="#374151" fontSize={12} />
            <YAxis type="number" dataKey="y" stroke="#374151" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter dataKey="value" fill={chartColors[0]} />
          </ScatterChart>
        );

      case "histogram":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#374151" fontSize={12} />
            <YAxis stroke="#374151" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[2, 2, 0, 0]} fill={chartColors[1]} />
          </BarChart>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Unsupported chart type: {config.chart}
          </div>
        );
    }
  };

  if (!chartData || !config || !data) {
    return null;
  }

  return (
    <Card className="bg-white border-gray-200 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between bg-white">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg capitalize text-gray-900">
            {config.chart} Chart: {config.agg} {config.y} by {config.x}
          </CardTitle>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="border-gray-300 hover:bg-gray-50 text-gray-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </CardHeader>
      <CardContent className="bg-white">
        <div className="mb-4">
          <p className="text-sm text-gray-600">Query: "{query}"</p>
        </div>
        <div ref={chartRef} className="w-full bg-white">
          <ResponsiveContainer width="100%" height={400}>
            {renderChart()}
          </ResponsiveContainer>
        </div>

        {/* Chart summary */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold mb-2 text-gray-900">Chart Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Type:</span>
              <span className="ml-2 capitalize text-gray-900">
                {config.chart}
              </span>
            </div>
            <div>
              <span className="text-gray-600">X-Axis:</span>
              <span className="ml-2 text-gray-900">{config.x}</span>
            </div>
            <div>
              <span className="text-gray-600">Y-Axis:</span>
              <span className="ml-2 text-gray-900">{config.y}</span>
            </div>
            <div>
              <span className="text-gray-600">Aggregation:</span>
              <span className="ml-2 capitalize text-gray-900">
                {config.agg}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartRenderer;
