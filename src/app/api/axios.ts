import axios from 'axios';

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// add token to request
axiosInstance.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Add refresh interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      if (
        error.response.data?.message === 'Tenant is blocked' ||
        error.response.data?.message === 'User is blocked'
      ) {
        const isPublicPage =
          window.location.pathname === '/' ||
          window.location.pathname.includes('/login') ||
          window.location.pathname.includes('/auth') ||
          window.location.pathname === '/tenant-blocked' ||
          window.location.pathname === '/unauthorized';

        if (window.location.pathname !== '/tenant-blocked' && !isPublicPage) {
          window.location.href = '/tenant-blocked';
        }
        return Promise.reject(error);
      }
    }

    if (
      originalRequest?.url === '/auth/refresh' ||
      originalRequest?.url === '/auth/login' ||
      originalRequest?.url === '/auth/register'
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axiosInstance.post('/auth/refresh');
        const { access_token } = res.data;

        setAccessToken(access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);
