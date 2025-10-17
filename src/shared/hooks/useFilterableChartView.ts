// shared/hooks/useFilterableChartView.ts

import { useMemo } from 'react';
import { FilterableViewState, ChartData, FilterOptionsData } from '../types';

interface UseFilterableChartViewParams {
  optionsQuery: {
    data: FilterOptionsData | undefined;
    isLoading: boolean;
    isError: boolean;
    error: any;
  };
  dataQuery: {
    data: ChartData | undefined;
    isLoading: boolean;
    isError: boolean;
    error: any;
  };
  selectedFilterId: string | null;
}

export function useFilterableChartView({
  optionsQuery,
  dataQuery,
  selectedFilterId,
}: UseFilterableChartViewParams): FilterableViewState<ChartData> {
  const viewState = useMemo(() => {
    // Estado: Cargando opciones de filtro
    if (optionsQuery.isLoading) {
      return {
        data: null,
        isLoading: true,
        isError: false,
        error: null,
        hasNoData: false,
        filterOptions: null,
        selectedFilterId: null,
        isInitialState: true,
      };
    }

    // Estado: Error cargando opciones
    if (optionsQuery.isError) {
      return {
        data: null,
        isLoading: false,
        isError: true,
        error: optionsQuery.error ? String(optionsQuery.error) : 'Error loading filter options',
        hasNoData: false,
        filterOptions: null,
        selectedFilterId: null,
        isInitialState: true,
      };
    }

    // Estado: No hay opciones de filtro disponibles
    if (!optionsQuery.data || optionsQuery.data.length === 0) {
      return {
        data: null,
        isLoading: false,
        isError: false,
        error: null,
        hasNoData: true,
        filterOptions: [],
        selectedFilterId: null,
        isInitialState: true,
      };
    }

    // Estado: Mostrar opciones (ningún filtro seleccionado)
    if (!selectedFilterId) {
      return {
        data: null,
        isLoading: false,
        isError: false,
        error: null,
        hasNoData: false,
        filterOptions: optionsQuery.data,
        selectedFilterId: null,
        isInitialState: true,
      };
    }

    // Estado: Cargando datos del gráfico
    if (dataQuery.isLoading) {
      return {
        data: null,
        isLoading: true,
        isError: false,
        error: null,
        hasNoData: false,
        filterOptions: optionsQuery.data,
        selectedFilterId,
        isInitialState: false,
      };
    }

    // Estado: Error cargando datos del gráfico
    if (dataQuery.isError) {
      return {
        data: null,
        isLoading: false,
        isError: true,
        error: dataQuery.error ? String(dataQuery.error) : 'Error loading chart data',
        hasNoData: false,
        filterOptions: optionsQuery.data,
        selectedFilterId,
        isInitialState: false,
      };
    }

    // Estado: No hay datos en el gráfico o datasets vacíos
    if (!dataQuery.data || !dataQuery.data.datasets || dataQuery.data.datasets.length === 0) {
      return {
        data: null,
        isLoading: false,
        isError: false,
        error: null,
        hasNoData: true,
        filterOptions: optionsQuery.data,
        selectedFilterId,
        isInitialState: false,
      };
    }

    // Verificar si hay datos en los datasets
    const hasData = dataQuery.data.datasets.some(ds => ds.data && ds.data.length > 0);
    
    if (!hasData) {
      return {
        data: null,
        isLoading: false,
        isError: false,
        error: null,
        hasNoData: true,
        filterOptions: optionsQuery.data,
        selectedFilterId,
        isInitialState: false,
      };
    }

    // Estado: Datos exitosos
    return {
      data: dataQuery.data,
      isLoading: false,
      isError: false,
      error: null,
      hasNoData: false,
      filterOptions: optionsQuery.data,
      selectedFilterId,
      isInitialState: false,
    };
  }, [optionsQuery, dataQuery, selectedFilterId]);

  return viewState;
}