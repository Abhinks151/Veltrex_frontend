import { axiosInstance } from '@/app/api/axios';
import type { ApiResponse } from '@/shared/types/apiResponse';
import type {
  NcProgram,
  ProgramVersion,
  NcProgramResponse,
} from '@/features/ncProgram/types';
import { API_ENDPOINTS } from '@/shared/constants/apiEnpointsConstants';

export const ncProgramService = {
  create: (data: FormData) =>
    axiosInstance.post<ApiResponse<NcProgram>>(
      API_ENDPOINTS.NC_PROGRAM.CREATE,
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    ),

  list: (params: { page: number; limit: number; search?: string }) =>
    axiosInstance.get<ApiResponse<NcProgramResponse>>(
      API_ENDPOINTS.NC_PROGRAM.LIST,
      { params },
    ),

  getActive: () =>
    axiosInstance.get<ApiResponse<NcProgram[]>>(
      API_ENDPOINTS.NC_PROGRAM.ACTIVE,
    ),

  getById: (id: string) =>
    axiosInstance.get<ApiResponse<NcProgram>>(
      API_ENDPOINTS.NC_PROGRAM.GET_BY_ID(id),
    ),

  edit: (id: string, data: { name: string }) =>
    axiosInstance.patch<ApiResponse<NcProgram>>(
      API_ENDPOINTS.NC_PROGRAM.EDIT(id),
      data,
    ),

  addVersion: (id: string, data: FormData) =>
    axiosInstance.post<ApiResponse<ProgramVersion>>(
      API_ENDPOINTS.NC_PROGRAM.ADD_VERSION(id),
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    ),

  getVersionById: (id: string) =>
    axiosInstance.get<ApiResponse<ProgramVersion>>(
      API_ENDPOINTS.NC_PROGRAM.VERSION_BY_ID(id),
    ),

  blockVersion: (id: string) =>
    axiosInstance.patch<ApiResponse<ProgramVersion>>(
      API_ENDPOINTS.NC_PROGRAM.BLOCK_VERSION(id),
    ),

  deleteVersion: (id: string) =>
    axiosInstance.delete<ApiResponse<ProgramVersion>>(
      API_ENDPOINTS.NC_PROGRAM.DELETE_VERSION(id),
    ),

  createFromEditor: (data: {
    name: string;
    content: string;
    description?: string;
  }) =>
    axiosInstance.post<ApiResponse<NcProgram>>(
      API_ENDPOINTS.NC_PROGRAM.CREATE_FROM_EDITOR,
      data,
    ),

  addVersionFromEditor: (
    id: string,
    data: { content: string; description?: string },
  ) =>
    axiosInstance.post<ApiResponse<ProgramVersion>>(
      API_ENDPOINTS.NC_PROGRAM.ADD_VERSION_FROM_EDITOR(id),
      data,
    ),

  getVersionContent: (id: string) =>
    axiosInstance.get<ApiResponse<{ content: string }>>(
      API_ENDPOINTS.NC_PROGRAM.VERSION_CONTENT(id),
    ),
  delete: (id: string) =>
    axiosInstance.delete<ApiResponse<NcProgram>>(
      API_ENDPOINTS.NC_PROGRAM.DELETE(id),
    ),
};
