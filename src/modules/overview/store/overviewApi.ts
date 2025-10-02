// api/overviewApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { KPIData, ChartData, ListData } from '../types';
import { ENDPOINTS } from './endpoints';

export const overviewApi = createApi({
  reducerPath: 'overviewApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['KPIs', 'Chart', 'List'],
  endpoints: (builder) => ({
    // KPIs - Get all KPIs for the page in one request
    getKPIs: builder.query<KPIData[], void>({
      query: () => ENDPOINTS.KPIS,
      providesTags: ['KPIs'],
    }),
    
    // Chart Endpoints
    getSalesTrend: builder.query<ChartData, void>({
      query: () => ENDPOINTS.SALES_TREND,
      providesTags: ['Chart'],
    }),
    
    getSalesCategory: builder.query<ChartData, void>({
      query: () => ENDPOINTS.SALES_CATEGORY,
      providesTags: ['Chart'],
    }),
    
    getRevenueGraph: builder.query<ChartData, void>({
      query: () => ENDPOINTS.REVENUE_GRAPH,
      providesTags: ['Chart'],
    }),
    
    getOrdersChannels: builder.query<ChartData, void>({
      query: () => ENDPOINTS.ORDERS_CHANNELS,
      providesTags: ['Chart'],
    }),
    
    getWeeklyReservations: builder.query<ChartData, void>({
      query: () => ENDPOINTS.WEEKLY_RESERVATIONS,
      providesTags: ['Chart'],
    }),
    
    getPromotions: builder.query<ChartData, void>({
      query: () => ENDPOINTS.PROMOTIONS,
      providesTags: ['Chart'],
    }),
    
    getSatisfaction: builder.query<ChartData, void>({
      query: () => ENDPOINTS.SATISFACTION,
      providesTags: ['Chart'],
    }),
    
    // List Endpoints
    getStockAlerts: builder.query<ListData, void>({
      query: () => ENDPOINTS.STOCK_ALERTS,
      providesTags: ['List'],
    }),
    
    getPopularItems: builder.query<ListData, void>({
      query: () => ENDPOINTS.POPULAR_ITEMS,
      providesTags: ['List'],
    }),
  }),
});

export const {
  useGetKPIsQuery,
  useGetSalesTrendQuery,
  useGetSalesCategoryQuery,
  useGetRevenueGraphQuery,
  useGetOrdersChannelsQuery,
  useGetWeeklyReservationsQuery,
  useGetPromotionsQuery,
  useGetSatisfactionQuery,
  useGetStockAlertsQuery,
  useGetPopularItemsQuery,
} = overviewApi;