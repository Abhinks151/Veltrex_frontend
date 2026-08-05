import { ERROR_MESSAGES } from './errors';
import { SUCCESS_MESSAGES } from './success';
import { VALIDATION_MESSAGES } from './validation';

export const FRONTEND_MESSAGE_CONSTANTS = {
  ERROR: ERROR_MESSAGES,
  SUCCESS: SUCCESS_MESSAGES,
  VALIDATION: VALIDATION_MESSAGES,
} as const;

export * from './errors';
export * from './success';
export * from './validation';
