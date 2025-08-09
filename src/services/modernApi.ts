import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ModernAnalysisResult {
  success: boolean;
  chartType: 'bar' | 'line' | 'scatter' | 'histogram' | 'pie';
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string[];
      borderColor?: string[];
    }>;
  };
  summary: {
    mean?: number;
    median?: number;
    std?: number;
    count?: number;
    [key: string]: any;
  };
  error?: string;
}

class ModernApiService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async queryData(query: string): Promise<ModernAnalysisResult> {
    try {
      const response = await this.axiosInstance.post('/query', { query });
      return response.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Query failed');
    }
  }

  async exportData(data: any[], format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    const response = await this.axiosInstance.post('/export', { data, format }, {
      responseType: 'blob'
    });
    return response.data;
  }
}

export const modernApiService = new ModernApiService();