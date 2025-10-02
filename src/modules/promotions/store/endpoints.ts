
// constants/endpoints.ts (agregar a tu archivo existente)

export const BASE_API_URL =
  import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/promotions`
    : "http://localhost:8006/api/promotions";

export const ENDPOINTS = {
  // ... tus endpoints existentes ...
  
  // Promotions Endpoints
  PROMOTIONS_KPIS: `${BASE_API_URL}/kpi/`,
  PROMOTIONS_TABLE: `${BASE_API_URL}/promotions/`,
} as const;