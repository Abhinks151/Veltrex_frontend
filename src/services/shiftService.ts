import { axiosInstance } from '@/app/api/axios';
import type { ApiResponse } from '@/shared/types/apiResponse';
import type {
  ShiftTemplate,
  ProductionShift,
  ShiftJob,
  CreateShiftTemplateRequest,
  MachinistDashboardStats,
} from '@/features/shift/types';
import { API_ENDPOINTS } from '@/shared/constants/apiEnpointsConstants';

export const shiftService = {
  // Shift Templates
  createTemplate: (data: CreateShiftTemplateRequest) =>
    axiosInstance.post<ApiResponse<ShiftTemplate>>(
      API_ENDPOINTS.SHIFT.CREATE_TEMPLATE,
      data,
    ),

  editTemplate: (id: string, data: Partial<CreateShiftTemplateRequest>) =>
    axiosInstance.patch<ApiResponse<ShiftTemplate>>(
      API_ENDPOINTS.SHIFT.EDIT_TEMPLATE(id),
      data,
    ),

  deleteTemplate: (id: string) =>
    axiosInstance.delete<ApiResponse<ShiftTemplate>>(
      API_ENDPOINTS.SHIFT.DELETE_TEMPLATE(id),
    ),

  listTemplates: (params: { page: number; limit: number }) =>
    axiosInstance.get<ApiResponse<{ items: ShiftTemplate[]; total: number }>>(
      API_ENDPOINTS.SHIFT.LIST_TEMPLATES,
      { params },
    ),

  // Production Shifts
  generateShift: (templateId: string) =>
    axiosInstance.post<ApiResponse<ProductionShift>>(
      API_ENDPOINTS.SHIFT.GENERATE(templateId),
    ),

  listProductionShifts: (params: {
    page: number;
    limit: number;
    date?: string;
    employeeId?: string;
  }) =>
    axiosInstance.get<ApiResponse<{ items: ProductionShift[]; total: number }>>(
      API_ENDPOINTS.SHIFT.LIST_PRODUCTION,
      { params },
    ),

  // Shift Jobs
  updateJobProgress: (id: string, completedQuantity: number) =>
    axiosInstance.patch<ApiResponse<ShiftJob>>(
      API_ENDPOINTS.SHIFT.UPDATE_JOB_PROGRESS(id),
      { completedQuantity },
    ),

  // Machinist Dashboard
  getMachinistDashboard: () =>
    axiosInstance.get<ApiResponse<MachinistDashboardStats>>(
      API_ENDPOINTS.SHIFT.MACHINIST_DASHBOARD,
    ),
};
