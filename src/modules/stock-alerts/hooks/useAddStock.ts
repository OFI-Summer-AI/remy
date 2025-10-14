
// hooks/useStocks.ts
import { useState, useEffect } from 'react';

interface UseStocksReturn {
  stocks: Stock[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useStocks = (): UseStocksReturn => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStocks = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://remy.api.sofiatechnology.ai/api/stock-alerts/stocks/');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stocks: ${response.statusText}`);
      }
      
      const data = await response.json();
      setStocks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching stocks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  return {
    stocks,
    isLoading,
    error,
    refetch: fetchStocks
  };
};
import { useToast } from '@/shared/components/ui/use-toast';
import { Stock } from '../types';

export interface StockAlertData {
  reorder_level: number;
  max_quantity: number;
  stock: number;
  status?: string;
}

interface UseCreateStockAlertReturn {
  createStockAlert: (data: StockAlertData) => Promise<boolean>;
  isCreating: boolean;
}

export const useCreateStockAlert = (): UseCreateStockAlertReturn => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const createStockAlert = async (data: StockAlertData): Promise<boolean> => {
    setIsCreating(true);
    
    try {
      const response = await fetch('https://remy.api.sofiatechnology.ai/api/stock-alerts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create stock alert: ${response.statusText}`);
      }
      
      toast({
        title: "Success!",
        description: "Stock alert created successfully",
      });
      
      return true;
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to create stock alert',
        variant: "destructive",
      });
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createStockAlert,
    isCreating
  };
};