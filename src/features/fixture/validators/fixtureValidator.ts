import { z } from 'zod';
import { FixtureType } from '@/shared/types/fixture-type.enum';

export const fixtureSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  type: z.nativeEnum(FixtureType),
  dimensions: z.object({
    width: z.number().positive('Width must be positive'),
    length: z.number().positive('Length must be positive'),
    height: z.number().positive('Height must be positive'),
    unit: z.string().min(1, 'Unit is required'),
  }),
});

export type FixtureFormData = z.infer<typeof fixtureSchema>;
