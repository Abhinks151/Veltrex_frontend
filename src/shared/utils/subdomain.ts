export const getSubdomain = (): string | null => {
  const hostname = window.location.hostname;
  const baseDomain = import.meta.env.VITE_BASE_DOMAIN || 'localhost';

  if (hostname === baseDomain || hostname === 'localhost') {
    return null;
  }

  if (hostname.endsWith(`.${baseDomain}`)) {
    return hostname.split(`.${baseDomain}`)[0];
  }

  return null;
};

export const isPlatformRoute = (): boolean => {
  return window.location.pathname.startsWith('/platform');
};

export const getSubdomainUrl = (subdomain: string, path = '/'): string => {
  const baseDomain = import.meta.env.VITE_BASE_DOMAIN || 'localhost';
  const { protocol, port } = window.location;
  const portSuffix = port ? `:${port}` : '';
  return `${protocol}//${subdomain}.${baseDomain}${portSuffix}${path}`;
};
