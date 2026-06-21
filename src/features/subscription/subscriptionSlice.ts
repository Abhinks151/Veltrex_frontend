import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SubscriptionResponse, SubscriptionType } from './types';
import { getSubscription, toggleSubscriptionStatus } from './subscriptionThunk';
import type { ApiResponse } from '@/shared/types/apiResponse';

const initialState: SubscriptionType = {
  id: null,
  tenantId: null,
  planId: null,
  plan: null,
  status: null,
  startDate: null,
  endDate: null,
  trialUsed: false,
  razorpaySubscriptionId: null,
  loading: false,
  initialized: false,
  toggling: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearSubscription: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getSubscription.fulfilled,
        (
          state,
          action: PayloadAction<ApiResponse<SubscriptionResponse> | null>,
        ) => {
          state.loading = false;
          state.initialized = true;
          if (!action.payload || !action.payload.data) {
            state.id = null;
            state.tenantId = null;
            state.planId = null;
            state.plan = null;
            state.status = null;
            state.startDate = null;
            state.endDate = null;
            state.razorpaySubscriptionId = null;
            return;
          }

          const {
            id,
            tenantId,
            planId,
            plan,
            status,
            startDate,
            endDate,
            trialUsed,
            razorpaySubscriptionId,
          } = action.payload.data;
          state.id = id;
          state.tenantId = tenantId;
          state.planId = planId;
          state.plan = plan || null;
          state.status = status;
          state.startDate = startDate;
          state.endDate = endDate;
          state.trialUsed = trialUsed;
          state.razorpaySubscriptionId = razorpaySubscriptionId;
        },
      )
      .addCase(getSubscription.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.error = action.payload as string;
      })

      .addCase(toggleSubscriptionStatus.pending, (state) => {
        state.toggling = true;
        state.error = null;
      })
      .addCase(
        toggleSubscriptionStatus.fulfilled,
        (
          state,
          action: PayloadAction<ApiResponse<SubscriptionResponse> | null>,
        ) => {
          state.toggling = false;
          if (!action.payload || !action.payload.data) return;

          const {
            id,
            tenantId,
            planId,
            plan,
            status,
            startDate,
            endDate,
            razorpaySubscriptionId,
          } = action.payload.data;
          state.id = id;
          state.tenantId = tenantId;
          state.planId = planId;
          state.plan = plan || null;
          state.status = status;
          state.startDate = startDate;
          state.endDate = endDate;
          state.razorpaySubscriptionId = razorpaySubscriptionId;
        },
      )
      .addCase(toggleSubscriptionStatus.rejected, (state, action) => {
        state.toggling = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
