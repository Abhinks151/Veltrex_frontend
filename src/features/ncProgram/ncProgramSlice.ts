import { createSlice } from '@reduxjs/toolkit';
import type { NcProgram } from './types';
import {
  fetchNcPrograms,
  createNcProgram,
  editNcProgram,
  addProgramVersion,
  blockProgramVersion,
  deleteProgramVersion,
  createNcProgramFromEditor,
  addProgramVersionFromEditor,
} from './ncProgramThunk';

interface NcProgramState {
  programs: NcProgram[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: NcProgramState = {
  programs: [],
  total: 0,
  loading: false,
  error: null,
};

const ncProgramSlice = createSlice({
  name: 'ncProgram',
  initialState,
  reducers: {
    clearNcProgramError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchNcPrograms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNcPrograms.fulfilled, (state, action) => {
        state.loading = false;
        state.programs = action.payload.data?.programs || [];
        state.total = action.payload.data?.total || 0;
      })
      .addCase(fetchNcPrograms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createNcProgram.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.programs.unshift(action.payload.data);
          state.total += 1;
        }
      })
      .addCase(createNcProgramFromEditor.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.programs.unshift(action.payload.data);
          state.total += 1;
        }
      })
      // Edit (rename)
      .addCase(editNcProgram.fulfilled, (state, action) => {
        if (action.payload.data) {
          const index = state.programs.findIndex(
            (p) => p.id === action.payload.data?.id,
          );
          if (index !== -1) {
            state.programs[index] = {
              ...action.payload.data,
              versions: state.programs[index].versions,
            };
          }
        }
      })
      .addCase(addProgramVersion.fulfilled, (state, action) => {
        if (action.payload.data) {
          const version = action.payload.data;
          const programIndex = state.programs.findIndex(
            (p) => p.id === version.programId,
          );
          if (programIndex !== -1) {
            state.programs[programIndex].versions.push(version);
          }
        }
      })
      .addCase(addProgramVersionFromEditor.fulfilled, (state, action) => {
        if (action.payload.data) {
          const version = action.payload.data;
          const programIndex = state.programs.findIndex(
            (p) => p.id === version.programId,
          );
          if (programIndex !== -1) {
            state.programs[programIndex].versions.push(version);
          }
        }
      })
      // Block/unblock version
      .addCase(blockProgramVersion.fulfilled, (state, action) => {
        if (action.payload.data) {
          const updated = action.payload.data;
          const programIndex = state.programs.findIndex(
            (p) => p.id === updated.programId,
          );
          if (programIndex !== -1) {
            const versionIndex = state.programs[
              programIndex
            ].versions.findIndex((v) => v.id === updated.id);
            if (versionIndex !== -1) {
              state.programs[programIndex].versions[versionIndex] = updated;
            }
          }
        }
      })
      // Delete version
      .addCase(deleteProgramVersion.fulfilled, (state, action) => {
        if (action.payload.data) {
          const deleted = action.payload.data;
          const programIndex = state.programs.findIndex(
            (p) => p.id === deleted.programId,
          );
          if (programIndex !== -1) {
            const versionIndex = state.programs[
              programIndex
            ].versions.findIndex((v) => v.id === deleted.id);
            if (versionIndex !== -1) {
              state.programs[programIndex].versions[versionIndex] = deleted;
            }
          }
        }
      });
  },
});

export const { clearNcProgramError } = ncProgramSlice.actions;
export default ncProgramSlice.reducer;
