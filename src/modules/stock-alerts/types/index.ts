// pages/StockAlertsPage/types.ts

export interface AvailableProduct {
  id: number;
  name: string;
  current_quantity: number;
  units: string;
  supplier: string;
  unit_price: number;
}

export interface StockRowProps {
  item: any; // Replace with StockItem from stockApi
  reorderQuantity: number;
  onQuantityChange: (delta: number) => void;
  onReorder: () => void;
  isLoading: boolean;
  isEditingThreshold: boolean;
  newThresholdValue: string;
  onThresholdValueChange: (value: string) => void;
  onStartEditingThreshold: () => void;
  onSaveThreshold: () => void;
  onCancelEditingThreshold: () => void;
}

export interface AddItemDialogProps {
  onAdd: (product: AvailableProduct, minThreshold: number) => void;
}

export interface StockTableProps {
  items: any[]; // Replace with StockItem[]
  searchQuery: string;
  onSearchChange: (query: string) => void;
  reorderQuantities: Record<string, number>;
  onQuantityChange: (itemId: string, delta: number) => void;
  onReorder: (item: any) => void;
  isReordering: Record<string, boolean>;
  editingThreshold: string | null;
  newThresholdValue: string;
  onThresholdValueChange: (value: string) => void;
  onStartEditingThreshold: (item: any) => void;
  onSaveThreshold: (itemId: string) => void;
  onCancelEditingThreshold: () => void;
  onAddItem: (product: AvailableProduct, minThreshold: number) => void;
}

export interface Stock {
  id: number;
  name: string;
  supplier: string;
  current_quantity: number;
  unit_price: number;
  units: string;
}

export interface StockItem {
  id: string;
  name: string;
  supplier: string;
  current_stock: number;
  min_threshold: number;
  unit_price: number;
  status: string;
  unit?: string;
}