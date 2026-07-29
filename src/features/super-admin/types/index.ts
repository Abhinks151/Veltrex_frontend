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
