// store/predictionApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ChartData, ListData } from '@/shared/types';
import { ENDPOINTS } from './endpoints';

export const predictionApi = createApi({
  reducerPath: 'predictionApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Chart', 'List'],
  endpoints: (builder) => ({
    // Chart Endpoints
    getSalesForecast: builder.query<ChartData, void>({
      query: () => ENDPOINTS.SALES_FORECAST,
      providesTags: ['Chart'],
    }),
    
    getSalesCategory: builder.query<ChartData, void>({
      query: () => ENDPOINTS.SALES_CATEGORY_PREDICTION,
      providesTags: ['Chart'],
    }),
    
    // List Endpoints
    getTopItems: builder.query<ListData, void>({
      query: () => ENDPOINTS.TOP_ITEMS,
      providesTags: ['List'],
    }),
    
    getBottomItems: builder.query<ListData, void>({
      query: () => ENDPOINTS.BOTTOM_ITEMS,
      providesTags: ['List'],
    }),
  }),
});

export const {
  useGetSalesForecastQuery,
  useGetSalesCategoryQuery,
  useGetTopItemsQuery,
  useGetBottomItemsQuery,
} = predictionApi;