import { z } from 'zod';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';

export const loginSchema = z.object({
  email: z.string().email(FRONTEND_MESSAGE_CONSTANTS.VALIDATION.INVALID_EMAIL),
  password: z
    .string()
    .min(6, FRONTEND_MESSAGE_CONSTANTS.VALIDATION.PASSWORD_MIN_LENGTH_6)
    .max(12, FRONTEND_MESSAGE_CONSTANTS.VALIDATION.PASSWORD_MAX_LENGTH_12),
  // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  // .regex(/[0-9]/, "Password must contain at least one number")
  // .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export type loginFormData = z.infer<typeof loginSchema>;
