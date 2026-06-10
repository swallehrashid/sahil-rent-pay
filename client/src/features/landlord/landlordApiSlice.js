import { apiSlice } from "../../store/apiSlice";

export const landlordApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // ==========================================
    // 1. PROPERTY & HOUSE MANAGEMENT
    // ==========================================
    
    getProperties: builder.query({
      query: () => '/properties',
      providesTags: (result) =>
        result && result.properties
          ? [
              ...result.properties.map(({ id }) => ({ type: 'Property', id })),
              { type: 'Property', id: 'LIST' },
            ]
          : [{ type: 'Property', id: 'LIST' }],
    }),

    createProperty: builder.mutation({
      query: (propertyData) => ({
        url: '/properties',
        method: 'POST',
        body: propertyData, // { name, location, description }
      }),
      invalidatesTags: [{ type: 'Property', id: 'LIST' }, 'Report'],
    }),

    addHouse: builder.mutation({
      query: ({ propertyId, houseData }) => ({
        url: `/properties/${propertyId}/houses`,
        method: 'POST',
        body: houseData, // { house_number (suffix), base_rent }
      }),
      invalidatesTags: (result, error, { propertyId }) => [
        { type: 'Property', id: propertyId },
        { type: 'Property', id: 'LIST' },
        'Report'
      ],
    }),

    // ==========================================
    // 2. TENANT MANAGEMENT
    // ==========================================

    registerTenant: builder.mutation({
      query: (tenantData) => ({
        url: '/tenants',
        method: 'POST',
        body: tenantData, // { first_name, last_name, email, phone_number, id_number, move_in_date, deposit_amount, house_id, ... }
      }),
      invalidatesTags: [{ type: 'Property', id: 'LIST' }, 'Tenant', 'Report', 'Balance'],
    }),

    updateTenant: builder.mutation({
      query: ({ tenantId, updateData }) => ({
        url: `/tenants/${tenantId}`,
        method: 'PUT',
        body: updateData, // { email, phone_number, emergency_contact_name, ... }
      }),
      invalidatesTags: (result, error, { tenantId }) => [
        { type: 'Tenant', id: tenantId },
        { type: 'Property', id: 'LIST' }
      ],
    }),

    archiveTenant: builder.mutation({
      query: ({ tenantId, moveOutDate }) => ({
        url: `/tenants/${tenantId}/archive`,
        method: 'POST',
        body: { move_out_date: moveOutDate },
      }),
      // Archiving a tenant vacates the house, affecting properties, tenants, and reports
      invalidatesTags: [{ type: 'Property', id: 'LIST' }, 'Tenant', 'Report'],
    }),

    notifySystemSetup: builder.mutation({
      query: () => ({
        url: '/tenants/notify-setup',
        method: 'POST',
      }),
      // No cache invalidation needed as this just triggers outbound SMS
    }),

    // ==========================================
    // 3. CARETAKER PROVISIONING
    // ==========================================

    provisionCaretaker: builder.mutation({
      query: (caretakerData) => ({
        url: '/caretakers',
        method: 'POST',
        body: caretakerData, // { first_name, last_name, email, phone_number, password, permissions: {} }
      }),
      invalidatesTags: ['Caretaker', 'Report'],
    }),

    // ==========================================
    // 4. BILLING, FINES & CUSTOM CHARGES
    // ==========================================

    getChargeTypes: builder.query({
      query: () => '/billing/charge-types',
      providesTags: ['ChargeType'],
    }),

    createChargeType: builder.mutation({
      query: (chargeTypeData) => ({
        url: '/billing/charge-types',
        method: 'POST',
        body: chargeTypeData, // { name }
      }),
      invalidatesTags: ['ChargeType'],
    }),

    addPendingCharge: builder.mutation({
      query: (chargeData) => ({
        url: '/billing/pending-charges',
        method: 'POST',
        body: chargeData, // { tenant_id, charge_type_id, amount, notes }
      }),
      invalidatesTags: ['Balance', 'Report'],
    }),

    triggerFines: builder.mutation({
      query: (fineData) => ({
        url: '/billing/fines/trigger',
        method: 'POST',
        body: fineData, // { tenant_ids: [], amount, description }
      }),
      // Fines alter the ledger and tenant balances instantly
      invalidatesTags: ['Balance', 'Report', 'Tenant'],
    }),

    // ==========================================
    // 5. PAYMENTS & MANUAL ADJUSTMENTS
    // ==========================================

    verifyManualPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/mpesa/verify-manual',
        method: 'POST',
        body: paymentData, // { receipt_number, tenant_id }
      }),
      invalidatesTags: ['Balance', 'Report'],
    }),

    addManualAdjustment: builder.mutation({
      query: (adjustmentData) => ({
        url: '/billing/manual-adjustments',
        method: 'POST',
        body: adjustmentData, // { transaction_type: 'Deposit Held', amount, description, tenant_id (optional) }
      }),
      invalidatesTags: ['Report', 'Balance'],
    }),

    // ==========================================
    // 6. REPORTS & DASHBOARDS
    // ==========================================

    getCurrentMonthReports: builder.query({
      query: () => '/reports/current-month',
      providesTags: ['Report'],
    }),

    getTenantBalances: builder.query({
      query: () => '/reports/balances',
      providesTags: ['Balance'],
    }),

    getHistoricalReports: builder.query({
      query: (year) => ({
        url: '/reports/historical',
        params: { year },
      }),
      providesTags: ['Report'],
    }),

  }),
});

// Automatically generated React Hooks based on the defined endpoints
export const {
  useGetPropertiesQuery,
  useCreatePropertyMutation,
  useAddHouseMutation,
  useRegisterTenantMutation,
  useUpdateTenantMutation,
  useArchiveTenantMutation,
  useNotifySystemSetupMutation,
  useProvisionCaretakerMutation,
  useGetChargeTypesQuery,
  useCreateChargeTypeMutation,
  useAddPendingChargeMutation,
  useTriggerFinesMutation,
  useVerifyManualPaymentMutation,
  useAddManualAdjustmentMutation,
  useGetCurrentMonthReportsQuery,
  useGetTenantBalancesQuery,
  useGetHistoricalReportsQuery,
} = landlordApiSlice;