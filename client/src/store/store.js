import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    // 1. Synchronous State: Holds the current user object and JWT token
    auth: authReducer,
    
    // 2. Asynchronous State: Holds all the cached data from API requests (RTK Query)
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  
  // Adding the api middleware enables caching, invalidation, polling, and other useful RTK Query features
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
    
  // Enables the Redux DevTools extension in your browser for debugging
  devTools: process.env.NODE_ENV !== 'production',
});