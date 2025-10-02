
// hooks/useChartView.ts

import { useMemo } from 'react';
import { ViewState, ChartData } from '../types';

type ChartQueryHook = () => {
  data: ChartData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: any;
};

export function useChartView(queryHook: ChartQueryHook): ViewState<ChartData> {
  const { data, isLoading, isError, error } = queryHook();

  return useMemo(() => {
    // Si está cargando
    if (isLoading) {
      return {
        data: null,
        isLoading: true,
        isError: false,
        error: null,
        hasNoData: false,
      };
    }

    // Si hay error
    if (isError) {
      return {
        data: null,
        isLoading: false,
        isError: true,
        error: error ? String(error) : 'Error loading chart',
        hasNoData: false,
      };
    }

    // Si no hay datos o datasets vacíos
    if (!data || !data.datasets || data.datasets.length === 0) {
      return {
        data: null,
        isLoading: false,
        isError: false,
        error: null,
        hasNoData: true,
      };
    }

    // Verificar si hay datos en los datasets
    const hasData = data.datasets.some(ds => ds.data && ds.data.length > 0);
    
    if (!hasData) {
      return {
        data: null,
        isLoading: false,
        isError: false,
        error: null,
        hasNoData: true,
      };
    }

    // Datos exitosos
    return {
      data,
      isLoading: false,
      isError: false,
      error: null,
      hasNoData: false,
    };
  }, [data, isLoading, isError, error]);
}