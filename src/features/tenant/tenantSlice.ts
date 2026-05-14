import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TenantResponse, TenantType } from './types';
import { getTenant, tenant, updateTenant } from './tenantThunk';
import type { ApiResponse } from '@/shared/types/apiResponse';

const initialState: TenantType = {
  name: null,
  id: null,
  isBlocked: false,
  isDeleted: false,
  loading: false,
  error: null,
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(tenant.pending, (state) => {
        state.name = null;
        state.loading = true;
        state.error = null;
      })
      .addCase(
        tenant.fulfilled,
        (state, action: PayloadAction<ApiResponse<TenantResponse>>) => {
          state.name = action.payload.data?.name || null;
          state.id = action.payload.data?.id || null;
          state.isBlocked = action.payload.data?.isBlocked || false;
          state.isDeleted = action.payload.data?.isDeleted || false;
          state.loading = false;
        },
      )
      .addCase(tenant.rejected, (state, action) => {
        state.name = null;
        state.id = null;
        state.loading = false;
        state.error = action.payload as string;
      })


      //Get tenant
      .addCase(getTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getTenant.fulfilled,
        (state, action: PayloadAction<ApiResponse<TenantResponse> | null>) => {
          // state.name = action.payload.data?.name || null;
          // state.loading = false;

          if (!action.payload) {
            state.name = null;
            state.id = null;
            state.isBlocked = false;
            state.isDeleted = false;
            state.loading = false;
            return;
          }

          state.name = action.payload.data?.name || null;
          state.id = action.payload.data?.id || null;
          state.isBlocked = action.payload.data?.isBlocked || false;
          state.isDeleted = action.payload.data?.isDeleted || false;
          state.loading = false;
        },
      )
      .addCase(getTenant.rejected, (state, action) => {
        state.name = null;
        state.loading = false;
        state.error = action.payload as string;
      })

      //Update Tenant
      .addCase(updateTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateTenant.fulfilled,
        (state, action: PayloadAction<ApiResponse<TenantResponse>>) => {
          state.name = action.payload.data?.name || null;
          state.loading = false;
          state.isBlocked = action.payload.data?.isBlocked || false;
          state.isDeleted = action.payload.data?.isDeleted || false;
        },
      )
      .addCase(updateTenant.rejected, (state, action) => {
        state.name = null;
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default tenantSlice.reducer;
