import { apiSlice } from "../../store/apiSlice";

export const caretakerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // ==========================================
    // 1. CARETAKER OPERATIONS DASHBOARD
    // ==========================================
    // Endpoint: GET /api/caretakers/dashboard
    // Highly restricted endpoint serving ONLY properties, houses, and tenants 
    // linked to the caretaker's employer_id. Strips out all global financial data.
    getCaretakerDashboard: builder.query({
      query: () => '/caretakers/dashboard',
      providesTags: ['CaretakerDashboard'],
    }),

    // ==========================================
    // 2. UTILITY & PENDING CHARGE ENTRY
    // ==========================================
    // Endpoint: POST /api/billing/pending-charges
    // Allows caretakers to log meter readings (water, electricity) mid-month.
    // Automatically queues as a pending charge for the tenant's next automated invoice.
    addUtilityCharge: builder.mutation({
      query: (chargeData) => ({
        // Payload expects: { tenant_id, charge_type_id, amount, notes }
        url: '/billing/pending-charges',
        method: 'POST',
        body: chargeData,
      }),
      // Invalidate to reflect the newly added charge immediately in local views
      invalidatesTags: ['CaretakerDashboard', 'TenantBalances'],
    }),

    // ==========================================
    // 3. TENANT BALANCES (FOLLOW-UP VIEW)
    // ==========================================
    // Note: Caretakers are blocked from the Landlord's /api/reports/balances route.
    // This targets a caretaker-specific operational balance route to view who owes rent.
    getTenantBalances: builder.query({
      query: () => '/caretakers/balances',
      providesTags: ['TenantBalances'],
    }),

  }),
});

// RTK Query automatically generates custom React hooks for each endpoint
export const {
  useGetCaretakerDashboardQuery,
  useAddUtilityChargeMutation,
  useGetTenantBalancesQuery,
} = caretakerApiSlice;