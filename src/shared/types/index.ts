
// shared/types/index.ts

export type IconType = 
  | "shopping_cart" 
  | "users" 
  | "utensils" 
  | "alert_triangle"
  | "dollar_sign"
  | "trending_up"
  | "package";

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

// Generic view state - not coupled to any specific library
export interface ViewState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  hasNoData: boolean;
}

// Generic query result - works with any data fetching library
export interface QueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error?: any;
}

// Generic query hook type
export type QueryHook<TData, TParams = void> = (
  params?: TParams
) => QueryResult<TData>;

// shared/types.ts - Agregar estos tipos

export interface FilterOption {
  label: string;
  id: string;
}

export type FilterOptionsData = FilterOption[];

export interface FilterableChartQueryHook {
  // Query para obtener las opciones de filtro (inicialización)
  useOptionsQuery: () => {
    data: FilterOptionsData | undefined;
    isLoading: boolean;
    isError: boolean;
    error: any;
  };
  
  // Query para obtener los datos del gráfico (filtrado)
  useDataQuery: (id: string | null) => {
    data: ChartData | undefined;
    isLoading: boolean;
    isError: boolean;
    error: any;
  };
}

export interface FilterableViewState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  hasNoData: boolean;
  // Estados específicos del filtro
  filterOptions: FilterOption[] | null;
  selectedFilterId: string | null;
  isInitialState: boolean;
}