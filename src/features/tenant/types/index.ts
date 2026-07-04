export interface TenantType {
  name: string | null;
  id: string | null;
  isBlocked: boolean;
  isDeleted: boolean;
  loading: boolean;
  error: string | null;
}

export interface TenantRequest {
  name: string;
  subdomain: string;
  plan?: string; // plan code e.g. 'TRIAL', 'LIFETIME'
}

export interface TenantUpdateData {
  name: string;
}

export interface TenantUpdateRequest {
  data: TenantUpdateData;
  id: string;
}

export interface TenantResponse {
  id: string;
  name: string;
  isBlocked: boolean;
  isDeleted: boolean;
}
