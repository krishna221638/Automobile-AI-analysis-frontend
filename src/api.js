import axios from "axios";

// Base API configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Initialize the application
 * @returns {Promise<Object>} Initialization result
 */
export const initializeApp = async () => {
  try {
    const response = await api.post("/initialize");
    return response.data;
  } catch (error) {
    console.error("Error initializing app:", error);
    throw new Error(
      error.response?.data?.error || "Failed to initialize application."
    );
  }
};

/**
 * Check API health
 * @returns {Promise<Object>} Health status
 */
export const healthCheck = async () => {
  try {
    const response = await api.get("/health");
    return response.data;
  } catch (error) {
    console.error("Error checking health:", error);
    throw new Error(
      error.response?.data?.error || "Failed to check API health."
    );
  }
};

/**
 * Analyze a natural language query and get chart configuration
 * @param {string} query - Natural language query (e.g., "Show average price by brand")
 * @returns {Promise<Object>} Chart configuration object
 */
export const analyzeQuery = async (query) => {
  try {
    const response = await api.post("/analyze", {
      query,
      library: "plotly",
    });
    return response.data;
  } catch (error) {
    console.error("Error analyzing query:", error);
    throw new Error(
      error.response?.data?.error ||
        "Failed to analyze query. Please try again."
    );
  }
};

/**
 * Complete pipeline: analyze query and get chart data
 * @param {string} query - Natural language query
 * @returns {Promise<Object>} Object containing both config and data
 */
export const processQuery = async (query) => {
  try {
    // Analyze the query - this returns the complete result including chart data
    const result = await analyzeQuery(query);

    // Check for API error in response
    if (!result.success) {
      throw new Error(result.error || "Analysis failed");
    }

    return result;
  } catch (error) {
    console.error("Error processing query:", error);
    throw error;
  }
};

export default api;
