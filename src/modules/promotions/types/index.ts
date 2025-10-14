// pages/PromotionsPage/types.ts

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
}

export type PromotionStatus = 'active' | 'scheduled' | 'expired';

export interface PromotionRowProps {
  promotion: any; // Replace with PromotionItem from promotionsApi
  onDelete: () => void;
  isDeleting: boolean;
}

export interface MenuItemCardProps {
  item: MenuItem;
  isSelected: boolean;
  onClick: () => void;
}

export interface SelectedItemPreviewProps {
  item: MenuItem;
  discount: string;
}

export interface AddPromotionDialogProps {
  onAdd: (menuItem: MenuItem, discount: number, startDate: string, endDate: string) => void;
  isCreating: boolean;
}

export interface PromotionsTableProps {
  promotions: any[]; // Replace with PromotionItem[]
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddPromotion: (menuItem: MenuItem, discount: number, startDate: string, endDate: string) => void;
  onDeletePromotion: (id: string, itemName: string) => void;
  deletingId: string | null;
  isCreating: boolean;
}

export interface Product {
  id: number;
  name: string;
  category: string;
}

export interface Promotion {
  id: string;
  item: string;
  original_price: number;
  discount: number;
  start_date: string;
  end_date: string;
}