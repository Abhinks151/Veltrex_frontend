import { PlanType } from "@/features/subscription/types";

export interface TenantType {
  name: string | null;
  id: string | null;
  isBlocked: boolean;
  isDeleted: boolean;
  loading: boolean,
  error: string | null,
}

export interface TenantRequest {
  name: string;
  plan?: PlanType;
}

export interface TenantUpdateRequest {
  data: TenantRequest,
  id: string;
}

export interface TenantResponse {
  id: string;
  name: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

