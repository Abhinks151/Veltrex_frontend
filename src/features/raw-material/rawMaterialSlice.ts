import { createSlice } from '@reduxjs/toolkit';
import type { RawMaterial } from './types';
import {
  fetchRawMaterials,
  createRawMaterial,
  updateRawMaterial,
  toggleRawMaterialBlock,
  deleteRawMaterial,
} from './rawMaterialThunk';

interface RawMaterialState {
  rawMaterials: RawMaterial[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: RawMaterialState = {
  rawMaterials: [],
  total: 0,
  loading: false,
  error: null,
};

const rawMaterialSlice = createSlice({
  name: 'rawMaterial',
  initialState,
  reducers: {
    clearRawMaterialError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Raw Materials
      .addCase(fetchRawMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRawMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.rawMaterials = action.payload.data?.rawMaterials || [];
        state.total = action.payload.data?.total || 0;
      })
      .addCase(fetchRawMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Raw Material
      .addCase(createRawMaterial.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.rawMaterials.unshift(action.payload.data);
          state.total += 1;
        }
      })
      // Update Raw Material
      .addCase(updateRawMaterial.fulfilled, (state, action) => {
        if (action.payload.data) {
          const index = state.rawMaterials.findIndex(
            (rm) => rm.id === action.payload.data?.id,
          );
          if (index !== -1) {
            state.rawMaterials[index] = action.payload.data;
          }
        }
      })
      // Toggle Block
      .addCase(toggleRawMaterialBlock.fulfilled, (state, action) => {
        if (action.payload.data) {
          const index = state.rawMaterials.findIndex(
            (rm) => rm.id === action.payload.data?.id,
          );
          if (index !== -1) {
            state.rawMaterials[index] = action.payload.data;
          }
        }
      })
      // Delete Raw Material
      .addCase(deleteRawMaterial.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.rawMaterials = state.rawMaterials.filter(
            (rm) => rm.id !== action.payload.data?.id,
          );
          state.total -= 1;
        }
      });
  },
});

export const { clearRawMaterialError } = rawMaterialSlice.actions;
export default rawMaterialSlice.reducer;
