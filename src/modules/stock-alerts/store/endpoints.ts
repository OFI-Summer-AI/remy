
// constants/endpoints.ts (agregar a tu archivo existente)

export const BASE_API_URL =
  import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/stock-alerts`
    : "http://localhost:8006/api/stock-alerts";

export const ENDPOINTS = {
  
  // Stock Endpoints
  STOCK_KPIS: `${BASE_API_URL}/kpi/`,
  STOCK_TABLE: `${BASE_API_URL}/`,
} as const;