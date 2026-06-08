// Note: We assume the base RTK Query setup (fetchBaseQuery) is configured in your store directory.
import { apiSlice } from "../../store/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // Universal login for all role_types (Admin, Landlord, Caretaker, Tenant)
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login", 
        method: "POST", 
        body: credentials,
      }),
    }),
    
    // Landlord Self-Service Onboarding
    registerLandlord: builder.mutation({
      query: (userData) => ({
        url: "/auth/register/landlord", 
        method: "POST", 
        body: userData,
      }),
    }),

    // Tenant Smart Link Activation (First-time password creation via SMS token)
    activateTenant: builder.mutation({
      query: (body) => ({
        // Body will contain { activation_token: "...", password: "..." }
        url: "/auth/activate-tenant", 
        method: "POST", 
        body,
      }),
    }),

    // Email Verification (Post-registration step for Landlords)
    verifyEmail: builder.query({
      query: (token) => `/auth/verify-email?token=${token}`,
    }),

    // Standard Password Recovery Flow
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/forgot-password", 
        method: "POST", 
        body,
      }),
    }),
    
    resetPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/reset-password", 
        method: "POST", 
        body,
      }),
    }),

    // Session Hydration: Fetches the latest profile data for the authenticated user
    getMe: builder.query({
      query: () => "/auth/me",
      // Ensures the component re-fetches if the cache is invalidated
      providesTags: ['User'], 
    }),
    
  }),
});

// RTK Query automatically generates custom React hooks for each endpoint
export const {
  useLoginMutation,
  useRegisterLandlordMutation,
  useActivateTenantMutation,
  useVerifyEmailQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMeQuery,             
} = authApiSlice;