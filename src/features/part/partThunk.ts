import { createAsyncThunk } from '@reduxjs/toolkit';
import { partService } from '@/services/partService';
import type { Part, PartResponse } from './types';
import type { ApiResponse } from '@/shared/types/apiResponse';
import axios from 'axios';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';

export const fetchParts = createAsyncThunk<
  ApiResponse<PartResponse>,
  {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    priority?: string;
  },
  { rejectValue: string }
>('part/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const response = await partService.list(params);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message ||
          FRONTEND_MESSAGE_CONSTANTS.ERROR.FAILED_FETCH_PARTS,
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const createPart = createAsyncThunk<
  ApiResponse<Part>,
  FormData,
  { rejectValue: string }
>('part/create', async (data, { rejectWithValue }) => {
  try {
    const response = await partService.create(data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message ||
          FRONTEND_MESSAGE_CONSTANTS.ERROR.PART_CREATION_FAILED,
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const updatePart = createAsyncThunk<
  ApiResponse<Part>,
  { id: string; data: FormData },
  { rejectValue: string }
>('part/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await partService.edit(id, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message ||
          FRONTEND_MESSAGE_CONSTANTS.ERROR.PART_UPDATE_FAILED,
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const togglePartBlock = createAsyncThunk<
  ApiResponse<Part>,
  string,
  { rejectValue: string }
>('part/toggleBlock', async (id, { rejectWithValue }) => {
  try {
    const response = await partService.toggleBlock(id);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Failed to update part status',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const deletePart = createAsyncThunk<
  ApiResponse<Part>,
  string,
  { rejectValue: string }
>('part/delete', async (id, { rejectWithValue }) => {
  try {
    const response = await partService.delete(id);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Failed to delete part',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});
