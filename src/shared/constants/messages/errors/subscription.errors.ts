export const SUBSCRIPTION_ERRORS = {
  FAILED_FETCH_PLANS: 'Failed to fetch plans',
  FAILED_UPDATE_PLAN: 'Failed to update plan',
  FAILED_DELETE_PLAN: 'Failed to delete plan',
  SUBSCRIPTION_EXPIRED:
    'Access blocked: Your subscription has expired. Please unblock to continue.',
  SUBSCRIPTION_CANCELLED:
    'Access blocked: Your access has been manually blocked. Please unblock to restore platform access.',
  SUBSCRIPTION_INACTIVE: 'No active subscription found for your organization.',
  PAYMENT_FAILED_REASON: 'Payment failed: {reason}. Please try again.',
  PAYMENT_VERIFICATION_FAILED:
    'Payment verification failed. Please contact support.',
  RAZORPAY_LOAD_FAILED:
    'Could not load payment gateway. Please check your connection.',
  ACCESS_RESTRICTED_EMPLOYEE:
    'Organization access suspended. Contact your administrator.',
} as const;
