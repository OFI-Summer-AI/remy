
// types/index.ts

export type IconType = 
  | "shopping_cart" 
  | "users" 
  | "utensils" 
  | "alert_triangle";

export interface KPIData {
  id: string;
  title: string;
  value: string;
  delta: string;
  up: boolean;
  icon: IconType;
}

export interface ChartDataset {
  label: string;
  data: number[];
}

export interface ChartData {
  id: string;
  title: string;
  labels: string[];
  datasets: ChartDataset[];
}

export interface ListItem {
  id: string;
  name: string;
  subtitle: string;
  value: number;
  unit: string;
}

export type ListData = ListItem[];

// View state interface
export interface ViewState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  hasNoData: boolean;
}