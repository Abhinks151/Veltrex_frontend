import { axiosInstance } from "@/app/api/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEnpointsConstants";

export const profileService = {
  getProfile: async () => {
    return axiosInstance.get(API_ENDPOINTS.PROFILE.GET);
  },
  updateProfile: async (name: string) => {
    return axiosInstance.patch(API_ENDPOINTS.PROFILE.UPDATE, { name });
  },
  changePassword: async (passwordData: { currentPassword: string, newPassword: string, confirmPassword: string }) => {
    return axiosInstance.patch(API_ENDPOINTS.PROFILE.CHANGE_PASSWORD, passwordData);
  },
  uploadProfileImage: async (blob: Blob) => {
    const formData = new FormData();
    formData.append("file", blob, "profile.png");
    return axiosInstance.post(API_ENDPOINTS.PROFILE.UPLOAD_IMAGE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
