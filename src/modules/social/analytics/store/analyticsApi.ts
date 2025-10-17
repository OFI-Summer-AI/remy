// api/reviewsApi.ts (ACTUALIZADO)

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ChartData, FilterOptionsData } from '@/shared/types';
import { REVIEWS_ENDPOINTS } from './endpoints';

export const analyticsApi = createApi({
  reducerPath: 'reviewsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['EmployeeSummary', 'ItemSummary', 'ItemTrend', 'EmployeeTrend'],
  endpoints: (builder) => ({
    // ========== SUMMARIES (Estáticos) ==========
    getEmployeeSummary: builder.query<ChartData, void>({
      query: () => REVIEWS_ENDPOINTS.EMPLOYEE_SUMMARY,
      providesTags: ['EmployeeSummary'],
    }),
    
    getItemSummary: builder.query<ChartData, void>({
      query: () => REVIEWS_ENDPOINTS.ITEM_SUMMARY,
      providesTags: ['ItemSummary'],
    }),

    // ========== ITEM TREND (Con filtros) ==========
    // Obtener opciones de items
    getItemTrendOptions: builder.query<FilterOptionsData, void>({
      query: () => REVIEWS_ENDPOINTS.ITEM_TREND_OPTIONS,
      providesTags: ['ItemTrend'],
    }),
    
    // Obtener datos de tendencia de un item específico
    getItemTrendData: builder.query<ChartData, string>({
      query: (itemId) => REVIEWS_ENDPOINTS.ITEM_TREND_DATA(itemId),
      providesTags: ['ItemTrend'],
    }),

    // ========== EMPLOYEE TREND (Con filtros) ==========
    // Obtener opciones de empleados
    getEmployeeTrendOptions: builder.query<FilterOptionsData, void>({
      query: () => REVIEWS_ENDPOINTS.EMPLOYEE_TREND_OPTIONS,
      providesTags: ['EmployeeTrend'],
    }),
    
    // Obtener datos de tendencia de un empleado específico
    getEmployeeTrendData: builder.query<ChartData, string>({
      query: (employeeId) => REVIEWS_ENDPOINTS.EMPLOYEE_TREND_DATA(employeeId),
      providesTags: ['EmployeeTrend'],
    }),
  }),
});

export const {
  // Summaries
  useGetEmployeeSummaryQuery,
  useGetItemSummaryQuery,
  
  // Item Trend
  useGetItemTrendOptionsQuery,
  useGetItemTrendDataQuery,
  
  // Employee Trend
  useGetEmployeeTrendOptionsQuery,
  useGetEmployeeTrendDataQuery,
} = analyticsApi;