import { axiosInstance } from '@/app/api/axios';
import type { ApiResponse } from '@/shared/types/apiResponse';
import type { Part, PartResponse } from '@/features/part/types';
import { API_ENDPOINTS } from '@/shared/constants/apiEnpointsConstants';

export const partService = {
  create: (data: FormData) =>
    axiosInstance.post<ApiResponse<Part>>(API_ENDPOINTS.PART.CREATE, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  edit: (id: string, data: FormData) =>
    axiosInstance.patch<ApiResponse<Part>>(API_ENDPOINTS.PART.EDIT(id), data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  list: (params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    priority?: string;
  }) =>
    axiosInstance.get<ApiResponse<PartResponse>>(API_ENDPOINTS.PART.LIST, {
      params,
    }),

  toggleBlock: (id: string) =>
    axiosInstance.patch<ApiResponse<Part>>(API_ENDPOINTS.PART.BLOCK(id)),

  delete: (id: string) =>
    axiosInstance.delete<ApiResponse<Part>>(API_ENDPOINTS.PART.DELETE(id)),

  getActive: () =>
    axiosInstance.get<ApiResponse<Part[]>>(API_ENDPOINTS.PART.ACTIVE),
};
