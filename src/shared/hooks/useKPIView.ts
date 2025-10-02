// hooks/useKPIsView.ts

import { useMemo } from 'react';
import { useGetKPIsQuery } from '@/modules/overview/store/overviewApi';
import { ViewState, KPIData } from '../types';

export function useKPIsView(): ViewState<KPIData[]> {
  const { data, isLoading, isError, error } = useGetKPIsQuery();

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
        error: error ? String(error) : 'Error loading KPIs',
        hasNoData: false,
      };
    }

    // No data or empty array
    if (!data || !Array.isArray(data) || data.length === 0) {
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
      data,
      isLoading: false,
      isError: false,
      error: null,
      hasNoData: false,
    };
  }, [data, isLoading, isError, error]);
}