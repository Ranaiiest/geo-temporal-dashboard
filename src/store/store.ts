// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import timelineReducer from './slices/timelineSlice';
import polygonsReducer from './slices/polygonsSlice';
import mapReducer from './slices/mapSlice';

/**
 * The main Redux store.
 * It combines reducers from different "slices" of the application state.
 * Each slice is responsible for its own part of the state (e.g., timeline, map, polygons).
 */
export const store = configureStore({
  reducer: {
    timeline: timelineReducer,
    polygons: polygonsReducer,
    map: mapReducer,
  },
  
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;