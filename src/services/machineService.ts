import { axiosInstance } from '@/app/api/axios';
import type { ApiResponse } from '@/shared/types/apiResponse';
import type {
  Machine,
  MachineRequest,
  MachineResponse,
} from '@/features/machine/types';
import { API_ENDPOINTS } from '@/shared/constants/apiEnpointsConstants';

export const machineService = {
  create: (data: MachineRequest) =>
    axiosInstance.post<ApiResponse<Machine>>(
      API_ENDPOINTS.MACHINE.CREATE,
      data,
    ),

  edit: (id: string, data: Partial<MachineRequest>) =>
    axiosInstance.patch<ApiResponse<Machine>>(
      API_ENDPOINTS.MACHINE.EDIT(id),
      data,
    ),

  list: (params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
  }) =>
    axiosInstance.get<ApiResponse<MachineResponse>>(
      API_ENDPOINTS.MACHINE.LIST,
      { params },
    ),

  toggleBlock: (id: string) =>
    axiosInstance.patch<ApiResponse<Machine>>(API_ENDPOINTS.MACHINE.BLOCK(id)),

  delete: (id: string) =>
    axiosInstance.delete<ApiResponse<Machine>>(
      API_ENDPOINTS.MACHINE.DELETE(id),
    ),

  getActive: () =>
    axiosInstance.get<ApiResponse<Machine[]>>(API_ENDPOINTS.MACHINE.ACTIVE),
};
