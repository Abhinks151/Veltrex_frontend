import { axiosInstance } from "@/app/api/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEnpointsConstants";

export const subscriptionService = {
  get: async () => {
    return axiosInstance.get(API_ENDPOINTS.SUBSCRIPTION.GET);
  },
  toggleStatus: async (id: string) => {
    return axiosInstance.patch(API_ENDPOINTS.SUBSCRIPTION.TOGGLE_STATUS(id));
  },

};
