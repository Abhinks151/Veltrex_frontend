import { createAsyncThunk } from '@reduxjs/toolkit';
import { rawMaterialService } from '@/services/rawMaterialService';
import type { RawMaterial, RawMaterialRequest } from './types';
import type { ApiResponse } from '@/shared/types/apiResponse';
import axios from 'axios';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';

export interface RawMaterialResponse {
  items: RawMaterial[];
  rawMaterials: RawMaterial[];
  total: number;
}

export const fetchRawMaterials = createAsyncThunk<
  ApiResponse<RawMaterialResponse>,
  { page: number; limit: number; search?: string; status?: string },
  { rejectValue: string }
>('rawMaterial/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const response = await rawMaterialService.list(params);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Failed to fetch raw materials',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const createRawMaterial = createAsyncThunk<
  ApiResponse<RawMaterial>,
  RawMaterialRequest,
  { rejectValue: string }
>('rawMaterial/create', async (data, { rejectWithValue }) => {
  try {
    const response = await rawMaterialService.create(data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Raw material creation failed',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const updateRawMaterial = createAsyncThunk<
  ApiResponse<RawMaterial>,
  { id: string; data: Partial<RawMaterialRequest> },
  { rejectValue: string }
>('rawMaterial/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await rawMaterialService.edit(id, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Raw material update failed',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const toggleRawMaterialBlock = createAsyncThunk<
  ApiResponse<RawMaterial>,
  string,
  { rejectValue: string }
>('rawMaterial/toggleBlock', async (id, { rejectWithValue }) => {
  try {
    const response = await rawMaterialService.toggleBlock(id);
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

export const deleteRawMaterial = createAsyncThunk<
  ApiResponse<RawMaterial>,
  string,
  { rejectValue: string }
>('rawMaterial/delete', async (id, { rejectWithValue }) => {
  try {
    const response = await rawMaterialService.delete(id);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Delete raw material failed',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});
