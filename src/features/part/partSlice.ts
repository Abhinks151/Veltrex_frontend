import { createSlice } from '@reduxjs/toolkit';
import type { Part } from './types';
import {
  fetchParts,
  createPart,
  updatePart,
  togglePartBlock,
  deletePart,
} from './partThunk';

interface PartState {
  parts: Part[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: PartState = {
  parts: [],
  total: 0,
  loading: false,
  error: null,
};

const partSlice = createSlice({
  name: 'part',
  initialState,
  reducers: {
    clearPartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Parts
      .addCase(fetchParts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParts.fulfilled, (state, action) => {
        state.loading = false;
        state.parts = action.payload.data?.items || [];
        state.total = action.payload.data?.total || 0;
      })
      .addCase(fetchParts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Part
      .addCase(createPart.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.parts.unshift(action.payload.data);
          state.total += 1;
        }
      })
      // Update Part
      .addCase(updatePart.fulfilled, (state, action) => {
        if (action.payload.data) {
          const index = state.parts.findIndex(
            (p) => p.id === action.payload.data?.id,
          );
          if (index !== -1) {
            state.parts[index] = action.payload.data;
          }
        }
      })
      // Toggle Block
      .addCase(togglePartBlock.fulfilled, (state, action) => {
        if (action.payload.data) {
          const index = state.parts.findIndex(
            (p) => p.id === action.payload.data?.id,
          );
          if (index !== -1) {
            state.parts[index] = action.payload.data;
          }
        }
      })
      // Delete Part
      .addCase(deletePart.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.parts = state.parts.filter(
            (p) => p.id !== action.payload.data?.id,
          );
          state.total -= 1;
        }
      });
  },
});

export const { clearPartError } = partSlice.actions;
export default partSlice.reducer;
