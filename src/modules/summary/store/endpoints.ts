
// constants/endpoints.ts (agregar a tu archivo existente)

export const BASE_API_URL =
  import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/summary`
    : "http://localhost:8006/api/summary";


export const ENDPOINTS = {
  // ... tus endpoints existentes de overview ...
  
  // POS Dashboard Endpoints
  POS_KPIS: `${BASE_API_URL}/kpi/`,
  PAYMENT_METHODS: `${BASE_API_URL}/daily-sales/`,
  SALES_BREAKDOWN: `${BASE_API_URL}/sales_discounts/`,
  CASH_REGISTER: `${BASE_API_URL}/cash_register/`,
  TOP_SALES_BY_TAG: `${BASE_API_URL}/top5_tag/`,
  TOP_SALES_BY_CATEGORY: `${BASE_API_URL}/top5_category/`,
  PRODUCT_TRENDS: `${BASE_API_URL}/product_trends/`,
} as const;