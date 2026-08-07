export const MAINTENANCE_ERRORS = {
  FAILED_FETCH_OPEN_TICKETS: 'Failed to fetch open maintenance tickets.',
  FAILED_FETCH_MY_TICKETS: 'Failed to fetch my tickets.',
  FAILED_FETCH_MACHINIST_TICKETS: 'Failed to fetch your submitted tickets.',
  FAILED_FETCH_ADMIN_LOGS: 'Failed to fetch maintenance logs.',
  FAILED_FETCH_MACHINES: 'Failed to fetch available machines.',
  FAILED_CREATE_TICKET: 'Failed to create maintenance ticket.',
  FAILED_ASSIGN_TICKET: 'Failed to assign ticket.',
  FAILED_RELEASE_TICKET: 'Failed to release ticket.',
  FAILED_CLOSE_TICKET: 'Failed to close ticket.',
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
  END_DATE_CANNOT_BE_BEFORE_START_DATE: 'End date cannot be before start date.',
} as const;
