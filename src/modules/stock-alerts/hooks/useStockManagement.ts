
// pages/StockAlertsPage/hooks/useStockManagement.ts

import React from "react";
import { useToast } from "@/shared/components/ui/use-toast";
import {
  useGetStockTableQuery,
  useUpdateStockThresholdMutation,
  type StockItem
} from "../store/stockApi";
import { WEBHOOK_URL } from "../constants";
import type { AvailableProduct } from "../types";

export const useStockManagement = () => {
  const { data: stockItems = [], isLoading, isError, refetch } = useGetStockTableQuery();
  const [updateThreshold] = useUpdateStockThresholdMutation();
  const { toast } = useToast();

  // Local state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [reorderQuantities, setReorderQuantities] = React.useState<Record<string, number>>({});
  const [isReordering, setIsReordering] = React.useState<Record<string, boolean>>({});
  const [editingThreshold, setEditingThreshold] = React.useState<string | null>(null);
  const [newThresholdValue, setNewThresholdValue] = React.useState<string>("");

  // Filtered items based on search
  const filteredItems = React.useMemo(
    () =>
      stockItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [stockItems, searchQuery]
  );

  // Update reorder quantity
  const updateReorderQuantity = (itemId: string, delta: number) => {
    setReorderQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 1) + delta)
    }));
  };

  // Handle reorder
  const handleReorder = async (item: StockItem) => {
    const quantity = reorderQuantities[item.id] || 1;
    
    if (quantity <= 0) {
      toast({
        title: "Error",
        description: "Quantity must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    setIsReordering(prev => ({ ...prev, [item.id]: true }));

    try {
      const queryParams = new URLSearchParams({
        product_name: item.name,
        quantity: quantity.toString(),
        units: item.unit || 'units'
      });

      const response = await fetch(`${WEBHOOK_URL}?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        toast({
          title: "Order sent successfully!",
          description: `Requested ${quantity} units of ${item.name}`,
        });
        
        setReorderQuantities(prev => ({
          ...prev,
          [item.id]: 1
        }));
        
        refetch();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Reorder failed:', error);
      toast({
        title: "Order failed",
        description: "Could not process the order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsReordering(prev => ({ ...prev, [item.id]: false }));
    }
  };

  // Threshold editing
  const startEditingThreshold = (item: StockItem) => {
    setEditingThreshold(item.id);
    setNewThresholdValue(item.min_threshold.toString());
  };

  const saveThreshold = async (itemId: string) => {
    const newValue = parseInt(newThresholdValue);
    if (isNaN(newValue) || newValue < 0) {
      toast({
        title: "Invalid threshold",
        description: "Threshold must be a positive number",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateThreshold({ id: itemId, threshold: newValue }).unwrap();
      
      setEditingThreshold(null);
      setNewThresholdValue("");

      toast({
        title: "Threshold updated",
        description: "Minimum stock threshold updated successfully",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Could not update threshold. Please try again.",
        variant: "destructive",
      });
    }
  };

  const cancelEditingThreshold = () => {
    setEditingThreshold(null);
    setNewThresholdValue("");
  };

  // Add new item
  const addNewItem = (product: AvailableProduct, minThreshold: number) => {
    toast({
      title: "Item added",
      description: `${product.name} has been added to stock monitoring`,
    });
    
    refetch();
  };

  return {
    stockItems: filteredItems,
    isLoading,
    isError,
    searchQuery,
    setSearchQuery,
    reorderQuantities,
    updateReorderQuantity,
    handleReorder,
    isReordering,
    editingThreshold,
    newThresholdValue,
    setNewThresholdValue,
    startEditingThreshold,
    saveThreshold,
    cancelEditingThreshold,
    addNewItem,
    refetch
  };
};