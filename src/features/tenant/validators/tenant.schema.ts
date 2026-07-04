import { z } from 'zod';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';

export const tenantSchema = z.object({
  name: z
    .string()
    .min(3, FRONTEND_MESSAGE_CONSTANTS.VALIDATION.NAME_MIN_LENGTH_3),
  subdomain: z
    .string()
    .min(3, 'Subdomain must be at least 3 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Subdomain can only contain lowercase letters, numbers, and hyphens',
    ),
});

export type tenantFormData = z.infer<typeof tenantSchema>;

export const updateTenantSchema = z.object({
  name: z
    .string()
    .min(3, FRONTEND_MESSAGE_CONSTANTS.VALIDATION.NAME_MIN_LENGTH_3),
});

export type updateTenantFormData = z.infer<typeof updateTenantSchema>;
