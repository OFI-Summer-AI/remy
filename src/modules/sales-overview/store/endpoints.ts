
// constants/endpoints.ts (agregar a tu archivo existente)

export const BASE_API_URL =
  import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/prediction`
    : "http://localhost:8006/api/prediction";

export const ENDPOINTS = {
  // ... tus endpoints existentes ...
  
  // Prediction Endpoints
  SALES_FORECAST: `${BASE_API_URL}/sales/`,
  SALES_CATEGORY_PREDICTION: `${BASE_API_URL}/sales_category/`,
  TOP_ITEMS: `${BASE_API_URL}/list/top5/`,
  BOTTOM_ITEMS: `${BASE_API_URL}/list/bottom5/`,
} as const;