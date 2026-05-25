import { axiosInstance } from '@/app/api/axios';
import { API_ENDPOINTS } from '@/shared/constants/apiEnpointsConstants';

export interface Plan {
  id: string;
  code: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  durationDays: number | null;
  isBlocked: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const planService = {
  getAllPlans: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    return axiosInstance.get(API_ENDPOINTS.SUPER_ADMIN.PLANS, { params });
  },

  createPlan: async (data: Partial<Plan>) => {
    return axiosInstance.post(API_ENDPOINTS.SUPER_ADMIN.CREATE_PLAN, data);
  },

  updatePlan: async (id: string, data: Partial<Plan>) => {
    return axiosInstance.patch(API_ENDPOINTS.SUPER_ADMIN.UPDATE_PLAN(id), data);
  },

  toggleBlock: async (id: string) => {
    return axiosInstance.patch(API_ENDPOINTS.SUPER_ADMIN.TOGGLE_PLAN_BLOCK(id));
  },

  deletePlan: async (id: string) => {
    return axiosInstance.delete(API_ENDPOINTS.SUPER_ADMIN.DELETE_PLAN(id));
  },
};
