// constants/endpoints.ts - Reviews section (ACTUALIZADO)

export const REVIEWS_BASE_API_URL =
  import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/reviews`
    : "https://remy.api.sofiatechnology.ai/api/reviews";

export const REVIEWS_ENDPOINTS = {
  // Reviews Summaries (estáticos)
  EMPLOYEE_SUMMARY: `${REVIEWS_BASE_API_URL}/employee-summary/`,
  ITEM_SUMMARY: `${REVIEWS_BASE_API_URL}/item-summary/`,
  
  // Reviews Trends (con filtros)
  ITEM_TREND_OPTIONS: `${REVIEWS_BASE_API_URL}/item-trend/`,
  ITEM_TREND_DATA: (itemId: string) => `${REVIEWS_BASE_API_URL}/item-trend/${itemId}/`,
  
  EMPLOYEE_TREND_OPTIONS: `${REVIEWS_BASE_API_URL}/employee-trend/`,
  EMPLOYEE_TREND_DATA: (employeeId: string) => `${REVIEWS_BASE_API_URL}/employee-trend/${employeeId}/`,
} as const;

export type ReviewsEndpointKey = keyof typeof REVIEWS_ENDPOINTS;