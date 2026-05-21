import { axiosInstance } from '@/app/api/axios';
import type {
  Employee,
  EmployeeRequest,
  EmployeeResponse,
} from '@/features/employee/types';
import type { ApiResponse } from '@/shared/types/apiResponse';

export const employeeService = {
  list: (params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    sort?: string;
  }) =>
    axiosInstance.get<ApiResponse<EmployeeResponse>>('/platform/employees', {
      params,
    }),

  create: (data: EmployeeRequest) =>
    axiosInstance.post<ApiResponse<Employee>>('/platform/employees', data),

  edit: (id: string, data: Partial<EmployeeRequest>) =>
    axiosInstance.patch<ApiResponse<Employee>>(
      `/platform/employees/${id}`,
      data,
    ),

  toggleBlock: (id: string) =>
    axiosInstance.patch<ApiResponse<Employee>>(
      `/platform/employees/${id}/toggle-block`,
    ),

  delete: (id: string) =>
    axiosInstance.delete<ApiResponse<Employee>>(`/platform/employees/${id}`),
};
