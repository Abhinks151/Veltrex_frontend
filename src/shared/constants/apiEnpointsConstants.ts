export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',

    RESEND_VERIFICATION: '/auth/resend',
    VERIFY_EMAIL: '/auth/verify',

    FORGOT_PASSWORD: '/auth/forgot',
    RESET_PASSWORD: '/auth/reset',
  },

  SUPER_ADMIN: {
    TENANTS: '/super-admin/tenants',
    USERS: '/super-admin/users',
    TOGGLE_USER_BLOCK: (id: string) => `/super-admin/users/${id}/toggle-block`,
    TOGGLE_TENANT_BLOCK: (id: string) =>
      `/super-admin/tenants/${id}/toggle-block`,
    UPDATE_TENANT_NAME: (id: string) =>
      `/super-admin/tenants/${id}/update-name`,
    PLANS: '/super-admin/plans',
    CREATE_PLAN: '/super-admin/plans',
    UPDATE_PLAN: (id: string) => `/super-admin/plans/${id}`,
    TOGGLE_PLAN_BLOCK: (id: string) => `/super-admin/plans/${id}/toggle-block`,
    DELETE_PLAN: (id: string) => `/super-admin/plans/${id}`,
  },

  TENANT: {
    CREATE: '/tenant/create',
    GET: '/tenant/get',
    CHECK_NAME: (name: string) => `/tenant/check-name/${name}`,
    UPDATE: (id: string) => `/tenant/update/${id}`,
  },

  SUBSCRIPTION: {
    GET: '/subscription/get',
    TOGGLE_STATUS: (id: string) => `/subscription/toggle-status/${id}`,
  },
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile/update',
    CHANGE_PASSWORD: '/profile/password',
    UPLOAD_IMAGE: '/profile/upload',
  },
  MACHINE: {
    CREATE: '/machine/create',
    LIST: '/machine/list',
    ACTIVE: '/machine/active',
    EDIT: (id: string) => `/machine/edit/${id}`,
    BLOCK: (id: string) => `/machine/block/${id}`,
    DELETE: (id: string) => `/machine/delete/${id}`,
  },
  FIXTURE: {
    CREATE: '/fixture/create',
    LIST: '/fixture/list',
    ACTIVE: '/fixture/active',
    EDIT: (id: string) => `/fixture/edit/${id}`,
    BLOCK: (id: string) => `/fixture/block/${id}`,
    DELETE: (id: string) => `/fixture/delete/${id}`,
  },
};
