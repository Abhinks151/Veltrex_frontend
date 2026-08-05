export const AUTH_ERRORS = {
  TOKEN_REQUIRED: 'Token is required',
  SOMETHING_WENT_WRONG: 'Something went wrong',
  INVALID_RESET_LINK:
    'Invalid or expired reset link. Please request a new one.',
  SESSION_EXPIRED: 'Session expired. Please register again.',
  FAILED_RESEND_EMAIL: 'Failed to resend email',
  LOGOUT_FAILED: 'Logout failed',
} as const;
