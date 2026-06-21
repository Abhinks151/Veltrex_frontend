import { axiosInstance } from '@/app/api/axios';
import type {
  RawMaterial,
  RawMaterialRequest,
} from '@/features/raw-material/types';
import type { ApiResponse } from '@/shared/types/apiResponse';
import { API_ENDPOINTS } from '@/shared/constants/apiEnpointsConstants';

interface RawMaterialResponse {
  items: RawMaterial[];
  rawMaterials: RawMaterial[];
  total: number;
}

export const rawMaterialService = {
  create: (data: RawMaterialRequest) =>
    axiosInstance.post<ApiResponse<RawMaterial>>(
      API_ENDPOINTS.RAW_MATERIAL.CREATE,
      data,
    ),

  edit: (id: string, data: Partial<RawMaterialRequest>) =>
    axiosInstance.patch<ApiResponse<RawMaterial>>(
      API_ENDPOINTS.RAW_MATERIAL.EDIT(id),
      data,
    ),

  list: (params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
  }) =>
    axiosInstance.get<ApiResponse<RawMaterialResponse>>(
      API_ENDPOINTS.RAW_MATERIAL.LIST,
      { params },
    ),

  toggleBlock: (id: string) =>
    axiosInstance.patch<ApiResponse<RawMaterial>>(
      API_ENDPOINTS.RAW_MATERIAL.BLOCK(id),
    ),

  delete: (id: string) =>
    axiosInstance.delete<ApiResponse<RawMaterial>>(
      API_ENDPOINTS.RAW_MATERIAL.DELETE(id),
    ),

  getActive: () =>
    axiosInstance.get<ApiResponse<RawMaterial[]>>(
      API_ENDPOINTS.RAW_MATERIAL.ACTIVE,
    ),
};
