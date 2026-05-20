import { axiosInstance } from '@/app/api/axios';
import type { ApiResponse } from '@/shared/types/apiResponse';
import type {
  Fixture,
  FixtureRequest,
  FixtureResponse,
} from '@/features/fixture/types';
import { API_ENDPOINTS } from '@/shared/constants/apiEnpointsConstants';

export const fixtureService = {
  create: (data: FixtureRequest) =>
    axiosInstance.post<ApiResponse<Fixture>>(
      API_ENDPOINTS.FIXTURE.CREATE,
      data,
    ),

  edit: (id: string, data: Partial<FixtureRequest>) =>
    axiosInstance.patch<ApiResponse<Fixture>>(
      API_ENDPOINTS.FIXTURE.EDIT(id),
      data,
    ),

  list: (params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
  }) =>
    axiosInstance.get<ApiResponse<FixtureResponse>>(
      API_ENDPOINTS.FIXTURE.LIST,
      { params },
    ),

  toggleBlock: (id: string) =>
    axiosInstance.patch<ApiResponse<Fixture>>(API_ENDPOINTS.FIXTURE.BLOCK(id)),

  delete: (id: string) =>
    axiosInstance.delete<ApiResponse<Fixture>>(
      API_ENDPOINTS.FIXTURE.DELETE(id),
    ),

  getActive: () =>
    axiosInstance.get<ApiResponse<Fixture[]>>(API_ENDPOINTS.FIXTURE.ACTIVE),
};
