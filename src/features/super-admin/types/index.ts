export type Tenant = {
  id: string;
  name: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;

  profileImage?: string;
  profileImageKey?: string;

  createdAt: string;
  updatedAt: string;
};

export type DashboardTenant = {
  id: string;
  name: string;
  subdomain: string;
  createdAt: string;
  isBlocked: boolean;
  ownerName: string;
  ownerEmail: string;
  planStatus: string;
  planName: string;
};

export type ChartDataPoint = {
  label: string;
  count: number;
};

export type DashboardStats = {
  totalTenants: number;
  tenantGrowthPercentage: number;
  totalUsers: number;
  totalRevenue: number;
  recentTenants: DashboardTenant[];
  chartData: ChartDataPoint[];
};

export type RevenueChartPoint = {
  label: string;
  amount: number;
};

export type RevenuePaymentRecord = {
  id: string;
  amount: string;
  currency: string;
  provider: string;
  providerPaymentId: string | null;
  providerOrderId: string | null;
  createdAt: string;
  tenant: {
    name: string;
  };
  plan: {
    name: string;
  } | null;
};

export type RecentSubscriptionRecord = {
  id: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  createdAt: string;
  plan: {
    name: string;
    price: string;
    currency: string;
  };
  tenant: {
    name: string;
    owner: {
      email: string;
    };
  };
};

export type RevenueDashboardStats = {
  lifetimeRevenue: number;
  periodRevenue: number;
  revenueGrowthPercentage: number;
  activeSubscriptionsCount: number;
  averageRevenuePerAccount: number;
  recentSubscriptions: RecentSubscriptionRecord[];
  payments: RevenuePaymentRecord[];
  chartData: RevenueChartPoint[];
};
