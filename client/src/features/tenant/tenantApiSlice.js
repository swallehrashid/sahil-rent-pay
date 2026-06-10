import { apiSlice } from "../../store/apiSlice";

export const tenantApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // ==========================================
    // 1. DASHBOARD & INVOICING
    // ==========================================
    
    // Fetches the tenant's current line-item invoice, active arrears, 
    // advance payment wallet balance, and assigned property/house details.
    getTenantDashboard: builder.query({
      query: () => '/tenant/dashboard',
      providesTags: ['TenantDashboard', 'Balance', 'Invoice'],
    }),

    // ==========================================
    // 2. PAYMENTS & M-PESA FALLBACK
    // ==========================================
    
    // Retrieves the chronological ledger of past transactions
    getPaymentHistory: builder.query({
      query: () => '/tenant/payments',
      providesTags: ['PaymentHistory'],
    }),

    // M-Pesa Fallback Validation: Submits an alphanumeric Safaricom receipt code 
    // to force the backend to query the Daraja Transaction Status API.
    claimMissingPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/tenant/payments/claim',
        method: 'POST',
        body: paymentData, // { receipt_number: 'SGH1234567' }
      }),
      // Instantly updates the dashboard and history if Daraja validates the payment
      invalidatesTags: ['TenantDashboard', 'Balance', 'PaymentHistory'],
    }),

    // ==========================================
    // 3. DOCUMENT GENERATION (PDFs via WeasyPrint)
    // ==========================================
    
    // Downloads the generated PDF receipt for a specific verified payment
    downloadReceipt: builder.mutation({
      query: (transactionId) => ({
        url: `/tenant/payments/${transactionId}/receipt`,
        method: 'GET',
        // Crucial for handling binary PDF files sent by Flask/WeasyPrint
        responseHandler: (response) => response.blob(), 
      }),
    }),

    // Downloads the formal PDF statement/invoice breakdown
    downloadInvoice: builder.mutation({
      query: (invoiceId) => ({
        url: `/tenant/invoices/${invoiceId}/pdf`,
        method: 'GET',
        responseHandler: (response) => response.blob(), 
      }),
    }),

    // ==========================================
    // 4. PROFILE SETTINGS
    // ==========================================
    
    // Fetches the tenant's personal data
    getTenantProfile: builder.query({
      query: () => '/tenant/profile',
      providesTags: ['TenantProfile'],
    }),

    // Securely updates contact information and emergency contacts
    updateTenantProfile: builder.mutation({
      query: (profileData) => ({
        url: '/tenant/profile',
        method: 'PUT',
        body: profileData, // { email, phone_number, emergency_contact_name, emergency_contact_phone }
      }),
      invalidatesTags: ['TenantProfile', 'TenantDashboard'],
    }),
  }),
});

// Automatically generated React Hooks based on the defined endpoints
export const {
  useGetTenantDashboardQuery,
  useGetPaymentHistoryQuery,
  useClaimMissingPaymentMutation,
  useDownloadReceiptMutation,
  useDownloadInvoiceMutation,
  useGetTenantProfileQuery,
  useUpdateTenantProfileMutation,
} = tenantApiSlice;