import { axiosInstance } from '@/app/api/axios';
import type { LoginRequest, RegisterRequest } from '@/features/auth/types';
import { API_ENDPOINTS } from '@/shared/constants/apiEnpointsConstants';

export const authService = {
  login: async (data: LoginRequest) => {
    return axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, data);
  },

  register: async (data: RegisterRequest) => {
    return axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, data);
  },

  resendVerificationEmail: async (email: string) => {
    return axiosInstance.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, {
      email,
    });
  },
  verifyEmail: async (token: string) => {
    return axiosInstance.post(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL,
      {},
      { params: { token } },
    );
  },

  refresh: async () => {
    return axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH, {});
  },

  profile: async () => {
    return axiosInstance.get(API_ENDPOINTS.AUTH.PROFILE);
  },

  logout: async () => {
    return axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  forgotPassword: async (email: string, resetLink?: string) => {
    return axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email,
      resetLink,
    });
  },

  resetPassword: async (token: string, password: string) => {
    return axiosInstance.post(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      { password },
      { params: { token } },
    );
  },
};
