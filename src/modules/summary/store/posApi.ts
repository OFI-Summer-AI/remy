
// store/posApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { KPIData, ChartData, ListData } from '@/shared/types';
import { ENDPOINTS } from './endpoints';

export const posApi = createApi({
  reducerPath: 'posApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['KPIs', 'Chart', 'List'],
  endpoints: (builder) => ({
    // KPIs - Get all KPIs for the POS dashboard
    getPOSKPIs: builder.query<KPIData[], void>({
      query: () => ENDPOINTS.POS_KPIS,
      providesTags: ['KPIs'],
    }),
    
    // Chart Endpoints
    getPaymentMethods: builder.query<ChartData, void>({
      query: () => ENDPOINTS.PAYMENT_METHODS,
      providesTags: ['Chart'],
    }),
    
    getSalesBreakdown: builder.query<ChartData, void>({
      query: () => ENDPOINTS.SALES_BREAKDOWN,
      providesTags: ['Chart'],
    }),
    
    getCashRegister: builder.query<ChartData, void>({
      query: () => ENDPOINTS.CASH_REGISTER,
      providesTags: ['Chart'],
    }),
    
    getTopSalesByTag: builder.query<ChartData, void>({
      query: () => ENDPOINTS.TOP_SALES_BY_TAG,
      providesTags: ['Chart'],
    }),
    
    getTopSalesByCategory: builder.query<ChartData, void>({
      query: () => ENDPOINTS.TOP_SALES_BY_CATEGORY,
      providesTags: ['Chart'],
    }),
    
    // List Endpoints
    getProductTrends: builder.query<ListData, void>({
      query: () => ENDPOINTS.PRODUCT_TRENDS,
      providesTags: ['List'],
    }),
  }),
});

export const {
  useGetPOSKPIsQuery,
  useGetPaymentMethodsQuery,
  useGetSalesBreakdownQuery,
  useGetCashRegisterQuery,
  useGetTopSalesByTagQuery,
  useGetTopSalesByCategoryQuery,
  useGetProductTrendsQuery,
} = posApi;