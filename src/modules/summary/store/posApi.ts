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
      transformResponse: (response: any) => {
        console.log('🧩 KPIs Response:', response);
        return response;
      },
      providesTags: ['KPIs'],
    }),

    // Chart Endpoints
    getPaymentMethods: builder.query<ChartData, void>({
      query: () => ENDPOINTS.PAYMENT_METHODS,
      transformResponse: (response: any) => {
        console.log('📊 Payment Methods Response:', response);
        return response;
      },
      providesTags: ['Chart'],
    }),

    getSalesBreakdown: builder.query<ChartData, void>({
      query: () => ENDPOINTS.SALES_BREAKDOWN,
      transformResponse: (response: any) => {
        console.log('📈 Sales Breakdown Response:', response);
        return response;
      },
      providesTags: ['Chart'],
    }),

    getCashRegister: builder.query<ChartData, void>({
      query: () => ENDPOINTS.CASH_REGISTER,
      transformResponse: (response: any) => {
        console.log('💰 Cash Register Response:', response);
        return response;
      },
      providesTags: ['Chart'],
    }),

    getTopSalesByTag: builder.query<ChartData, void>({
      query: () => ENDPOINTS.TOP_SALES_BY_TAG,
      transformResponse: (response: any) => {
        console.log('🏷️ Top Sales by Tag Response:', response);
        return response;
      },
      providesTags: ['Chart'],
    }),

    getTopSalesByCategory: builder.query<ChartData, void>({
      query: () => ENDPOINTS.TOP_SALES_BY_CATEGORY,
      transformResponse: (response: any) => {
        console.log('📦 Top Sales by Category Response:', response);
        return response;
      },
      providesTags: ['Chart'],
    }),

    // List Endpoints
    getProductTrends: builder.query<ListData, void>({
      query: () => ENDPOINTS.PRODUCT_TRENDS,
      transformResponse: (response: any) => {
        console.log('🧾 Product Trends Response:', response);
        return response;
      },
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
