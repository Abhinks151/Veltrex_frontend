import { axiosInstance } from '@/app/api/axios';
import { API_ENDPOINTS } from '@/shared/constants/apiEnpointsConstants';

export const superAdminService = {
  getDashboardStats: async (params?: {
    range?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    return axiosInstance.get(API_ENDPOINTS.SUPER_ADMIN.DASHBOARD, { params });
  },

  getAllTenants: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    return axiosInstance.get(API_ENDPOINTS.SUPER_ADMIN.TENANTS, { params });
  },

  getAllUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    return axiosInstance.get(API_ENDPOINTS.SUPER_ADMIN.USERS, { params });
  },

  toggleUserBlock: async (id: string) => {
    return axiosInstance.patch(API_ENDPOINTS.SUPER_ADMIN.TOGGLE_USER_BLOCK(id));
  },

  toggleTenantBlock: async (id: string) => {
    return axiosInstance.patch(
      API_ENDPOINTS.SUPER_ADMIN.TOGGLE_TENANT_BLOCK(id),
    );
  },

  updateTenantName: async (id: string, name: string) => {
    return axiosInstance.patch(
      API_ENDPOINTS.SUPER_ADMIN.UPDATE_TENANT_NAME(id),
      { name },
    );
  },

  getRevenueStats: async (params?: {
    range?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    return axiosInstance.get(API_ENDPOINTS.SUPER_ADMIN.REVENUE, { params });
  },
};
