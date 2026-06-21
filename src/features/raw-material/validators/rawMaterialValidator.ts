import { z } from 'zod';

export const rawMaterialSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  dimensions: z.object({
    width: z.number().positive('Width must be positive'),
    length: z.number().positive('Length must be positive'),
    height: z.number().positive('Height must be positive'),
    unit: z.string().min(1, 'Unit is required'),
  }),
  material: z.string().trim().min(1, 'Material is required'),
  minQty: z.number().int().min(0, 'Minimum quantity cannot be negative'),
});

export type RawMaterialFormData = z.infer<typeof rawMaterialSchema>;
