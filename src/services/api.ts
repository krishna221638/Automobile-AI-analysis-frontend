import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export interface DatasetInfo {
  rows: number;
  columns: number;
  column_names: string[];
  numeric_columns: string[];
  categorical_columns: string[];
  missing_values: Record<string, number>;
}

export interface ChartAnalysis {
  chart: string;
  x: string;
  y?: string;
  agg?: string;
}

export interface AnalysisResult {
  success: boolean;
  analysis: ChartAnalysis;
  chart_data: any;
  processed_data: any[];
  summary: string;
  data_points: number;
  error?: string;
}

export interface ExampleQuery {
  query: string;
  description: string;
}

class ApiService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await this.axiosInstance.get("/health");
    return response.data;
  }

  async initialize(): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    const response = await this.axiosInstance.post("/initialize");
    return response.data;
  }

  async getDatasetInfo(): Promise<{
    success: boolean;
    info: DatasetInfo;
    preview: any[];
    error?: string;
  }> {
    const response = await this.axiosInstance.get("/dataset-info");
    return response.data;
  }

  async analyzeQuery(
    query: string,
    library: "plotly" | "matplotlib" = "plotly"
  ): Promise<AnalysisResult> {
    const response = await this.axiosInstance.post("/analyze", {
      query,
      library,
    });
    return response.data;
  }

  async downloadData(data: any[]): Promise<{
    success: boolean;
    csv_content: string;
    filename: string;
    error?: string;
  }> {
    const response = await this.axiosInstance.post("/download-data", {
      data,
    });
    return response.data;
  }

  async getExampleQueries(): Promise<{
    success: boolean;
    examples: ExampleQuery[];
  }> {
    const response = await this.axiosInstance.get("/example-queries");
    return response.data;
  }
}

export const apiService = new ApiService();
