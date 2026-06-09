import { apiSlice } from "../../store/apiSlice";

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // ==========================================
    // 1. DASHBOARD & OVERVIEW
    // ==========================================
    getDashboardStats: builder.query({
      query: () => '/admin/dashboard',
      providesTags: ['AdminDashboard'],
    }),

    // ==========================================
    // 2. LANDLORD MANAGEMENT
    // ==========================================
    getLandlords: builder.query({
      query: () => '/admin/landlords',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Landlord', id })),
              { type: 'Landlord', id: 'LIST' },
            ]
          : [{ type: 'Landlord', id: 'LIST' }],
    }),

    updateLandlordFee: builder.mutation({
      query: ({ landlordId, fee_percentage }) => ({
        url: `/admin/landlords/${landlordId}/fee`,
        method: 'PUT',
        body: { fee_percentage },
      }),
      invalidatesTags: (result, error, { landlordId }) => [
        { type: 'Landlord', id: landlordId },
        'AdminDashboard'
      ],
    }),

    updateLandlordTrial: builder.mutation({
      query: ({ landlordId, is_active, trial_days }) => ({
        url: `/admin/landlords/${landlordId}/trial`,
        method: 'PUT',
        body: { is_active, trial_days },
      }),
      invalidatesTags: (result, error, { landlordId }) => [
        { type: 'Landlord', id: landlordId },
        'AdminDashboard'
      ],
    }),

    // High-security endpoint: Generates a temporary impersonation JWT
    impersonateLandlord: builder.mutation({
      query: (landlordId) => ({
        url: `/admin/impersonate/${landlordId}`,
        method: 'POST',
      }),
      // Note: The UI will need to handle storing this new temporary token 
      // and redirecting to the Landlord Dashboard.
    }),

    // ==========================================
    // 3. MASTER LEDGER & AUDIT
    // ==========================================
    getMasterLedger: builder.query({
      query: (params) => ({
        url: '/admin/ledger',
        params, // E.g., ?search=SGH1234567 or ?status=Allocated
      }),
      providesTags: ['MasterLedger'],
    }),

    getAuditLogs: builder.query({
      query: (params) => ({
        url: '/admin/audit-logs',
        params,
      }),
      providesTags: ['AuditLog'],
    }),

    // Triggers Daraja Transaction Status API query globally
    queryDarajaStatus: builder.mutation({
      query: (transactionCode) => ({
        url: '/admin/daraja/query',
        method: 'POST',
        body: { transaction_code: transactionCode },
      }),
      invalidatesTags: ['MasterLedger'],
    }),

    // ==========================================
    // 4. GLOBAL SETTINGS & AUTOMATION
    // ==========================================
    getGlobalSettings: builder.query({
      query: () => '/admin/settings',
      providesTags: ['GlobalSettings'],
    }),

    updateGlobalSettings: builder.mutation({
      query: (settingsData) => ({
        url: '/admin/settings',
        method: 'PUT',
        body: settingsData,
      }),
      invalidatesTags: ['GlobalSettings', { type: 'Landlord', id: 'LIST' }],
    }),

    // Forces manual execution of Celery Beat cron jobs (e.g., sync_invoices, verify_trials)
    triggerSystemJob: builder.mutation({
      query: (jobName) => ({
        url: `/admin/jobs/trigger`,
        method: 'POST',
        body: { job_name: jobName },
      }),
      invalidatesTags: ['MasterLedger', 'AdminDashboard', 'AuditLog', { type: 'Landlord', id: 'LIST' }],
    }),

  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetLandlordsQuery,
  useUpdateLandlordFeeMutation,
  useUpdateLandlordTrialMutation,
  useImpersonateLandlordMutation,
  useGetMasterLedgerQuery,
  useGetAuditLogsQuery,
  useQueryDarajaStatusMutation,
  useGetGlobalSettingsQuery,
  useUpdateGlobalSettingsMutation,
  useTriggerSystemJobMutation,
} = adminApiSlice;