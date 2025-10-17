// store/index.ts - Configuration with multiple API slices

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { overviewApi } from '@/modules/overview/store/overviewApi';
import { posApi } from '@/modules/summary/store/posApi';
import { predictionApi } from '@/modules/sales-overview/store/predictionApi';
import { stockApi } from '@/modules/stock-alerts/store/stockApi';
import { promotionsApi } from '@/modules/promotions/store/promotionsApi';
import { analyticsApi } from '@/modules/social/analytics/store/analyticsApi';

export const store = configureStore({
  reducer: {
    // Add reducers for each API
    [overviewApi.reducerPath]: overviewApi.reducer,
    [posApi.reducerPath]: posApi.reducer,
    [predictionApi.reducerPath]: predictionApi.reducer,
    [stockApi.reducerPath]: stockApi.reducer,
    [promotionsApi.reducerPath]: promotionsApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    
    // ... other reducers
  },
  // Add middleware for all RTK Query APIs
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(overviewApi.middleware)
      .concat(posApi.middleware)
      .concat(predictionApi.middleware)
      .concat(stockApi.middleware)
      .concat(promotionsApi.middleware)
      .concat(analyticsApi.middleware),
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;