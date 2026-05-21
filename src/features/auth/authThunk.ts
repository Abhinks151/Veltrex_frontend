import { createAsyncThunk } from '@reduxjs/toolkit';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ForgotPasswordRequest,
} from './types';
import { ApiResponse } from '@/shared/types/apiResponse';
// import { axiosInstance } from "@/app/api/axios";
import axios from 'axios';
import { authService } from '@/services/authServices';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';

export const loginUser = createAsyncThunk<
  ApiResponse<LoginResponse>,
  LoginRequest,
  { rejectValue: string }
>('auth/login', async (data: LoginRequest, { rejectWithValue }) => {
  try {
    // const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
    //   method: "POST",
    //   credentials: "include",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(data),
    // });
    // const result: ApiResponse<LoginResponse> = await res.json();

    // if (!res.ok || !result.success) {
    //   return rejectWithValue(result.message || "Login failed");
    // }

    // return result;

    // const resposne = await axiosInstance.post('/auth/login', data)
    const response = await authService.login(data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data.message || 'Login failed');
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const registerUser = createAsyncThunk<
  ApiResponse<void>,
  RegisterRequest,
  { rejectValue: string }
>('auth/register', async (data: RegisterRequest, { rejectWithValue }) => {
  try {
    // const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
    //   method: "POST",
    //   credentials: "include",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(data),
    // });

    // const result: ApiResponse<void> = await res.json();

    // if (!res.ok || !result.success) {
    //   return rejectWithValue(result.message || "Register failed");
    // }

    // return result;

    // const response = await axiosInstance.post('/auth/register', data);
    const response = await authService.register(data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data.message || 'Register failed');
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data.message ||
            FRONTEND_MESSAGE_CONSTANTS.ERROR.LOGOUT_FAILED,
        );
      }
      return rejectWithValue(
        FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
      );
    }
  },
);

export const forgotPassword = createAsyncThunk<
  ApiResponse<void>,
  ForgotPasswordRequest,
  { rejectValue: string }
>(
  'auth/forgotPassword',
  async (data: ForgotPasswordRequest, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(
        data.email,
        data.resetLink,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data.message || 'Request failed',
        );
      }
      return rejectWithValue(
        FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
      );
    }
  },
);

export const resetPassword = createAsyncThunk<
  ApiResponse<void>,
  { token: string; password: string },
  { rejectValue: string }
>('auth/resetPassword', async ({ token, password }, { rejectWithValue }) => {
  try {
    const response = await authService.resetPassword(token, password);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data.message || 'Reset failed');
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});
