import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Create the base API slice
export const apiSlice = createApi({
  // The unique key that defines where this cache will be kept in the Redux store
  reducerPath: 'api',
  
  baseQuery: fetchBaseQuery({
    // Point this to your Python Flask Backend URL
    baseUrl: 'http://localhost:5000/api', 
    
    // This function runs before EVERY request. 
    // It intercepts the request and attaches the JWT if the user is logged in.
    prepareHeaders: (headers, { getState }) => {
      // Access the auth state from the Redux store
      const token = getState().auth.token;
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  // Define cache tags for automatic UI refetching (mapped from our adminApiSlice)
  tagTypes: [
    'User', 
    'Landlord', 
    'AdminDashboard', 
    'MasterLedger', 
    'AuditLog', 
    'GlobalSettings'
  ],
  
  // We leave endpoints empty here. 
  // authApiSlice.js and adminApiSlice.js will use .injectEndpoints() to populate this.
  endpoints: (builder) => ({}),
});