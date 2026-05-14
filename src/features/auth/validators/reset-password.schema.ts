import { z } from "zod";
import { FRONTEND_MESSAGE_CONSTANTS } from '../../../shared/constants/messageConstants';

export const resetPasswordSchema = z
  .object({
    password: z.string()
      .min(6, FRONTEND_MESSAGE_CONSTANTS.VALIDATION.PASSWORD_MIN_LENGTH_6)
      .max(12, FRONTEND_MESSAGE_CONSTANTS.VALIDATION.PASSWORD_MAX_LENGTH_12),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: FRONTEND_MESSAGE_CONSTANTS.VALIDATION.PASSWORDS_DO_NOT_MATCH,
    path: ["confirmPassword"],
  });

export type resetPasswordFormData = z.infer<typeof resetPasswordSchema>;
