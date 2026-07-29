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
    DASHBOARD: '/super-admin/dashboard',
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
    CHECK_SUBDOMAIN: (subdomain: string) =>
      `/tenant/check-subdomain/${subdomain}`,
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
  RAW_MATERIAL: {
    CREATE: '/raw-material/create',
    LIST: '/raw-material/list',
    ACTIVE: '/raw-material/active',
    EDIT: (id: string) => `/raw-material/edit/${id}`,
    BLOCK: (id: string) => `/raw-material/block/${id}`,
    DELETE: (id: string) => `/raw-material/delete/${id}`,
  },
  JOB: {
    CREATE: '/job/create',
    LIST: '/job/list',
    EDIT: (id: string) => `/job/edit/${id}`,
    DELETE: (id: string) => `/job/delete/${id}`,
  },
  PART: {
    CREATE: '/part/create',
    LIST: '/part/list',
    ACTIVE: '/part/active',
    GET_BY_ID: (id: string) => `/part/${id}`,
    EDIT: (id: string) => `/part/edit/${id}`,
    BLOCK: (id: string) => `/part/block/${id}`,
    DELETE: (id: string) => `/part/delete/${id}`,
  },
  SHIFT: {
    CREATE_TEMPLATE: '/shift/template/create',
    LIST_TEMPLATES: '/shift/template/list',
    EDIT_TEMPLATE: (id: string) => `/shift/template/edit/${id}`,
    DELETE_TEMPLATE: (id: string) => `/shift/template/delete/${id}`,
    GENERATE: (templateId: string) =>
      `/shift/production/generate/${templateId}`,
    LIST_PRODUCTION: '/shift/production/list',
    UPDATE_JOB_PROGRESS: (id: string) => `/shift/production/job-progress/${id}`,
  },
  NC_PROGRAM: {
    CREATE: '/nc-program/create',
    LIST: '/nc-program/list',
    ACTIVE: '/nc-program/active',
    GET_BY_ID: (id: string) => `/nc-program/${id}`,
    EDIT: (id: string) => `/nc-program/edit/${id}`,
    ADD_VERSION: (id: string) => `/nc-program/${id}/version`,
    VERSION_BY_ID: (id: string) => `/nc-program/version/${id}`,
    BLOCK_VERSION: (id: string) => `/nc-program/version/${id}/block`,
    DELETE_VERSION: (id: string) => `/nc-program/version/${id}/delete`,
  },
};
