import { createAsyncThunk } from '@reduxjs/toolkit';
import { ncProgramService } from '@/services/ncProgramService';
import type { NcProgram, ProgramVersion, NcProgramResponse } from './types';
import type { ApiResponse } from '@/shared/types/apiResponse';
import axios from 'axios';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';

export const fetchNcPrograms = createAsyncThunk<
  ApiResponse<NcProgramResponse>,
  { page: number; limit: number; search?: string },
  { rejectValue: string }
>('ncProgram/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const response = await ncProgramService.list(params);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Failed to fetch NC programs',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const createNcProgram = createAsyncThunk<
  ApiResponse<NcProgram>,
  FormData,
  { rejectValue: string }
>('ncProgram/create', async (formData, { rejectWithValue }) => {
  try {
    const response = await ncProgramService.create(formData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'NC Program creation failed',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const editNcProgram = createAsyncThunk<
  ApiResponse<NcProgram>,
  { id: string; name: string },
  { rejectValue: string }
>('ncProgram/edit', async ({ id, name }, { rejectWithValue }) => {
  try {
    const response = await ncProgramService.edit(id, { name });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'NC Program update failed',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const addProgramVersion = createAsyncThunk<
  ApiResponse<ProgramVersion>,
  { programId: string; formData: FormData },
  { rejectValue: string }
>(
  'ncProgram/addVersion',
  async ({ programId, formData }, { rejectWithValue }) => {
    try {
      const response = await ncProgramService.addVersion(programId, formData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data.message || 'Failed to add version',
        );
      }
      return rejectWithValue(
        FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
      );
    }
  },
);

export const blockProgramVersion = createAsyncThunk<
  ApiResponse<ProgramVersion>,
  string,
  { rejectValue: string }
>('ncProgram/blockVersion', async (versionId, { rejectWithValue }) => {
  try {
    const response = await ncProgramService.blockVersion(versionId);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Failed to toggle version block',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const deleteProgramVersion = createAsyncThunk<
  ApiResponse<ProgramVersion>,
  string,
  { rejectValue: string }
>('ncProgram/deleteVersion', async (versionId, { rejectWithValue }) => {
  try {
    const response = await ncProgramService.deleteVersion(versionId);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Failed to delete version',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const createNcProgramFromEditor = createAsyncThunk<
  ApiResponse<NcProgram>,
  { name: string; content: string; description?: string },
  { rejectValue: string }
>('ncProgram/createFromEditor', async (payload, { rejectWithValue }) => {
  try {
    const response = await ncProgramService.createFromEditor(payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'NC Program creation failed',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const addProgramVersionFromEditor = createAsyncThunk<
  ApiResponse<ProgramVersion>,
  { programId: string; content: string; description?: string },
  { rejectValue: string }
>(
  'ncProgram/addVersionFromEditor',
  async ({ programId, content, description }, { rejectWithValue }) => {
    try {
      const response = await ncProgramService.addVersionFromEditor(programId, {
        content,
        description,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data.message || 'Failed to add version',
        );
      }
      return rejectWithValue(
        FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
      );
    }
  },
);

export const fetchVersionContent = createAsyncThunk<
  ApiResponse<{ content: string }>,
  string,
  { rejectValue: string }
>('ncProgram/fetchVersionContent', async (versionId, { rejectWithValue }) => {
  try {
    const response = await ncProgramService.getVersionContent(versionId);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Failed to load version content',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});
