import { useState } from 'react';
import type { AnalysisResult } from '../services/api';

export interface QueryHistoryItem {
  id: string;
  query: string;
  result: AnalysisResult;
  timestamp: Date;
}

export const useQueryHistory = () => {
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);
  const [activeQueryId, setActiveQueryId] = useState<string | null>(null);

  const addQuery = (query: string, result: AnalysisResult) => {
    const id = Date.now().toString();
    const newItem: QueryHistoryItem = {
      id,
      query,
      result,
      timestamp: new Date(),
    };
    
    setHistory(prev => [newItem, ...prev.slice(0, 9)]); // Keep last 10 queries
    setActiveQueryId(id);
  };

  const selectQuery = (id: string) => {
    setActiveQueryId(id);
  };

  const clearHistory = () => {
    setHistory([]);
    setActiveQueryId(null);
  };

  const activeQuery = history.find(item => item.id === activeQueryId);

  return {
    history,
    activeQuery,
    activeQueryId,
    addQuery,
    selectQuery,
    clearHistory,
  };
};