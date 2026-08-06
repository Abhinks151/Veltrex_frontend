import { createAsyncThunk } from '@reduxjs/toolkit';
import { maintenanceService } from '@/services/maintenanceService';
import type {
  MaintenanceTicket,
  MachinistMachine,
  CreateTicketRequest,
  CloseTicketRequest,
  AdminLogsQuery,
} from './types';
import type { ApiResponse } from '@/shared/types/apiResponse';
import axios from 'axios';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';

const ERR = FRONTEND_MESSAGE_CONSTANTS.ERROR;

export const fetchMachinistMachines = createAsyncThunk<
  ApiResponse<MachinistMachine[]>,
  void,
  { rejectValue: string }
>('maintenance/fetchMachinistMachines', async (_, { rejectWithValue }) => {
  try {
    const res = await maintenanceService.getMachinistMachines();
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || ERR.FAILED_FETCH_MACHINES,
      );
    }
    return rejectWithValue(ERR.SOMETHING_WENT_WRONG);
  }
});

export const createMaintenanceTicket = createAsyncThunk<
  ApiResponse<MaintenanceTicket>,
  CreateTicketRequest,
  { rejectValue: string }
>('maintenance/createTicket', async (data, { rejectWithValue }) => {
  try {
    const res = await maintenanceService.createTicket(data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || ERR.FAILED_CREATE_TICKET,
      );
    }
    return rejectWithValue(ERR.SOMETHING_WENT_WRONG);
  }
});

export const fetchMachinistTickets = createAsyncThunk<
  ApiResponse<{ items: MaintenanceTicket[]; total: number }>,
  { page: number; limit: number },
  { rejectValue: string }
>('maintenance/fetchMachinistTickets', async (params, { rejectWithValue }) => {
  try {
    const res = await maintenanceService.getMachinistTickets(params);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || ERR.FAILED_FETCH_MACHINIST_TICKETS,
      );
    }
    return rejectWithValue(ERR.SOMETHING_WENT_WRONG);
  }
});

export const fetchOpenTickets = createAsyncThunk<
  ApiResponse<{ items: MaintenanceTicket[]; total: number }>,
  { page: number; limit: number },
  { rejectValue: string }
>('maintenance/fetchOpenTickets', async (params, { rejectWithValue }) => {
  try {
    const res = await maintenanceService.getOpenTickets(params);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || ERR.FAILED_FETCH_OPEN_TICKETS,
      );
    }
    return rejectWithValue(ERR.SOMETHING_WENT_WRONG);
  }
});

export const fetchMyTickets = createAsyncThunk<
  ApiResponse<{ items: MaintenanceTicket[]; total: number }>,
  { page: number; limit: number },
  { rejectValue: string }
>('maintenance/fetchMyTickets', async (params, { rejectWithValue }) => {
  try {
    const res = await maintenanceService.getMyTickets(params);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || ERR.FAILED_FETCH_MY_TICKETS,
      );
    }
    return rejectWithValue(ERR.SOMETHING_WENT_WRONG);
  }
});

export const assignTicket = createAsyncThunk<
  ApiResponse<MaintenanceTicket>,
  string,
  { rejectValue: string }
>('maintenance/assignTicket', async (id, { rejectWithValue }) => {
  try {
    const res = await maintenanceService.assignTicket(id);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || ERR.FAILED_ASSIGN_TICKET,
      );
    }
    return rejectWithValue(ERR.SOMETHING_WENT_WRONG);
  }
});

export const releaseTicket = createAsyncThunk<
  ApiResponse<MaintenanceTicket>,
  string,
  { rejectValue: string }
>('maintenance/releaseTicket', async (id, { rejectWithValue }) => {
  try {
    const res = await maintenanceService.releaseTicket(id);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || ERR.FAILED_RELEASE_TICKET,
      );
    }
    return rejectWithValue(ERR.SOMETHING_WENT_WRONG);
  }
});

export const closeTicket = createAsyncThunk<
  ApiResponse<MaintenanceTicket>,
  { id: string; data: CloseTicketRequest },
  { rejectValue: string }
>('maintenance/closeTicket', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await maintenanceService.closeTicket(id, data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || ERR.FAILED_CLOSE_TICKET,
      );
    }
    return rejectWithValue(ERR.SOMETHING_WENT_WRONG);
  }
});

export const fetchAdminLogs = createAsyncThunk<
  ApiResponse<{ items: MaintenanceTicket[]; total: number }>,
  AdminLogsQuery,
  { rejectValue: string }
>('maintenance/fetchAdminLogs', async (params, { rejectWithValue }) => {
  try {
    const res = await maintenanceService.getAdminLogs(params);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data.message || ERR.FAILED_FETCH_ADMIN_LOGS,
      );
    }
    return rejectWithValue(ERR.SOMETHING_WENT_WRONG);
  }
});
