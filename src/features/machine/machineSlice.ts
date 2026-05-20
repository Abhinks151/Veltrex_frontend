import { createSlice } from '@reduxjs/toolkit';
import type { Machine } from './types';
import {
  fetchMachines,
  createMachine,
  updateMachine,
  toggleMachineBlock,
  deleteMachine,
} from './machineThunk';

interface MachineState {
  machines: Machine[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: MachineState = {
  machines: [],
  total: 0,
  loading: false,
  error: null,
};

const machineSlice = createSlice({
  name: 'machine',
  initialState,
  reducers: {
    clearMachineError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Machines
      .addCase(fetchMachines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMachines.fulfilled, (state, action) => {
        state.loading = false;
        state.machines = action.payload.data?.machines || [];
        state.total = action.payload.data?.total || 0;
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Machine
      .addCase(createMachine.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.machines.unshift(action.payload.data);
          state.total += 1;
        }
      })
      // Update Machine
      .addCase(updateMachine.fulfilled, (state, action) => {
        if (action.payload.data) {
          const index = state.machines.findIndex(
            (m) => m.id === action.payload.data?.id,
          );
          if (index !== -1) {
            state.machines[index] = action.payload.data;
          }
        }
      })
      // Toggle Block
      .addCase(toggleMachineBlock.fulfilled, (state, action) => {
        if (action.payload.data) {
          const index = state.machines.findIndex(
            (m) => m.id === action.payload.data?.id,
          );
          if (index !== -1) {
            state.machines[index] = action.payload.data;
          }
        }
      })
      // Delete Machine
      .addCase(deleteMachine.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.machines = state.machines.filter(
            (m) => m.id !== action.payload.data?.id,
          );
          state.total -= 1;
        }
      });
  },
});

export const { clearMachineError } = machineSlice.actions;
export default machineSlice.reducer;
