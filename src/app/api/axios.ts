import axios from 'axios';
import { getSubdomain } from '@/shared/utils/subdomain';

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

const isLocalDev = () => {
  const baseDomain = import.meta.env.VITE_BASE_DOMAIN || 'localhost';
  // Local dev uses lvh.me or localhost
  return baseDomain === 'lvh.me' || baseDomain === 'localhost';
};

const getBaseURL = () => {
  const subdomain = getSubdomain();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL; // e.g., http://localhost:3000

  if (!subdomain) return apiBaseUrl;

  // In local dev (lvh.me), rewrite hostname to tenant.lvh.me:3000 so NestJS
  // can read the subdomain. In production the API is always api.abhinks.site,
  // so we never rewrite — the tenant is sent via x-tenant header instead.
  if (isLocalDev()) {
    try {
      const url = new URL(apiBaseUrl);
      const baseDomain = import.meta.env.VITE_BASE_DOMAIN || 'localhost';
      url.hostname = `${subdomain}.${baseDomain}`;
      return url.toString().replace(/\/$/, '');
    } catch {
      return apiBaseUrl;
    }
  }

  // Production: VITE_API_BASE_URL is already https://api.abhinks.site
  return apiBaseUrl;
};

export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// add token + tenant header to every request
axiosInstance.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  // In production the API host is fixed (api.abhinks.site), so we send the
  // tenant subdomain as a header so the backend can resolve the tenant.
  if (!isLocalDev()) {
    const subdomain = getSubdomain();
    if (subdomain) {
      config.headers['x-tenant'] = subdomain;
    }
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

    if (error.response?.status === 403) {
      const message = error.response.data?.message || '';
      if (
        message.includes('Subscription has expired') ||
        message.includes('No active subscription found') ||
        message.includes('Subscription is restricted')
      ) {
        if (window.location.pathname !== '/subscription-expired') {
          window.location.href = '/subscription-expired';
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
