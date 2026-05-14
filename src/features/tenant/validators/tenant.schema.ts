import { z } from "zod";
import { FRONTEND_MESSAGE_CONSTANTS } from '../../../shared/constants/messageConstants';

export const tenantSchema = z.object({
  name: z.string().min(3, FRONTEND_MESSAGE_CONSTANTS.VALIDATION.NAME_MIN_LENGTH_3),
})

export type tenantFormData = z.infer<typeof tenantSchema>