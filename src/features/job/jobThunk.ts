import { createAsyncThunk } from '@reduxjs/toolkit';
import { jobService } from '@/services/jobService';
import type { Job, JobRequest } from './types';
import type { ApiResponse } from '@/shared/types/apiResponse';
import axios from 'axios';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';

export const fetchJobs = createAsyncThunk<
  ApiResponse<{ items: Job[]; total: number }>,
  {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    priority?: string;
  },
  { rejectValue: string }
>('job/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const response = await jobService.list(params);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Failed to fetch jobs',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const createJob = createAsyncThunk<
  ApiResponse<Job>,
  JobRequest,
  { rejectValue: string }
>('job/create', async (data, { rejectWithValue }) => {
  try {
    const response = await jobService.create(data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Job creation failed',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const updateJob = createAsyncThunk<
  ApiResponse<Job>,
  { id: string; data: Partial<JobRequest> },
  { rejectValue: string }
>('job/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await jobService.edit(id, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Job update failed',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const deleteJob = createAsyncThunk<
  ApiResponse<Job>,
  string,
  { rejectValue: string }
>('job/delete', async (id, { rejectWithValue }) => {
  try {
    const response = await jobService.delete(id);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Delete job failed',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});
