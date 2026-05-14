export enum PlanType {
  FREE = "FREE",
  PRO = "PRO",
}

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
  TRIAL = "TRIAL",
}

export interface SubscriptionType {
  id: string | null;
  tenantId: string | null;
  plan: PlanType | null;
  status: SubscriptionStatus | null;
  startDate: string | null;
  endDate: string | null;
  trialUsed: boolean;
  razorpaySubscriptionId: string | null;
  loading: boolean;
  toggling: boolean;
  error: string | null;
}

export interface SubscriptionResponse {
  id: string;
  tenantId: string;
  plan: PlanType;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  trialUsed: boolean;
  razorpaySubscriptionId: string;
}
