
// hooks/useProducts.ts
import { useToast } from '@/shared/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Product } from '../types';

interface UseProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://remy.api.sofiatechnology.ai/api/promotions/products/');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts
  };
};


export interface PromotionData {
  item: number;
  discount: number;
  start_date: string;
  end_date: string;
}

interface UseCreatePromotionReturn {
  createPromotion: (data: PromotionData) => Promise<boolean>;
  isCreating: boolean;
}

export const useCreatePromotion = (): UseCreatePromotionReturn => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const createPromotion = async (data: PromotionData): Promise<boolean> => {
    setIsCreating(true);
    
    try {
      const response = await fetch('https://remy.api.sofiatechnology.ai/api/promotions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create promotion: ${response.statusText}`);
      }
      
      toast({
        title: "Success!",
        description: "Promotion created successfully",
      });
      
      return true;
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to create promotion',
        variant: "destructive",
      });
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createPromotion,
    isCreating
  };
};