
// store/promotionsApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { KPIData } from '@/shared/types';
import { ENDPOINTS } from './endpoints';

// Types específicos para Promotions
export interface PromotionItem {
  id: string;
  item: string;
  discount: string; // "15%"
  start_date: string;
  end_date: string;
  original_price?: number; // Opcional si el backend lo incluye
  status?: 'active' | 'scheduled' | 'expired'; // Calculado en frontend
}

export interface CreatePromotionRequest {
  item_id: number;
  item_name: string;
  original_price: number;
  discount: number;
  start_date: string;
  end_date: string;
}

export const promotionsApi = createApi({
  reducerPath: 'promotionsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['PromotionsKPIs', 'PromotionsTable'],
  endpoints: (builder) => ({
    // KPIs
    getPromotionsKPIs: builder.query<KPIData[], void>({
      query: () => ENDPOINTS.PROMOTIONS_KPIS,
      providesTags: ['PromotionsKPIs'],
    }),
    
    // Promotions Table
    getPromotionsTable: builder.query<PromotionItem[], void>({
      query: () => ENDPOINTS.PROMOTIONS_TABLE,
      providesTags: ['PromotionsTable'],
    }),
    
    // Mutations
    createPromotion: builder.mutation<void, CreatePromotionRequest>({
      query: (promotion) => ({
        url: ENDPOINTS.PROMOTIONS_TABLE,
        method: 'POST',
        body: promotion,
      }),
      invalidatesTags: ['PromotionsTable', 'PromotionsKPIs'],
    }),
    
    deletePromotion: builder.mutation<void, string>({
      query: (id) => ({
        url: `${ENDPOINTS.PROMOTIONS_TABLE}${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PromotionsTable', 'PromotionsKPIs'],
    }),
  }),
});

export const {
  useGetPromotionsKPIsQuery,
  useGetPromotionsTableQuery,
  useCreatePromotionMutation,
  useDeletePromotionMutation,
} = promotionsApi;