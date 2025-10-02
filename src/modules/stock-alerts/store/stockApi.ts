
// store/stockApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { KPIData } from '@/shared/types';
import { ENDPOINTS } from './endpoints';

// Types específicos para Stock
export interface StockItem {
  id: string;
  name: string;
  supplier: string;
  current_stock: number;
  min_threshold: number;
  unit_price: number;
  status: string;
  unit?: string; // Opcional si el backend lo incluye
}

export interface StockTableResponse {
  items: StockItem[];
}

export const stockApi = createApi({
  reducerPath: 'stockApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['StockKPIs', 'StockTable'],
  endpoints: (builder) => ({
    // KPIs
    getStockKPIs: builder.query<KPIData[], void>({
      query: () => ENDPOINTS.STOCK_KPIS,
      providesTags: ['StockKPIs'],
    }),
    
    // Stock Table
    getStockTable: builder.query<StockItem[], void>({
      query: () => ENDPOINTS.STOCK_TABLE,
      providesTags: ['StockTable'],
    }),
    
    // Mutations para actualizar threshold
    updateStockThreshold: builder.mutation<void, { id: string; threshold: number }>({
      query: ({ id, threshold }) => ({
        url: `${ENDPOINTS.STOCK_TABLE}${id}/threshold/`,
        method: 'PATCH',
        body: { min_threshold: threshold },
      }),
      invalidatesTags: ['StockTable', 'StockKPIs'],
    }),
  }),
});

export const {
  useGetStockKPIsQuery,
  useGetStockTableQuery,
  useUpdateStockThresholdMutation,
} = stockApi;