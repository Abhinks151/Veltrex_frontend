export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  TRIAL = 'TRIAL',
}

export interface Plan {
  id: string;
  code: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  durationDays: number | null;
}

export interface SubscriptionType {
  id: string | null;
  tenantId: string | null;
  planId: string | null;
  plan: Plan | null;
  status: SubscriptionStatus | null;
  startDate: string | null;
  endDate: string | null;
  razorpaySubscriptionId: string | null;
  loading: boolean;
  toggling: boolean;
  error: string | null;
}

export interface SubscriptionResponse {
  id: string;
  tenantId: string;
  planId: string;
  plan?: Plan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  razorpaySubscriptionId: string | null;
}
