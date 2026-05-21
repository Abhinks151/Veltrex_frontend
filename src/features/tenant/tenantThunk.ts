import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '@/shared/types/apiResponse';
import axios from 'axios';
import type {
  TenantRequest,
  TenantResponse,
  TenantUpdateRequest,
} from './types';
import { tenantService } from '@/services/tenantService';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';

export const tenant = createAsyncThunk<
  ApiResponse<TenantResponse>,
  TenantRequest,
  { rejectValue: string }
>('tenant/create', async (data: TenantRequest, { rejectWithValue }) => {
  try {
    // const resposne = await axiosInstance.post('/tenant/create', data)
    const resposne = await tenantService.create(data);
    return resposne.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // console.log(error)
      return rejectWithValue(
        error.response?.data.message ||
          FRONTEND_MESSAGE_CONSTANTS.ERROR.TENANT_CREATION_FAILED,
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

// export const getTenant = createAsyncThunk<ApiResponse<TenantResponse>, void, { rejectValue: string }>(
//   "tenant/get",
//   async (_, { rejectWithValue }) => {
//     try {

//       // const resposne = await axiosInstance.get('/tenant/get')
//       const resposne = await tenantService.get()
//       return resposne.data;

//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         return rejectWithValue(error.response?.data.message || "Tenant fetch failed");
//       }
//       return rejectWithValue(FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG);
//     }
//   }
// );

export const getTenant = createAsyncThunk<
  ApiResponse<TenantResponse> | null,
  void,
  { rejectValue: string }
>('tenant/get', async (_, { rejectWithValue }) => {
  try {
    const response = await tenantService.get();
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return null; // ✅ expected case
      }

      return rejectWithValue(
        error.response?.data.message || 'Failed to fetch tenant',
      );
    }

    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const updateTenant = createAsyncThunk<
  ApiResponse<TenantResponse>,
  TenantUpdateRequest,
  { rejectValue: string }
>('tenant/update', async (data: TenantUpdateRequest, { rejectWithValue }) => {
  try {
    // const resposne = await axiosInstance.patch('/tenant/update', data)
    const resposne = await tenantService.update(data.data, data.id);
    return resposne.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Tenant update failed',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});
