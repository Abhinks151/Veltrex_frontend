import { axiosInstance } from '@/app/api/axios';
import type { ApiResponse } from '@/shared/types/apiResponse';
import type {
  MaintenanceTicket,
  MachinistMachine,
  CreateTicketRequest,
  CloseTicketRequest,
  AdminLogsQuery,
} from '@/features/maintenance/types';
import { API_ENDPOINTS } from '@/shared/constants/apiEnpointsConstants';

export const maintenanceService = {
  getMachinistMachines: () =>
    axiosInstance.get<ApiResponse<MachinistMachine[]>>(
      API_ENDPOINTS.MAINTENANCE.MACHINIST_MACHINES,
    ),

  createTicket: (data: CreateTicketRequest) =>
    axiosInstance.post<ApiResponse<MaintenanceTicket>>(
      API_ENDPOINTS.MAINTENANCE.CREATE,
      data,
    ),

  getMachinistTickets: (params: { page: number; limit: number }) =>
    axiosInstance.get<
      ApiResponse<{ items: MaintenanceTicket[]; total: number }>
    >(API_ENDPOINTS.MAINTENANCE.MACHINIST_TICKETS, { params }),

  getOpenTickets: (params: { page: number; limit: number }) =>
    axiosInstance.get<
      ApiResponse<{ items: MaintenanceTicket[]; total: number }>
    >(API_ENDPOINTS.MAINTENANCE.OPEN_TICKETS, { params }),

  getMyTickets: (params: { page: number; limit: number }) =>
    axiosInstance.get<
      ApiResponse<{ items: MaintenanceTicket[]; total: number }>
    >(API_ENDPOINTS.MAINTENANCE.MY_TICKETS, { params }),

  assignTicket: (id: string) =>
    axiosInstance.patch<ApiResponse<MaintenanceTicket>>(
      API_ENDPOINTS.MAINTENANCE.ASSIGN(id),
    ),

  releaseTicket: (id: string) =>
    axiosInstance.patch<ApiResponse<MaintenanceTicket>>(
      API_ENDPOINTS.MAINTENANCE.RELEASE(id),
    ),

  closeTicket: (id: string, data: CloseTicketRequest) =>
    axiosInstance.patch<ApiResponse<MaintenanceTicket>>(
      API_ENDPOINTS.MAINTENANCE.CLOSE(id),
      data,
    ),

  getAdminLogs: (params: AdminLogsQuery) =>
    axiosInstance.get<
      ApiResponse<{ items: MaintenanceTicket[]; total: number }>
    >(API_ENDPOINTS.MAINTENANCE.ADMIN_LOGS, { params }),

  deleteTicket: (id: string) =>
    axiosInstance.delete<ApiResponse<MaintenanceTicket>>(
      API_ENDPOINTS.MAINTENANCE.DELETE(id),
    ),
};
