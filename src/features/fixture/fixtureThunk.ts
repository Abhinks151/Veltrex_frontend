import { createAsyncThunk } from '@reduxjs/toolkit';
import { fixtureService } from '@/services/fixtureService';
import type { Fixture, FixtureRequest, FixtureResponse } from './types';
import type { ApiResponse } from '@/shared/types/apiResponse';
import axios from 'axios';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';

export const fetchFixtures = createAsyncThunk<
  ApiResponse<FixtureResponse>,
  { page: number; limit: number; search?: string; status?: string },
  { rejectValue: string }
>('fixture/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const response = await fixtureService.list(params);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Failed to fetch fixtures',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const createFixture = createAsyncThunk<
  ApiResponse<Fixture>,
  FixtureRequest,
  { rejectValue: string }
>('fixture/create', async (data, { rejectWithValue }) => {
  try {
    const response = await fixtureService.create(data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Fixture creation failed',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const updateFixture = createAsyncThunk<
  ApiResponse<Fixture>,
  { id: string; data: Partial<FixtureRequest> },
  { rejectValue: string }
>('fixture/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await fixtureService.edit(id, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Fixture update failed',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const toggleFixtureBlock = createAsyncThunk<
  ApiResponse<Fixture>,
  string,
  { rejectValue: string }
>('fixture/toggleBlock', async (id, { rejectWithValue }) => {
  try {
    const response = await fixtureService.toggleBlock(id);
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

export const deleteFixture = createAsyncThunk<
  ApiResponse<Fixture>,
  string,
  { rejectValue: string }
>('fixture/delete', async (id, { rejectWithValue }) => {
  try {
    const response = await fixtureService.delete(id);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Delete fixture failed',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});
