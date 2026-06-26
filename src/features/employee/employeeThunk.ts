import { createAsyncThunk } from '@reduxjs/toolkit';
import { employeeService } from '@/services/employeeService';
import type { Employee, EmployeeRequest, EmployeeResponse } from './types';
import type { ApiResponse } from '@/shared/types/apiResponse';
import axios from 'axios';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';

export const fetchEmployees = createAsyncThunk<
  ApiResponse<EmployeeResponse>,
  {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    sort?: string;
  },
  { rejectValue: string }
>('employee/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const response = await employeeService.list(params);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Failed to fetch employees',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const createEmployee = createAsyncThunk<
  ApiResponse<Employee>,
  EmployeeRequest,
  { rejectValue: string }
>('employee/create', async (data, { rejectWithValue }) => {
  try {
    const response = await employeeService.create(data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Employee creation failed',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const bulkCreateEmployee = createAsyncThunk<
  ApiResponse<Employee[]>,
  { employees: EmployeeRequest[] },
  { rejectValue: string }
>('employee/bulkCreate', async (data, { rejectWithValue }) => {
  try {
    const response = await employeeService.bulkCreate(data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Bulk employee creation failed',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const updateEmployee = createAsyncThunk<
  ApiResponse<Employee>,
  { id: string; data: Partial<EmployeeRequest> },
  { rejectValue: string }
>('employee/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await employeeService.edit(id, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Employee update failed',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});

export const toggleEmployeeBlock = createAsyncThunk<
  ApiResponse<Employee>,
  string,
  { rejectValue: string }
>('employee/toggleBlock', async (id, { rejectWithValue }) => {
  try {
    const response = await employeeService.toggleBlock(id);
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

export const deleteEmployee = createAsyncThunk<
  ApiResponse<Employee>,
  string,
  { rejectValue: string }
>('employee/delete', async (id, { rejectWithValue }) => {
  try {
    const response = await employeeService.delete(id);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || 'Delete employee failed',
      );
    }
    return rejectWithValue(
      FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
    );
  }
});
