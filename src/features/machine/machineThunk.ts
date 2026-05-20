import { createAsyncThunk } from '@reduxjs/toolkit';
import { machineService } from '@/services/machineService';
import type { Machine, MachineRequest, MachineResponse } from './types';
import type { ApiResponse } from '@/shared/types/apiResponse';
import axios from 'axios';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';

export const fetchMachines = createAsyncThunk<
  ApiResponse<MachineResponse>,
  { page: number; limit: number; search?: string; status?: string },
  { rejectValue: string }
>('machine/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const response = await machineService.list(params);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Failed to fetch machines',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const createMachine = createAsyncThunk<
  ApiResponse<Machine>,
  MachineRequest,
  { rejectValue: string }
>('machine/create', async (data, { rejectWithValue }) => {
  try {
    const response = await machineService.create(data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Machine creation failed',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const updateMachine = createAsyncThunk<
  ApiResponse<Machine>,
  { id: string; data: Partial<MachineRequest> },
  { rejectValue: string }
>('machine/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await machineService.edit(id, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Machine update failed',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const toggleMachineBlock = createAsyncThunk<
  ApiResponse<Machine>,
  string,
  { rejectValue: string }
>('machine/toggleBlock', async (id, { rejectWithValue }) => {
  try {
    const response = await machineService.toggleBlock(id);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Toggle block failed',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const deleteMachine = createAsyncThunk<
  ApiResponse<Machine>,
  string,
  { rejectValue: string }
>('machine/delete', async (id, { rejectWithValue }) => {
  try {
    const response = await machineService.delete(id);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Delete machine failed',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});
