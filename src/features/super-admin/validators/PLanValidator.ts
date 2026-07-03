import { z } from 'zod';

export const planSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z
    .number({
      error: 'Price is required',
    })
    .min(0, 'Price cannot be negative'),
  currency: z.string().min(1, 'Currency is required'),
  durationDays: z
    .union([z.string(), z.number()])
    .optional()
    .refine((val) => val === '' || val === undefined || Number(val) >= 0, {
      message: 'Duration days cannot be negative',
    }),
});

export type PlanFormData = z.infer<typeof planSchema>;
