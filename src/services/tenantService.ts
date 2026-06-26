import { axiosInstance } from '@/app/api/axios';
import type { TenantRequest } from '@/features/tenant/types';
import { API_ENDPOINTS } from '@/shared/constants/apiEnpointsConstants';

export const tenantService = {
  create: async (data: TenantRequest) => {
    return axiosInstance.post(API_ENDPOINTS.TENANT.CREATE, data);
  },

  get: async () => {
    return axiosInstance.get(API_ENDPOINTS.TENANT.GET);
  },

  update: async (data: TenantRequest, id: string) => {
    return axiosInstance.patch(API_ENDPOINTS.TENANT.UPDATE(id), data);
  },

  checkName: async (name: string) => {
    return axiosInstance.get(API_ENDPOINTS.TENANT.CHECK_NAME(name));
  },
  checkSubdomain: async (subdomain: string) => {
    return axiosInstance.get(API_ENDPOINTS.TENANT.CHECK_SUBDOMAIN(subdomain));
  },
};
