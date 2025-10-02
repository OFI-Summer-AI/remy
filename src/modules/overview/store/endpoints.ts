
// constants/endpoints.ts

export const BASE_API_URL =
  import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/overview`
    : "http://localhost:8006/api/overview";

export const ENDPOINTS = {
  // KPIs
  KPIS:`${BASE_API_URL}/kpi/`,
  
  // Charts (graphs)
  SALES_TREND: `${BASE_API_URL}/sales_trend/`,
  SALES_CATEGORY: `${BASE_API_URL}/sales_category/`,
  REVENUE_GRAPH: `${BASE_API_URL}/revenue_graph/`,
  ORDERS_CHANNELS: `${BASE_API_URL}/orders_channels/`,
  WEEKLY_RESERVATIONS: `${BASE_API_URL}/weekly_reservations/`,
  PROMOTIONS: `${BASE_API_URL}/promotions/`,
  SATISFACTION: `${BASE_API_URL}/satisfaction/`,
  
  // Lists (tables)
  STOCK_ALERTS: `${BASE_API_URL}/stock_alerts/`,
  POPULAR_ITEMS: `${BASE_API_URL}/popular_items/`,
} as const;

export type EndpointKey = keyof typeof ENDPOINTS;