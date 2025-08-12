import { useState, useEffect } from "react";
import { apiService } from "../services/api";

const ConnectionTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<
    "testing" | "connected" | "error"
  >("testing");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus("testing");
      const response = await apiService.healthCheck();
      if (response.status === "healthy") {
        setConnectionStatus("connected");
      } else {
        setConnectionStatus("error");
        setErrorMessage("Backend responded but status is not healthy");
      }
    } catch (error) {
      setConnectionStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "testing":
        return "text-yellow-500";
      case "connected":
        return "text-green-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "testing":
        return "Testing connection...";
      case "connected":
        return "Connected to backend";
      case "error":
        return "Connection failed";
      default:
        return "Unknown status";
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg z-50">
      <div className="flex items-center space-x-2">
        <div
          className={`w-3 h-3 rounded-full ${
            connectionStatus === "connected"
              ? "bg-green-500"
              : connectionStatus === "error"
              ? "bg-red-500"
              : "bg-yellow-500 animate-pulse"
          }`}
        />
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
      {connectionStatus === "error" && (
        <div className="mt-2 text-xs text-red-400">{errorMessage}</div>
      )}
      <button
        onClick={testConnection}
        className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
      >
        Retry
      </button>
    </div>
  );
};

export default ConnectionTest;
