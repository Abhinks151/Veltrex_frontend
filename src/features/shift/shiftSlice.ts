import { createSlice } from '@reduxjs/toolkit';
import type { ShiftTemplate, ProductionShift } from './types';
import {
  fetchShiftTemplates,
  createShiftTemplate,
  updateShiftTemplate,
  deleteShiftTemplate,
  fetchProductionShifts,
  generateProductionShift,
  updateShiftJobProgress,
} from './shiftThunk';

interface ShiftState {
  templates: ShiftTemplate[];
  totalTemplates: number;
  productionShifts: ProductionShift[];
  totalProductionShifts: number;
  loading: boolean;
  error: string | null;
}

const initialState: ShiftState = {
  templates: [],
  totalTemplates: 0,
  productionShifts: [],
  totalProductionShifts: 0,
  loading: false,
  error: null,
};

const shiftSlice = createSlice({
  name: 'shift',
  initialState,
  reducers: {
    clearShiftError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ─── Fetch Templates ──────────────────────────────────────────────
      .addCase(fetchShiftTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShiftTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload.data?.items || [];
        state.totalTemplates = action.payload.data?.total || 0;
      })
      .addCase(fetchShiftTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ─── Create Template ──────────────────────────────────────────────
      .addCase(createShiftTemplate.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.templates.unshift(action.payload.data);
          state.totalTemplates += 1;
        }
      })

      // ─── Update Template ──────────────────────────────────────────────
      .addCase(updateShiftTemplate.fulfilled, (state, action) => {
        if (action.payload.data) {
          const idx = state.templates.findIndex(
            (t) => t.id === action.payload.data?.id,
          );
          if (idx !== -1) state.templates[idx] = action.payload.data;
        }
      })

      // ─── Delete Template ──────────────────────────────────────────────
      .addCase(deleteShiftTemplate.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.templates = state.templates.filter(
            (t) => t.id !== action.payload.data?.id,
          );
          state.totalTemplates -= 1;
        }
      })

      // ─── Fetch Production Shifts ──────────────────────────────────────
      .addCase(fetchProductionShifts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductionShifts.fulfilled, (state, action) => {
        state.loading = false;
        state.productionShifts = action.payload.data?.items || [];
        state.totalProductionShifts = action.payload.data?.total || 0;
      })
      .addCase(fetchProductionShifts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ─── Generate Production Shift ────────────────────────────────────
      .addCase(generateProductionShift.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.productionShifts.unshift(action.payload.data);
          state.totalProductionShifts += 1;
        }
      })

      // ─── Update Shift Job Progress ────────────────────────────────────
      .addCase(updateShiftJobProgress.fulfilled, (state, action) => {
        const updatedJob = action.payload.data;
        if (!updatedJob) return;
        const shift = state.productionShifts.find(
          (s) => s.id === updatedJob.productionShiftId,
        );
        if (shift?.shiftJobs) {
          const jobIdx = shift.shiftJobs.findIndex(
            (j) => j.id === updatedJob.id,
          );
          if (jobIdx !== -1) shift.shiftJobs[jobIdx] = updatedJob;
        }
      });
  },
});

export const { clearShiftError } = shiftSlice.actions;
export default shiftSlice.reducer;
