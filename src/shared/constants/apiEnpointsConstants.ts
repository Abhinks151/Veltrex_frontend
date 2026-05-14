export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",

    RESEND_VERIFICATION: "/auth/resend",
    VERIFY_EMAIL: "/auth/verify",

    FORGOT_PASSWORD: "/auth/forgot",
    RESET_PASSWORD: "/auth/reset",
  },

  SUPER_ADMIN: {
    TENANTS: "/super-admin/tenants",
    USERS: "/super-admin/users",
    TOGGLE_USER_BLOCK: (id: string) => `/super-admin/users/${id}/toggle-block`,

    TOGGLE_TENANT_BLOCK: (id: string) =>
      `/super-admin/tenants/${id}/toggle-block`,

    UPDATE_TENANT_NAME: (id: string) =>
      `/super-admin/tenants/${id}/update-name`,
  },

  TENANT: {
    CREATE: "/tenant/create",
    GET: "/tenant/get",
    CHECK_NAME: (name: string) => `/tenant/check-name/${name}`,
    UPDATE: (id: string) => `/tenant/update/${id}`,
  },

  SUBSCRIPTION: {
    GET: "/subscription/get",
    TOGGLE_STATUS: (id: string) => `/subscription/toggle-status/${id}`,
  },
  PROFILE: {
    GET: "/profile",
    UPDATE: "/profile/update",
    CHANGE_PASSWORD: "/profile/password",
    UPLOAD_IMAGE: "/profile/upload",
  },
};