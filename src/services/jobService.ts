import { axiosInstance } from '@/app/api/axios';
import type { ApiResponse } from '@/shared/types/apiResponse';
import type { Job, JobRequest } from '@/features/job/types';
import { API_ENDPOINTS } from '@/shared/constants/apiEnpointsConstants';

export const jobService = {
  create: (data: JobRequest) =>
    axiosInstance.post<ApiResponse<Job>>(API_ENDPOINTS.JOB.CREATE, data),

  edit: (id: string, data: Partial<JobRequest>) =>
    axiosInstance.patch<ApiResponse<Job>>(API_ENDPOINTS.JOB.EDIT(id), data),

  list: (params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    priority?: string;
  }) =>
    axiosInstance.get<ApiResponse<{ items: Job[]; total: number }>>(
      API_ENDPOINTS.JOB.LIST,
      { params },
    ),

  delete: (id: string) =>
    axiosInstance.delete<ApiResponse<Job>>(API_ENDPOINTS.JOB.DELETE(id)),
};
