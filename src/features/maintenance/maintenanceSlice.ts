import { createSlice } from '@reduxjs/toolkit';
import type { MaintenanceTicket, MachinistMachine } from './types';
import {
  fetchMachinistMachines,
  createMaintenanceTicket,
  fetchMachinistTickets,
  fetchOpenTickets,
  fetchMyTickets,
  assignTicket,
  releaseTicket,
  closeTicket,
  fetchAdminLogs,
} from './maintenanceThunk';

interface MaintenanceState {
  machinistMachines: MachinistMachine[];
  machinistTickets: MaintenanceTicket[];
  totalMachinistTickets: number;
  openTickets: MaintenanceTicket[];
  totalOpenTickets: number;
  myTickets: MaintenanceTicket[];
  totalMyTickets: number;
  adminLogs: MaintenanceTicket[];
  totalAdminLogs: number;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}

const initialState: MaintenanceState = {
  machinistMachines: [],
  machinistTickets: [],
  totalMachinistTickets: 0,
  openTickets: [],
  totalOpenTickets: 0,
  myTickets: [],
  totalMyTickets: 0,
  adminLogs: [],
  totalAdminLogs: 0,
  loading: false,
  actionLoading: false,
  error: null,
};

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    clearMaintenanceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Machinist Machines ──────────────────────────────────────────────────
      .addCase(fetchMachinistMachines.fulfilled, (state, action) => {
        state.machinistMachines = action.payload.data ?? [];
      })

      // ── Create ticket ───────────────────────────────────────────────────────
      .addCase(createMaintenanceTicket.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createMaintenanceTicket.fulfilled, (state, action) => {
        state.actionLoading = false;
        if (action.payload.data) {
          state.machinistTickets.unshift(action.payload.data);
          state.totalMachinistTickets += 1;
        }
      })
      .addCase(createMaintenanceTicket.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })

      // ── Machinist tickets ───────────────────────────────────────────────────
      .addCase(fetchMachinistTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMachinistTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.machinistTickets = action.payload.data?.items ?? [];
        state.totalMachinistTickets = action.payload.data?.total ?? 0;
      })
      .addCase(fetchMachinistTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ── Open tickets ────────────────────────────────────────────────────────
      .addCase(fetchOpenTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpenTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.openTickets = action.payload.data?.items ?? [];
        state.totalOpenTickets = action.payload.data?.total ?? 0;
      })
      .addCase(fetchOpenTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ── My tickets ──────────────────────────────────────────────────────────
      .addCase(fetchMyTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.myTickets = action.payload.data?.items ?? [];
        state.totalMyTickets = action.payload.data?.total ?? 0;
      })
      .addCase(fetchMyTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ── Assign ──────────────────────────────────────────────────────────────
      .addCase(assignTicket.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(assignTicket.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload.data;
        if (updated) {
          state.openTickets = state.openTickets.filter(
            (t) => t.id !== updated.id,
          );
          state.totalOpenTickets = Math.max(0, state.totalOpenTickets - 1);
          state.myTickets.unshift(updated);
          state.totalMyTickets += 1;
        }
      })
      .addCase(assignTicket.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })

      // ── Release ─────────────────────────────────────────────────────────────
      .addCase(releaseTicket.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(releaseTicket.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload.data;
        if (updated) {
          state.myTickets = state.myTickets.filter((t) => t.id !== updated.id);
          state.totalMyTickets = Math.max(0, state.totalMyTickets - 1);
        }
      })
      .addCase(releaseTicket.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })

      // ── Close ───────────────────────────────────────────────────────────────
      .addCase(closeTicket.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(closeTicket.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload.data;
        if (updated) {
          state.myTickets = state.myTickets.filter((t) => t.id !== updated.id);
          state.totalMyTickets = Math.max(0, state.totalMyTickets - 1);
        }
      })
      .addCase(closeTicket.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })

      // ── Admin logs ──────────────────────────────────────────────────────────
      .addCase(fetchAdminLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.adminLogs = action.payload.data?.items ?? [];
        state.totalAdminLogs = action.payload.data?.total ?? 0;
      })
      .addCase(fetchAdminLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMaintenanceError } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
