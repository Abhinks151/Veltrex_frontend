import { z } from "zod";
import { FRONTEND_MESSAGE_CONSTANTS } from '../../../shared/constants/messageConstants';

export const forgotPasswordSchema = z.object({
  email: z.string().email(FRONTEND_MESSAGE_CONSTANTS.VALIDATION.INVALID_EMAIL),
});

export type forgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
