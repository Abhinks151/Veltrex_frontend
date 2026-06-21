import { axiosInstance } from '@/app/api/axios';
import type { ApiResponse } from '@/shared/types/apiResponse';
import { API_ENDPOINTS } from '@/shared/constants/apiEnpointsConstants';

interface PartLookup {
  id: string;
  name: string;
  partNumber: string;
}

export const partService = {
  getActive: () =>
    axiosInstance.get<ApiResponse<PartLookup[]>>(API_ENDPOINTS.PART.ACTIVE),
};
