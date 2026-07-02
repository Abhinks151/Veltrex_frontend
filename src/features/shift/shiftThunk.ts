import { createAsyncThunk } from '@reduxjs/toolkit';
import { shiftService } from '@/services/shiftService';
import type {
  ShiftTemplate,
  ProductionShift,
  ShiftJob,
  CreateShiftTemplateRequest,
} from './types';
import type { ApiResponse } from '@/shared/types/apiResponse';
import axios from 'axios';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';

// ── Shift Templates ─────────────────────────────────────────────────────────

export const fetchShiftTemplates = createAsyncThunk<
  ApiResponse<{ items: ShiftTemplate[]; total: number }>,
  { page: number; limit: number },
  { rejectValue: string }
>('shift/fetchTemplates', async (params, { rejectWithValue }) => {
  try {
    const response = await shiftService.listTemplates(params);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Failed to fetch shift templates',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const createShiftTemplate = createAsyncThunk<
  ApiResponse<ShiftTemplate>,
  CreateShiftTemplateRequest,
  { rejectValue: string }
>('shift/createTemplate', async (data, { rejectWithValue }) => {
  try {
    const response = await shiftService.createTemplate(data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Failed to create shift template',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const updateShiftTemplate = createAsyncThunk<
  ApiResponse<ShiftTemplate>,
  { id: string; data: Partial<CreateShiftTemplateRequest> },
  { rejectValue: string }
>('shift/updateTemplate', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await shiftService.editTemplate(id, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Failed to update shift template',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const deleteShiftTemplate = createAsyncThunk<
  ApiResponse<ShiftTemplate>,
  string,
  { rejectValue: string }
>('shift/deleteTemplate', async (id, { rejectWithValue }) => {
  try {
    const response = await shiftService.deleteTemplate(id);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Failed to delete shift template',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

// ── Production Shifts ────────────────────────────────────────────────────────

export const fetchProductionShifts = createAsyncThunk<
  ApiResponse<{ items: ProductionShift[]; total: number }>,
  { page: number; limit: number; date?: string; employeeId?: string },
  { rejectValue: string }
>('shift/fetchProduction', async (params, { rejectWithValue }) => {
  try {
    const response = await shiftService.listProductionShifts(params);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Failed to fetch production shifts',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const generateProductionShift = createAsyncThunk<
  ApiResponse<ProductionShift>,
  string,
  { rejectValue: string }
>('shift/generate', async (templateId, { rejectWithValue }) => {
  try {
    const response = await shiftService.generateShift(templateId);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Failed to generate production shift',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const updateShiftJobProgress = createAsyncThunk<
  ApiResponse<ShiftJob>,
  { id: string; completedQuantity: number },
  { rejectValue: string }
>(
  'shift/updateJobProgress',
  async ({ id, completedQuantity }, { rejectWithValue }) => {
    try {
      const response = await shiftService.updateJobProgress(
        id,
        completedQuantity,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data.message || 'Failed to update job progress',
        );
      }
      return rejectWithValue(
        FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
      );
    }
  },
);
