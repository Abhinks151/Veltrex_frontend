export const SUPER_ADMIN_ERRORS = {
  FAILED_FETCH_DASHBOARD: 'Failed to fetch dashboard statistics',
  VALIDATION_DATE_REQUIRED: 'Start date and End date are required.',
  VALIDATION_DATE_END_BEFORE_START: 'End date cannot be before start date.',
  FAILED_FETCH_REVENUE: 'Failed to fetch revenue statistics',
  REVENUE_NO_EXPORT_DATA: 'No transaction data to export.',
  FAILED_FETCH_MACHINIST_DASHBOARD: 'Failed to fetch your dashboard data',
} as const;
