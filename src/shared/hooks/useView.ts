
// shared/hooks/useView.ts
// Generic hook that works with ANY data fetching library (RTK Query, React Query, SWR, etc.)

import { useMemo } from 'react';
import { ViewState, QueryResult } from '../types';

/**
 * Generic view hook that transforms any query result into a ViewState
 * Works with RTK Query, React Query, SWR, or any custom hook that returns:
 * { data, isLoading, isError, error }
 * 
 * @param queryResult - Result from any data fetching hook
 * @param validateData - Optional function to validate if data is valid
 * @returns ViewState with normalized loading/error/data states
 */
export function useView<T>(
  queryResult: QueryResult<T>,
  validateData?: (data: T | undefined) => boolean
): ViewState<T> {
  const { data, isLoading, isError, error } = queryResult;

  return useMemo(() => {
    // Loading state
    if (isLoading) {
      return {
        data: null,
        isLoading: true,
        isError: false,
        error: null,
        hasNoData: false,
      };
    }

    // Error state
    if (isError) {
      return {
        data: null,
        isLoading: false,
        isError: true,
        error: error ? String(error) : 'Error loading data',
        hasNoData: false,
      };
    }

    // Validate data if validator provided
    const isValid = validateData ? validateData(data) : !!data;

    // No data state
    if (!isValid) {
      return {
        data: null,
        isLoading: false,
        isError: false,
        error: null,
        hasNoData: true,
      };
    }

    // Success state
    return {
      data: data as T,
      isLoading: false,
      isError: false,
      error: null,
      hasNoData: false,
    };
  }, [data, isLoading, isError, error, validateData]);
}

/**
 * Specialized hook for KPIs (array of KPIData)
 */
export function useKPIsView<T extends any[]>(
  queryResult: QueryResult<T>
): ViewState<T> {
  return useView(queryResult, (data) => {
    return Array.isArray(data) && data.length > 0;
  });
}

/**
 * Specialized hook for Charts
 */
export function useChartView<T extends { datasets?: any[] }>(
  queryResult: QueryResult<T>
): ViewState<T> {
  return useView(queryResult, (data) => {
    return !!(
      data &&
      data.datasets &&
      Array.isArray(data.datasets) &&
      data.datasets.length > 0 &&
      data.datasets.some(ds => ds.data && ds.data.length > 0)
    );
  });
}

/**
 * Specialized hook for Lists
 */
export function useListView<T extends any[]>(
  queryResult: QueryResult<T>
): ViewState<T> {
  return useView(queryResult, (data) => {
    return Array.isArray(data) && data.length > 0;
  });
}