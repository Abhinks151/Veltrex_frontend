import { axiosInstance } from '@/app/api/axios';
import type { ApiResponse } from '@/shared/types/apiResponse';

export interface NotificationResponse {
  id: string;
  tenantId: string | null;
  userId: string | null;
  role: string | null;
  type: string;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
}

export const notificationService = {
  list: () =>
    axiosInstance.get<ApiResponse<NotificationResponse[]>>(
      '/notifications/list',
    ),

  markRead: (id: string) =>
    axiosInstance.patch<ApiResponse<NotificationResponse>>(
      `/notifications/read/${id}`,
    ),

  markAllRead: () =>
    axiosInstance.patch<ApiResponse<null>>('/notifications/read-all'),
};
