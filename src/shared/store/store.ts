// store/index.ts - Configuration with multiple API slices

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { overviewApi } from '@/modules/overview/store/overviewApi';
import { posApi } from '@/modules/summary/store/posApi';

export const store = configureStore({
  reducer: {
    // Add reducers for each API
    [overviewApi.reducerPath]: overviewApi.reducer,
    [posApi.reducerPath]: posApi.reducer,
    // ... other reducers
  },
  // Add middleware for all RTK Query APIs
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(overviewApi.middleware)
      .concat(posApi.middleware),
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;