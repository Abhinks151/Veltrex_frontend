import { createSlice } from '@reduxjs/toolkit';
import type { Job } from './types';
import { fetchJobs, createJob, updateJob, deleteJob } from './jobThunk';

interface JobState {
  jobs: Job[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  total: 0,
  loading: false,
  error: null,
};

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    clearJobError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.data?.items || [];
        state.total = action.payload.data?.total || 0;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Job
      .addCase(createJob.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.jobs.unshift(action.payload.data);
          state.total += 1;
        }
      })
      // Update Job
      .addCase(updateJob.fulfilled, (state, action) => {
        if (action.payload.data) {
          const index = state.jobs.findIndex(
            (j) => j.id === action.payload.data?.id,
          );
          if (index !== -1) {
            state.jobs[index] = action.payload.data;
          }
        }
      })
      // Delete Job
      .addCase(deleteJob.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.jobs = state.jobs.filter(
            (j) => j.id !== action.payload.data?.id,
          );
          state.total -= 1;
        }
      });
  },
});

export const { clearJobError } = jobSlice.actions;
export default jobSlice.reducer;
